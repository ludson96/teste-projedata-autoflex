import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';

interface ProductionPlanState {
    plan: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductionPlanState = {
    plan: [],
    status: 'idle',
    error: null,
};

export const getProductionPlan = createAsyncThunk('productionPlan/getProductionPlan', async () => {
    return await api.getProductionPlan();
});

const productionPlanSlice = createSlice({
    name: 'productionPlan',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProductionPlan.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getProductionPlan.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.plan = action.payload;
            })
            .addCase(getProductionPlan.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch production plan';
            });
    },
});

export default productionPlanSlice.reducer;
