import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductManager } from './ProductManager';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../data/productsSlice';
import rawMaterialsReducer from '../data/rawMaterialsSlice';

const createMockStore = (initialState: any) => {
    return configureStore({
        reducer: {
            products: productsReducer,
            rawMaterials: rawMaterialsReducer,
        },
        preloadedState: initialState,
    });
};

describe('ProductManager', () => {
    const initialRawMaterialsState = {
        items: [{ id: 1, name: 'Wood', stockQuantity: 100 }],
        status: 'succeeded',
        error: null,
    };

    it('should render loading state initially', () => {
        const store = createMockStore({
            products: { items: [], status: 'loading', error: null },
            rawMaterials: initialRawMaterialsState,
        });

        render(
            <Provider store={store}>
                <ProductManager />
            </Provider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render the table with products when status is "succeeded"', () => {
        const store = createMockStore({
            products: {
                items: [
                    { id: 1, name: 'Chair', price: 50, materials: [] },
                    { id: 2, name: 'Table', price: 150, materials: [] },
                ],
                status: 'succeeded',
                error: null,
            },
            rawMaterials: initialRawMaterialsState,
        });

        render(
            <Provider store={store}>
                <ProductManager />
            </Provider>
        );

        expect(screen.getByText('Chair')).toBeInTheDocument();
        expect(screen.getByText('Table')).toBeInTheDocument();
    });

    it('should show an error message when status is "failed"', () => {
        const store = createMockStore({
            products: {
                items: [],
                status: 'failed',
                error: 'Failed to fetch products',
            },
            rawMaterials: initialRawMaterialsState,
        });

        render(
            <Provider store={store}>
                <ProductManager />
            </Provider>
        );

        expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
    });

    it('should show "No products found." when there are no products', () => {
        const store = createMockStore({
            products: {
                items: [],
                status: 'succeeded',
                error: null,
            },
            rawMaterials: initialRawMaterialsState,
        });

        render(
            <Provider store={store}>
                <ProductManager />
            </Provider>
        );

        expect(screen.getByText('No products found.')).toBeInTheDocument();
    });
});
