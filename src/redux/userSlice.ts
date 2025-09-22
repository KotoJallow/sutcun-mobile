// src/redux/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Utility function to clean address data
const cleanAddress = (address: any): Address => {
  // Convert Firestore Timestamp fields to ISO strings (safe for Redux)
  const serializeDates = (obj: any) => {
    const out: any = {};
    for (const key of Object.keys(obj)) {
      const val = (obj as any)[key];
      if (val && typeof val.toDate === 'function') {
        try {
          out[key] = val.toDate().toISOString();
        } catch (e) {
          out[key] = val;
        }
      } else {
        out[key] = val;
      }
    }
    return out;
  };

  const { createdAt, updatedAt, userId, ...cleanData } = address;
  const serializableData = serializeDates(cleanData);
  
  return {
    ...serializableData,
    // Omit timestamp fields from Redux state
  };
};

export interface UserState {
  id: string | null;
  name: string | null;
  surname: string | null;
  phone: string | null;
  isVerified: boolean;
  address: string | null;
  addressId: string | null; // Primary address ID
  gender: string | null;
  age: number | null;
  addresses: Address[]; // Array of all user addresses
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
  id: null,
  name: null,
  surname: null,
  phone: null,
  isVerified: false,
  address: null,
  addressId: null, // Primary address ID
  gender: null,
  age: null,
  addresses: [], // Empty array as default
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
    addAddress(state, action: PayloadAction<Address>) {
      console.log('🔄 addAddress called with:', action.payload);
      console.log('🔄 Address keys:', Object.keys(action.payload));
      
      // Clean the address before storing
      const cleanedAddress = cleanAddress(action.payload);
      console.log('🔄 Cleaned address:', cleanedAddress);
      
      // Check if address already exists to prevent duplicates
      const existingAddress = state.addresses.find(addr => addr.id === cleanedAddress.id);
      if (existingAddress) {
        console.log('🔄 Address already exists, skipping');
        return; // Don't add duplicate
      }
      
      const newAddress = { ...cleanedAddress, isDefault: state.addresses.length === 0 };
      console.log('🔄 Adding new address:', newAddress);
      state.addresses.push(newAddress);
      if (newAddress.isDefault) {
        state.address = `${newAddress.district}/${newAddress.neighborhood}`;
        state.addressId = newAddress.id;
      }
    },
    setDefaultAddress(state, action: PayloadAction<string>) {
      state.addresses.forEach(addr => addr.isDefault = addr.id === action.payload);
      const defaultAddr = state.addresses.find(addr => addr.id === action.payload);
      if (defaultAddr) {
        state.address = `${defaultAddr.district}/${defaultAddr.neighborhood}`;
        state.addressId = defaultAddr.id;
      }
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      if (state.addresses.length > 0 && !state.addresses.some(addr => addr.isDefault)) {
        state.addresses[0].isDefault = true;
        state.address = `${state.addresses[0].district}/${state.addresses[0].neighborhood}`;
        state.addressId = state.addresses[0].id;
      } else if (state.addresses.length === 0) {
        state.address = null;
        state.addressId = null;
      }
    },
    setAddresses(state, action: PayloadAction<Address[]>) {
      console.log('🔄 setAddresses called with:', action.payload);
      console.log('🔄 First address keys:', action.payload[0] ? Object.keys(action.payload[0]) : 'No addresses');
      console.log('🔄 First address:', action.payload[0]);
      
      // Clean all addresses before storing
      const cleanedAddresses = action.payload.map(cleanAddress);
      console.log('🔄 Cleaned addresses:', cleanedAddresses);
      
      state.addresses = cleanedAddresses;
      // Update default address display and addressId
      const defaultAddr = cleanedAddresses.find(addr => addr.isDefault);
      if (defaultAddr) {
        state.address = `${defaultAddr.district}/${defaultAddr.neighborhood}`;
        state.addressId = defaultAddr.id;
      } else if (cleanedAddresses.length > 0) {
        // If no default set, make first one default
        state.addresses[0].isDefault = true;
        state.address = `${state.addresses[0].district}/${state.addresses[0].neighborhood}`;
        state.addressId = state.addresses[0].id;
      } else {
        state.address = null;
        state.addressId = null;
      }
    },
    logout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, addAddress, setDefaultAddress, removeAddress, setAddresses, logout } = userSlice.actions;
export default userSlice.reducer;
