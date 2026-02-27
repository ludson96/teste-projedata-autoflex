import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductionPlan } from '../data/productionPlanSlice';
import type { AppDispatch, RootState } from '../store/store';

export const ProductionReport: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { plan, status, error } = useSelector((state: RootState) => state.productionPlan);

    useEffect(() => {
        // Fetches the plan every time the component is shown
        // This is useful to get the most up-to-date calculation
        dispatch(getProductionPlan());
    }, [dispatch]);

    const totalValue = plan.reduce((acc, item) => acc + item.subtotal, 0);

    let content;

    if (status === 'loading') {
        content = <p>Calculating production plan...</p>;
    } else if (status === 'failed') {
        content = <p>Error: {error}</p>;
    } else if (status === 'succeeded') {
        content = (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 mb-4">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity to Produce</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {plan.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.product_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">{item.producible_quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${item.unit_price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                            {plan.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No products can be produced with the current inventory.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-blue-900">Total Production Value:</span>
                        <span className="text-2xl font-bold text-blue-700">${totalValue.toFixed(2)}</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Production Plan</h2>
            <p className="mb-4 text-gray-600">
                Calculated based on available stock.
            </p>
            {content}
        </div>
    );
};