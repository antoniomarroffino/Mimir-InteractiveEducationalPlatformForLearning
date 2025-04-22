import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsBoxArrowRight } from 'react-icons/bs';

interface LeaveCoursePopupProps {
    courseName: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const LeaveCoursePopup: React.FC<LeaveCoursePopupProps> = ({
                                                                      courseName,
                                                                      onCancel,
                                                                      onConfirm,
                                                                  }) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-warning text-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-4 border-white relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-center mb-4">
                        <BsBoxArrowRight className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Leave Course</h2>
                    <p className="text-md mb-4">
                        Are you sure you want to leave <strong>{courseName}</strong>?<br />
                        You will lose access until you rejoin.
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={onCancel}
                            className="btn btn-ghost border border-white text-white hover:bg-white hover:text-warning"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-white text-warning bg-white hover:brightness-90"
                        >
                            <BsBoxArrowRight className="mr-1" />
                            Leave
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
