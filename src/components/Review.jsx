import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  getUserProductReview,
} from '../services/api';

// Individual Review Component
const Review = ({ review, onEdit, onDelete }) => (
  <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
    <div className="flex items-center mb-2 justify-between">
      <div>
        <div className="flex mr-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-semibold">{review.title}</span>
        <p className="text-sm text-gray-500">
          By {review.anonymous ? 'Anonymous' : review.userName || 'User'}
        </p>
      </div>
      {/* Show edit and delete icons if onEdit and onDelete are provided */}
      {onEdit && onDelete && (
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

// Review Form Component
const ReviewForm = ({ onSubmit, initialReview = null }) => {
  const [title, setTitle] = useState(initialReview ? initialReview.title : '');
  const [rating, setRating] = useState(initialReview ? initialReview.rating : 5);
  const [reviewText, setReviewText] = useState(
    initialReview ? initialReview.reviewText : ''
  );
  const [anonymous, setAnonymous] = useState(
    initialReview ? initialReview.anonymous : false
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, rating, reviewText, anonymous });
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
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
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
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
          />{' '}
          Post as anonymous
        </label>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

// Main Review Section
const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Fetch user-specific review
  const fetchUserReview = async () => {
    try {
      const review = await getUserProductReview(productId);
      setUserReview(review);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setUserReview(null); // No user review found
      } else {
        console.error('Error fetching user review:', error);
      }
    }
  };

  // Fetch all product reviews
  const fetchReviews = async () => {
    try {
      const allReviews = await getProductReviews(productId);
      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Toggle reviews visibility and fetch data
  const handleReviewsToggle = () => {
    setIsReviewsOpen(!isReviewsOpen);
    if (!isReviewsOpen) {
      fetchUserReview();
      fetchReviews();
    }
  };

  // Handle adding a new review
  const handleAddReview = async (reviewData) => {
    try {
      const newReview = await addReview(productId, reviewData);
      setUserReview(newReview);
      setReviews((prev) => [newReview, ...prev]);
      setIsAddingReview(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error('You have already reviewed this product.');
      } else {
        console.error('Error adding review:', error);
      }
    }
  };

  // Handle updating an existing review
  const handleUpdateReview = async (reviewData) => {
    try {
      const updatedReview = await updateReview(productId, reviewData);
      setUserReview(updatedReview);
      setReviews((prev) =>
        prev.map((rev) =>
          rev.userId === updatedReview.userId ? updatedReview : rev
        )
      );
      setEditingReview(null);
      setIsAddingReview(false);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  // Handle editing a review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsAddingReview(true);
  };

  // Handle deleting a review
  const handleDeleteReview = async () => {
    try {
      await deleteReview(productId);
      setUserReview(null);
      setReviews((prev) =>
        prev.filter((review) => review.userId !== userReview.userId)
      );
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Comparison function to identify the user's review
  const isSameReview = (review1, review2) => {
    if (!review1 || !review2) return false;
    return (
      review1.title === review2.title &&
      review1.reviewText === review2.reviewText &&
      review1.rating === review2.rating &&
      review1.userName === review2.userName &&
      review1.createdAt === review2.createdAt
    );
  };

  // Filter out the user's own review from the list of all reviews
  const filteredReviews = reviews.filter(
    (review) => !isSameReview(review, userReview)
  );

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      {/* Toggle Button */}
      <button
        className="flex justify-between items-center w-full"
        onClick={handleReviewsToggle}
      >
        <span className="text-lg font-medium text-gray-900">Customer Reviews</span>
        <ChevronRight
          className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
            isReviewsOpen ? 'rotate-90' : ''
          }`}
        />
      </button>

      {/* Reviews Content */}
      <AnimatePresence>
        {isReviewsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            {/* Review Form */}
            {isAddingReview && (
              <ReviewForm
                onSubmit={editingReview ? handleUpdateReview : handleAddReview}
                initialReview={editingReview}
              />
            )}

            {/* User Review or Add Review Button */}
            {userReview ? (
              <Review
                review={userReview}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ) : (
              <button
                onClick={() => {
                  setIsAddingReview(true);
                  setEditingReview(null);
                }}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Review
              </button>
            )}

            {/* All Reviews (excluding user's own review) */}
            {filteredReviews.map((review, index) => (
              <Review
                key={`${review.userName}-${review.createdAt}-${index}`}
                review={review}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { ReviewSection };
