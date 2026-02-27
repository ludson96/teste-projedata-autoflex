import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import type { Product } from '../types';

interface ProductsState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const getProducts = createAsyncThunk('products/getProducts', async () => {
    return await api.getProducts();
});

export const createProduct = createAsyncThunk('products/createProduct', async (product: Omit<Product, 'id'>) => {
    return await api.createProduct(product);
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product: Product) => {
    return await api.updateProduct(product.id, product);
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number) => {
    await api.deleteProduct(id);
    return id;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch products';
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default productsSlice.reducer;