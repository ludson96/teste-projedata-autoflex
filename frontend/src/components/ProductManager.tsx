import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../data/productsSlice';
import type { Product } from '../types';
import type { AppDispatch, RootState } from '../store/store';

// TODO: Implement a separate component to manage product composition (materials)
// The backend handles this via /product-materials endpoint.

export const ProductManager: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: products, status, error } = useSelector((state: RootState) => state.products);
    // const rawMaterials = useSelector((state: RootState) => state.rawMaterials.items); // Keep for future composition feature

    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        price: 0,
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getProducts());
        }
    }, [status, dispatch]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateProduct({ ...formData, id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createProduct(formData));
        }
        setFormData({ name: '', price: 0 });
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            price: product.price,
        });
        setEditingId(product.id);
    };

    let content;

    if (status === 'loading') {
        content = <p>Loading...</p>;
    } else if (status === 'succeeded') {
        content = (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => dispatch(deleteProduct(product.id))} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    } else if (status === 'failed') {
        content = <p>{error}</p>;
    }


    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Product Management</h2>

            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        {editingId ? 'Update Product' : 'Create Product'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', price: 0 }); }}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {content}
        </div>
    );
};