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
            alert('O produto precisa de ao menos uma matéria-prima.');
            return;
        }

        // Mapeia os materiais do formulário para o formato esperado pelo backend
        const materialsToSend = formData.materials.map(material => {
            if (material.rawMaterialId === '') {
                throw new Error('Por favor, selecione uma matéria-prima para todas as entradas.');
            }
            if (material.quantity <= 0) {
                throw new Error('A quantidade da matéria-prima deve ser positiva.');
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
            setFormData(initialFormState);
            setEditingId(null);
        } catch (err: any) {
            // Extrai a mensagem de erro da resposta da API (ajuste se o formato for diferente)
            const errorMessage = err?.message || 'Falha ao salvar o produto. Verifique os dados e tente novamente.';
            alert(`Erro: ${errorMessage}`);
            console.error("Falha ao salvar produto:", err);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            materials: product.materials.map(pm => ({
                rawMaterialId: pm.material.id,
                quantity: pm.quantityRequired,
            }))
        });
    };

    const handleMaterialIdChange = (index: number, newId: string) => {
        const newMaterials = [...formData.materials];
        newMaterials[index] = { ...newMaterials[index], rawMaterialId: newId === '' ? '' : Number(newId) };
        setFormData({ ...formData, materials: newMaterials });
    };

    const handleMaterialQuantityChange = (index: number, newQuantity: string) => {
        const newMaterials = [...formData.materials];
        // Prevent non-numeric input from breaking the state
        const quantity = Number(newQuantity);
        newMaterials[index] = { ...newMaterials[index], quantity: isNaN(quantity) ? 0 : quantity };
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

    // Ordena os produtos do mais caro para o mais barato
    const sortedProducts = [...(products || [])]
        .filter(product => product && product.id != null && product.name)
        .sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

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
                        {sortedProducts.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${(product.price ?? 0).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => dispatch(deleteProduct(product.id))} className="text-red-600 hover:text-red-900">Delete</button>
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
        content = <p>{error}</p>;
    }

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{editingId ? 'Edit Product' : 'Create Product'}</h2>

            <form onSubmit={handleSubmit} className="mb-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                            value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="9.99" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Raw Materials</h3>
                    <div className="space-y-2">
                        {formData.materials.map((material, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <select
                                    value={material.rawMaterialId}
                                    onChange={(e) => handleMaterialIdChange(index, e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                >
                                    <option value="">Select a material</option>
                                    {rawMaterials.map(rm => (
                                        <option key={rm.id} value={rm.id}>{rm.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    value={material.quantity}
                                    onChange={(e) => handleMaterialQuantityChange(index, e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                />
                                <button type="button" onClick={() => removeMaterialRow(index)} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addMaterialRow} className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                        Add Material
                    </button>
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        {editingId ? 'Update Product' : 'Create Product'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setFormData(initialFormState); }}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <hr className="my-6" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Product List</h2>
            {content}
        </div>
    );
};