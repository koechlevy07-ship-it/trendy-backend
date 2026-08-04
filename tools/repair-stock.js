// One-shot stock/flag repair for Trendy Wardrobe.
// Fixes:
//   1. Negative stock values -> 0
//   2. Flag/stock inconsistencies (inStock/soldOut derived from authoritative stock)
//   3. Inventory docs synced from Product.stock
// Dry-run by default. Pass --apply to write to the database.
//
// Usage:
//   node tools/repair-stock.js            (dry run, prints what would change)
//   node tools/repair-stock.js --apply    (writes changes)

const path = require('path');
const fs = require('fs');
const mongoose = require('../trendy-backend/node_modules/mongoose');

const apply = process.argv.includes('--apply');

function loadEnv(file) {
    const out = {};
    try {
        const txt = fs.readFileSync(file, 'utf8');
        for (const line of txt.split(/\r?\n/)) {
            const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
            if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
    } catch (e) { /* ignore */ }
    return out;
}

const env = loadEnv(path.join(__dirname, '..', 'trendy-backend', '.env'));
const MONGODB_URI = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI || env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI not found. Check trendy-backend/.env');
    process.exit(1);
}

const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// Same availability rule as routes: stock > 0 wins, then limited, then preOrder.
function desiredFlags(p) {
    const stock = Math.max(0, Number(p.stock) || 0);
    const preOrder = !!p.preOrder;
    const limited = !!p.limitedAvailable && (Number(p.limitedPieces) || 0) > 0;
    if (stock > 0 || preOrder || limited) {
        return { inStock: true, soldOut: false };
    }
    return { inStock: false, soldOut: true };
}

(async () => {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
        console.log(`[${apply ? 'APPLY' : 'DRY-RUN'}] Connected to ${mongoose.connection.name}`);

        const products = await Product.find({});
        let flagFixes = 0;
        let negativeFixes = 0;
        let invCreated = 0;
        let invUpdated = 0;
        const rows = [];

        for (const p of products) {
            const rawStock = Number(p.stock) || 0;
            const stock = Math.max(0, rawStock);
            const flags = desiredFlags(p);

            const stockChanged = rawStock !== stock;
            const flagChanged = p.inStock !== flags.inStock || p.soldOut !== flags.soldOut;
            const displayName = p.name || p.sku || p._id;

            if (stockChanged) negativeFixes++;
            if (flagChanged) flagFixes++;
            if (stockChanged || flagChanged) {
                rows.push({ name: displayName, id: p._id.toString(), fromStock: rawStock, toStock: stock, from: { inStock: p.inStock, soldOut: p.soldOut }, to: flags });
                if (apply) {
                    await Product.findByIdAndUpdate(p._id, { $set: { stock, inStock: flags.inStock, soldOut: flags.soldOut } });
                }
            }

            // Inventory mirror
            let inv = await Inventory.findOne({ product: p._id });
            const qty = Math.max(0, stock);
            const limitedQty = flags.inStock && !p.preOrder && p.limitedAvailable && (Number(p.limitedPieces) || 0) > 0
                ? Number(p.limitedPieces)
                : qty;
            const threshold = Number(p.stockThreshold) || 5;
            let newStatus = limitedQty <= 0 ? (p.preOrder ? 'backorder' : 'out_of_stock') : (limitedQty <= threshold ? 'low_stock' : 'in_stock');

            if (!inv) {
                invCreated++;
                if (apply) {
                    await Inventory.create({
                        product: p._id,
                        sku: p.sku || '',
                        quantity: limitedQty,
                        reservedQuantity: Number(p.reservedStock) || 0,
                        lowStockThreshold: threshold,
                        status: newStatus,
                        history: []
                    });
                }
            } else {
                const prevQty = inv.quantity;
                const prevStatus = inv.status;
                const thresholdChanged = Number(inv.lowStockThreshold || 5) !== threshold;
                if (prevQty !== limitedQty || prevStatus !== newStatus || thresholdChanged) {
                    invUpdated++;
                    if (apply) {
                        inv.quantity = limitedQty;
                        inv.lowStockThreshold = threshold;
                        inv.status = newStatus;
                        inv.history.push({ previousQty: prevQty, newQty: limitedQty, delta: limitedQty - prevQty, type: 'correction', reason: 'Stock repair sync', admin: 'system' });
                        await inv.save();
                    }
                }
            }
        }

        console.log('\n--- Flag/stock changes ---');
        for (const r of rows) {
            console.log(`  ${r.name} [${r.id}] stock ${r.fromStock} -> ${r.toStock} | inStock ${r.from.inStock}->${r.to.inStock}, soldOut ${r.from.soldOut}->${r.to.soldOut}`);
        }
        console.log(`\nSummary: ${flagFixes} flag fixes, ${negativeFixes} negative-stock fixes, ${invCreated} inventory created, ${invUpdated} inventory updated`);
        console.log(apply ? 'APPLIED.' : 'Dry run only. Re-run with --apply to write changes.');
    } catch (err) {
        console.error('Repair failed:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
