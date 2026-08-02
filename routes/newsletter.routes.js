const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const Campaign = require('../models/Campaign');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

function toSubscriberDTO(s) {
    return {
        _id: s._id,
        email: s.email,
        name: s.name || '',
        status: s.status || (s.active === false ? 'unsubscribed' : 'active'),
        active: s.active,
        createdAt: s.createdAt,
        lastCampaign: s.lastCampaign || null
    };
}

router.post('/', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
        await Newsletter.findOneAndUpdate(
            { email: String(email).toLowerCase() },
            { email: String(email).toLowerCase(), name: name || '', active: true, status: 'active' },
            { upsert: true, new: true }
        );
        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET /api/newsletter/subscribers — list all subscribers
router.get('/subscribers', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const list = await Newsletter.find({}).sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: list.map(toSubscriberDTO) });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load subscribers' });
    }
});

// DELETE /api/newsletter/subscribers/:id — remove a subscriber
router.delete('/subscribers/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await Newsletter.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Subscriber not found' });
        res.json({ success: true, message: 'Subscriber deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete subscriber' });
    }
});

// POST /api/newsletter/import — bulk import subscribers [{ email, name }]
router.post('/import', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { subscribers } = req.body;
        if (!Array.isArray(subscribers) || !subscribers.length) {
            return res.status(400).json({ success: false, message: 'No subscribers provided' });
        }
        let added = 0;
        for (const sub of subscribers) {
            const email = String((sub && sub.email) || '').trim().toLowerCase();
            if (!email) continue;
            const exists = await Newsletter.findOne({ email });
            if (!exists) {
                await Newsletter.create({ email, name: (sub && sub.name) || '', active: true, status: 'active' });
                added++;
            }
        }
        res.json({ success: true, message: `${added} subscriber(s) imported`, added });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Import failed' });
    }
});

// GET /api/newsletter/stats — subscriber + campaign engagement stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [total, active, campaignAgg] = await Promise.all([
            Newsletter.countDocuments(),
            Newsletter.countDocuments({ $or: [{ status: 'active' }, { status: { $exists: false }, active: true }] }),
            Campaign.aggregate([
                { $group: { _id: null, sent: { $sum: { $ifNull: ['$analytics.sent', 0] } }, opened: { $sum: { $ifNull: ['$analytics.opened', 0] } }, clicked: { $sum: { $ifNull: ['$analytics.clicked', 0] } }, bounced: { $sum: { $ifNull: ['$analytics.bounced', 0] } } } }
            ])
        ]);
        const c = campaignAgg[0] || { sent: 0, opened: 0, clicked: 0, bounced: 0 };
        res.json({ success: true, data: {
            total,
            active,
            openRate: c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0,
            clickRate: c.sent > 0 ? Math.round((c.clicked / c.sent) * 100) : 0,
            bounceRate: c.sent > 0 ? Math.round((c.bounced / c.sent) * 100) : 0
        }});
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load newsletter stats' });
    }
});

module.exports = router;
