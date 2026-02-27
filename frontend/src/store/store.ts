import { configureStore } from '@reduxjs/toolkit';
import rawMaterialsReducer from '../data/rawMaterialsSlice';
import productsReducer from '../data/productsSlice';
import productionPlanReducer from '../data/productionPlanSlice';

export const store = configureStore({
    reducer: {
        rawMaterials: rawMaterialsReducer,
        products: productsReducer,
        productionPlan: productionPlanReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;