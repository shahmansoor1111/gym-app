# 💪 FlexGym Manager

A modern React.js Gym Management Website.

## 📁 Project Structure

```
gym-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                  ← Main app + page routing
    ├── components/
    │   ├── Navbar.jsx           ← Navigation bar (fixed, responsive)
    │   └── PageWrapper.jsx      ← Reusable page layout shell
    └── pages/
        ├── Home.jsx             ← Landing page with feature cards
        ├── Dashboard.jsx        ← Stats: members, income, payments
        ├── Members.jsx          ← Add/edit/search gym members
        ├── Exercises.jsx        ← Categories → Exercise list → Detail page
        ├── DietPlans.jsx        ← Weight-based nutrition calculator
        ├── Alerts.jsx           ← Payment overdue & due-soon notifications
        ├── Gallery.jsx          ← Photos, videos, transformations
        └── Contact.jsx          ← Contact form + gym info
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## 📋 Pages Overview

| Page        | Route/State  | Description                                      |
|-------------|--------------|--------------------------------------------------|
| Home        | `home`       | Landing page with navigation cards               |
| Dashboard   | `dashboard`  | KPI stats: members, income, pending payments     |
| Members     | `members`    | Member table with search, add, edit, status      |
| Exercises   | `exercises`  | 6 categories × 5 exercises with detail pages     |
| Diet Plans  | `diet`       | Enter weight + goal → get full meal plan         |
| Alerts      | `alerts`     | Overdue & due-soon payment notifications         |
| Gallery     | `gallery`    | Photos, videos, transformations upload grid      |
| Contact Us  | `contact`    | Contact form + gym address/hours                 |

## 🎨 Tech Stack
- **React 18** (no router — uses simple state-based navigation)
- **Vite** (fast dev server & bundler)
- **Google Fonts** — Barlow + Barlow Condensed
- **Pure CSS** (CSS-in-JS via `<style>` tags, no external UI lib)

## ➕ How to Add Content
- **Add members**: Extend the `sampleMembers` array in `Members.jsx`
- **Add exercises**: Edit the `categories` array in `Exercises.jsx`
- **Add gallery media**: Replace placeholder cards in `Gallery.jsx` with `<img>` or `<video>` tags
