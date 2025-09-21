import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';
import { DeliveryTimeSlot } from '../constants/deliveryTimes';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  deliveryAddress: {
    district: string;
    neighborhood: string;
    street: string;
    buildingNo: string;
    floor: string;
    apartmentNo: string;
    description?: string;
  };
  deliveryTime: DeliveryTimeSlot;
  paymentMethod: 'cash_on_delivery' | 'credit_card' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `ORD-${timestamp}`;
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<{
      items: CartItem[];
      total: number;
      deliveryAddress: Order['deliveryAddress'];
      deliveryTime: DeliveryTimeSlot;
      paymentMethod: Order['paymentMethod'];
    }>) => {
      const { items, total, deliveryAddress, deliveryTime, paymentMethod } = action.payload;
      
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: generateOrderNumber(),
        date: new Date().toISOString(),
        status: 'pending',
        items: [...items],
        total,
        deliveryAddress,
        deliveryTime,
        paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.orders.unshift(newOrder);
      state.currentOrder = newOrder;
    },
    updateOrderStatus: (state, action: PayloadAction<{
      orderId: string;
      status: Order['status'];
    }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { createOrder, updateOrderStatus, cancelOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
