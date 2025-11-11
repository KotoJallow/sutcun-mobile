import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../constants/dummyData';
import { setDefaultAddress, logout } from './userSlice';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  groupedItems: { [categoryName: string]: CartItem[] };
}

const initialState: CartState = {
  items: [],
  total: 0,
  groupedItems: {},
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

const groupItemsByCategory = (items: CartItem[]) => {
  const grouped: { [categoryName: string]: CartItem[] } = {};
  items.forEach(item => {
    const categoryName = item.product.category_name;
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    grouped[categoryName].push(item);
  });
  return grouped;
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
      state.groupedItems = groupItemsByCategory(state.items);
    },
    increment: (state, action: PayloadAction<number>) => {
      const item = state.items.find(
        item => item.product.product_id === action.payload
      );
      if (item) {
        item.quantity += 1;
        state.total = calculateTotal(state.items);
        state.groupedItems = groupItemsByCategory(state.items);
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
        state.groupedItems = groupItemsByCategory(state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        item => item.product.product_id !== action.payload
      );
      state.total = calculateTotal(state.items);
      state.groupedItems = groupItemsByCategory(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.groupedItems = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setDefaultAddress, (state) => {
      state.items = [];
      state.total = 0;
      state.groupedItems = {};
    });
    builder.addCase(logout, (state) => {
      state.items = [];
      state.total = 0;
      state.groupedItems = {};
    });
  },
});

export const { addToCart, increment, decrement, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;