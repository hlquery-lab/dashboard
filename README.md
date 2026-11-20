<div align="center">
  <img src="public/logo.png" alt="HLQuery logo" width="132">
</div>

<div align="center">

**A flexible workspace for projects, teams, and business metrics.**

[![Demo](https://img.shields.io/badge/Demo-live-1976d3?logo=google-chrome&logoColor=white&labelColor=101d2e)](https://dashboard.hlquery.com)
[![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white&labelColor=101d2e)](https://vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-4-1867c0?logo=vuetify&logoColor=white&labelColor=101d2e)](https://vuetifyjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white&labelColor=101d2e)](https://vite.dev/)

</div>

> Explore the live dashboard at [dashboard.hlquery.com](https://dashboard.hlquery.com).

### Overview

HLQuery Dashboard brings projects, reporting, schedules, and team activity together in one responsive workspace. Use the interactive views to organize work and get a clear picture of what is moving forward.

### Features

- Track projects in a searchable list, a drag-and-drop board, or a calendar.
- Review business metrics with interactive charts and reports.
- Keep up with team members, project updates, invoices, and payment records.
- Adjust the workspace with light and dark themes, compact tables, and compact navigation.
- Jump between pages and projects with `Ctrl+K` or `⌘K`.
- Use the dashboard on desktop, tablet, and mobile.

### Quick start

Requires Node.js and npm.

```bash
git clone https://github.com/hlquery-lab/dashboard.git
cd dashboard
npm install
npm run dev
```

Vite serves the local dashboard at [http://localhost:5174](http://localhost:5174).

### Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Run the Playwright browser tests. |
| `npm run test:ui` | Open the Playwright test runner. |

### Built with

Vue 3, Vuetify 4, Vite, Chart.js, Vue Draggable, VueUse, AutoAnimate, and Lucide icons.

### Demo data

Projects and preferences are stored in the current browser. Financial figures, invoices, team members, and initial activity are illustrative demo data. The demo does not include authentication, a backend API, cross-device sync, or payment processing.

### Run browser tests

Install Chromium for Playwright, then run the test suite:

```bash
npx playwright install chromium
npm test
```
