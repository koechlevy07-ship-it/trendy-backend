// services/settingsService.js
const Settings = require('../models/Settings');
const SecurityPolicy = require('../models/SecurityPolicy');

const settingsService = {};

settingsService.getAllSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    return settings;
};

settingsService.updateSettings = async (updates) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings(updates);
    } else {
        Object.assign(settings, updates);
    }
    await settings.save();
    return settings;
};

settingsService.getSecurityPolicy = async () => {
    let policy = await SecurityPolicy.findOne();
    if (!policy) {
        policy = await SecurityPolicy.create({});
    }
    return policy;
};

settingsService.updateSecurityPolicy = async (updates) => {
    let policy = await SecurityPolicy.findOne();
    if (!policy) {
        policy = await SecurityPolicy.create(updates);
    } else {
        Object.assign(policy, updates);
    }
    await policy.save();
    return policy;
};

settingsService.getBackupHistory = async () => {
    const settings = await Settings.findOne();
    return settings?.backupHistory || [];
};

settingsService.addBackup = async (backup) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings();
    }
    if (!settings.backupHistory) settings.backupHistory = [];
    settings.backupHistory.unshift(backup);
    await settings.save();
    return settings;
};

settingsService.getFrontendSettings = async () => {
    const settings = await Settings.findOne();
    return {
        storeName: settings?.storeName || 'Trendy Wardrobe',
        tagline: settings?.tagline || 'Luxury Fashion Redefined',
        email: settings?.email || '',
        phone: settings?.phone || '',
        whatsapp: settings?.whatsapp || '',
        address: settings?.address || '',
        mapsEmbedUrl: settings?.mapsEmbedUrl || '',
        businessHours: settings?.businessHours || '24/7',
        timezone: settings?.timezone || 'Africa/Nairobi',
        dateFormat: settings?.dateFormat || 'DD/MM/YYYY',
        timeFormat: settings?.timeFormat || '12h',
        currency: settings?.currency || 'Ksh',
        currencySymbol: settings?.currencySymbol || 'Ksh',
        defaultLanguage: settings?.defaultLanguage || 'en',
        primaryColor: settings?.primaryColor || '#111827',
        secondaryColor: settings?.secondaryColor || '#4B5563',
        accentColor: settings?.accentColor || '#C8A35A',
        buttonColor: settings?.buttonColor || '#111827',
        successColor: settings?.successColor || '#10B981',
        warningColor: settings?.warningColor || '#F59E0B',
        errorColor: settings?.errorColor || '#EF4444',
        primaryFont: settings?.primaryFont || 'Inter',
        secondaryFont: settings?.secondaryFont || 'Poppins',
        headingFont: settings?.headingFont || 'Poppins',
        logo: settings?.logo || '',
        logoDark: settings?.logoDark || '',
        logoLight: settings?.logoLight || '',
        mobileLogo: settings?.mobileLogo || '',
        footerLogo: settings?.footerLogo || '',
        emailLogo: settings?.emailLogo || '',
        favicon: settings?.favicon || '',
        appleTouchIcon: settings?.appleTouchIcon || '',
        androidIcon: settings?.androidIcon || '',
        paymentMethods: settings?.paymentMethods || ['Cash on Delivery'],
        deliveryFee: settings?.deliveryFee || 150,
        freeDeliveryThreshold: settings?.freeDeliveryThreshold || 5000,
        estimatedDeliveryDays: settings?.estimatedDeliveryDays || 3,
        taxPercentage: settings?.taxPercentage || 16,
        currencies: settings?.currencies || ['KES', 'USD', 'EUR'],
        homepageLayout: settings?.homepageLayout || 'default',
        productListingStyle: settings?.productListingStyle || 'grid',
        defaultPagination: settings?.defaultPagination || 12
    };
};

module.exports = settingsService;
