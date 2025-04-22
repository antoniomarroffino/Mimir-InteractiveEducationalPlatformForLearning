import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsTrash } from 'react-icons/bs';

interface DeleteFolderPopupProps {
    isOpen: boolean;
    folderNames: string[];
    onCancel: () => void;
    onConfirm: () => void;
}

export const DeleteFolderPopup: React.FC<DeleteFolderPopupProps> = ({
                                                                        isOpen,
                                                                        folderNames,
                                                                        onCancel,
                                                                        onConfirm
                                                                    }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-error text-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-4 border-white relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-center mb-4">
                            <BsTrash className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Delete Folders</h2>
                        <p className="text-md mb-4">
                            You're about to permanently delete the following folder{folderNames.length > 1 ? 's' : ''}:
                        </p>

                        <ul className="text-sm text-white/90 mb-4 max-h-40 overflow-y-auto text-left list-disc list-inside">
                            {folderNames.map((name, idx) => (
                                <li key={idx}>{name}</li>
                            ))}
                        </ul>

                        <p className="text-sm mb-6 italic">
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={onCancel}
                                className="btn btn-ghost border border-white text-white hover:bg-white hover:text-error"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="btn btn-white text-error bg-white hover:brightness-90"
                            >
                                <BsTrash className="mr-1" />
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
