import { createSlice } from '@reduxjs/toolkit';

const getTodayKey = () => {
  const now = new Date();
  return `ventas_${now.getFullYear()}_${now.getMonth()}_${now.getDate()}`;
};

const calculateTotals = (sales, initialBalance) => {
  const cashSales = sales
    .filter(s => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.amount, 0);
  
  const transferTotal = sales
    .filter(s => s.paymentMethod === 'transferencia')
    .reduce((sum, s) => sum + s.amount, 0);
  
  return { cashTotal: initialBalance + cashSales, transferTotal };
};

const loadInitialState = () => {
  const savedData = localStorage.getItem(getTodayKey());
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      const totals = calculateTotals(parsed.sales || [], parsed.initialBalance || 0);
      return {
        sales: parsed.sales || [],
        initialBalance: parsed.initialBalance || 0,
        ...totals
      };
    } catch {
      localStorage.removeItem(getTodayKey());
    }
  }
  return {
    sales: [],
    initialBalance: 0,
    cashTotal: 0,
    transferTotal: 0
  };
};

const saveToStorage = (state) => {
  localStorage.setItem(getTodayKey(), JSON.stringify({
    sales: state.sales,
    initialBalance: state.initialBalance
  }));
};

const initialState = loadInitialState();

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addSale: (state, action) => {
      const { amount, paymentMethod } = action.payload;
      const now = new Date();
      const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      
      const sale = {
        id: Date.now(),
        type: 'sale',
        amount: Number(amount),
        paymentMethod,
        dateString: `${dayName} ${day} ${timeStr}`,
        timestamp: now.getTime()
      };

      state.sales.unshift(sale);
      const totals = calculateTotals(state.sales, state.initialBalance);
      state.cashTotal = totals.cashTotal;
      state.transferTotal = totals.transferTotal;
      saveToStorage(state);
    },

    deleteSale: (state, action) => {
      state.sales = state.sales.filter(s => s.id !== action.payload);
      const totals = calculateTotals(state.sales, state.initialBalance);
      state.cashTotal = totals.cashTotal;
      state.transferTotal = totals.transferTotal;
      saveToStorage(state);
    },

    updateInitialBalance: (state, action) => {
      state.initialBalance = Number(action.payload) || 0;
      const totals = calculateTotals(state.sales, state.initialBalance);
      state.cashTotal = totals.cashTotal;
      state.transferTotal = totals.transferTotal;
      saveToStorage(state);
    },

    clearDay: (state) => {
      state.sales = [];
      state.initialBalance = 0;
      state.cashTotal = 0;
      state.transferTotal = 0;
      localStorage.removeItem(getTodayKey());
    },

    loadSales: (state, action) => {
      const { sales, initialBalance } = action.payload;
      state.sales = sales;
      state.initialBalance = initialBalance;
      const totals = calculateTotals(sales, initialBalance);
      state.cashTotal = totals.cashTotal;
      state.transferTotal = totals.transferTotal;
    }
  }
});

export const { addSale, deleteSale, updateInitialBalance, clearDay, loadSales } = salesSlice.actions;
export default salesSlice.reducer;
