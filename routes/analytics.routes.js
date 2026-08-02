const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Contact = require('../models/Contact');
const Inventory = require('../models/Inventory');
const Campaign = require('../models/Campaign');
const Newsletter = require('../models/Newsletter');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/analytics/dashboard — comprehensive KPI dashboard
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const thisWeek = new Date(today); thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const thisYear = new Date(today.getFullYear(), 0, 1);

        const [
            totalRevenue, todayRevenue, weekRevenue, monthRevenue, yearRevenue,
            totalOrders, todayOrders, pendingOrders, processingOrders, shippedOrders,
            deliveredOrders, cancelledOrders, returnedOrders, refundRequests,
            totalCustomers, newCustomersToday, activeCustomers, repeatCustomers,
            totalProducts, activeProducts, outOfStock, lowStock,
            inventoryValueResult, inventoryCount,
            avgRating, totalReviews,
            couponUsage, couponsActive, totalNewsletter,
            contactTickets, contactResolved
        ] = await Promise.all([
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: thisWeek } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: thisMonth } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: thisYear } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.countDocuments(),
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
            Order.countDocuments({ status: 'processing' }),
            Order.countDocuments({ status: 'shipped' }),
            Order.countDocuments({ status: 'delivered' }),
            Order.countDocuments({ status: 'cancelled' }),
            Order.countDocuments({ status: 'returned' }),
            Order.countDocuments({ status: 'refunded' }),
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'customer', createdAt: { $gte: today } }),
            User.countDocuments({ role: 'customer', lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
            Order.aggregate([{ $group: { _id: '$user' } }, { $match: { _id: { $ne: null } } }, { $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0, count: 1 } }]),
            Product.countDocuments(),
            Product.countDocuments({ status: 'published' }),
            Product.countDocuments({ $or: [{ stock: { $lte: 0 }, inStock: false }, { soldOut: true }] }),
            Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
            Product.aggregate([{ $match: { stock: { $gte: 0 } } }, { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stock'] } } } }]),
            Product.countDocuments({}),
            Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]),
            Review.countDocuments(),
            Coupon.aggregate([{ $group: { _id: null, used: { $sum: '$timesUsed' }, revenue: { $sum: '$totalDiscountGiven' }, count: { $sum: 1 } } }]),
            Coupon.countDocuments({ status: 'active' }),
            (async()=>{try{const News=require('../models/Newsletter');return await News.countDocuments();}catch(e){return 0;}})(),
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'resolved' })
        ]);

        const tr = totalRevenue[0] || { total: 0, count: 0 };
        const tod = todayRevenue[0] || { total: 0, count: 0 };
        const wk = weekRevenue[0] || { total: 0, count: 0 };
        const mo = monthRevenue[0] || { total: 0, count: 0 };
        const yr = yearRevenue[0] || { total: 0, count: 0 };
        const avgR = avgRating[0] || { avg: 0, count: 0 };
        const cp = couponUsage[0] || { used: 0, revenue: 0, count: 0 };
        const invVal = inventoryValueResult[0] || { total: 0 };
        const rp = repeatCustomers[0] || { count: 0 };

        res.json({ success: true, data: {
            revenue: {
                today: tod.total, week: wk.total, month: mo.total, year: yr.total,
                total: tr.total, avgOrderValue: tr.count > 0 ? Math.round(tr.total / tr.count) : 0,
                todayOrders: tod.count, monthOrders: mo.count
            },
            orders: {
                total: totalOrders, today: todayOrders,
                pending: pendingOrders, processing: processingOrders,
                shipped: shippedOrders, delivered: deliveredOrders,
                cancelled: cancelledOrders, returned: returnedOrders,
                refundRequests: refundRequests
            },
            customers: {
                total: totalCustomers, newToday: newCustomersToday,
                active: activeCustomers, returning: rp.count || 0
            },
            products: {
                total: totalProducts, active: activeProducts,
                outOfStock, lowStock, inventoryValue: invVal.total
            },
            reviews: {
                total: totalReviews, averageRating: Math.round(avgR.avg * 10) / 10 || 0
            },
            marketing: {
                couponCount: cp.count, couponUsage: cp.used, couponRevenue: cp.revenue,
                subscribers: totalNewsletter || 0
            },
            contact: {
                total: contactTickets, resolved: contactResolved,
                open: contactTickets - contactResolved
            }
        }});
    } catch (err) {
        console.error('Analytics dashboard error:', err);
        res.status(500).json({ success: false, message: 'Failed to load analytics' });
    }
});

