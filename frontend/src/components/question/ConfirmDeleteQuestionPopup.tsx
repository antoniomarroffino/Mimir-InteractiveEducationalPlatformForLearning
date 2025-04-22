import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ExclamationTriangleIcon} from '@heroicons/react/24/solid';

interface ConfirmDeleteQuestionPopupProps {
    questionText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDeleteQuestionPopup: React.FC<ConfirmDeleteQuestionPopupProps> = ({
                                                                                          questionText,
                                                                                          onConfirm,
                                                                                          onCancel
                                                                                      }) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <motion.div
                    className="bg-base-100 rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-4 border-error"
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.9, opacity: 0}}
                    transition={{duration: 0.3}}
                >
                    <div className="flex justify-center mb-4">
                        <ExclamationTriangleIcon className="w-12 h-12 text-error animate-bounce"/>
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-error">Confirm Deletion</h2>
                    <p className="text-base-content/70 mb-4">
                        Are you sure you want to permanently delete
                        {questionText ? ` the question "${questionText}"?` : ' this question?'}
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={onCancel} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="btn btn-error">
                            Delete
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
