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

// Helper para tratar respostas da API que vêm como string JSON malformada
const parseResponse = (payload: any) => {
    if (typeof payload === 'string') {
        try {
            // Workaround: Corrige JSON malformado vindo do backend (provável referência circular cortada)
            // Substitui "materials":] (inválido) por "materials":[] (array vazio válido)
            const fixedPayload = payload.replace(/"materials":\s*]/g, '"materials":[]');
            return JSON.parse(fixedPayload);
        } catch (e) {
            console.error('Erro ao fazer parse do JSON:', e);
            return null;
        }
    }
    return payload;
};

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
                let payload = parseResponse(action.payload);

                // Normaliza a resposta para garantir que seja um array
                if (Array.isArray(payload)) {
                    state.items = payload;
                } else if (payload && typeof payload === 'object') {
                    // Verifica se é uma resposta paginada ou envelopada (comum em APIs Java/Spring)
                    if (Array.isArray(payload.content)) {
                        state.items = payload.content;
                    } else if (Array.isArray(payload.items)) {
                        state.items = payload.items;
                    } else if (Array.isArray(payload.data)) {
                        state.items = payload.data;
                    } else {
                        // Se a API retornar um objeto único (não array), envolvemos em um array
                        state.items = [payload];
                    }
                } else {
                    state.items = [];
                }
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch products';
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                // Proteção extra: se state.items foi corrompido, reinicia como array antes do push
                if (!Array.isArray(state.items)) state.items = [];
                const payload = parseResponse(action.payload);
                if (payload) {
                    state.items.push(payload);
                }
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const payload = parseResponse(action.payload);
                const index = state.items.findIndex((item) => item.id === payload?.id);
                if (index !== -1) {
                    state.items[index] = payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default productsSlice.reducer;