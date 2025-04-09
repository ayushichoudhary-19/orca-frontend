import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    uid: string;
  } | null;
  roleId: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  roleId: 'user',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ email: string; uid: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.roleId = 'user';
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.roleId = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth, setRole } = authSlice.actions;
export default authSlice.reducer;