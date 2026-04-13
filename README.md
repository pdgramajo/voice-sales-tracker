# Registro de Ventas

A modern voice-controlled daily sales, expenses, and withdrawals tracking application built with React. Dictate transactions in Spanish using voice commands, track sales by payment method, manage expenses and withdrawals, view daily summaries, and export reports as PDF.

## Features

- **Voice Commands**: Dictate transactions in Spanish with full descriptions
  - "venta mil efectivo" → Cash sale $1,000
  - "gasto quinientos en servilletas" → Expense $500 with note
  - "retiro trescientos" → Withdrawal $300
  - "inicio de caja cinco mil" → Set starting cash $5,000
- **Payment Methods**: Track sales by cash (Efectivo) or bank transfer (Transferencia)
- **Expense & Withdrawal Tracking**: Add expenses with descriptions and withdrawals with comments
- **Edit & Delete**: Edit descriptions and amounts, or delete transactions
- **Real-time Summary**: View totals in a 2x2 grid (Efectivo, Transferencia, Total, Balance)
- **Unified Transaction List**: View all sales, expenses, and withdrawals in chronological order
- **Filter by Type**: Filter by All, Cash, Transfer, or Expenses/Withdrawals
- **Historical Records**: Access summaries from previous days
- **PDF Export**: Download a formatted daily report with all transactions
- **PWA Installable**: Works 100% offline on your phone as an installed app
- **Premium Dark Theme**: "Night Owl" design with amber accents
- **Bottom Navigation**: Easy navigation with Home, Summary, Add Sale, Expense, History, and Settings
- **Local Storage**: All data persists in your browser

## Tech Stack

- **React** + Vite
- **jsPDF** for PDF generation
- **Web Speech API** for voice recognition
- **Vite PWA Plugin** for offline support and app installation
- **CSS Variables** for theming

## How to Run

```bash
# Clone the repository
git clone https://github.com/pdgramajo/voice-sales-tracker.git
cd voice-sales-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Usage

### Voice Commands

| Command | Description |
|---------|-------------|
| `venta mil efectivo` | Cash sale for $1,000 |
| `venta dos mil transferencia` | Transfer sale for $2,000 |
| `gasto quinientos en papel` | Expense $500 with description |
| `retiro trescientos` | Withdrawal $300 |
| `inicio de caja cinco mil` | Set starting cash to $5,000 |

### Manual Entry

1. **Add Sale**: Tap the **+** button → Select payment method → Enter amount → Save
2. **Add Expense**: Tap **Gasto** → Enter description and amount → Save
3. **Edit/Delete**: Go to **Gasto** section → Tap ✏️ to edit or × to delete
4. **View Summary**: Check the 2x2 grid on **Home** for quick totals
5. **Close Day**: Tap **Resumen** → Set starting cash (optional) → Tap "Cerrar Día" to download PDF and save to history
6. **View History**: Tap **Historial** to see past days

### Install as Mobile App

The app works as a Progressive Web App (PWA):

**iOS (Safari):**
1. Open the URL in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home Screen"

The app works 100% offline once installed!

## Daily Summary Logic

The app calculates totals from the transactions:

| Field | Calculation |
|-------|-------------|
| **Efectivo** | Sum of all cash sales |
| **Transferencia** | Sum of all transfer sales |
| **Total Ventas** | Efectivo + Transferencia |
| **Gastos** | Sum of all expenses + withdrawals |
| **En Caja** | Efectivo - Gastos |

All values are color-coded:
- 🟢 Green for sales and positive balance
- 🟠 Orange for withdrawals
- 🔴 Red for expenses and negative balance

## Deploy

```bash
npm run deploy
```

This will build the app and deploy to GitHub Pages.

## Project Structure

```
voice-sales-tracker/
├── public/
│   ├── favicon.svg          # App icon
│   └── pwa-*.png            # PWA icons
├── src/
│   ├── App.jsx              # Main React component
│   ├── App.css              # Styles
│   ├── hooks/
│   │   └── useVentas.js     # Sales/expenses state management
│   └── utils/
│       └── textToNumber.js   # Spanish text to number conversion
├── index.html
├── vite.config.js            # Vite + PWA configuration
└── package.json
```

## License

MIT
