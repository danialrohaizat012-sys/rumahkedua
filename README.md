# Rumah Kedua POS

Internal counter and kitchen system for Rumah Kedua, Pasir Tumboh. Cream, espresso and terracotta branding, with the original kiosk logo.

## Features

- POS: dine-in/takeaway, table selection, order notes and cash change.
- Menu: add/edit name, category, price and images; availability toggle; archive without changing historical receipts.
- Kitchen: New → Preparing → Ready → Served; independent `/?view=kitchen` screen, automatic refresh every 8 seconds, oldest tickets first.
- Loyalty: phone-based membership, points earned after confirmed payment, configurable redemption, and full refund reversal.
- Orders: history, printable receipts and full refunds.
- Reports: daily sales, average order, payment methods, popular menu, JSON export.

Cash, QR and card payments are manually confirmed by staff. No payment gateway or customer application is included. Initial menu items and prices are examples and must be reviewed before use.

## Runtime and deployment

This is a Vinext application hosted as a Cloudflare Worker through ChatGPT Sites. Structured records use D1 (`DB`) and uploaded menu images use R2 (`BUCKET`). This repository contains application source, not customer records or credentials.

The live Site is private to the owner. Sharing with kitchen staff must be configured through Site access controls. The operator name is a display setting and does not grant access or assign staff roles. Do not publish the API on an unprotected host: it relies on the private Site access boundary and same-origin checks.

GitHub stores the source. GitHub Pages alone cannot run the server APIs, D1 or R2. For another hosting platform, configure these bindings, migrate the SQL in `drizzle/`, and add authentication before opening access.

Install with the project's pnpm version and lockfile. Run `pnpm exec tsc --noEmit` to check types. Use the Sites build helper for the configured managed environment, or `pnpm run build` in a configured portable checkout. Never commit runtime data, secrets, `.wrangler`, `.sites-runtime` or build outputs.

## Installed PWA

The same original kiosk mark is used for 192px/512px app icons, a maskable icon, the Apple touch icon and favicon. The web manifest supports standalone installation and shortcuts for POS and Kitchen. A Pasang POS button uses the browser installation prompt where available, with Safari instructions for iOS.

The service worker caches only the offline notice and public icons. It never caches API responses, customer records, orders or authenticated HTML. Payments and edits require internet; disconnected actions are disabled and the offline notice does not claim transactions have been saved.

UI improvements include labelled mobile bottom navigation, a floating cart shortcut, larger touch controls, menu search/filters and thumbnails, order reset confirmation, payment item summary, kitchen sync status, success messages and keyboard focus handling for POS dialogs.
