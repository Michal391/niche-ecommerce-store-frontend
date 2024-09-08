import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ChevronUp, ChevronDown, Star, ChevronRight, Edit, Trash } from 'lucide-react';
import { getProductInformation, getProductReviews, addReview, updateReview, deleteReview, getUserProductReview } from '../services/api';
import Navbar from '../components/Navbar';

const Review = ({ review, currentUserId, onEdit, onDelete }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex items-center mb-2 justify-between">
        <div>
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="font-semibold">{review.title}</span>
        </div>
        {currentUserId === review.userId && onEdit && onDelete && (
          <div>
            <button onClick={() => onEdit(review)} className="mr-2 text-blue-500">
              <Edit size={16} />
            </button>
            <button onClick={() => onDelete(review.id)} className="text-red-500">
              <Trash size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600 mb-2">{review.reviewText}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(review.createdAt).toLocaleString()}
      </p>
    </div>
  );

  const ReviewForm = ({ onSubmit, initialReview = null }) => {
    const [title, setTitle] = useState(initialReview ? initialReview.title : '');
    const [rating, setRating] = useState(initialReview ? initialReview.rating : 5);
    const [reviewText, setReviewText] = useState(initialReview ? initialReview.reviewText : '');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ title, rating, reviewText });
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review Title"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <div className="mb-2">
          <label>Rating: </label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Your review"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {initialReview ? 'Update Review' : 'Submit Review'}
        </button>
      </form>
    );
  };

  const ProductDetails = () => {
    const { id } = useParams(); // Extract id from URL params
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userReview, setUserReview] = useState(null);
  
    useEffect(() => {
      fetchProductDetails();
      // Set current user ID here based on your auth system
      setCurrentUserId("13d55c8d-ea2d-4261-a5fa-0a01212eecef"); // Example user ID
    }, [id]);

    useEffect(() => {
      if (currentUserId) {
        fetchUserReview();
      }
    }, [id, currentUserId]);

    const fetchUserReview = async () => {
      try {
        const review = await getUserProductReview(id, currentUserId);
        setUserReview(review);
      } catch (error) {
        console.error('Error fetching user review:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const newReviews = await getProductReviews(id, page);
        setReviews(prevReviews => [...prevReviews, ...newReviews]);
        setHasMore(newReviews.length === 5); // Assuming we're fetching 5 reviews at a time
        setPage(prevPage => prevPage + 1);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

      const handleReviewsToggle = () => {
        setIsReviewsOpen(!isReviewsOpen);
        if (!isReviewsOpen && reviews.length === 0) {
          fetchReviews();
        }
      };
    
      const handleAddReview = async (reviewData) => {
        try {
          const response = await addReview(id, reviewData);
          setUserReview(response.review);
          setReviews(prevReviews => [response.review, ...prevReviews]);
          setIsAddingReview(false);
        } catch (error) {
          console.error('Error adding review:', error);
          // Optionally, show an error message to the user
        }
      };
    
      const handleEditReview = (review) => {
        setEditingReview(review);
      };
    
      const handleUpdateReview = async (reviewData) => {
        try {
          const updatedReview = await updateReview(id, reviewData);
          setUserReview(updatedReview);
          setReviews(prevReviews => prevReviews.map(review => 
            review.id === updatedReview.id ? updatedReview : review
          ));
          setEditingReview(null);
        } catch (error) {
          console.error('Error updating review:', error);
          // Optionally, show an error message to the user
        }
      };
    
      const handleDeleteReview = async () => {
        try {
          await deleteReview(id);
          setUserReview(null);
          setReviews(prevReviews => prevReviews.filter(review => review.userId !== currentUserId));
        } catch (error) {
          console.error('Error deleting review:', error);
          // Optionally, show an error message to the user
        }
      };

      const fetchProductDetails = async () => {
        try {
          setLoading(true);
          const productData = await getProductInformation(id);
          setProduct(productData);
          setSelectedVariant(productData.variants[0]);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch product details. Please try again later.');
          setLoading(false);
        }
      };

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', { ...product, variant: selectedVariant, quantity });
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { ...product, variant: selectedVariant, quantity });
  };

  const getStockDisplay = () => {
    if (typeof product.stock !== 'number') {
      return { text: 'Stock information unavailable', color: 'text-gray-500' };
    }
    if (product.stock <= 10) {
      return { text: `Limited Stock available: ${product.stock}`, color: 'text-red-500' };
    } else {
      return { text: 'In Stock', color: 'text-green-500' };
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  const stockInfo = getStockDisplay();

  // Placeholder for multiple images
  const images = [product.imageUrl, product.thumbnailUrl];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                <div className="relative group">
                <button 
                    onClick={() => navigate('/products')} 
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition-all duration-300 ease-in-out overflow-hidden"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out ml-0 group-hover:ml-2">
                    Back to Products
                    </span>
                </button>
                </div>
                <div className="text-right">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{product.name}</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{product.brand}</p>
                </div>
            </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="sm:flex">
              {/* Left side - Product Images */}
              <div className="sm:w-1/2 p-6 flex">
                {/* Vertical Carousel */}
                <div className="w-1/5 mr-4">
                  <button className="w-full mb-2 text-gray-500" onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}>
                    <ChevronUp />
                  </button>
                  <div className="space-y-2 overflow-hidden" style={{ height: '300px' }}>
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Product ${index + 1}`}
                        className={`w-full h-20 object-cover cursor-pointer ${index === selectedImageIndex ? 'border-2 border-blue-500' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                  <button className="w-full mt-2 text-gray-500" onClick={() => setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))}>
                    <ChevronDown />
                  </button>
                </div>
                {/* Main Image */}
                <div className="w-4/5">
                  <img src={images[selectedImageIndex]} alt={product.name} className="w-full h-80 object-cover rounded-lg"/>
                </div>
              </div>

              {/* Right side - Product Details and Purchase Options */}
              <div className="sm:w-1/2 p-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900">${selectedVariant.price.toFixed(2)}</p>
                  <p className={`mt-2 text-sm font-semibold ${stockInfo.color}`}>{stockInfo.text}</p>
                </div>

                <div className="mb-6">
                  <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-2">
                    {product.variants[0].band ? 'Band Color' : 'Color'}
                  </label>
                  <div className="flex space-x-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.sku}
                        onClick={() => handleVariantChange(variant)}
                        className={`px-3 py-1 rounded border ${selectedVariant.sku === variant.sku ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                      >
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Product Description and Specifications */}
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.description}</dd>
              </div>

              <div className="py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 mb-2">Specifications</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <li key={key} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {value}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <button
                className="flex justify-between items-center w-full"
                onClick={handleReviewsToggle}
              >
                <span className="text-lg font-medium text-gray-900">Customer Reviews</span>
                <ChevronRight className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${isReviewsOpen ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {isReviewsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    {!userReview && !isAddingReview && (
                      <button 
                        onClick={() => setIsAddingReview(true)} 
                        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Add Review
                      </button>
                    )}
                    {isAddingReview && (
                      <ReviewForm onSubmit={handleAddReview} />
                    )}
                    {editingReview && (
                      <ReviewForm onSubmit={handleUpdateReview} initialReview={editingReview} />
                    )}
                    {userReview && !editingReview && (
                      <Review 
                        review={userReview}
                        currentUserId={currentUserId}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                      />
                    )}
                    {reviews.filter(review => review.id !== userReview?.id).map((review) => (
                      <Review 
                        key={review.id} 
                        review={review} 
                        currentUserId={currentUserId}
                        // Don't pass onEdit and onDelete for non-user reviews
                      />
                    ))}
                    {hasMore && (
                      <button 
                        onClick={fetchReviews} 
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Load More Reviews
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
      <footer className="bg-gray-800 text-white text-center py-4 mt-8">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProductDetails;