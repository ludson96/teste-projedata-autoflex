import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../data/productsSlice';
import { getRawMaterials } from '../data/rawMaterialsSlice';
import type { AppDispatch, RootState } from '../store/store';
import type { Product } from '../types';

interface MaterialFormComponent {
    rawMaterialId: number | '';
    quantity: number;
}

interface ProductFormComponent {
    name: string;
    price: number;
    materials: MaterialFormComponent[];
}

// Ícones
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);


export const ProductManager: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: products, status, error } = useSelector((state: RootState) => state.products);
    const { items: rawMaterials, status: rawMaterialsStatus } = useSelector((state: RootState) => state.rawMaterials);

    const initialFormState: ProductFormComponent = {
        name: '',
        price: 0,
        materials: [],
    };

    const [formData, setFormData] = useState<ProductFormComponent>(initialFormState);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getProducts());
        }
        if (rawMaterialsStatus === 'idle') {
            dispatch(getRawMaterials());
        }
    }, [status, rawMaterialsStatus, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.materials.length === 0) {
            alert('The product needs at least one raw material.');
            return;
        }

        const materialsToSend = formData.materials.map(material => {
            if (material.rawMaterialId === '' || material.quantity <= 0) {
                throw new Error('Please ensure all materials are selected and have a positive quantity.');
            }
            return {
                rawMaterialId: Number(material.rawMaterialId),
                quantity: Number(material.quantity),
            };
        });

        try {
            if (editingId) {
                await dispatch(updateProduct({ id: editingId, name: formData.name, price: formData.price, materials: materialsToSend as any })).unwrap();
            } else {
                await dispatch(createProduct({ name: formData.name, price: formData.price, materials: materialsToSend as any })).unwrap();
            }
            dispatch(getRawMaterials());
            setFormData(initialFormState);
            setEditingId(null);
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to save product. Check data and try again.';
            alert(`Error: ${errorMessage}`);
            console.error("Failed to save product:", err);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            materials: (product.materials || []).map(pm => ({
                rawMaterialId: pm.material.id,
                quantity: pm.quantityRequired,
            }))
        });
    };

    const handleMaterialChange = (index: number, field: 'rawMaterialId' | 'quantity', value: string) => {
        const newMaterials = [...formData.materials];
        const numericValue = field === 'rawMaterialId' ? (value === '' ? '' : Number(value)) : Number(value);
        newMaterials[index] = { ...newMaterials[index], [field]: isNaN(numericValue as number) ? newMaterials[index][field] : numericValue };
        setFormData({ ...formData, materials: newMaterials });
    };

    const addMaterialRow = () => {
        setFormData({
            ...formData,
            materials: [...formData.materials, { rawMaterialId: '', quantity: 1 }]
        });
    };

    const removeMaterialRow = (index: number) => {
        const newMaterials = formData.materials.filter((_, i) => i !== index);
        setFormData({ ...formData, materials: newMaterials });
    };

    const sortedProducts = [...(products || [])]
        .filter(product => product && product.id != null && product.name)
        .sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

    let content;

    if (status === 'loading' || rawMaterialsStatus === 'loading') {
        content = <div className="text-center p-8">Loading...</div>;
    } else if (status === 'succeeded') {
        content = (
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(product.price ?? 0).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 transition-colors"><PencilIcon /></button>
                                    <button onClick={() => dispatch(deleteProduct(product.id))} className="text-red-600 hover:text-red-800 transition-colors"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                        {sortedProducts.length === 0 && (
                            <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No products found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    } else if (status === 'failed') {
        content = <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">{editingId ? 'Edit Product' : 'Create Product'}</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input id="productName" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Fancy Chair" />
                    </div>
                    <div>
                        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input id="productPrice" type="number" required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="e.g., 99.99" />
                    </div>
                </div>

                {/* Materials Section */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Composition</h3>
                    <div className="space-y-4">
                        {formData.materials.map((material, index) => (
                            <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                                <select
                                    value={material.rawMaterialId}
                                    onChange={(e) => handleMaterialChange(index, 'rawMaterialId', e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                >
                                    <option value="">Select a material...</option>
                                    {rawMaterials.map(rm => (
                                        <option key={rm.id} value={rm.id}>{rm.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    value={material.quantity}
                                    onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                                />
                                <button type="button" onClick={() => removeMaterialRow(index)} className="mt-1 text-red-500 hover:text-red-700 transition-colors">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addMaterialRow} className="mt-4 inline-flex items-center px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Add Material
                    </button>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData(initialFormState); }}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        {editingId ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>

            <hr className="my-8" />
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Product List</h2>
            {content}
        </div>
    );
};