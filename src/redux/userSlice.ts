// src/redux/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name: string | null;
  surname: string | null;
  phone: string | null;
  isVerified: boolean;
  address: string | null;
  gender: string | null;
  age: number | null;
  addresses: Address[];
}

export type User = Partial<UserState>;

export interface Address {
  id: string;
  title: string;
  district: string;
  neighborhood: string;
  street: string;
  buildingNo: string;
  floor: string;
  apartmentNo: string;
  description: string;
  icon: string;
  isDefault: boolean;
}

const initialState: UserState = {
  name: null,
  surname: null,
  phone: null,
  isVerified: false,
  address: null,
  gender: null,
  age: null,
  addresses: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
    addAddress(state, action: PayloadAction<Address>) {
      const newAddress = { ...action.payload, isDefault: state.addresses.length === 0 };
      state.addresses.push(newAddress);
      if (newAddress.isDefault) {
        state.address = `${newAddress.district}/${newAddress.neighborhood}`;
      }
    },
    setDefaultAddress(state, action: PayloadAction<string>) {
      state.addresses.forEach(addr => addr.isDefault = addr.id === action.payload);
      const defaultAddr = state.addresses.find(addr => addr.id === action.payload);
      if (defaultAddr) {
        state.address = `${defaultAddr.district}/${defaultAddr.neighborhood}`;
      }
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      if (state.addresses.length > 0 && !state.addresses.some(addr => addr.isDefault)) {
        state.addresses[0].isDefault = true;
        state.address = `${state.addresses[0].district}/${state.addresses[0].neighborhood}`;
      } else if (state.addresses.length === 0) {
        state.address = null;
      }
    },
    logout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, addAddress, setDefaultAddress, removeAddress, logout } = userSlice.actions;
export default userSlice.reducer;
