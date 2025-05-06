import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

interface PolicyState {
  policyData: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PolicyState = {
  policyData: null,
  status: 'idle',
  error: null,
};

export const createOrSavePolicy = createAsyncThunk(
  'policy/createOrSavePolicy',
  async (policyData: any, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const response = await axios.post(
      'https://softtek-sandbox-am.insuremo.com/api/softtek/api-orchestration/v1/flow/easypa_createOrSave',
      policyData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-ebao-tenant-code': 'softtek',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.PolicyObject;
  }
);

export const calculatePolicy = createAsyncThunk('policy/calculatePolicy', async (policyData: any, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.accessToken;
  const response = await axios.post(
    'https://softtek-sandbox-am.insuremo.com/api/softtek/api-orchestration/v1/flow/easypa_calculate',
    policyData,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-ebao-tenant-id': 'softtek',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.PolicyObject;
});

export const bindPolicy = createAsyncThunk('policy/bindPolicy', async (policyData: any, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.accessToken;
  const response = await axios.post(
    'https://softtek-sandbox-am.insuremo.com/api/softtek/api-orchestration/v1/flow/easypa_bind',
    policyData,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-ebao-tenant-code': 'softtek',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.PolicyObject;
});

export const issuePolicy = createAsyncThunk('policy/issuePolicy', async (policyData: any, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.accessToken;
  const response = await axios.post(
    'https://softtek-sandbox-am.insuremo.com/api/platform/proposal/v1/issuePolicy',
    policyData,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-ebao-tenant-code': 'softtek',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.PolicyObject;
});

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrSavePolicy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrSavePolicy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.policyData = action.payload;
      })
      .addCase(createOrSavePolicy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create or save policy';
      })
      .addCase(calculatePolicy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(calculatePolicy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.policyData = action.payload;
      })
      .addCase(calculatePolicy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to calculate policy';
      })
      .addCase(bindPolicy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(bindPolicy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.policyData = action.payload;
      })
      .addCase(bindPolicy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to bind policy';
      })
      .addCase(issuePolicy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(issuePolicy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.policyData = action.payload;
      })
      .addCase(issuePolicy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to issue policy';
      });
  },
});

export default policySlice.reducer;