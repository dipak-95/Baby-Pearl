const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ['boy', 'girl'],
        required: true
    },
    type: {
        type: String,
        enum: ['month', 'festival'],
        required: true
    },
    category: {
        type: String,
        required: true
        // e.g., '1_month', 'diwali'
    },
    imageUrl: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

// Create text index for search
PhotoSchema.index({ prompt: 'text', category: 'text', keywords: 'text' });

module.exports = mongoose.model('Photo', PhotoSchema);