// GET /api/analytics/revenue — revenue breakdown with daily/monthly data
router.get('/revenue', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const [daily, monthly, byStatus] = await Promise.all([
            Order.aggregate([
                { $match: { createdAt: { $gte: since } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            Order.aggregate([
                { $group: { _id: '$status', revenue: { $sum: '$total' }, count: { $sum: 1 } } }
            ])
        ]);
        res.json({ success: true, data: { daily, monthly, byStatus } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// GET /api/analytics/products — product performance
router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const [bestSellers, topRevenue, categoryStats] = await Promise.all([
            Product.find({ status: 'published' }).sort({ totalSold: -1 }).limit(limit).select('name price totalSold stock images category').lean(),
            Product.find({ status: 'published' }).sort({ totalRevenue: -1 }).limit(limit).select('name price totalRevenue stock images category').lean(),
            Product.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' }, totalStock: { $sum: '$stock' } } },
                { $sort: { count: -1 } }
            ])
        ]);
        res.json({ success: true, data: { bestSellers, topRevenue, categoryStats } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// GET /api/analytics/customers — customer analytics
router.get('/customers', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 90;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const [registrationTrend, topCustomers] = await Promise.all([
            User.aggregate([
                { $match: { role: 'customer', createdAt: { $gte: since } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            User.find({ role: 'customer' }).sort({ totalSpent: -1 }).limit(10)
                .select('name email totalSpent orderCount createdAt').lean()
        ]);
        res.json({ success: true, data: { registrationTrend, topCustomers } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// GET /api/analytics/orders — order trends
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const [dailyOrders, statusDist] = await Promise.all([
            Order.aggregate([
                { $match: { createdAt: { $gte: since } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$total' } } },
                { $sort: { _id: 1 } }
            ]),
            Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);
        res.json({ success: true, data: { dailyOrders, statusDist } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// GET /api/analytics/reviews — review analytics
router.get('/reviews', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [ratingDist, recent, topReviewed] = await Promise.all([
            Review.aggregate([
                { $group: { _id: '$rating', count: { $sum: 1 } } },
                { $sort: { _id: -1 } }
            ]),
            Review.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name').select('rating comment product createdAt').lean(),
            Review.aggregate([
                { $group: { _id: '$product', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
                { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
                { $project: { count: 1, avgRating: { $round: ['$avgRating', 1] }, productName: '$product.name' } }
            ])
        ]);
        res.json({ success: true, data: { ratingDist, recent, topReviewed } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// GET /api/analytics/coupons — coupon analytics
router.get('/coupons', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [usage, topCoupons] = await Promise.all([
            Coupon.aggregate([
                { $group: { _id: '$discountType', count: { $sum: 1 }, used: { $sum: '$timesUsed' }, revenue: { $sum: '$totalDiscountGiven' }, failed: { $sum: '$failedAttempts' } } }
            ]),
            Coupon.find().sort({ timesUsed: -1 }).limit(10).select('name code discountType discountValue timesUsed totalDiscountGiven failedAttempts').lean()
        ]);
        res.json({ success: true, data: { usage, topCoupons } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// GET /api/analytics/inventory — inventory analytics
router.get('/inventory', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [stockDist, lowStockItems] = await Promise.all([
            Product.aggregate([
                { $group: { _id: null, totalValue: { $sum: { $multiply: ['$price', '$stock'] } }, totalItems: { $sum: '$stock' }, productCount: { $sum: 1 }, outOfStock: { $sum: { $cond: [{ $or: [{ $lte: ['$stock', 0] }, { $eq: ['$inStock', false] }] }, 1, 0] } }, lowStock: { $sum: { $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', 5] }] }, 1, 0] } } } }
            ]),
            Product.find({ stock: { $gt: 0, $lte: 5 } }).sort({ stock: 1 }).limit(20).select('name sku price stock images category').lean()
        ]);
        res.json({ success: true, data: { summary: stockDist[0] || {}, lowStockItems } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// GET /api/analytics/contact — contact/ support analytics
router.get('/contact', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [total, statusDist, monthly] = await Promise.all([
            Contact.countDocuments(),
            Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            Contact.aggregate([
                { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
                { $limit: 12 }
            ])
        ]);
        res.json({ success: true, data: { total, statusDist, monthly } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed' });
    }
});

// POST /api/analytics/reports/export — generate and return CSV data
router.post('/reports/export', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { type, startDate, endDate, filters } = req.body;
        const match = {};
        if (startDate || endDate) {
            match.createdAt = {};
            if (startDate) match.createdAt.$gte = new Date(startDate);
            if (endDate) match.createdAt.$lte = new Date(endDate);
        }

        let data, headers, rows;

        switch (type) {
            case 'sales': {
                const query = Order.find(match).sort({ createdAt: -1 }).lean();
                if (filters?.status) query.where('status').equals(filters.status);
                const orders = await query;
                headers = ['Order #', 'Date', 'Customer', 'Items', 'Total', 'Discount', 'Shipping', 'Status', 'Payment'];
                rows = orders.map(o => [
                    o.orderNumber || o._id.toString().slice(-6),
                    new Date(o.createdAt).toISOString().split('T')[0],
                    o.shippingAddress?.name || 'N/A',
                    (o.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
                    o.total || 0, o.discount || 0, o.shippingCost || 0,
                    o.status, o.paymentMethod || 'N/A'
                ]);
                break;
            }
            case 'products': {
                const products = await Product.find(match).sort({ totalSold: -1 }).lean();
                headers = ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Total Sold', 'Revenue', 'Status'];
                rows = products.map(p => [p.name, p.sku||'', p.category||'', p.price, p.stock, p.totalSold||0, p.totalRevenue||0, p.status]);
                break;
            }
            case 'customers': {
                const users = await User.find({ role: 'customer', ...match }).sort({ totalSpent: -1 }).lean();
                headers = ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined'];
                rows = users.map(u => [u.name, u.email, u.phone||'', u.orderCount||0, u.totalSpent||0, new Date(u.createdAt).toISOString().split('T')[0]]);
                break;
            }
            case 'inventory': {
                const inv = await Product.find({}).sort({ stock: 1 }).lean();
                headers = ['Name', 'SKU', 'Stock', 'Price', 'Value', 'Category', 'Status'];
                rows = inv.map(p => [p.name, p.sku||'', p.stock, p.price, (p.price||0)*(p.stock||0), p.category||'', p.status]);
                break;
            }
            default: {
                const orders = await Order.find(match).sort({ createdAt: -1 }).lean();
                headers = ['Order #', 'Date', 'Total', 'Status'];
                rows = orders.map(o => [o.orderNumber || o._id.toString().slice(-6), new Date(o.createdAt).toISOString().split('T')[0], o.total||0, o.status]);
            }
        }

        res.json({ success: true, data: { headers, rows } });
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ success: false, message: 'Export failed' });
    }
});

// ===================== ADMIN ANALYTICS/REPORTS ENDPOINTS =====================

function getAnalyticsMatch(req) {
    const match = {};
    if (req.query.startDate) match.createdAt = { $gte: new Date(req.query.startDate + 'T00:00:00') };
    if (req.query.endDate) match.createdAt = { ...(match.createdAt || {}), $lte: new Date(req.query.endDate + 'T23:59:59.999') };
    return match;
}

async function getSalesSeries(match) {
    const agg = await Order.aggregate([
        { $match: match },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$total' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    const map = {};
    agg.forEach(d => { map[d._id] = { date: d._id, total: d.total, orders: d.orders }; });

    let start = match.createdAt && match.createdAt.$gte ? new Date(match.createdAt.$gte) : new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
    start = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    let end = match.createdAt && match.createdAt.$lte ? new Date(match.createdAt.$lte) : new Date();

    const result = [];
    const cur = new Date(start);
    while (cur <= end && result.length < 366) {
        const key = cur.toISOString().split('T')[0];
        result.push(map[key] || { date: key, total: 0, orders: 0 });
        cur.setUTCDate(cur.getUTCDate() + 1);
    }
    for (let i = 1; i < result.length; i++) {
        const prev = result[i - 1].total || 0;
        const c = result[i].total || 0;
        result[i].growth = prev > 0 ? Math.round(((c - prev) / prev) * 1000) / 10 : 0;
    }
    return result;
}

// GET /api/analytics/kpi — KPI cards for the reports dashboard
router.get('/kpi', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const match = getAnalyticsMatch(req);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const [windowAgg, todayAgg, weekAgg, monthAgg, statusAgg, customersInWindow, totalCustomers, newInWindow, returningAgg, reviewAgg, activeProducts, lowStockItems, couponActive] = await Promise.all([
            Order.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: '$total' }, subtotal: { $sum: '$subtotal' }, fees: { $sum: '$deliveryFee' }, tax: { $sum: '$tax' }, discount: { $sum: '$couponDiscount' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: weekStart } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
            User.countDocuments({ role: 'customer', ...match }),
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'customer', createdAt: match.createdAt || { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
            Order.aggregate([{ $match: match }, { $group: { _id: '$user' } }, { $match: { _id: { $ne: null } } }, { $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0, count: 1 } }]),
            Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
            Product.countDocuments({ status: 'published' }),
            Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
            Coupon.countDocuments({ status: 'active' })
        ]);

        const w = windowAgg[0] || { total: 0, subtotal: 0, fees: 0, tax: 0, discount: 0, count: 0 };
        const td = todayAgg[0] || { total: 0, count: 0 };
        const wk = weekAgg[0] || { total: 0, count: 0 };
        const mo = monthAgg[0] || { total: 0, count: 0 };
        const returning = returningAgg[0] || { count: 0 };
        const avgR = reviewAgg[0] || { avg: 0 };

        const orderStatusBreakdown = {};
        statusAgg.forEach(s => { orderStatusBreakdown[s._id] = s.count; });

        res.json({ success: true, data: {
            todayRevenue: td.total,
            weekRevenue: wk.total,
            monthRevenue: mo.total,
            totalRevenue: w.total,
            grossProfit: Math.round((w.total - w.fees - w.tax) * 100) / 100,
            netProfit: Math.round((w.total - w.fees - w.tax - w.discount) * 100) / 100,
            ordersToday: td.count,
            monthOrders: mo.count,
            totalOrders: w.count,
            conversionRate: customersInWindow > 0 ? Math.round((w.count / customersInWindow) * 1000) / 10 : 0,
            avgOrderValue: w.count > 0 ? Math.round(w.total / w.count) : 0,
            customerLTV: totalCustomers > 0 ? Math.round(w.total / totalCustomers) : 0,
            newCustomers: newInWindow,
            returningCustomerRate: totalCustomers > 0 ? Math.round((returning.count / totalCustomers) * 1000) / 10 : 0,
            totalCustomers,
            activeProducts,
            lowStockItems,
            avgRating: Math.round(avgR.avg * 10) / 10 || 0,
            orderStatusBreakdown,
            activeCoupons: couponActive
        }});
    } catch (err) {
        console.error('Analytics kpi error:', err);
        res.status(500).json({ success: false, message: 'Failed to load analytics' });
    }
});

// GET /api/analytics/sales — daily sales series
router.get('/sales', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const match = getAnalyticsMatch(req);
        const data = await getSalesSeries(match);
        res.json({ success: true, data });
    } catch (err) {
        console.error('Analytics sales error:', err);
        res.status(500).json({ success: false, message: 'Failed to load sales data' });
    }
});

// GET /api/analytics/charts — chart + report datasets
router.get('/charts', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const match = getAnalyticsMatch(req);

        let categoryAgg = await Order.aggregate([
            { $match: match },
            { $unwind: '$items' },
            { $group: { _id: { $ifNull: ['$items.category', 'Uncategorized'] }, total: { $sum: { $ifNull: ['$items.lineTotal', 0] } }, count: { $sum: { $ifNull: ['$items.quantity', 0] } } } },
            { $sort: { total: -1 } },
            { $limit: 10 }
        ]);
        if (!categoryAgg.length) {
            categoryAgg = await Product.aggregate([
                { $match: { status: 'published' } },
                { $group: { _id: { $ifNull: ['$category', 'Uncategorized'] }, total: { $sum: 1 }, count: { $sum: 1 } } },
                { $sort: { total: -1 } },
                { $limit: 10 }
            ]);
        }

        const [statusAgg, payAgg, rateAgg, topAgg, custAgg, invAgg, shipAgg, campAgg, revAgg, coupAgg, contactAgg] = await Promise.all([
            Order.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: match }, { $group: { _id: { $ifNull: ['$paymentMethod', 'cash'] }, count: { $sum: 1 }, amount: { $sum: '$total' } } }]),
            Review.aggregate([{ $group: { _id: '$rating', count: { $sum: 1 } } }]),
            Order.aggregate([
                { $match: match },
                { $unwind: '$items' },
                { $group: { _id: { $ifNull: ['$items.name', 'Unknown'] }, category: { $first: '$items.category' }, revenue: { $sum: { $ifNull: ['$items.lineTotal', 0] } }, sold: { $sum: { $ifNull: ['$items.quantity', 0] } } } },
                { $sort: { revenue: -1 } },
                { $limit: 10 }
            ]),
            Order.aggregate([
                { $match: match },
                { $group: { _id: '$user', orders: { $sum: 1 }, spent: { $sum: '$total' } } },
                { $sort: { spent: -1 } },
                { $limit: 10 },
                { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'u' } },
                { $unwind: { path: '$u', preserveNullAndEmptyArrays: true } }
            ]),
            Product.find({}).sort({ stock: 1 }).limit(50).select('name stock price').lean(),
            Order.aggregate([{ $match: match }, { $group: { _id: { $ifNull: ['$courier', 'Standard'] }, orders: { $sum: 1 }, avgCost: { $avg: { $ifNull: ['$deliveryFee', 0] } } } }]),
            Campaign.find({}).sort({ createdAt: -1 }).limit(10).select('name analytics').lean(),
            Review.aggregate([
                { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'p' } },
                { $unwind: { path: '$p', preserveNullAndEmptyArrays: true } }
            ]),
            Coupon.find({}).sort({ timesUsed: -1 }).limit(10).select('code discountType discountValue timesUsed totalDiscountGiven').lean(),
            Contact.find({}).sort({ createdAt: -1 }).limit(20).select('name email subject status createdAt').lean()
        ]);

        const orderStatus = {};
        statusAgg.forEach(s => { orderStatus[s._id] = s.count; });
        const paymentMethods = {};
        const paymentBreakdown = {};
        payAgg.forEach(p => { paymentMethods[p._id] = p.count; paymentBreakdown[p._id] = p.amount; });
        const ratingDistribution = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
        rateAgg.forEach(r => { ratingDistribution[r._id] = r.count; });

        const totalProducts = await Product.countDocuments();
        const totalCustomersAll = await User.countDocuments({ role: 'customer' });
        const contactTotal = contactAgg.length;
        const contactResolved = contactAgg.filter(c => c.status === 'resolved').length;

        res.json({ success: true, data: {
            categories: categoryAgg.map(c => ({ name: c._id, total: c.total, count: c.count })),
            orderStatus,
            paymentMethods,
            paymentBreakdown,
            ratingDistribution,
            topProducts: topAgg.map(t => ({ name: t._id, category: t.category || '', revenue: t.revenue, sold: t.sold })),
            topCustomers: custAgg.map(c => ({ name: (c.u && c.u.name) || 'Guest', email: (c.u && c.u.email) || '', orders: c.orders, spent: c.spent })),
            inventoryStats: invAgg.map(p => ({ name: p.name, stock: p.stock, value: Math.round((p.price || 0) * (p.stock || 0)) })),
            shippingStats: shipAgg.map(s => ({ courier: s._id, orders: s.orders, avgCost: Math.round(s.avgCost), avgTime: '-' })),
            marketingStats: campAgg.map(c => ({ name: c.name, sent: (c.analytics && c.analytics.sent) || 0, opens: (c.analytics && c.analytics.opened) || 0, clicks: (c.analytics && c.analytics.clicked) || 0, revenue: (c.analytics && c.analytics.revenue) || 0 })),
            reviewStats: revAgg.map(r => ({ name: (r.p && r.p.name) || 'Product', avgRating: Math.round(r.avgRating * 10) / 10, count: r.count })),
            couponStats: coupAgg.map(c => ({ code: c.code, discountType: c.discountType, discountValue: c.discountValue, used: c.timesUsed || 0, revenue: c.totalDiscountGiven || 0 })),
            contactStats: contactAgg.map(c => ({ name: c.name, email: c.email, subject: c.subject, status: c.status, date: c.createdAt })),
            websiteStats: [
                { metric: 'Total Products', value: totalProducts, change: 0 },
                { metric: 'Total Orders', value: statusAgg.reduce((s, x) => s + x.count, 0), change: 0 },
                { metric: 'Total Customers', value: totalCustomersAll, change: 0 },
                { metric: 'Open Contact Tickets', value: contactTotal - contactResolved, change: 0 }
            ]
        }});
    } catch (err) {
        console.error('Analytics charts error:', err);
        res.status(500).json({ success: false, message: 'Failed to load chart data' });
    }
});

// GET /api/analytics/report/:tab — report detail tables
router.get('/report/:tab', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const match = getAnalyticsMatch(req);
        const search = (req.query.search || '').trim().toLowerCase();
        const filter = (req.query.filter || '').trim();
        let data = [];

        switch (req.params.tab) {
            case 'products': {
                let agg = await Order.aggregate([
                    { $match: match },
                    { $unwind: '$items' },
                    { $group: { _id: { $ifNull: ['$items.name', 'Unknown'] }, category: { $first: '$items.category' }, revenue: { $sum: { $ifNull: ['$items.lineTotal', 0] } }, sold: { $sum: { $ifNull: ['$items.quantity', 0] } } } },
                    { $sort: { revenue: -1 } },
                    { $limit: 200 }
                ]);
                data = agg.map(t => ({ name: t._id, category: t.category || '', revenue: t.revenue, sold: t.sold }));
                if (filter) data = data.filter(d => d.category === filter);
                if (search) data = data.filter(d => (d.name || '').toLowerCase().includes(search));
                break;
            }
            case 'customers': {
                let agg = await Order.aggregate([
                    { $match: match },
                    { $group: { _id: '$user', orders: { $sum: 1 }, spent: { $sum: '$total' } } },
                    { $sort: { spent: -1 } },
                    { $limit: 200 },
                    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'u' } },
                    { $unwind: { path: '$u', preserveNullAndEmptyArrays: true } }
                ]);
                data = agg.map(c => ({ name: (c.u && c.u.name) || 'Guest', email: (c.u && c.u.email) || '', orders: c.orders, spent: c.spent }));
                if (search) data = data.filter(d => (d.name + ' ' + d.email).toLowerCase().includes(search));
                break;
            }
            case 'orders': {
                const statusAgg = await Order.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
                data = statusAgg.map(s => ({ status: s._id, count: s.count }));
                if (filter) data = data.filter(d => d.status === filter);
                break;
            }
            case 'inventory': {
                const rows = await Product.find({}).sort({ stock: 1 }).limit(200).select('name stock price').lean();
                data = rows.map(p => ({ name: p.name, stock: p.stock, value: Math.round((p.price || 0) * (p.stock || 0)) }));
                if (search) data = data.filter(d => (d.name || '').toLowerCase().includes(search));
                break;
            }
            case 'marketing': {
                const rows = await Campaign.find({}).sort({ createdAt: -1 }).limit(200).select('name analytics').lean();
                data = rows.map(c => ({ name: c.name, sent: (c.analytics && c.analytics.sent) || 0, opens: (c.analytics && c.analytics.opened) || 0, clicks: (c.analytics && c.analytics.clicked) || 0, revenue: (c.analytics && c.analytics.revenue) || 0 }));
                if (search) data = data.filter(d => (d.name || '').toLowerCase().includes(search));
                break;
            }
            case 'payments': {
                const payAgg = await Order.aggregate([{ $match: match }, { $group: { _id: { $ifNull: ['$paymentMethod', 'cash'] }, count: { $sum: 1 }, amount: { $sum: '$total' } } }]);
                data = payAgg.map(p => ({ method: p._id, count: p.count, amount: p.amount }));
                break;
            }
            case 'shipping': {
                const shipAgg = await Order.aggregate([{ $match: match }, { $group: { _id: { $ifNull: ['$courier', 'Standard'] }, orders: { $sum: 1 }, avgCost: { $avg: { $ifNull: ['$deliveryFee', 0] } } } }]);
                data = shipAgg.map(s => ({ courier: s._id, orders: s.orders, avgCost: Math.round(s.avgCost), avgTime: '-' }));
                break;
            }
            case 'website': {
                const [prods, orders, customers, contactOpen] = await Promise.all([
                    Product.countDocuments(),
                    Order.countDocuments(match),
                    User.countDocuments({ role: 'customer' }),
                    Contact.countDocuments({ status: { $ne: 'resolved' } })
                ]);
                data = [
                    { metric: 'Total Products', value: prods, change: 0 },
                    { metric: 'Orders in Period', value: orders, change: 0 },
                    { metric: 'Total Customers', value: customers, change: 0 },
                    { metric: 'Open Contact Tickets', value: contactOpen, change: 0 }
                ];
                break;
            }
            case 'reviews': {
                const agg = await Review.aggregate([
                    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 200 },
                    { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'p' } },
                    { $unwind: { path: '$p', preserveNullAndEmptyArrays: true } }
                ]);
                data = agg.map(r => ({ name: (r.p && r.p.name) || 'Product', avgRating: Math.round(r.avgRating * 10) / 10, count: r.count }));
                break;
            }
            case 'coupons': {
                const rows = await Coupon.find({}).sort({ timesUsed: -1 }).limit(200).select('code discountType discountValue timesUsed totalDiscountGiven').lean();
                data = rows.map(c => ({ code: c.code, discountType: c.discountType, discountValue: c.discountValue, used: c.timesUsed || 0, revenue: c.totalDiscountGiven || 0 }));
                if (search) data = data.filter(d => (d.code || '').toLowerCase().includes(search));
                break;
            }
            case 'contact': {
                const rows = await Contact.find({}).sort({ createdAt: -1 }).limit(200).select('name email subject status createdAt').lean();
                data = rows.map(c => ({ name: c.name, email: c.email, subject: c.subject, status: c.status, date: c.createdAt }));
                if (search) data = data.filter(d => (d.name + ' ' + d.email + ' ' + d.subject).toLowerCase().includes(search));
                break;
            }
            case 'sales':
            default: {
                const series = await getSalesSeries(match);
                data = filter ? series.map(d => ({ ...d, category: filter })) : series;
                if (search) data = data.filter(d => String(d.date).includes(search));
            }
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error('Analytics report error:', err);
        res.status(500).json({ success: false, message: 'Failed to load report' });
    }
});

// GET /api/analytics/live — lightweight realtime snapshot for polling
router.get('/live', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const [totAgg, todAgg, totalOrders, pendingOrders, newCustomersToday, customersAll] = await Promise.all([
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
            Order.countDocuments(),
            Order.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
            User.countDocuments({ role: 'customer', createdAt: { $gte: today } }),
            User.countDocuments({ role: 'customer' })
        ]);
        const tot = totAgg[0] || { total: 0, count: 0 };
        const tod = todAgg[0] || { total: 0, count: 0 };
        const conversionRate = customersAll > 0 ? Math.round((tot.count / customersAll) * 1000) / 10 : 0;
        const avgOrderValue = tot.count > 0 ? Math.round(tot.total / tot.count) : 0;

        res.json({ success: true, data: {
            kpi: { totalRevenue: tot.total, todayRevenue: tod.total, totalOrders, pendingOrders, newCustomersToday },
            realtime: { todayRevenue: tod.total, ordersToday: tod.count, newCustomers: newCustomersToday, conversionRate, avgOrderValue },
            timestamp: new Date().toISOString()
        }});
    } catch (err) {
        console.error('Analytics live error:', err);
        res.status(500).json({ success: false, message: 'Failed to load live data' });
    }
});

module.exports = router;
