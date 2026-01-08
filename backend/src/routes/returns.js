const express = require('express');
const router = express.Router();
const {
    createReturnRequest,
    getUserReturns,
    getShopReturns,
    updateReturnStatus,
    getReturnById
} = require('../controllers/returnController');
const { protect, shopProtect } = require('../middleware/auth');

// Customer routes
router.post('/', protect, createReturnRequest);
router.get('/user', protect, getUserReturns);
router.get('/:id', protect, getReturnById);

// Shop owner routes
router.get('/shop/:shopId', shopProtect, getShopReturns);
router.put('/:id/status', shopProtect, updateReturnStatus);

module.exports = router;
