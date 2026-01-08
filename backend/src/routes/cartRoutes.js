const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

// All routes are protected (require authentication)
router.use(protect);

// Get cart
router.get('/', getCart);

// Add to cart
router.post('/', addToCart);

// Update cart item
router.put('/:itemId', updateCartItem);

// Remove from cart
router.delete('/:itemId', removeFromCart);

// Clear cart
router.delete('/', clearCart);

module.exports = router;
