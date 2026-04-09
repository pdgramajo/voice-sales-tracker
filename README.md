# Voice Sales Tracker

A modern voice-controlled daily sales tracking application built with React. Dictate sale amounts in Spanish, track transactions with timestamps, view historical data, and export daily reports as PDF.

## Features

- **Voice Input**: Dictate sale amounts in Spanish (e.g., "mil quinientos" → $1,500.00)
- **Real-time Tracking**: Record sales with automatic timestamps (day, time)
- **Daily Totals**: Automatically calculate and display daily sales sum
- **Transaction History**: View all sales for the current day with delete capability
- **Historical Records**: Access summaries from previous days
- **PDF Export**: Download a formatted daily report when closing the day
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Local Storage**: All data persists in your browser

## Demo

```
🎤 Dictate: "quinientos" → Save → ✓ Sale recorded: $500.00 (jueves 9 3:45:46 pm)
📊 Total updates automatically
📄 Click "Close Day" → PDF downloads with all transactions
```

## Tech Stack

- **React** + Vite
- **jsPDF** for PDF generation
- **Web Speech API** for voice recognition
- **CSS Variables** for theming

## How to Run

```bash
# Clone the repository
git clone <your-repo-url>
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

1. **Add a sale**: Click the microphone to dictate, or type a number/word (e.g., "dos mil")
2. **Save**: Click "Guardar" to record the transaction
3. **Delete**: Click × on any sale to remove it
4. **Close Day**: Click "Cerrar Día" to save to history and download PDF
5. **Toggle Theme**: Click the sun/moon icon in the top-right corner
