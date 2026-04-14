import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  const saved = localStorage.getItem('stock_entries');
  if (saved) {
    try {
      return { entries: JSON.parse(saved) };
    } catch {
      return { entries: [] };
    }
  }
  return { entries: [] };
};

const saveToStorage = (entries) => {
  localStorage.setItem('stock_entries', JSON.stringify(entries));
};

const initialState = loadInitialState();

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    addEntry: (state, action) => {
      const { type, description } = action.payload;
      const entry = {
        id: Date.now(),
        type,
        description,
        timestamp: Date.now(),
      };
      state.entries.unshift(entry);
      saveToStorage(state.entries);
    },

    deleteEntry: (state, action) => {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
      saveToStorage(state.entries);
    },

    clearAllEntries: (state) => {
      state.entries = [];
      localStorage.removeItem('stock_entries');
    },
  },
});

export const { addEntry, deleteEntry, clearAllEntries } = stockSlice.actions;
export default stockSlice.reducer;
