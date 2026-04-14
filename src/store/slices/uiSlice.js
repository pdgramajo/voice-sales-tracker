import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  const savedFilter = localStorage.getItem('filter');
  return {
    currentScreen: 'movimientos',
    filter: savedFilter || 'todos',
    toast: null,
    editingExpense: null,
    paymentMethod: 'efectivo',
    expenseDescription: '',
    expenseAmount: '',
    saleAmount: '',
  };
};

const initialState = loadInitialState();

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    navigate: (state, action) => {
      state.currentScreen = action.payload;
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
      localStorage.setItem('filter', action.payload);
    },

    showToast: (state, action) => {
      state.toast = action.payload;
    },

    clearToast: (state) => {
      state.toast = null;
    },

    setEditingExpense: (state, action) => {
      state.editingExpense = action.payload;
      if (action.payload) {
        state.expenseDescription = action.payload.description;
        state.expenseAmount = action.payload.amount.toString();
      } else {
        state.expenseDescription = '';
        state.expenseAmount = '';
      }
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    setExpenseDescription: (state, action) => {
      state.expenseDescription = action.payload;
    },

    setExpenseAmount: (state, action) => {
      state.expenseAmount = action.payload;
    },

    setSaleAmount: (state, action) => {
      state.saleAmount = action.payload;
    },

    resetExpenseForm: (state) => {
      state.editingExpense = null;
      state.expenseDescription = '';
      state.expenseAmount = '';
    },

    resetSaleForm: (state) => {
      state.saleAmount = '';
    },
  },
});

export const {
  navigate,
  setFilter,
  showToast,
  clearToast,
  setEditingExpense,
  setPaymentMethod,
  setExpenseDescription,
  setExpenseAmount,
  setSaleAmount,
  resetExpenseForm,
  resetSaleForm,
} = uiSlice.actions;

export default uiSlice.reducer;
