const express = require('express');
const router = express.Router();
const {
    createReview,
    getProductReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markHelpful
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/user', protect, getUserReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

module.exports = router;
