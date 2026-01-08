const express = require('express');
const router = express.Router();
const {
    getAllShops,
    updateShopStatus,
    getAllProducts,
    updateProductStatus,
    getDashboardStats
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

// All admin routes are protected and restricted to admin role
router.use(protect);
router.use(restrictTo('admin'));

// Shop Management
router.get('/shops', getAllShops);
router.put('/shops/:id/status', updateShopStatus);

// Product Management
router.get('/products', getAllProducts);
router.put('/products/:id/status', updateProductStatus);

// Stats
router.get('/stats', getDashboardStats);

module.exports = router;
