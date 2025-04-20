import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface TimeWarningPopupProps {
    onClose: () => void;
}

export const TimeWarningPopup: React.FC<TimeWarningPopupProps> = ({ onClose }) => {
    return (
        <AnimatePresence>
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
                        <ExclamationTriangleIcon className="w-12 h-12 text-white animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">⚠️ Time is running out!</h2>
                    <p className="text-md mb-4">
                        You have less than one minute left to complete the quiz. Please review your answers and submit it now!
                    </p>
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-error transition"
                    >
                        Got it!
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
