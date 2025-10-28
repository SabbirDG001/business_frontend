import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
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
                        className="relative w-full max-w-md bg-white dark:bg-shrain-dark-gray rounded-lg shadow-xl"
                    >
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Confirm Deletion</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-shrain-light-gray">
                                Are you sure you want to delete the product "{productName}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3 rounded-b-lg">
                            <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
                                Cancel
                            </button>
                            <button onClick={onConfirm} type="button" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;