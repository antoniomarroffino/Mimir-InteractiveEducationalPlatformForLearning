import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsTrash } from 'react-icons/bs';

interface DeleteQuestionBankDialogProps {
    isOpen: boolean;
    questionBankName: string;
    questionCount: number;
    onCancel: () => void;
    onConfirm: () => void;
}

export const DeleteQuestionBankDialog: React.FC<DeleteQuestionBankDialogProps> = ({
                                                                                      isOpen,
                                                                                      questionBankName,
                                                                                      questionCount,
                                                                                      onCancel,
                                                                                      onConfirm,
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
                        className="bg-base-100 rounded-xl shadow-2xl max-w-md w-full p-6 border border-error/20"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full bg-error/10 text-error">
                                <BsTrash className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-bold">Confirm Deletion</h3>
                        </div>

                        <p className="text-base-content/80 mb-6">
                            You're about to permanently delete <strong>{questionBankName}</strong> and all its {questionCount} questions.
                            <span className="block mt-2 text-error/80">This action cannot be undone!</span>
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="btn btn-ghost"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error gap-2"
                                onClick={onConfirm}
                            >
                                <BsTrash />
                                Delete Permanently
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
