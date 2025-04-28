import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  accessToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  status: 'idle',
  error: null,
};

export const getToken = createAsyncThunk('auth/getToken', async (credentials: { username: string; password: string }) => {
  const response = await axios.post('https://sandbox-am.insuremo.com/cas/ebao/v1/json/tickets', credentials, {
    headers: {
      'Content-Type': 'application/json',
      'x-ebao-tenant-code': 'softtek',
    },
  });
  return response.data.access_token;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessToken = action.payload;
      })
      .addCase(getToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to get token';
      });
  },
});

export default authSlice.reducer;