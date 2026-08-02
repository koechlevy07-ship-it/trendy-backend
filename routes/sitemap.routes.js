const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const DEFAULT_BASE_URL = 'https://trendy-frontend-ashen.vercel.app';

function xmlEscape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function urlEntry(loc, lastmod, changefreq, priority) {
    return `    <url>\n        <loc>${xmlEscape(loc)}</loc>\n        <lastmod>${lastmod}</lastmod>\n        <changefreq>${changefreq}</changefreq>\n        <priority>${priority}</priority>\n    </url>`;
}

async function getSettings() {
    let s = await Settings.findOne();
    if (!s) { s = new Settings(); await s.save(); }
    return s;
}

// POST /api/sitemap/generate — build and store sitemap.xml
router.post('/generate', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const settings = await getSettings();
        const base = String(settings.canonicalUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
        const today = new Date().toISOString().slice(0, 10);

        const [products, categories] = await Promise.all([
            Product.find({ status: 'published' }).select('_id updatedAt').lean(),
            Product.distinct('category', { status: 'published' })
        ]);

        const entries = [];
        entries.push(urlEntry(base + '/', today, 'daily', '1.0'));

        const catItems = (categories || []).filter(c => c && c.trim());
        catItems.forEach(c => entries.push(urlEntry(`${base}/?category=${encodeURIComponent(c)}`, today, 'weekly', '0.9')));
        ['men', 'women', 'kids'].forEach(g => entries.push(urlEntry(`${base}/?gender=${g}`, today, 'weekly', '0.8')));
        entries.push(urlEntry(base + '/collections', today, 'weekly', '0.8'));
        entries.push(urlEntry(base + '/contact', today, 'monthly', '0.8'));
        entries.push(urlEntry(base + '/about', today, 'monthly', '0.7'));
        entries.push(urlEntry(base + '/terms', today, 'yearly', '0.3'));
        entries.push(urlEntry(base + '/privacy', today, 'yearly', '0.3'));
        products.forEach(p => {
            const mod = p.updatedAt ? p.updatedAt.toISOString().slice(0, 10) : today;
            entries.push(urlEntry(`${base}/product-details.html?id=${p._id}`, mod, 'weekly', '0.8'));
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;

        settings.sitemapXml = xml;
        settings.sitemapGeneratedAt = new Date();
        await settings.save();

        res.json({ success: true, count: entries.length, url: '/api/sitemap', message: 'Sitemap generated' });
    } catch (err) {
        console.error('Sitemap generation error:', err);
        res.status(500).json({ success: false, message: 'Sitemap generation failed' });
    }
});

// GET /api/sitemap — serve the stored sitemap as XML
router.get('/', async (req, res) => {
    try {
        const settings = await getSettings();
        if (!settings.sitemapXml) return res.status(404).json({ success: false, message: 'Sitemap not generated yet' });
        res.set('Content-Type', 'application/xml');
        res.send(settings.sitemapXml);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load sitemap' });
    }
});

module.exports = router;
