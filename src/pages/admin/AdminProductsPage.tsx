import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { useNotification } from '../../hooks/useNotification';
import ProductFormModal from '../../components/admin/ProductFormModal';
import DeleteConfirmationModal from '../../components/admin/DeleteConfirmationModal';

const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getProducts('all');
            setProducts(data);
        } catch (error) {
            addNotification({ message: 'Failed to fetch products.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteModal = (product: Product) => {
        setDeletingProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (productData: Omit<Product, 'id' | 'popularity' | 'gallery'> & { gallery: string }) => {
        const payload = {
            ...productData,
            gallery: productData.gallery.split(',').map(url => url.trim()).filter(url => url),
        }

        try {
            if (editingProduct) {
                await api.updateProduct(editingProduct.id, payload);
                addNotification({ message: 'Product updated successfully!', type: 'success' });
            } else {
                await api.addProduct(payload);
                addNotification({ message: 'Product added successfully!', type: 'success' });
            }
            setIsFormModalOpen(false);
            fetchProducts();
        } catch (error) {
            addNotification({ message: 'Failed to save product.', type: 'error' });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingProduct) return;

        try {
            await api.deleteProduct(deletingProduct.id);
            addNotification({ message: 'Product deleted successfully!', type: 'success' });
            setIsDeleteModalOpen(false);
            fetchProducts();
        } catch (error) {
            addNotification({ message: 'Failed to delete product.', type: 'error' });
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800 dark:text-white">Manage Products</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-shrain-purple text-white font-bold py-2 px-4 rounded-md hover:bg-shrain-purple/80 transition-colors"
                >
                    Add New Product
                </button>
            </div>

            <div className="bg-white dark:bg-shrain-dark-gray shadow-md rounded-lg overflow-x-auto">
                {loading ? (
                    <p className="p-4 text-center">Loading products...</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md"/></td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300 capitalize">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleOpenEditModal(product)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                                        <button onClick={() => handleOpenDeleteModal(product)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormModalOpen && (
                <ProductFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingProduct}
                />
            )}

            {isDeleteModalOpen && deletingProduct && (
                 <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    productName={deletingProduct.name}
                />
            )}
        </div>
    );
};

export default AdminProductsPage;