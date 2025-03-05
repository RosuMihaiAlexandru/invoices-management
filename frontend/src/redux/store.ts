import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import invoiceReducer from './invoiceSlice'; // Import the invoice slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    invoices: invoiceReducer, // Add the invoice reducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
