const mongoose = require('mongoose');

const customerPaymentMethodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
        type: String,
        enum: ['mpesa', 'visa', 'mastercard', 'paypal', 'bank_transfer'],
        required: true
    },
    nickname: { type: String, trim: true, maxlength: 60 },
    details: { type: String, trim: true, required: true, maxlength: 120 },
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('CustomerPaymentMethod', customerPaymentMethodSchema);
