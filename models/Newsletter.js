const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, default: '', trim: true },
    active: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'unsubscribed', 'pending'], default: 'active' },
    lastCampaign: { type: Date }
}, { timestamps: true });

newsletterSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);
