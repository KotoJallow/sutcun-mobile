import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';
import { DeliveryTimeSlot } from '../constants/deliveryTimes';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  userId: string; // Connection to user
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
      userId: string;
      items: CartItem[];
      total: number;
      deliveryAddress: Order['deliveryAddress'];
      deliveryTime: DeliveryTimeSlot;
      paymentMethod: Order['paymentMethod'];
    }>) => {
      const { userId, items, total, deliveryAddress, deliveryTime, paymentMethod } = action.payload;
      
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: generateOrderNumber(),
        date: new Date().toISOString(),
        status: 'pending',
        userId, // Include userId
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
    addOrder: (state, action: PayloadAction<Order>) => {
      // Add order from Firestore to Redux state
      const existingOrder = state.orders.find(order => order.id === action.payload.id);
      if (!existingOrder) {
        state.orders.unshift(action.payload);
        console.log('✅ Order added to Redux:', action.payload.id);
      }
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      // Set all orders from Firestore
      state.orders = action.payload;
      console.log('✅ Orders set in Redux:', action.payload.length, 'orders');
    },
    addOrderFromFirestore: (state, action: PayloadAction<Order>) => {
      // Add order created in Firestore to Redux
      const existingOrder = state.orders.find(order => order.id === action.payload.id);
      if (!existingOrder) {
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        console.log('✅ Order from Firestore added to Redux:', action.payload.id);
      }
    },
  },
});

export const { 
  createOrder, 
  updateOrderStatus, 
  cancelOrder, 
  clearCurrentOrder, 
  addOrder, 
  setOrders, 
  addOrderFromFirestore 
} = orderSlice.actions;
export default orderSlice.reducer;
