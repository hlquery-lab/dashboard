# HLQuery Ecommerce Dashboard

A working ecommerce demo for **Everyday Supply**, a store selling everyday essentials. Built with Vue 3, Vuetify, Chart.js, and Vite.

## Run locally

```bash
npm install
npm run dev
```

The dashboard runs at http://localhost:5174. `npm run build` creates `dist/`; `npm test` runs the Playwright browser tests. Install the browser with `npx playwright install chromium` if necessary.

## Store workflows

- **Overview and analytics:** sales, order volume, average order value, units sold, best sellers, category and channel revenue, and inventory alerts. Reporting periods use the sample date of November 23, 2026. Financial metrics count paid, non-cancelled orders.
- **Orders and fulfillment:** search, filter, paginate, export, create orders, apply discounts, and move paid orders through packing, shipping, and delivery. Pending payments must be marked paid before fulfillment. Cancelling an unshipped order restores inventory; its payment becomes Refunded or Voided.
- **Products and inventory:** create and edit products, unique SKUs, USD prices with cents, publication status, product illustrations, stock levels, and restocking. Draft, archived, and out-of-stock products cannot be added to a new order.
- **Customers:** customer profiles, saved addresses, purchase histories, returning-customer segments, and lifetime paid sales.
- **Discounts:** create percentage codes with an optional minimum order subtotal; activate or pause them. A code is validated before an order is created.
- **Invoices and payments:** financial totals and CSV exports share the order records. Download itemized sample invoices. Order line prices are captured at checkout and survive later catalog changes.
- **Store settings:** store name, light/dark theme, compact tables/navigation, card corners, and content width. Ctrl/Cmd+K searches pages and orders.

## Demo data

Commerce records are stored under `hlquery-commerce-v1` in this browser's localStorage. The old project demo's records are preserved separately. All amounts are USD. New sample orders use the fixed reference date, so reporting stays consistent.

The demo has no backend, authentication, live storefront, payment processing, email delivery, tax calculation, or shipping integration. Payment, refund, and fulfillment actions change demo records only. Shipping is free in the example checkout; downloaded invoices are sample documents.
