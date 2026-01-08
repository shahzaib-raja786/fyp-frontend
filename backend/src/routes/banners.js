const express = require('express');
const router = express.Router();
const {
    getBanners,
    getAllBannersAdmin,
    createBanner,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');

const { protect, restrictTo } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Public route to get active banners
router.get('/', getBanners);

// Admin routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/admin', getAllBannersAdmin);
router.post('/', uploadSingle, createBanner);
router.route('/:id')
    .put(uploadSingle, updateBanner)
    .delete(deleteBanner);

module.exports = router;
