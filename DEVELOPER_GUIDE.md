# Developer Guide - Registro de Ventas

Documentación técnica para programadores que necesiten entender, modificar o extender esta aplicación.

---

## 1. Concepto del Negocio

**¿Qué hace la app?**
Aplicación PWA voice-controlled para registrar ventas, gastos y movimientos de inventario en un negocio minorista.

**Contexto:**

- **País:** Argentina
- **Moneda:** ARS (Pesos Argentinos)
- **Formato de fecha:** DD/MM/YYYY (ej: "martes 14 de abril 2026")
- **Locale:** `es-AR`

**Flujo principal:**

```
Usuario habla → Voice Parser interpreta → Redux actualiza estado → UI refleja cambios
                                                                    ↓
                                              Cierre de día → PDF + Historial
```

---

## 2. Stack Tecnológico

| Tecnología          | Propósito                       |
| ------------------- | ------------------------------- |
| React 19 + Vite 8   | Frontend framework + build tool |
| Redux Toolkit       | State management                |
| localStorage        | Persistencia de datos           |
| Web Speech API      | Reconocimiento de voz           |
| jsPDF               | Generación de PDFs              |
| Vite PWA Plugin     | App instalable offline          |
| ESLint + Prettier   | Code quality                    |
| Husky + lint-staged | Pre-commit hooks                |
| Jest                | Testing                         |

---

## 3. Reglas de Código

### 3.1 Convenciones de Nomenclatura

| Tipo        | Ejemplo                            | Regla            |
| ----------- | ---------------------------------- | ---------------- |
| Variables   | `saleAmount`, `isListening`        | camelCase        |
| Constantes  | `DAYS_OF_WEEK`                     | UPPER_SNAKE_CASE |
| Funciones   | `handleSaleSubmit`                 | camelCase        |
| Componentes | `HomeScreen`, `BottomNav`          | PascalCase       |
| Archivos    | `salesSlice.js`, `voice-parser.js` | kebab-case       |

### 3.2 Idioma

| Elemento                             | Idioma           |
| ------------------------------------ | ---------------- |
| Código (variables, funciones, props) | **Inglés**       |
| Texto UI (labels, mensajes, botones) | **Español**      |
| Comentarios                          | Español o Inglés |
| README usuarios                      | Español          |

### 3.3 Code Quality Obligatorio

```bash
# Antes de cada commit (Husky lo hace automáticamente)
npm run lint      # ESLint
npm run format    # Prettier

# Tests
npm test          # Jest
```

**Reglas importantes:**

- NO commits sin pasar lint
- NO código sin formatear
- NO comments en código (a menos que explícitamente requerido)

---

## 4. Arquitectura del Proyecto

```
voice-sales-tracker/
├── src/
│   ├── components/
│   │   ├── screens/          # Screens completas
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── ExpenseScreen.jsx
│   │   │   ├── SummaryScreen.jsx
│   │   │   ├── HistoryScreen.jsx
│   │   │   ├── DayDetailScreen.jsx
│   │   │   ├── StockScreen.jsx
│   │   │   ├── ConfigScreen.jsx
│   │   │   └── GuideScreen.jsx
│   │   ├── forms/            # Formularios
│   │   │   └── SaleForm.jsx
│   │   ├── ui/               # Componentes reutilizables
│   │   │   ├── BottomNav.jsx
│   │   │   └── Toast.jsx
│   │   └── Icons.jsx         # SVG icons
│   ├── hooks/
│   │   ├── useVoiceRecognition.js  # Voice commands
│   │   └── useToast.js             # Notificaciones
│   ├── store/
│   │   ├── index.js                # Redux store
│   │   └── slices/
│   │       ├── salesSlice.js       # Ventas
│   │       ├── expensesSlice.js    # Gastos
│   │       ├── stockSlice.js       # Inventario
│   │       ├── historySlice.js     # Historial
│   │       └── uiSlice.js          # UI state
│   ├── utils/
│   │   ├── pdfGenerator.js         # Generación de PDF
│   │   ├── voiceParser.js          # Parser de voz
│   │   ├── textToNumber.js         # Texto a número
│   │   └── formatters.js           # Formateadores
│   ├── App.jsx                     # Componente principal
│   ├── App.css                     # Estilos
│   └── main.jsx                    # Entry point
├── __tests__/                      # Tests Jest
├── public/
│   ├── favicon.svg
│   └── pwa-*.png
├── vite.config.js
├── eslint.config.js
├── .prettierrc
└── package.json
```

---

## 5. Lógica de Negocio

### 5.1 Cálculos de Resumen

```
Efectivo en Caja = Saldo Inicial + Ventas en Efectivo - Gastos
Total Ventas     = Ventas en Efectivo + Transferencias
```

### 5.2 Tipos de Transacción

