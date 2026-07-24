const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, default: '' },
    county: { type: String, default: '' },
    city: { type: String, required: true },
    street: { type: String, default: '' },
    apartment: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'Kenya' },
    deliveryInstructions: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
}, { _id: true });

const notificationPrefSchema = new mongoose.Schema({
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    wishlistStock: { type: Boolean, default: true },
    priceDrops: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'admin', 'seller'], default: 'customer' },
    phone: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
    status: {
        type: String,
        enum: ['active', 'suspended', 'blocked', 'pending_verification', 'deleted'],
        default: 'active'
    },
    customerId: { type: String, unique: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    isGuest: { type: Boolean, default: false },
    notes: { type: String, default: '' },
    notificationPreferences: { type: notificationPrefSchema, default: () => ({}) },
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    addresses: [addressSchema],
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('User', userSchema);
