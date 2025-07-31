import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import policyReducer from './slices/policySlice';
import claimsReducer from './slices/claimsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    policy: policyReducer,
    claims: claimsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;