# Registro de Ventas

A modern voice-controlled daily sales, expenses, and withdrawals tracking application built with React. Dictate transactions in Spanish using voice commands, track sales by payment method, manage expenses, track inventory stock, view daily summaries, and export reports as PDF.

## Features

- **Voice Commands**: Dictate transactions in Spanish with full descriptions
  - "venta mil efectivo" → Cash sale $1,000
  - "gasto quinientos en servilletas" → Expense $500 with note
  - "retiro trescientos Juan Pérez" → Withdrawal $300
  - "inicio de caja cinco mil" → Set starting cash $5,000
- **Payment Methods**: Track sales by cash (Efectivo) or bank transfer (Transferencia)
- **Expense & Withdrawal Tracking**: Add expenses with descriptions and withdrawals with comments
- **Edit & Delete**: Edit descriptions and amounts, or delete transactions
- **Real-time Summary**: View totals in a 2x2 grid (Ventas en Efectivo, Transferencias, Total Ventas, Efectivo en Caja)
- **Filter with Counts**: Filter transactions with real-time counts per category
- **Stock Management**: Track inventory entries and exits with descriptions
- **Historical Records**: Access summaries from previous days
- **PDF Export**: Download a formatted daily report with sales, expenses, and stock movements
- **PWA Installable**: Works 100% offline on your phone as an installed app
- **Premium Dark Theme**: "Night Owl Refined" design with amber accents
- **Bottom Navigation**: Easy navigation with Home, Summary, Add Sale, Expense, Stock, and More
- **Local Storage**: All data persists in your browser

## Tech Stack

- **React 19** + Vite 8
- **Redux Toolkit** for state management
- **jsPDF** for PDF generation
- **Web Speech API** for voice recognition
- **Vite PWA Plugin** for offline support and app installation
- **Prettier + ESLint** for code quality
- **Husky + lint-staged** for pre-commit hooks

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

## Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start development server         |
| `npm run build`        | Build for production             |
| `npm run lint`         | Run ESLint                       |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check formatting without changes |
| `npm run preview`      | Preview production build         |
| `npm run deploy`       | Build and deploy to GitHub Pages |

## Usage

### Voice Commands

| Command                         | Description                   |
| ------------------------------- | ----------------------------- |
| `venta mil efectivo`            | Cash sale for $1,000          |
| `venta dos mil transferencia`   | Transfer sale for $2,000      |
| `gasto quinientos en papel`     | Expense $500 with description |
| `retiro trescientos Juan Pérez` | Withdrawal $300               |
| `inicio de caja cinco mil`      | Set starting cash to $5,000   |

### Manual Entry

1. **Add Sale**: Tap the **+** button → Select payment method → Enter amount → Save
2. **Add Expense**: Tap **Gasto** → Enter description and amount → Save
3. **Edit/Delete**: Go to **Gasto** section → Tap edit icon to edit or delete
4. **Stock**: Tap **Stock** → Select Entrada/Salida → Enter description → Save
5. **View Summary**: Check the 2x2 grid on **Home** for quick totals
6. **Close Day**: Tap **Resumen** → Set starting cash (optional) → Tap "Cerrar Día" to download PDF and save to history
7. **View History**: Tap **Más** → **Historial**

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

| Field                  | Calculation                                 |
| ---------------------- | ------------------------------------------- |
| **Ventas en Efectivo** | Sum of all cash sales                       |
| **Transferencias**     | Sum of all transfer sales                   |
| **Total Ventas**       | Ventas en Efectivo + Transferencias         |
| **Efectivo en Caja**   | Saldo Inicial + Ventas en Efectivo - Gastos |

## Deploy

```bash
npm run deploy
```

This will build the app and deploy to GitHub Pages.

## Project Structure

```
voice-sales-tracker/
├── public/
│   ├── favicon.svg              # App icon
│   └── pwa-*.png               # PWA icons
├── src/
│   ├── components/
│   │   ├── forms/             # Form components
│   │   ├── screens/            # Screen components
│   │   ├── ui/                # UI components
│   │   └── Icons.jsx           # SVG icons
│   ├── hooks/
│   │   ├── useToast.js         # Toast notifications
│   │   └── useVoiceRecognition.js # Voice commands
│   ├── store/
│   │   ├── index.js            # Redux store
│   │   └── slices/
│   │       ├── salesSlice.js    # Sales state
│   │       ├── expensesSlice.js # Expenses state
│   │       ├── stockSlice.js    # Stock state
│   │       ├── historySlice.js  # History state
│   │       └── uiSlice.js      # UI state
│   ├── utils/
│   │   ├── formatters.js       # Currency/date formatters
│   │   ├── pdfGenerator.js     # PDF generation
│   │   ├── textToNumber.js     # Spanish text to number
│   │   └── voiceParser.js      # Voice command parser
│   ├── App.jsx                 # Main React component
│   ├── App.css                 # Styles
│   └── main.jsx                # Entry point
├── .husky/                     # Git hooks
├── eslint.config.js            # ESLint configuration
├── .prettierrc                # Prettier configuration
├── vite.config.js              # Vite + PWA configuration
└── package.json
```

## License

MIT
