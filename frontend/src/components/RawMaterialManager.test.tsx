import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RawMaterialManager } from './RawMaterialManager';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rawMaterialsReducer, { createRawMaterial } from '../data/rawMaterialsSlice';

// Mock the async thunk
vi.mock('../data/rawMaterialsSlice', async (importOriginal) => {
    const original = await importOriginal<any>();
    return {
        ...original,
        createRawMaterial: vi.fn((material) => ({
            type: 'rawMaterials/create/fulfilled',
            payload: { ...material, id: Date.now() },
        })),
    };
});


// A simple mock store for rendering the component
const createMockStore = (initialState: any) => {
    return configureStore({
        reducer: {
            rawMaterials: rawMaterialsReducer,
        },
        preloadedState: {
            rawMaterials: initialState,
        },
    });
};

describe('RawMaterialManager', () => {
    it('should render loading state initially', () => {
        const store = createMockStore({
            items: [],
            status: 'loading',
            error: null,
        });

        render(
            <Provider store={store}>
                <RawMaterialManager />
            </Provider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render the table with materials when status is "succeeded"', () => {
        const store = createMockStore({
            items: [
                { id: 1, name: 'Wood', stockQuantity: 100 },
                { id: 2, name: 'Steel', stockQuantity: 50 },
            ],
            status: 'succeeded',
            error: null,
        });

        render(
            <Provider store={store}>
                <RawMaterialManager />
            </Provider>
        );

        expect(screen.getByText('Wood')).toBeInTheDocument();
        expect(screen.getByText('Steel')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should show an error message when status is "failed"', () => {
        const store = createMockStore({
            items: [],
            status: 'failed',
            error: 'Failed to fetch materials',
        });

        render(
            <Provider store={store}>
                <RawMaterialManager />
            </Provider>
        );

        expect(screen.getByText('Failed to fetch materials')).toBeInTheDocument();
    });

    it('should show "No raw materials found." when there are no materials', () => {
        const store = createMockStore({
            items: [],
            status: 'succeeded',
            error: null,
        });

        render(
            <Provider store={store}>
                <RawMaterialManager />
            </Provider>
        );

        expect(screen.getByText('No raw materials found.')).toBeInTheDocument();
    });

    it('should allow a user to add a new raw material', async () => {
        const store = createMockStore({
            items: [],
            status: 'succeeded',
            error: null,
        });

        render(
            <Provider store={store}>
                <RawMaterialManager />
            </Provider>
        );

        const nameInput = screen.getByLabelText('Name');
        const quantityInput = screen.getByLabelText('Stock Quantity');
        const addButton = screen.getByRole('button', { name: 'Add' });

        await userEvent.type(nameInput, 'Fabric');
        await userEvent.type(quantityInput, '200');
        await userEvent.click(addButton);

        expect(createRawMaterial).toHaveBeenCalledWith({
            name: 'Fabric',
            stockQuantity: 200,
        });
    });
});
