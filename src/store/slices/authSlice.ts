import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  accessToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('api_token') || null,
  status: localStorage.getItem('api_token') ? 'succeeded' : 'idle', // <-- FIX
  error: null,
};

export const getToken = createAsyncThunk('auth/getToken', async (credentials: { username: string; password: string }) => {
  const response = await axios.post('https://sandbox-am.insuremo.com/cas/ebao/v1/json/tickets', credentials, {
    headers: {
      'Content-Type': 'application/json',
      'x-ebao-tenant-code': 'softtek',
    },
  });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.status = 'idle';
      localStorage.removeItem('api_token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload.access_token;
        localStorage.setItem('api_token', action.payload.access_token);
      })
      .addCase(getToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to get token';
        localStorage.removeItem('api_token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;