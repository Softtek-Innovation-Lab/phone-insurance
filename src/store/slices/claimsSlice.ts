import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { claimsApi } from '@/services/claimsApi';

// --- Interfaces ---
interface ApiResponse<T> {
  Model: T;
}

interface Task {
    TaskId: string;
    TaskType: string;
    TaskStatus: string;
    // ... otros campos de la tarea
}

interface ClaimsState {
    claims: any[];
    tasks: Task[];
    currentClaimData: any | null;
    retrievedPolicy: any | null; // Nuevo estado para la póliza recuperada
    loading: boolean;
    error: string | null;
}

const initialState: ClaimsState = {
    claims: [],
    tasks: [],
    currentClaimData: null,
    retrievedPolicy: null, // Inicializar el nuevo estado
    loading: false,
    error: null,
};

// --- Thunks ---
export const fetchAllClaims = createAsyncThunk('claims/fetchAllClaims', async () => {
    const response: ApiResponse<{ data: any[] }> = await claimsApi.queryClaim(); // Sin claimNo para obtener todos
    return response.Model.data;
});

export const fetchClaimDetails = createAsyncThunk('claims/fetchClaimDetails', async (claimNo: string) => {
    const response: ApiResponse<{ data: any }> = await claimsApi.queryClaim(claimNo);
    return response.Model.data;
});

export const fetchTasks = createAsyncThunk('claims/fetchTasks', async (claimNo: string) => {
    const response: ApiResponse<{ TaskInfoList: Task[] }> = await claimsApi.queryTask(claimNo);
    return response.Model.TaskInfoList;
});

export const assignTask = createAsyncThunk('claims/assignTask', async ({ claimNo, taskId }: { claimNo: string, taskId: string }) => {
    await claimsApi.assignTask(claimNo, taskId);
    return taskId;
});

export const loadStepData = createAsyncThunk(
    'claims/loadStepData',
    async ({ step, claimNo, taskId }: { step: 'registration' | 'calculation' | 'settlement', claimNo: string, taskId: string }) => {
        const response: ApiResponse<any> = await claimsApi.loadStepData(step, claimNo, taskId);
        return response.Model;
    }
);

export const submitStepData = createAsyncThunk(
    'claims/submitStepData',
    async ({ step, payload }: { step: 'registration' | 'calculation' | 'settlement', payload: any }) => {
        const response: ApiResponse<any> = await claimsApi.submitStepData(step, payload);
        return response;
    }
);

export const reportAccident = createAsyncThunk(
    'claims/reportAccident',
    async ({ policyNo, dateOfLoss }: { policyNo: string, dateOfLoss: string }) => {
        const response: ApiResponse<any> = await claimsApi.reportAccidentWithPolicy(policyNo, dateOfLoss);
        return response.Model; // Asumiendo que la respuesta contiene las coberturas
    }
);

export const retrievePolicyDetails = createAsyncThunk(
    'claims/retrievePolicyDetails',
    async ({ policyNo, accidentTime }: { policyNo: string, accidentTime: string }) => {
        const response: ApiResponse<any> = await claimsApi.retrievePolicy(policyNo, accidentTime);
        return response.Model;
    }
);

// --- Slice ---
const claimsSlice = createSlice({
    name: 'claims',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All Claims
            .addCase(fetchAllClaims.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllClaims.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.claims = action.payload;
            })
            .addCase(fetchAllClaims.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch claims';
            })
            // Fetch Claim Details
            .addCase(fetchClaimDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClaimDetails.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false;
                state.claims = action.payload;
            })
            .addCase(fetchClaimDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch claim details';
            })
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            // Assign Task
            .addCase(assignTask.fulfilled, (state, action: PayloadAction<string>) => {
                const task = state.tasks.find(t => t.TaskId === action.payload);
                if (task) {
                    task.TaskStatus = 'Assigned'; // O el estado que corresponda
                }
            })
            // Load Step Data
            .addCase(loadStepData.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadStepData.fulfilled, (state, action) => {
                state.loading = false;
                state.currentClaimData = action.payload;
            })
            .addCase(loadStepData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load step data';
            })
            // Submit Step Data
            .addCase(submitStepData.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitStepData.fulfilled, (state) => {
                state.loading = false;
                // Opcional: actualizar el estado o mostrar una notificación
            })
            .addCase(submitStepData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to submit step data';
            })
            // Report Accident
            .addCase(reportAccident.pending, (state) => {
                state.loading = true;
                state.currentClaimData = null;
                state.error = null;
            })
            .addCase(reportAccident.fulfilled, (state, action) => {
                state.loading = false;
                state.currentClaimData = action.payload; // Guardar las coberturas
            })
            .addCase(reportAccident.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to report accident';
            })
            // Retrieve Policy Details
            .addCase(retrievePolicyDetails.pending, (state) => {
                state.loading = true;
                state.retrievedPolicy = null;
            })
            .addCase(retrievePolicyDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.retrievedPolicy = action.payload;
            })
            .addCase(retrievePolicyDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to retrieve policy';
            });
    },
});

export default claimsSlice.reducer;
