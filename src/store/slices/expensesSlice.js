import { createSlice } from '@reduxjs/toolkit';

const getExpensesKey = () => {
  const now = new Date();
  return `gastos_${now.getFullYear()}_${now.getMonth()}_${now.getDate()}`;
};

const loadInitialState = () => {
  const savedData = localStorage.getItem(getExpensesKey());
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      const totalExpenses = (parsed || []).reduce((sum, e) => sum + e.amount, 0);
      return {
        expenses: parsed || [],
        totalExpenses,
      };
    } catch {
      return { expenses: [], totalExpenses: 0 };
    }
  }
  return { expenses: [], totalExpenses: 0 };
};

const saveToStorage = (state) => {
  localStorage.setItem(getExpensesKey(), JSON.stringify(state.expenses));
};

const initialState = loadInitialState();

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      const { amount, description } = action.payload;
      const expense = {
        id: Date.now(),
        type: 'expense',
        amount: Number(amount),
        description,
        timestamp: Date.now(),
      };
      state.expenses.unshift(expense);
      state.totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
      saveToStorage(state);
    },

    addWithdrawal: (state, action) => {
      const { amount, description } = action.payload;
      const withdrawal = {
        id: Date.now(),
        type: 'withdrawal',
        amount: Number(amount),
        description,
        timestamp: Date.now(),
      };
      state.expenses.unshift(withdrawal);
      state.totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
      saveToStorage(state);
    },

    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      state.totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
      saveToStorage(state);
    },

    updateExpense: (state, action) => {
      const { id, amount, description } = action.payload;
      const expense = state.expenses.find((e) => e.id === id);
      if (expense) {
        if (amount !== undefined) expense.amount = Number(amount);
        if (description !== undefined) expense.description = description;
        state.totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
        saveToStorage(state);
      }
    },

    clearDay: (state) => {
      state.expenses = [];
      state.totalExpenses = 0;
      localStorage.removeItem(getExpensesKey());
    },

    loadExpenses: (state, action) => {
      state.expenses = action.payload;
      state.totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    },
  },
});

export const { addExpense, addWithdrawal, deleteExpense, updateExpense, clearDay, loadExpenses } =
  expensesSlice.actions;
export default expensesSlice.reducer;
