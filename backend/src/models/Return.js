const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        quantity: Number,
        price: Number,
        thumbnail: String,
        selectedOptions: {
            type: Map,
            of: String
        },
        reason: String
    }],
    reason: {
        type: String,
        required: true,
        enum: ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'other']
    },
    detailedReason: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    images: [{
        type: String
    }],
    refundAmount: {
        type: Number,
        default: 0
    },
    adminNotes: {
        type: String,
        trim: true
    },
    approvedAt: Date,
    rejectedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

// Indexes
returnSchema.index({ userId: 1, createdAt: -1 });
returnSchema.index({ shopId: 1, status: 1 });
returnSchema.index({ orderId: 1 });

// Virtual for return window check (14 days)
returnSchema.virtual('isWithinReturnWindow').get(function () {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    return this.createdAt >= fourteenDaysAgo;
});

module.exports = mongoose.model('Return', returnSchema);
