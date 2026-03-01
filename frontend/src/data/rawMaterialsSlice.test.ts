import { describe, it, expect } from 'vitest';
import rawMaterialsReducer, { getRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial } from './rawMaterialsSlice';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
};

describe('rawMaterialsSlice', () => {
    it('should return the initial state', () => {
        expect(rawMaterialsReducer(undefined, { type: '' })).toEqual(initialState);
    });

    describe('getRawMaterials extra reducers', () => {
        it('should handle pending state', () => {
            const action = { type: getRawMaterials.pending.type };
            const state = rawMaterialsReducer(initialState, action);
            expect(state.status).toBe('loading');
        });

        it('should handle fulfilled state', () => {
            const mockMaterials = [{ id: 1, name: 'Wood', stockQuantity: 100 }];
            const action = { type: getRawMaterials.fulfilled.type, payload: mockMaterials };
            const state = rawMaterialsReducer(initialState, action);
            expect(state.status).toBe('succeeded');
            expect(state.items).toEqual(mockMaterials);
        });

        it('should handle rejected state', () => {
            const action = { type: getRawMaterials.rejected.type, error: { message: 'Error fetching' } };
            const state = rawMaterialsReducer(initialState, action);
            expect(state.status).toBe('failed');
            expect(state.error).toBe('Error fetching');
        });
    });

    describe('createRawMaterial extra reducers', () => {
        it('should handle fulfilled state', () => {
            const newMaterial = { id: 1, name: 'Steel', stockQuantity: 50 };
            const action = { type: createRawMaterial.fulfilled.type, payload: newMaterial };
            const state = rawMaterialsReducer(initialState, action);
            expect(state.items).toEqual([newMaterial]);
        });
    });

    describe('updateRawMaterial extra reducers', () => {
        it('should handle fulfilled state', () => {
            const existingState = {
                ...initialState,
                items: [{ id: 1, name: 'Wood', stockQuantity: 100 }],
            };
            const updatedMaterial = { id: 1, name: 'Hardwood', stockQuantity: 90 };
            const action = { type: updateRawMaterial.fulfilled.type, payload: updatedMaterial };
            const state = rawMaterialsReducer(existingState, action);
            expect(state.items).toEqual([updatedMaterial]);
        });
    });

    describe('deleteRawMaterial extra reducers', () => {
        it('should handle fulfilled state', () => {
            const existingState = {
                ...initialState,
                items: [{ id: 1, name: 'Wood', stockQuantity: 100 }],
            };
            const action = { type: deleteRawMaterial.fulfilled.type, payload: 1 };
            const state = rawMaterialsReducer(existingState, action);
            expect(state.items).toEqual([]);
        });
    });
});
