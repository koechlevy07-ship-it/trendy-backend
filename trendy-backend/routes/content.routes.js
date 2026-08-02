const express = require('express');
const router = express.Router();
const ContentPage = require('../models/ContentPage');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/content/pages — all editable website content pages
router.get('/pages', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const pages = await ContentPage.find({}).lean();
        const data = {};
        pages.forEach(p => { data[p.key] = { title: p.title || '', content: p.content || '' }; });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load pages' });
    }
});

// PUT /api/content/pages/:page — create or update a page
router.put('/pages/:page', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const key = String(req.params.page).toLowerCase().trim();
        const { title, content } = req.body;
        if (!key) return res.status(400).json({ success: false, message: 'Page key required' });
        await ContentPage.findOneAndUpdate(
            { key },
            { key, title: title || '', content: content || '' },
            { upsert: true, new: true }
        );
        res.json({ success: true, message: 'Page saved' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save page' });
    }
});

module.exports = router;
