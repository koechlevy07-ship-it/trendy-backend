const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, default: 'newsletter' },
    trigger: { type: String, default: 'on_load' },
    delay: { type: Number, default: 5 },
    content: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    displayRules: { type: String, default: 'all' },
    active: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Popup', popupSchema);
