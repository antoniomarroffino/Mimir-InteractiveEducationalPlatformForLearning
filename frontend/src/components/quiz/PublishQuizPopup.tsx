import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BsRocket, BsShieldLock, BsPersonCheck } from 'react-icons/bs';
import { QuizDTO } from '@dti-isin/backend-api-client';

interface PublishQuizPopupProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
    isAnonymous: boolean;
    setIsAnonymous: (value: boolean) => void;
    onClose: () => void;
    onConfirm: () => void;
    isCreating: boolean;
    error?: string | null;
}

export const PublishQuizPopup: React.FC<PublishQuizPopupProps> = ({
                                                                      quiz,
                                                                      isAnonymous,
                                                                      setIsAnonymous,
                                                                      onClose,
                                                                      onConfirm,
                                                                      isCreating,
                                                                      error
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
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-4 border-primary/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-center mb-4">
                        <BsRocket className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-primary">Publish Quiz</h2>
                    <p className="text-base mb-4 text-base-content/70">
                        Are you sure you want to publish <strong>"{quiz.name}"</strong>?<br />
                        It will become accessible to students via a unique code.
                    </p>

                    {error && (
                        <div className="alert alert-error text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div className="bg-base-100 rounded-lg p-4 shadow-sm mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <BsShieldLock className={`text-lg ${isAnonymous ? 'text-secondary' : 'text-primary'}`} />
                                <span className="font-medium text-sm text-base-content/70">
                                    Allow anonymous access
                                </span>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={isAnonymous}
                                onChange={() => setIsAnonymous(!isAnonymous)}
                            />
                        </div>

                        <div className={`mt-3 p-3 rounded-lg ${isAnonymous ? 'bg-secondary/10 border-l-4 border-secondary' : 'bg-error/10 border-l-4 border-error'}`}>
                            <div className="flex items-center gap-2">
                                <BsPersonCheck className={isAnonymous ? 'text-secondary' : 'text-error'} />
                                <p className={`font-semibold text-sm ${isAnonymous ? 'text-secondary' : 'text-error'}`}>
                                    {isAnonymous
                                        ? 'Students can take the quiz without logging in.'
                                        : 'Students must log in to access the quiz.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-primary"
                            disabled={isCreating}
                        >
                            {isCreating ? <span className="loading loading-spinner" /> : 'Publish'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
