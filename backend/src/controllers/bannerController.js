const Banner = require('../models/Banner');
const { uploadImage, deleteImage } = require('../config/cloudinary');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: banners.length,
            banners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
exports.getAllBannersAdmin = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: banners.length,
            banners
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = async (req, res) => {
    try {
        let imageUrl = req.body.imageUrl; // Fallback if URL provided manually
        let publicId = null;

        // Handle Image Upload
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const uploadRes = await uploadImage(dataURI, 'banners');
            imageUrl = uploadRes.url;
            publicId = uploadRes.publicId;
        }

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const bannerData = {
            ...req.body,
            imageUrl,
            publicId
        };

        const banner = await Banner.create(bannerData);
        res.status(201).json({
            success: true,
            banner
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
    try {
        let banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        let imageUrl = banner.imageUrl;
        let publicId = banner.publicId;

        // Handle New Image Upload
        if (req.file) {
            // Delete old image if exists
            if (banner.publicId) {
                await deleteImage(banner.publicId);
            }

            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const uploadRes = await uploadImage(dataURI, 'banners');
            imageUrl = uploadRes.url;
            publicId = uploadRes.publicId;
        }

        const updateData = {
            ...req.body,
            imageUrl,
            publicId
        };

        banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            banner
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }

        // Delete image from Cloudinary
        if (banner.publicId) {
            await deleteImage(banner.publicId);
        }

        await banner.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Banner deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
