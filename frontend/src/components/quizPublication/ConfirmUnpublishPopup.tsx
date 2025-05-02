import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {FaInfoCircle, FaPowerOff} from 'react-icons/fa';

interface ConfirmUnpublishPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const ConfirmUnpublishPopup: React.FC<ConfirmUnpublishPopupProps> = ({
                                                                                isOpen,
                                                                                onClose,
                                                                                onConfirm,
                                                                                isLoading = false,
                                                                            }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className="bg-error text-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-4 border-white relative"
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.9, opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <div className="flex justify-center mb-4">
                            <FaPowerOff className="w-10 h-10 text-white animate-pulse"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Deactivate Publication</h2>
                        <p className="text-sm mb-4">
                            Are you sure you want to deactivate this quiz publication?
                            <br/>
                            Students will no longer be able to access it.
                        </p>

                        <div
                            className="alert alert-warning text-white bg-warning/10 border-l-4 border-warning mb-6 py-2 px-4 text-sm">
                            <FaInfoCircle className="mr-2"/>
                            <span>This action cannot be undone.</span>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={onClose}
                                className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-error transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="btn btn-sm bg-white text-error hover:brightness-90 transition"
                            >
                                {isLoading ? (
                                    <span className="loading loading-spinner"/>
                                ) : (
                                    'Deactivate'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