| Tipo         | Descripción                     | Campos                                         |
| ------------ | ------------------------------- | ---------------------------------------------- |
| `sale`       | Venta                           | amount, paymentMethod (efectivo/transferencia) |
| `expense`    | Gasto/Retiro de caja            | amount, description                            |
| `withdrawal` | Retiro (ej: "retiro para Juan") | amount, description                            |
| `entrada`    | Entrada de stock                | description                                    |
| `salida`     | Salida de stock                 | description                                    |

**Nota:** Expenses y Withdrawals se guardan en el mismo array `expenses[]` pero tienen `type` diferente.

### 5.3 Estructura de una Venta

```javascript
{
  id: 1713004800000,           // Date.now()
  type: 'sale',
  amount: 1000,                 // number
  paymentMethod: 'efectivo',    // 'efectivo' | 'transferencia'
  dateString: 'martes 14 10:30:45 am',  // Para mostrar
  timestamp: 1713004800000      // Para ordenar
}
```

### 5.4 Estructura de un Gasto

```javascript
{
  id: 1713004800000,
  type: 'expense',              // 'expense' | 'withdrawal'
  amount: 500,
  description: 'en papel',      // Texto libre
  timestamp: 1713004800000
}
```

### 5.5 Estructura de Movement de Stock

```javascript
{
  id: 1713004800000,
  type: 'entrada',              // 'entrada' | 'salida'
  description: 'Reabastecimiento',
  timestamp: 1713004800000
}
```

---

## 6. Persistencia en localStorage

### 6.1 Keys por Día

| Key                | Contenido                 | Expira        |
| ------------------ | ------------------------- | ------------- |
| `ventas_2026_3_14` | Ventas del día (array)    | Siguiente día |
| `gastos_2026_3_14` | Gastos del día (array)    | Siguiente día |
| `historial`        | Días cerrados (array)     | Nunca         |
| `stock_entries`    | Movimientos stock (array) | Nunca         |

**Formato de fecha:** `YYYY_M_D` (mes y día SIN padding)

### 6.2 Por qué keys separadas

Anteriormente `expenses` y `sales` usaban la misma key `ventas_YYYY_M_D`. Cuando se guardaba una venta, sobrescribía los gastos. La solución fue usar keys independientes.

### 6.3 Carga Inicial

Al iniciar la app, cada slice carga su estado desde localStorage:

```javascript
// salesSlice.js
const loadInitialState = () => {
  const savedData = localStorage.getItem(getTodayKey());
  if (savedData) {
    const parsed = JSON.parse(savedData);
    // ...restaurar estado
  }
  return { sales: [], ... };
};
```

---

## 7. Voice Commands

### 7.1 Flujo de Ejecución

```
1. Usuario presiona micrófono
2. useVoiceRecognition captura audio (Web Speech API)
3. onresult callback recibe transcript
4. voiceParser.parseVoiceCommand(text) interpreta
5. App.jsx dispatchea acción Redux correspondiente
6. UI se actualiza automáticamente
```

### 7.2 Parser (voiceParser.js)

```javascript
// Ejemplo de parsing
"venta mil efectivo" → { type: 'sale', amount: 1000, paymentMethod: 'efectivo' }
"gasto quinientos en papel" → { type: 'expense', amount: 500, description: 'papel' }
"retiro trescientos Juan Pérez" → { type: 'withdrawal', amount: 300, description: 'Juan Pérez' }
"inicio de caja cinco mil" → { type: 'initial-balance', amount: 5000 }
```

### 7.3 Comandos Soportados

| Comando                          | Keywords              | Resultado                                           |
| -------------------------------- | --------------------- | --------------------------------------------------- |
| "venta [monto] efectivo"         | venta + efectivo      | addSale({ amount, paymentMethod: 'efectivo' })      |
| "venta [monto] transferencia"    | venta + transferencia | addSale({ amount, paymentMethod: 'transferencia' }) |
| "gasto [monto] en [descripción]" | gasto + número        | addExpense({ amount, description })                 |
| "retiro [monto] [descripción]"   | retiro + número       | addWithdrawal({ amount, description })              |
| "inicio de caja [monto]"         | inicio de caja        | updateInitialBalance(amount)                        |

### 7.4 textToNumber

Convierte texto español a número:

```
"mil" → 1000
"dos mil quinientos" → 2500
"ciento cincuenta" → 150
"quinientos" → 500
```

---

## 8. Pantallas y Navegación

### 8.1 Mapa de Navegación

```
movimientos (Home)
├── agregar-venta
├── agregar-gasto
├── resumen
│   └── "Cerrar y Guardar Día" → PDF + Historial
├── historial
│   └── dia-detalle (solo lectura)
├── stock
└── config
    └── guia
```

### 8.2 Descripción de Pantallas

