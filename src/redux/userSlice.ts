// src/redux/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string | null;
  phone: string | null;
  isVerified: boolean;
  address: string | null;
}

const initialState: UserState = {
  name: null,
  phone: null,
  isVerified: false,
  address: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
    logout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
