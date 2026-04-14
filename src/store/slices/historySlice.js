import { createSlice } from '@reduxjs/toolkit';

const getHistoryKey = () => 'ventas_historico';

const MAX_HISTORY_DAYS = 30;

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
      const { summary, sales, expenses, stock } = action.payload;

      state.history.push({
        ...summary,
        sales: [...sales],
        expenses: [...expenses],
        stock: [...stock],
      });

      if (state.history.length > MAX_HISTORY_DAYS) {
        state.history = state.history.slice(-MAX_HISTORY_DAYS);
      }

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
