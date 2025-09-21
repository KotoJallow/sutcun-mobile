// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
