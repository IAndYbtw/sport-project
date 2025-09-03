import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface UserState {
  data: User | null;
}

const initialState: UserState = {
  data: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
        localStorage.setItem('userData', JSON.stringify(state.data));
      }
    },
    clearUser: (state) => {
      state.data = null;
    }
  }
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;