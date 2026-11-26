<div align="center">
  <img src="public/logo.png" alt="hlquery logo" width="140">
</div>

<div align="center">

**An interactive ecommerce dashboard built for exploring everyday store operations.**

[![Website](https://img.shields.io/badge/Website-hlquery.com-blue?logo=google-chrome&logoColor=white&labelColor=000000)](https://www.hlquery.com)
[![Docs](https://img.shields.io/badge/Docs-guides.hlquery.com-brightgreen?logo=readthedocs&logoColor=white&labelColor=000000)](https://guides.hlquery.com/)
[![Follow hlquery](https://img.shields.io/badge/Follow-%40hlquery-blue?logo=x&logoColor=white&labelColor=000000)](https://x.com/hlquery)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white&labelColor=000000)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-646cff?logo=vite&logoColor=white&labelColor=000000)](https://vite.dev/)
[![Dashboard](https://img.shields.io/badge/Dashboard-Live%20demo-0ea5e9?logo=chartdotjs&logoColor=white&labelColor=000000)](https://dashboard.hlquery.com/)

[Getting started](#getting-started) · [Store workflows](#store-workflows) · [Demo data](#demo-data) · [Development](#development-commands)

</div>

> **Everyday Supply** is a sample store selling everyday essentials.
> Explore it at [https://dashboard.hlquery.com/](https://dashboard.hlquery.com/).

### What is the dashboard?

The HLQuery dashboard is a working ecommerce demo built with **Vue 3, Vuetify, Chart.js, Vite, and Lucide icons**. It connects store reporting, catalog management, customers, discounts, and fulfillment through shared sample order records.

### Getting started

From the dashboard directory:

```bash
npm install
npm run dev
```

### Store workflows

| Feature | Description |
| --- | --- |
| 📈 **Overview and analytics** | Sales, order volume, average order value, units sold, best sellers, category and channel revenue, and inventory alerts. |
| 🛒 **Orders** | Search, filter, paginate, export, create orders, and apply discounts. |
| 🚚 **Fulfillment** | Record payment and move orders through packing, shipping, and delivery. |
| 📦 **Products and inventory** | Create and edit products, unique SKUs, USD prices with cents, illustrations, publication status, stock levels, and restocking. |
| 👥 **Customers** | Profiles, saved addresses, purchase histories, returning-customer segments, and lifetime paid sales. |
| 🏷️ **Discounts** | Percentage codes with an optional minimum order subtotal; activate or pause codes. |
| 🧾 **Invoices and payments** | Financial totals, CSV exports, and downloadable itemized sample invoices. |
| 🎨 **Store settings** | Store name, light/dark theme, compact tables and navigation, card corners, and content width. |

**Quick search:** press `Ctrl+K` on Windows/Linux or `⌘K` on macOS to find pages and orders.

### Try an order from start to finish

1. Create a published product with a price and available stock.
2. Create an order with that product and optionally apply an active discount.
3. Mark the payment as paid before starting fulfillment.
4. Move the order through packing, shipping, and delivery.
5. Review the results in analytics and download its sample invoice.

<details>
<summary><strong>Order, inventory, and discount rules</strong></summary>

- Draft, archived, and out-of-stock products cannot be added to a new order.
- Pending payments must be marked paid before fulfillment.
- Cancelling an unshipped order restores inventory; its payment becomes **Refunded** or **Voided**, as appropriate.
- Discount codes are validated before an order is created.
- Order line prices are captured at checkout and survive later catalog changes.
- Financial metrics count paid, non-cancelled orders.

</details>

### Demo data

| Setting | Behavior |
| --- | --- |
| Currency | All amounts are in USD. |
| Reference date | November 23, 2026, including newly created sample orders. |
| Commerce storage | Browser `localStorage`, under `hlquery-commerce-v1`. |
| Previous demo records | Preserved separately from commerce records. |

Changes belong to the browser you use. Clearing its local storage removes locally saved changes.

<details>
<summary><strong>Demo scope</strong></summary>

The demo has no backend, authentication, live storefront, payment processing, email delivery, tax calculation, or shipping integration. Payment, refund, and fulfillment actions change demo records only.

Shipping is free in the example checkout. Downloaded invoices are sample documents.

</details>

### Development commands

Run these commands from the dashboard directory:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 5174. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview the build on port 4174. |
| `npm test` | Run Playwright browser tests. |
| `npm run test:ui` | Open the interactive Playwright test interface. |

Install the test browser if needed:

```bash
npx playwright install chromium
```

### Configuration

Set `VITE_LANDING_URL` before building to configure the link back to the public website. See [.env.example](.env.example).

### Related documentation

- 📖 [HLQuery guides](https://guides.hlquery.com/)
- 🌐 [HLQuery website](https://www.hlquery.com)
