# Survive the Month — Smart Budget Planner

A polished, responsive personal-finance dashboard built with React, Vite, Recharts, and Lucide React. Designed as a frontend challenge project with sample data and local browser persistence.

## Features
- Premium dark fintech dashboard with responsive mobile navigation
- Monthly budget, remaining balance, spending pace, daily allowance, and financial wellness indicator
- Add and delete income/expense transactions
- Search and filter transactions
- Spending trend chart and category breakdown
- Analytics page with forecast and savings-rate estimates
- Savings goal tracker with editable target and contributions
- Budget Coach with practical, data-based tips
- Settings to edit monthly budget and reset demo transactions
- Export transactions to CSV
- Data persistence using localStorage
- Keyboard-accessible controls and reduced-motion support

## Run locally
1. Install Node.js LTS from https://nodejs.org/
2. Extract this ZIP.
3. Open the folder in VS Code.
4. Open Terminal and run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the localhost URL shown in your terminal.

## Create a production build
```bash
npm run build
npm run preview
```

## Deploy
Push the project to GitHub, then import the repository into Vercel or Netlify. Use `npm run build` as the build command and `dist` as the output directory.

## Important notes
- This is a frontend demo; it does not connect to a real bank or financial account.
- Transactions and settings are stored in localStorage on the current browser only.
- Sample transactions use an October 2026 demo timeline. Update dates/data for a live presentation.
- Forecasts and wellness indicators are illustrative budgeting estimates, not professional financial advice.
