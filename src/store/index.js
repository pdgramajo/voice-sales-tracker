import { configureStore, combineReducers } from '@reduxjs/toolkit';

import salesReducer from './slices/salesSlice';
import expensesReducer from './slices/expensesSlice';
import uiReducer from './slices/uiSlice';
import historyReducer from './slices/historySlice';

const rootReducer = combineReducers({
  sales: salesReducer,
  expenses: expensesReducer,
  ui: uiReducer,
  history: historyReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export const persistor = null;
