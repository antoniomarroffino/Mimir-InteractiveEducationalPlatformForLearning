import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaceFrownIcon } from "@heroicons/react/24/solid";
import { QuizDTO } from "@dti-isin/backend-api-client";

interface DeleteQuizPopupProps {
    quiz: QuizDTO;
    onConfirm: () => void;
    onCancel: () => void;
    error?: string | null;
}

export const DeleteQuizPopup: React.FC<DeleteQuizPopupProps> = ({
                                                                    quiz,
                                                                    onConfirm,
                                                                    onCancel,
                                                                    error,
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
                    className="bg-error text-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-4 border-white relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-center mb-4">
                        <FaceFrownIcon className="w-12 h-12 text-white animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Delete Quiz</h2>
                    <p className="text-md mb-4">
                        Are you sure you want to permanently delete <br />
                        <span className="font-semibold">"{quiz.name}"</span>?
                    </p>

                    {error && <p className="text-sm text-white/70 mb-2">{error}</p>}

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={onCancel}
                            className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-error transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-sm btn-white bg-white text-error hover:brightness-95 transition"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
