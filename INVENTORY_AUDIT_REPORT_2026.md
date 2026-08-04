# Inventory & Ordering Audit Report — 2026-08-04

## Objective
Guarantee that products available in admin are available on the storefront, add-to-cart and
checkout work, quantity decreases after orders, and admin stays synchronized — **without**
changing website design, layout, branding, or any working feature.

## Root Cause
`getEffectiveStock()` treated **stock as a fallback**, duplicated in backend
`order.routes.js`, `cart.routes.js`, `checkout.routes.js`, `wishlist.routes.js` and frontend
`app.js`, `cart.js`, `product-details.js`, `wishlist.js`:

```
if (product.soldOut) return 0;
if (product.stock > 0) return product.stock;
...
if (product.inStock) return product.stockThreshold || 5;   // ← the bug
return 0;
```

Because `inStock` defaults to `true` in the schema:
- A product with `stock: 0, inStock: true` was treated as **5 in stock** → **oversellable** (12 live products affected).
- A product with `stock: 5, soldOut: true` was treated as **0** → false "Out of Stock" (CHUNKY HEELS).
- `routes/checkout.routes.js` `createOrderFromCheckout()` built orders **with zero stock deduction**.

## Fixes (committed + deployed)

### Backend — `deploy` repo, branch `inventory-audit-backup` → `deploy/main` (commit `d1336ac8`)
- **`routes/order.routes.js`**
  - `getEffectiveStock`: stock-first; removed the `inStock → stockThreshold` fallback.
  - Order POST now **deducts stock atomically before saving the order**
    (`findOneAndUpdate({_id, stock: {$gte: qty}}, {$inc: {stock: -qty, totalSold: qty}})`), so
    stock can never go negative and concurrent orders can't oversell. Deductions roll back if
    order save fails. Pre-order lines skip deduction; limited-piece products deduct
    `limitedPieces`.
  - All cancel/return/refund restores route through shared `restoreOrderStock()` (limited-aware,
    logs inventory).
- **`routes/checkout.routes.js`**
  - Same stock-first `getEffectiveStock`.
  - `createOrderFromCheckout()` now deducts stock before saving (was a pure oversell path).
  - Shared `restoreCheckoutStock()` for the two cancel paths.
- **`routes/cart.routes.js`, `routes/wishlist.routes.js`** — stock-first `getEffectiveStock`;
  wishlist in-stock stat uses effective stock.
- **`routes/product.routes.js`** — admin update auto-derives `soldOut` from `stock` when the
  flag isn't explicitly sent, keeping admin display consistent.
- **`tools/repair-stock.js`** — one-shot data repair (dry-run default; `--apply` to write):
  fixes negative stock, flag/stock inconsistencies, and syncs the `Inventory` mirror from
  `Product.stock`.
- Same changes mirrored into the in-repo `trendy-backend/` copy (verified byte-identical).

### Frontend — `frontend` repo, branch `feat-whatsapp-checkout` → `master` (commit `d59dd05`)
- **`js/app.js`, `js/cart.js`, `js/product-details.js`, `js/wishlist.js`** — stock-first
  `getEffectiveStock` / `isProductAvailable` (drop `soldOut`/`inStock` fallback); quick-view qty
  max and stock labels use effective stock instead of raw `p.stock`.
- `public/` regenerated via `npm run build`; source + built output synced to main repo's
  `trendy-frontend/` mirror.
- Admin UI: no change needed — backend keeps flags consistent; stock is now authoritative.

## Live Verification (Render + Vercel)
- `POST /api/checkout` with `MID LENGTH COTTON PADDED…` (stock=0, inStock=true):
  → **400 `Insufficient stock… Available: 0`** (old code would have said 5). ✔
- `POST /api/checkout` with CHUNKY HEELS (stock=5, soldOut=true): → **accepted** (Available 5). ✔
- Vercel serves `getEffectiveStock(){return stock>0?stock:limited…:preOrder?999:0}` in all four
  JS files (no `soldOut` gate, no `stockThreshold` fallback). ✔
- Backend health `database: connected`, stable uptime.

## Deferred
- **DB data repair not run**: MongoDB Atlas is unreachable from this machine (DNS/SRV resolves to
  a private IP and times out). The code fix makes the ordering behavior correct regardless of the
  stale data. To clean up admin display + Inventory tab, run later:
  ```
  set NODE_PATH=%CD%\trendy-backend\node_modules
  node tools/repair-stock.js          # dry run
  node tools/repair-stock.js --apply  # write
  ```
  Fixes pending in data: 12 products `stock=0/inStock=true` (→ `inStock:false, soldOut:true`),
  5 negative-stock coats (→ 0 + flags), CHUNKY HEELS flag inconsistency (→ in stock), and
  Inventory mirror sync.

## Untouched (by design)
All design/layout/colors/fonts/responsiveness, product cards, product details page, hero,
checkout visual design, branding, and every working feature. Only stock/ordering/flag logic and
the new repair script were changed.

## Live Verification (completed 2026-08-04)
- **DB repair applied** (`tools/repair-stock.js --apply`): 5 negative-stock coats → 0; 12
  products at `stock=0/inStock=true` → `inStock:false, soldOut:true`; CHUNKY HEELS flag
  inconsistency fixed (`stock=5, soldOut:true` → `inStock:true, soldOut:false`); 12 Inventory
  docs created, 2 updated. Post-repair `/api/products` re-verified.
- **End-to-end order test (live, authenticated, all 13 checks pass):** registered a throwaway
  user; ordered 2x CHUNKY HEELS (stock 5 → 3); oversell of 999 rejected with
  `400 Insufficient stock… Available: 3`; cancelled → stock restored to 5. Limited-pieces
  product verified: `limitedPieces` 2 → 1 on order, restored to 2 on cancel. Test user + test
  orders deleted afterwards.
- **Inventory mirror verified:** 0 mismatches across all products — `Inventory.quantity/status`
  matches `Product.stock`/`limitedPieces` for every product.
- **Post-deploy stability:** 5 consecutive `/api/health` + `/api/products` samples — all
  `200`, `database: connected`, uptime monotonically increasing (266→273s), products API
  `success: true`. Result: **STABLE**.

## Recommendations
1. Run `tools/repair-stock.js --apply` from a machine with Atlas access (or a Render one-off) to
   clean admin/Inventory display data.
2. Keep `Product.stock` as the single source of truth; treat `inStock`/`soldOut` as derived
   display flags. Prefer `getEffectiveStock` (stock-first) anywhere stock is checked.
3. Consider a periodic cron (e.g. `inventory.routes.js` `syncProductStock`) to re-sync the
   `Inventory` mirror so the admin Inventory tab stays accurate automatically.
