const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Banner title is required'],
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Banner image URL is required']
    },
    publicId: {
        type: String
    },
    ctaText: {
        type: String,
        default: 'Shop Now'
    },
    link: {
        type: String, // Internal or external link
        default: '/search'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
