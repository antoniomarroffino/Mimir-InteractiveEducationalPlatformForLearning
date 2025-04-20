import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaceFrownIcon } from '@heroicons/react/24/solid';

interface TimeExpiredPopupProps {
    onConfirm?: () => void;
}

export const TimeExpiredPopup: React.FC<TimeExpiredPopupProps> = ({ onConfirm }) => {
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
                        <FaceFrownIcon className="w-12 h-12 text-white animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">⏰ Time's up!</h2>
                    <p className="text-md mb-4">
                        The quiz has been automatically submitted.<br />
                        We hope you enjoyed it! 🎯
                    </p>
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-error transition"
                        >
                            View Results
                        </button>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
