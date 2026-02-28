import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRawMaterial, deleteRawMaterial, getRawMaterials, updateRawMaterial } from '../data/rawMaterialsSlice';
import type { RawMaterial } from '../types'; // Importa o tipo RawMaterial
import type { AppDispatch, RootState } from '../store/store';

export const RawMaterialManager: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: rawMaterials, status, error } = useSelector((state: RootState) => state.rawMaterials);

    const [formData, setFormData] = useState<Omit<RawMaterial, 'id'>>({
        name: '',
        stockQuantity: 0,
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getRawMaterials());
        }
    }, [status, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateRawMaterial({ ...formData, id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createRawMaterial(formData));
        }
        setFormData({ name: '', stockQuantity: 0 });
    };

    const handleEdit = (material: RawMaterial) => {
        setFormData({
            name: material.name,
            stockQuantity: material.stockQuantity,
        });
        setEditingId(material.id);
    };

    const sortedRawMaterials = [...(rawMaterials || [])]
        .filter(material => material && material.id != null && material.name)
        .sort((a, b) => a.name.localeCompare(b.name));


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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedRawMaterials.map((material) => (
                            <tr key={material.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{material.stockQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(material)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => dispatch(deleteRawMaterial(material.id))}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sortedRawMaterials.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No raw materials found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    } else if (status === 'failed') {
        content = <p>{error}</p>;
    }


    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Raw Materials Management</h2>

            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input
                        type="number"
                        required
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setFormData({ name: '', stockQuantity: 0 }); }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {content}
        </div>
    );
};