| Pantalla          | Props                   | Descripción                              |
| ----------------- | ----------------------- | ---------------------------------------- |
| `HomeScreen`      | sales, expenses, totals | Lista de transacciones + filtros         |
| `SaleForm`        | paymentMethod, amount   | Formulario de venta                      |
| `ExpenseScreen`   | expenses, editing       | Lista de gastos + form                   |
| `SummaryScreen`   | todos los totales       | Resumen del día + cierre                 |
| `HistoryScreen`   | history                 | Lista de días cerrados                   |
| `DayDetailScreen` | day                     | Detalle de día específico (solo lectura) |
| `StockScreen`     | -                       | Entradas y salidas de inventario         |
| `ConfigScreen`    | -                       | Configuración + guía                     |

### 8.3 UI State (uiSlice)

```javascript
{
  currentScreen: 'movimientos',      // Pantalla actual
  filter: 'all',                   // Filtro activo
  editingExpense: null,             // Gasto en edición
  paymentMethod: 'efectivo',       // Método de pago seleccionado
  saleAmount: '',
  expenseAmount: '',
  expenseDescription: ''
}
```

---

## 9. Cierre de Día

### 9.1 Flujo

```
handleCloseDay()
    ↓
generatePDF(sales, expenses, initialBalance, stockEntries)
    ↓
dispatch(addDay({ summary, sales, expenses, stock }))
    ↓
showToast('Día guardado en historial')
```

**Importante:** Al cerrar día, los datos actuales NO se borran. El usuario puede seguir operando normalmente.

### 9.2 Contenido del PDF

Orden de secciones:

1. **Header** - "Reporte del Día" + fecha
2. **Resumen** - Totales (ventas, gastos, efectivo en caja)
3. **Stock** - Movimientos de inventario
4. **Gastos** - Lista de gastos y retiros
5. **Ventas** - Lista de ventas por método
6. **Footer** - Efectivo final en caja

---

## 10. Testing

### 10.1 Tests Existentes

```bash
npm test
# Test Suites: 1 passed
# Tests: 29 passed
```

Ubicación: `__tests__/logic/homeCalculations.test.js`

### 10.2 Qué se testa

- Cálculos de totales
- Filtrado de transacciones
- Ordenamiento por timestamp

### 10.3 Limitaciones

Los tests de Redux slices tienen problemas por:

- Module loading en Jest
- Mock de localStorage necesario
- Se recomienda testear lógica pura, no slices directamente

---

## 11. Deploy

### 11.1 Scripts Disponibles

```bash
npm run dev      # Desarrollo local (http://localhost:5173)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run deploy   # Build + deploy a GitHub Pages
npm run lint     # ESLint
npm test         # Jest
```

### 11.2 GitHub Pages

- Rama: `gh-pages`
- URL: https://pdgramajo.github.io/voice-sales-tracker/
- PWA funciona offline automáticamente

---

## 12. Errores Conocidos y Soluciones

### 12.1 Bug de Persistencia de Gastos (RESUELTO)

**Problema:** Gastos desaparecían al cerrar/abrir la app.

**Causa:** `salesSlice` y `expensesSlice` usaban la misma key `ventas_YYYY_M_D`. Al guardar ventas, se sobrescribían los gastos.

**Solución:** `expensesSlice` ahora usa key separada `gastos_YYYY_M_D`.

---

## 13. Agregar Nueva Funcionalidad

### 13.1 Nueva Pantalla

1. Crear componente en `src/components/screens/NuevaPantalla.jsx`
2. Agregar case en `App.jsx` → `renderScreen()`
3. Agregar navegación en `BottomNav.jsx` si es necesario
4. Agregar route en `uiSlice` → `navigate`

### 13.2 Nuevo Tipo de Transacción

1. Agregar en el slice correspondiente (o crear nuevo slice)
2. Actualizar `voiceParser.js` si necesita voice command
3. Actualizar `pdfGenerator.js` para incluir en PDF
4. Actualizar filtros en `HomeScreen` si aplica

### 13.3 Nuevo Campo en Transacción

1. Agregar campo en el objeto del slice
2. Actualizar funciones de cálculo si afecta totales
3. Actualizar UI para mostrar el nuevo campo

---

## 14. Checklist Antes de Commit

- [ ] `npm run lint` pasa sin errores
- [ ] `npm test` pasa sin errores
- [ ] Build completa exitosamente
- [ ] Código formateado con Prettier
- [ ] Sin console.logs o debug
- [ ] Props tipadas (si se usa TypeScript)
- [ ] Comentarios solo si es necesario explicar "por qué"

---

## 15. Contacto / Soporte

Para dudas sobre el código, revisar:

1. Este documento
2. README.md (para usuarios)
3. Código fuente (comentado donde es necesario)
