const mongoose = require('mongoose');

const contentPageSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, default: '', trim: true },
    content: { type: String, default: '' }
}, { timestamps: true });

contentPageSchema.index({ key: 1 }, { unique: true });

module.exports = mongoose.model('ContentPage', contentPageSchema);
