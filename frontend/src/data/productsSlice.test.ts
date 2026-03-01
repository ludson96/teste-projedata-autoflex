import { describe, it, expect } from 'vitest';
import productsReducer, { getProducts, createProduct, updateProduct, deleteProduct } from './productsSlice';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

describe('productsSlice', () => {
    it('should return the initial state', () => {
        expect(productsReducer(undefined, { type: '' })).toEqual(initialState);
    });

    describe('getProducts extra reducers', () => {
        it('should handle pending state', () => {
            const action = { type: getProducts.pending.type };
            const state = productsReducer(initialState, action);
            expect(state.status).toBe('loading');
        });

        it('should handle fulfilled state with a simple array payload', () => {
            const mockProducts = [{ id: 1, name: 'Chair', price: 100 }];
            const action = { type: getProducts.fulfilled.type, payload: mockProducts };
            const state = productsReducer(initialState, action);
            expect(state.status).toBe('succeeded');
            expect(state.items).toEqual(mockProducts);
        });

        it('should handle fulfilled state with a stringified JSON payload', () => {
            const mockProducts = [{ id: 1, name: 'Chair', price: 100 }];
            const stringPayload = JSON.stringify(mockProducts);
            const action = { type: getProducts.fulfilled.type, payload: stringPayload };
            const state = productsReducer(initialState, action);
            expect(state.status).toBe('succeeded');
            expect(state.items).toEqual(mockProducts);
        });

        it('should handle fulfilled state with a paginated response', () => {
            const mockProducts = [{ id: 1, name: 'Table', price: 200 }];
            const paginatedPayload = { content: mockProducts, totalPages: 1 };
            const action = { type: getProducts.fulfilled.type, payload: paginatedPayload };
            const state = productsReducer(initialState, action);
            expect(state.status).toBe('succeeded');
            expect(state.items).toEqual(mockProducts);
        });
        
        it('should handle fulfilled state with a malformed JSON string', () => {
            const malformedString = '[{"id":1,"name":"Chair","price":100,"materials":}]';
            const expectedProducts = [{"id":1,"name":"Chair","price":100,"materials":[]}];
            const action = { type: getProducts.fulfilled.type, payload: malformedString };
            const state = productsReducer(initialState, action);
            expect(state.status).toBe('succeeded');
            expect(state.items).toEqual(expectedProducts);
        });

        it('should handle rejected state', () => {
            const action = { type: getProducts.rejected.type, error: { message: 'Error fetching' } };
            const state = productsReducer(initialState, action);
            expect(state.status).toBe('failed');
            expect(state.error).toBe('Error fetching');
        });
    });

    describe('createProduct extra reducers', () => {
        it('should handle fulfilled state', () => {
            const newProduct = { id: 1, name: 'Desk', price: 150 };
            const action = { type: createProduct.fulfilled.type, payload: newProduct };
            const state = productsReducer(initialState, action);
            expect(state.items).toEqual([newProduct]);
        });
    });

    describe('updateProduct extra reducers', () => {
        it('should handle fulfilled state', () => {
            const existingState = {
                ...initialState,
                items: [{ id: 1, name: 'Desk', price: 150 }],
            };
            const updatedProduct = { id: 1, name: 'Oak Desk', price: 160 };
            const action = { type: updateProduct.fulfilled.type, payload: updatedProduct };
            const state = productsReducer(existingState, action);
            expect(state.items).toEqual([updatedProduct]);
        });
    });

    describe('deleteProduct extra reducers', () => {
        it('should handle fulfilled state', () => {
            const existingState = {
                ...initialState,
                items: [{ id: 1, name: 'Desk', price: 150 }],
            };
            const action = { type: deleteProduct.fulfilled.type, payload: 1 };
            const state = productsReducer(existingState, action);
            expect(state.items).toEqual([]);
        });
    });
});
