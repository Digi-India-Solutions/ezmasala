import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Admin {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  admin: Admin | null;
  userToken: string | null;
  adminToken: string | null;
}

const initialState: AuthState = {
  user: null,
  admin: null,
  userToken: null,
  adminToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.userToken = action.payload.token;
    },
    setAdminCredentials: (state, action: PayloadAction<{ admin: Admin; token: string }>) => {
      state.admin = action.payload.admin;
      state.adminToken = action.payload.token;
    },
    logoutUser: (state) => {
      state.user = null;
      state.userToken = null;
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.adminToken = null;
    },
  },
});

export const { setUserCredentials, setAdminCredentials, logoutUser, logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
