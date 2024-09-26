import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductReviews, addReview, updateReview, deleteReview, getUserProductReview } from '../services/api';

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
    <p className="text-gray-500 text-sm">Posted on: {new Date(review.createdAt).toLocaleString()}</p>
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

const ReviewSection = ({ productId, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchUserReview();
  }, [productId, currentUserId]);

  const fetchUserReview = async () => {
    try {
      const review = await getUserProductReview(productId, currentUserId);
      setUserReview(review);
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const newReviews = await getProductReviews(productId, page);
      setReviews(prevReviews => [...prevReviews, ...newReviews]);
      setHasMore(newReviews.length === 5);
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
      const response = await addReview(productId, reviewData);
      setUserReview(response.review);
      setReviews(prevReviews => [response.review, ...prevReviews]);
      setIsAddingReview(false);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      const updatedReview = await updateReview(productId, reviewData);
      setUserReview(updatedReview);
      setReviews(prevReviews => prevReviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      ));
      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(productId);
      setUserReview(null);
      setReviews(prevReviews => prevReviews.filter(review => review.userId !== currentUserId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      <button
        className="flex justify-between items-center w-full"
        onClick={handleReviewsToggle}
      >
        <span className="text-lg font-medium text-gray-900">Customer Reviews</span>
        <ChevronRight
          className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${isReviewsOpen ? 'rotate-90' : ''}`}
        />
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
              <Review key={review.id} review={review} currentUserId={currentUserId} />
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
  );
};

export { ReviewSection };
