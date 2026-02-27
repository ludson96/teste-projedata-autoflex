import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import type { RawMaterial } from '../types';

interface RawMaterialsState {
    items: RawMaterial[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RawMaterialsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const getRawMaterials = createAsyncThunk('rawMaterials/getRawMaterials', async () => {
    return await api.getRawMaterials();
});

export const createRawMaterial = createAsyncThunk('rawMaterials/createRawMaterial', async (rawMaterial: Omit<RawMaterial, 'id'>) => {
    return await api.createRawMaterial(rawMaterial);
});

export const updateRawMaterial = createAsyncThunk('rawMaterials/updateRawMaterial', async (rawMaterial: RawMaterial) => {
    return await api.updateRawMaterial(rawMaterial.id, rawMaterial);
});

export const deleteRawMaterial = createAsyncThunk('rawMaterials/deleteRawMaterial', async (id: number) => {
    await api.deleteRawMaterial(id);
    return id;
});

const rawMaterialsSlice = createSlice({
    name: 'rawMaterials',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRawMaterials.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getRawMaterials.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getRawMaterials.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch raw materials';
            })
            .addCase(createRawMaterial.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateRawMaterial.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteRawMaterial.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default rawMaterialsSlice.reducer;