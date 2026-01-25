# Daily Expense Tracker

Friendly React practice project to explore routing, simple forms, and light animations with Mocha (bear) and Milky (bunny).

## Tech
- React (Create React App structure)
- Tailwind CSS for utility styling
- Bootstrap (forms and buttons only)
- React Router DOM for page routing

## Quick start
1) Install dependencies:
   ```bash
   npm install
   ```
2) Run the dev server:
   ```bash
   npm start
   ```
   The app runs on http://localhost:3000.
3) Build for production (optional):
   ```bash
   npm run build
   ```

## Tailwind + Bootstrap setup (already applied)
- Added `tailwindcss`, `postcss`, `autoprefixer` to `package.json`.
- `tailwind.config.js` scans `./public/index.html` and `./src/**/*.{js,jsx,ts,tsx}`.
- `postcss.config.js` includes `tailwindcss` and `autoprefixer`.
- `src/index.css` starts with `@tailwind base; @tailwind components; @tailwind utilities;` and defines the Mocha/Milky theme.
- Bootstrap CSS is imported once in `src/index.js` for form and button base styles.

## Pages
- Landing: characters + rotating speech bubbles, buttons to Signup/Login.
- Signup: local form validation, saves a demo user to `localStorage`, then redirects to Login.
- Login: checks user from `localStorage`, redirects to Dashboard on success.
- Dashboard: placeholder cards for income/expenses/savings, logout button in nav.

## Notes
- Auth is demo-only: data lives in `localStorage` (`det-user`, `det-auth`).
- Animations use simple CSS keyframes (floating, wave, blink, bubble fade) in `tailwind.config.js` and `src/index.css`.
- Colors follow the soft Mocha (brown) and Milky (cream) palette; buttons use mocha backgrounds and milky text.
