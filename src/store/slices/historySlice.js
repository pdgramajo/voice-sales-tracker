import { createSlice } from '@reduxjs/toolkit';

const getHistoryKey = () => 'ventas_historico';

const loadInitialState = () => {
  const history = localStorage.getItem(getHistoryKey());
  return {
    history: history ? JSON.parse(history) : [],
  };
};

const initialState = loadInitialState();

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addDay: (state, action) => {
      const {
        initialBalance,
        totalSales,
        totalExpenses,
        cashTotal,
        transferTotal,
        cashInDrawer,
        salesCount,
        expensesCount,
        fecha,
      } = action.payload;
      state.history.push({
        fecha,
        initialBalance,
        totalSales,
        totalExpenses,
        cashTotal,
        transferTotal,
        cashInDrawer,
        salesCount,
        expensesCount,
      });
      localStorage.setItem(getHistoryKey(), JSON.stringify(state.history));
    },

    loadHistory: (state, action) => {
      state.history = action.payload;
    },
  },
});

export const { addDay, loadHistory } = historySlice.actions;
export default historySlice.reducer;

export const selectHistory = (state) => state.history.history;
