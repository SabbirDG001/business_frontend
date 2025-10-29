import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Product, 'id' | 'popularity' | 'gallery'> & { gallery: string }) => void;
    initialData?: Product | null;
}

type FormData = Omit<Product, 'id' | 'popularity' | 'gallery'> & { gallery: string };

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        category: 'sneakers',
        price: 0,
        description: '',
        imageUrl: '',
        gallery: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                gallery: initialData.gallery.join(', '),
            });
        } else {
             setFormData({
                name: '',
                category: 'sneakers',
                price: 0,
                description: '',
                imageUrl: '',
                gallery: '',
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    }

    const inputStyleClasses = "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-shrain-purple";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div className="absolute inset-0 bg-black/60 cursor-pointer" onClick={onClose}></div>
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-shrain-dark-gray rounded-lg shadow-xl max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={`mt-1 block w-full ${inputStyleClasses}`} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} required className={`mt-1 block w-full ${inputStyleClasses}`}>
                                    <option value="sneakers">Sneakers</option>
                                    <option value="glow">Glow</option>
                                    <option value="lamps">Lamps</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Price</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className={`mt-1 block w-full ${inputStyleClasses}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className={`mt-1 block w-full ${inputStyleClasses}`}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Main Image URL</label>
                                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className={`mt-1 block w-full ${inputStyleClasses}`} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Gallery Image URLs (comma-separated)</label>
                                <input type="text" name="gallery" value={formData.gallery} onChange={handleChange} className={`mt-1 block w-full ${inputStyleClasses}`} />
                            </div>
                        </form>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                            <button onClick={handleSubmit} type="submit" className="px-4 py-2 bg-shrain-purple text-white rounded-md hover:bg-shrain-purple/80">{initialData ? 'Save Changes' : 'Add Product'}</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProductFormModal;