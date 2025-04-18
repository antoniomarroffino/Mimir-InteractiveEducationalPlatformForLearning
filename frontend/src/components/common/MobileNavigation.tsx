import { XMarkIcon } from "@heroicons/react/24/solid";
import { QuizNavigation } from "../quiz/QuizNavigation";
import React from "react";
import { QuestionDTO, QuestionResponseDTO } from "@dti-isin/backend-api-client";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
    questions: QuestionDTO[];
    currentQuestionIndex: number;
    onQuestionChange: (index: number) => void;
    onCompleteQuiz: () => void;
    userResponses: QuestionResponseDTO[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      questions,
                                                                      currentQuestionIndex,
                                                                      onQuestionChange,
                                                                      onCompleteQuiz,
                                                                      userResponses
                                                                  }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay scuro per chiusura fuori dal pannello */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Sidebar mobile visibile solo su mobile */}
                    <motion.div
                        className="fixed inset-y-0 right-0 w-full max-w-sm z-50 bg-base-100 md:hidden flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation panel"
                    >
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold">Navigation</h3>
                            <button
                                onClick={onClose}
                                className="btn btn-ghost btn-circle"
                                aria-label="Close navigation"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <QuizNavigation
                                questions={questions}
                                currentQuestionIndex={currentQuestionIndex}
                                onQuestionChange={onQuestionChange}
                                onCompleteQuiz={onCompleteQuiz}
                                userResponses={userResponses}
                            />
                        </div>

                        {/* Azione principale (es. Fine quiz) */}
                        <div className="p-4 border-t">
                            <button
                                className="btn btn-primary w-full"
                                onClick={() => {
                                    onCompleteQuiz();
                                    onClose();
                                }}
                            >
                                Complete Quiz
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
