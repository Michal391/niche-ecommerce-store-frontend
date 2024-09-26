import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { getProductInformation } from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import Footer from '../components/Footer';
import { ReviewSection } from '../components/Review'; // Import ReviewSection
import { useUser } from '../contexts/UserContext';

const ProductDetails = () => {
  const { id } = useParams(); // Extract id from URL params
  const navigate = useNavigate();
  const { addItemToCart } = useCart();
  const { userId } = useUser();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProductDetails(); // Example user ID
  }, [id]);

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

  const handleAddToCart = () => {
    addItemToCart(product.id, quantity);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return null;

  const stockInfo = () => {
    if (typeof product.stock !== 'number') {
      return { text: 'Stock information unavailable', color: 'text-gray-500' };
    }
    if (product.stock <= 10) {
      return { text: `Limited Stock available: ${product.stock}`, color: 'text-red-500' };
    } else {
      return { text: 'In Stock', color: 'text-green-500' };
    }
  };

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
              <div className="sm:w-1/2 p-6 flex">
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
                <div className="w-4/5">
                  <img src={images[selectedImageIndex]} alt={product.name} className="w-full h-80 object-cover rounded-lg" />
                </div>
              </div>

              <div className="sm:w-1/2 p-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900">${selectedVariant.price.toFixed(2)}</p>
                  <p className={`mt-2 text-sm font-semibold ${stockInfo().color}`}>{stockInfo().text}</p>
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
                    onClick={() => console.log('Buy now')}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Product Description */}
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
          </div>

          {/* Reviews Section */}
          <ReviewSection productId={id} currentUserId={userId} />
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
