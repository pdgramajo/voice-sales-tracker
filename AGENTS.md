# Registro de Ventas - Agent Instructions

## Tech Stack

- React 19 + Vite 8 + Redux Toolkit
- PWA con offline support (vite-plugin-pwa)
- jsPDF para reportes
- Web Speech API para voice commands
- Jest para tests, ESLint + Prettier para code quality

## Developer Commands

```bash
npm run dev      # Dev server en http://localhost:5173
npm run build    # Build producción → dist/
npm run lint     # ESLint
npm run test     # Jest (51 tests pasando)
npm run format   # Prettier format
npm run deploy   # Build + deploy a GitHub Pages
```

**Orden importante:** lint → test → build (antes de commit, Husky lo hace automáticamente)

## Project Structure

```
src/
├── App.jsx              # Main component, routing logic
├── components/screens/   # Screen components (HomeScreen, SummaryScreen, etc.)
├── store/slices/        # Redux: sales, expenses, stock, history, ui
├── utils/               # pdfGenerator, voiceParser, textToNumber
├── hooks/               # useVoiceRecognition, useToast
└── __tests__/           # Jest tests
```

## Business Logic (Argentina, ARS)

```
Efectivo en Caja = Saldo Inicial + Ventas Efectivo - Gastos
Total Ventas = Ventas Efectivo + Transferencias
```

- Moneda: ARS (Pesos Argentinos)
- Formato fecha: DD/MM/YYYY (ej: "martes 14 de abril 2026")
- locale: es-AR

## Voice Commands

| Comando                     | Acción               |
| --------------------------- | -------------------- |
| "venta mil efectivo"        | addSale              |
| "gasto quinientos en papel" | addExpense           |
| "retiro trescientos Juan"   | addWithdrawal        |
| "inicio de caja cinco mil"  | updateInitialBalance |

Errores de voice parser se muestran con prefijo ❌ (para Toast en rojo)

## Persistence (localStorage)

- `ventas_YYYY_M_D` → Ventas del día
- `gastos_YYYY_M_D` → Gastos del día
- `stock_entries` → Inventario (acumulativo)
- `historial` → Días cerrados

## Code Conventions

- Identificadores en INGLÉS (variables, funciones, props)
- Texto UI en ESPAÑOL
- camelCase / PascalCase / kebab-case
- NO comments en código (a menos que requerido)
- NO commits sin pasar lint + tests

## Testing

- Tests en `src/__tests__/logic/` y `src/__tests__/utils/`
- 51 tests actualmente pasando
- Testear lógica pura, no Redux slices directamente (problemas con localStorage mocking)

## Deploy

- Rama `gh-pages` → GitHub Pages
- URL: https://pdgramajo.github.io/voice-sales-tracker/
- PWA funciona offline automáticamente

## Known Issues (Resueltas)

- Bug histórico: gastos usaban misma key que ventas → se sobrescribían
- Solución: clave separada `gastos_YYYY_M_D`

## Additional Docs

- `README.md` → Para usuarios
- `DEVELOPER_GUIDE.md` → Para otros desarrolladores
