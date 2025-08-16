import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../constants/dummyData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        item => item.product.product_id === action.payload.product_id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      state.total = calculateTotal(state.items);
    },
    increment: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        item => item.product.product_id === action.payload
      );
      if (item) {
        item.quantity += 1;
        state.total = calculateTotal(state.items);
      }
    },
    decrement: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        item => item.product.product_id === action.payload
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            item => item.product.product_id !== action.payload
          );
        }
        state.total = calculateTotal(state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        item => item.product.product_id !== action.payload
      );
      state.total = calculateTotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, increment, decrement, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;