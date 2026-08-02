const express = require('express');
const router = express.Router();
const Popup = require('../models/Popup');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/popups — list all popups
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const popups = await Popup.find({}).sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: popups });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load popups' });
    }
});

// GET /api/popups/stats — aggregate stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [total, active, viewsAgg] = await Promise.all([
            Popup.countDocuments(),
            Popup.countDocuments({ active: true }),
            Popup.aggregate([{ $group: { _id: null, views: { $sum: '$views' }, conversions: { $sum: '$conversions' }, clicks: { $sum: '$clicks' } } }])
        ]);
        const a = viewsAgg[0] || { views: 0, conversions: 0, clicks: 0 };
        res.json({ success: true, data: { total, active, views: a.views, conversions: a.conversions, clicks: a.clicks } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load popup stats' });
    }
});

// POST /api/popups — create popup
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, type, trigger, delay, content, ctaText, ctaLink, displayRules, active } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Name is required' });
        const popup = await Popup.create({
            name: String(name).trim(),
            type: type || 'newsletter',
            trigger: trigger || 'on_load',
            delay: parseInt(delay, 10) || 5,
            content: content || '',
            ctaText: ctaText || '',
            ctaLink: ctaLink || '',
            displayRules: displayRules || 'all',
            active: active !== false
        });
        res.status(201).json({ success: true, data: popup, message: 'Popup created' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create popup' });
    }
});

// PUT /api/popups/:id — update popup
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, type, trigger, delay, content, ctaText, ctaLink, displayRules, active } = req.body;
        const update = {};
        if (name !== undefined) update.name = String(name).trim();
        if (type !== undefined) update.type = type;
        if (trigger !== undefined) update.trigger = trigger;
        if (delay !== undefined) update.delay = parseInt(delay, 10) || 5;
        if (content !== undefined) update.content = content;
        if (ctaText !== undefined) update.ctaText = ctaText;
        if (ctaLink !== undefined) update.ctaLink = ctaLink;
        if (displayRules !== undefined) update.displayRules = displayRules;
        if (active !== undefined) update.active = active !== false;
        if (update.name === '') return res.status(400).json({ success: false, message: 'Name is required' });

        const popup = await Popup.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!popup) return res.status(404).json({ success: false, message: 'Popup not found' });
        res.json({ success: true, data: popup, message: 'Popup updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update popup' });
    }
});

// PUT /api/popups/:id/toggle — toggle active state
router.put('/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const popup = await Popup.findById(req.params.id);
        if (!popup) return res.status(404).json({ success: false, message: 'Popup not found' });
        popup.active = !popup.active;
        await popup.save();
        res.json({ success: true, data: popup, message: 'Popup toggled' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to toggle popup' });
    }
});

// DELETE /api/popups/:id — delete popup
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await Popup.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Popup not found' });
        res.json({ success: true, message: 'Popup deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete popup' });
    }
});

module.exports = router;
