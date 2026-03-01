import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRawMaterial, deleteRawMaterial, getRawMaterials, updateRawMaterial } from '../data/rawMaterialsSlice';
import type { RawMaterial } from '../types'; // Importa o tipo RawMaterial
import type { AppDispatch, RootState } from '../store/store';

// Ícone de Lixeira para o botão de deletar
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

// Ícone de Lápis para o botão de editar
const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);


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
        content = <div className="text-center p-8">Loading...</div>;
    } else if (status === 'succeeded') {
        content = (
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
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
                            <tr key={material.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.stockQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-4">
                                    <button
                                        onClick={() => handleEdit(material)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
                                        aria-label={`Edit ${material.name}`}
                                    >
                                        <PencilIcon />
                                    </button>
                                    <button
                                        onClick={() => dispatch(deleteRawMaterial(material.id))}
                                        className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-2"
                                        aria-label={`Delete ${material.name}`}
                                    >
                                        <TrashIcon />
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
        content = <div className="text-center p-8 text-red-500">{error}</div>;
    }


    return (
        <div className="p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Raw Materials Management</h2>

            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Plastic"
                    />
                </div>
                <div>
                    <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                        type="number"
                        id="stockQuantity"
                        required
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                        placeholder="e.g., 100"
                    />
                </div>
                <div className="flex gap-3 md:col-start-3">
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setFormData({ name: '', stockQuantity: 0 }); }}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {editingId ? 'Update Material' : 'Add Material'}
                    </button>
                </div>
            </form>

            {content}
        </div>
    );
};