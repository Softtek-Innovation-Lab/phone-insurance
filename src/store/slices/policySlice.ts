import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';
import { getToken } from './authSlice';

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

const _parsePolicyData = (cart: any) => {
  const policyCustomer = {
    CustomerName: "Richard Vives",
    DateOfBirth: "1975-04-21",
    GenderCode: "M",
    IdNo: "123456789",
    IdType: "1",
    IsInsured: "N",
    IsOrgParty: "N",
    IsPolicyHolder: "Y",
    VersionSeq: 1,
    TempData: {
      "Mask-IdNo": "Hy4eAmtfvwRJLr3TzyvcZA==",
      "MaskAfter-IdNo": "123456789",
    },
  };

  // Generar riesgos basados en cart
  const policyRiskList = [];

  // Mapear elementos de cart a riesgos
  for (const item of cart) {
    const quantity = item.quantity || 1;
    for (let i = 0; i < quantity; i++) {
      //@ts-ignore
      policyRiskList.push({
        PolicyCoverageList: [
          {
            PolicyLimitDeductibleList: [
              {
                LimitDeductibleValue: item.product.LimitDeductibleValue || 1000, 
                ProductElementCode: "PROP_FULL_DAMAGE_LIM",
                ProductElementId: 789611476,
              },
            ],
            ProductElementCode: "TRAV_PROP_COV",
            SumInsured: item.product.SumInsured || 1000, 
            VersionSeq: 1,
          },
        ],
        ProductElementCode: "TRAV_PROP_RISK", 
        ProductElementId: 789611472, 
        RiskName: "ProductElement",
        VersionSeq: 1,
        PredefinedPremium: item.product.premium || 70,
      });
    }
  }

  const policyLobList = [
    {
      PolicyRiskList: policyRiskList,
      ProductCode: "TRAV_PROP_MKT", 
      ProductElementCode: "TRAV_PROP_MKT",
      ProductId: 789725307,
      TechProductCode: "TRAV_PROP_TEC",
      TechProductId: 789317612,
      VersionSeq: 1,
    },
  ];

  return {
    BusinessCateCode: "1",
    EffectiveDate: "2025-04-25",
    ExpiryDate: "2026-04-24T23:59:59",
    OrgCode: "softtek",
    POIRate: 1,
    PolicyCustomerList: [policyCustomer],
    PolicyLobList: policyLobList,
    ProductCode: "TRAV_PROP_MKT", 
    ProductId: 789725307, 
    ProductVersion: "1.0",
    ProposalDate: "2025-04-24",
    TechProductCode: "TRAV_PROP_TEC",
    TechProductId: 789317612,
    VersionSeq: 1,
  };
};

export const createOrSavePolicy = createAsyncThunk(
  'policy/createOrSavePolicy',
  async (cart: any, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    const policyData = _parsePolicyData(cart);
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
    return response.data
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
  return response.data;
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
  return response.data;
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
  return response.data;
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


export const generatePolicy = async (cart: any, dispatch: any) => {
  try {
    await dispatch(getToken({
      username: 'martin.gimenezartero@softtek.com',
      password: 'Tinchogi500--',
    }))

    const createOrSaveResponse = await dispatch(createOrSavePolicy(cart)).unwrap()
    console.log('Create or Save Response:', createOrSaveResponse);

    const calculateResponse = await dispatch(calculatePolicy(createOrSaveResponse)).unwrap()
    console.log('Calculate Response:', calculateResponse);

    const bindResponse = await dispatch(bindPolicy(calculateResponse)).unwrap()
    console.log('Bind Response:', bindResponse);

    const issueResponse = await dispatch(issuePolicy(createOrSaveResponse)).unwrap()
    console.log('issueResponse Response:', issueResponse);

    return {
      createOrSaveResponse,
      calculateResponse,
      bindResponse,
      issueResponse
    };
  } catch (error) {
    console.error('Error generating policy:', error);
    throw error;
  }
};
