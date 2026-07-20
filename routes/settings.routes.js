const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validate');
const { authenticateToken, requireAdmin, requireTwoFactor } = require('../middleware/auth');
const permissionMiddleware = require('../middleware/permission');
const settingsController = require('../controllers/settingsController');
const settingsService = require('../services/settingsService');

// ===== GENERAL STORE SETTINGS =====

router.get('/general', authenticateToken, requireAdmin, settingsController.getSettings);
router.put('/general', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateSettings);

// ===== LOCALIZATION SETTINGS =====

router.get('/localization', authenticateToken, requireAdmin, settingsController.getLocalizationSettings);
router.put('/localization', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateLocalizationSettings);

// ===== PAYMENT SETTINGS =====

router.get('/payment', authenticateToken, requireAdmin, settingsController.getPaymentSettings);
router.put('/payment', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updatePaymentSettings);

// ===== SHIPPING SETTINGS =====

router.get('/shipping', authenticateToken, requireAdmin, settingsController.getShippingSettings);
router.put('/shipping', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateShippingSettings);

// ===== TAX SETTINGS =====

router.get('/tax', authenticateToken, requireAdmin, settingsController.getTaxSettings);
router.put('/tax', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateTaxSettings);

// ===== EMAIL SETTINGS =====

router.get('/email', authenticateToken, requireAdmin, settingsController.getEmailSettings);
router.put('/email', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateEmailSettings);
router.post('/email/test', authenticateToken, requireAdmin, settingsController.testEmailSettings);

// ===== SMS & WHATSAPP SETTINGS =====

router.get('/sms', authenticateToken, requireAdmin, settingsController.getSMSWhatsAppSettings);
router.put('/sms', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateSMSWhatsAppSettings);

// ===== SEO SETTINGS =====

router.get('/seo', authenticateToken, requireAdmin, settingsController.getSeoSettings);
router.put('/seo', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateSeoSettings);

// ===== SECURITY SETTINGS =====

router.get('/security', authenticateToken, requireAdmin, settingsController.getSecuritySettings);
router.put('/security', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateSecuritySettings);

// ===== MEDIA SETTINGS =====

router.get('/media', authenticateToken, requireAdmin, settingsController.getMediaSettings);
router.put('/media', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateMediaSettings);

// ===== NOTIFICATION SETTINGS =====

router.get('/notification', authenticateToken, requireAdmin, settingsController.getNotificationSettings);
router.put('/notification', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateNotificationSettings);

// ===== BACKUP & RESTORE =====

router.get('/backup', authenticateToken, requireAdmin, settingsController.getBackupSettings);
router.post('/backup/create', authenticateToken, requireAdmin, requireTwoFactor, settingsController.createBackup);
router.post('/backup/restore', authenticateToken, requireAdmin, requireTwoFactor, settingsController.restoreBackup);

// ===== SYSTEM MAINTENANCE =====

router.get('/maintenance', authenticateToken, requireAdmin, settingsController.getMaintenanceSettings);
router.put('/maintenance', authenticateToken, requireAdmin, requireTwoFactor, settingsController.updateMaintenanceSettings);
router.post('/cache/clear', authenticateToken, requireAdmin, requireTwoFactor, settingsController.clearCache);
router.post('/database/optimize', authenticateToken, requireAdmin, requireTwoFactor, settingsController.optimizeDatabase);

// ===== API SETTINGS =====

router.get('/api', authenticateToken, requireAdmin, settingsController.getApiSettings);

// ===== LEGAL SETTINGS =====

router.get('/legal', authenticateToken, requireAdmin, settingsController.getLegalSettings);

// ===== SYSTEM INFORMATION =====

router.get('/system-info', authenticateToken, requireAdmin, settingsController.getSystemInformation);

// ===== SYSTEM HEALTH =====

router.get('/health', settingsController.getSystemInformation);

// ===== UTILITY ENDPOINTS =====

router.get('/frontend-settings', settingsService.getFrontendSettings);

// Security headers middleware
router.use('/security', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

module.exports = router;