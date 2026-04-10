# Voice Sales Tracker

A modern voice-controlled daily sales and expenses tracking application built with React. Dictate sale amounts in Spanish, track transactions with timestamps, manage daily expenses, view historical data, and export daily reports as PDF.

## Features

- **Voice Input**: Dictate sale amounts in Spanish (e.g., "mil quinientos" → $1,500.00)
- **Payment Methods**: Track sales by cash (Efectivo) or bank transfer (Transferencia)
- **Expense Tracking**: Add daily expenses with description and amount
- **Real-time Totals**: All totals recalculate automatically from the transactions array
- **Unified List**: View all sales and expenses in chronological order
- **Transaction History**: View all movements for the current day with delete capability
- **Historical Records**: Access summaries from previous days
- **PDF Export**: Download a formatted daily report with sales, expenses, and totals
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Local Storage**: All data persists in your browser

## Tech Stack

- **React** + Vite
- **jsPDF** for PDF generation
- **Web Speech API** for voice recognition
- **CSS Variables** for theming

## How to Run

```bash
# Clone the repository
git clone <your-repo-url>
cd debts_tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Usage

1. **Add a sale**: Click the microphone to dictate, or type a number/word (e.g., "dos mil")
2. **Select payment method**: Choose Efectivo or Transferencia
3. **Save**: Click "Guardar" to record the transaction
4. **Add expense**: Fill in description and amount, click "+"
5. **Delete**: Click × on any item to remove it
6. **Close Day**: Click "Cerrar Día" to save to history and download PDF
7. **Toggle Theme**: Click the sun/moon icon in the top-right corner

## Daily Summary Logic

The app calculates totals from the transactions arrays:

| Field | Calculation |
|-------|-------------|
| **Efectivo** | Sum of all sales paid in cash |
| **Transferencia** | Sum of all sales paid by bank transfer |
| **Ventas Total** | Efectivo + Transferencia |
| **Gastos** | Sum of all expenses |
| **En Caja** | Efectivo - Gastos |

All values are color-coded:
- 🟢 Green for sales and positive balance
- 🔴 Red for expenses and negative balance

## Deploy

```bash
npm run deploy
```
