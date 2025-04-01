import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import {useEffect} from "react";

interface ErrorToastProps {
    message: string;
    onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="fixed bottom-4 right-4 z-50"
                onClick={onClose}
            >
                <div className="bg-error/90 text-error-content p-4 rounded-xl shadow-xl flex items-start gap-3 max-w-sm border border-error/30">
                    <FiAlertTriangle className="text-xl shrink-0" />
                    <div className="flex-1">
                        <p className="font-medium">Action not allowed</p>
                        <p className="text-sm opacity-90">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle hover:bg-error-content/10"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};