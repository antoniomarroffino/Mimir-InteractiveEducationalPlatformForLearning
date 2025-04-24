import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {BsExclamationCircle, BsCheckCircle} from 'react-icons/bs';

interface ConfirmQuizPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    unansweredQuestions: number[];
}

export const ConfirmQuizPopup: React.FC<ConfirmQuizPopupProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      onConfirm,
                                                                      unansweredQuestions
                                                                  }) => {
    if (!isOpen) return null;

    const hasUnanswered = unansweredQuestions.length > 0;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <motion.div
                    className={`${
                        hasUnanswered ? 'bg-warning' : 'bg-success'
                    } text-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border-4 border-white relative`}
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0.9, opacity: 0}}
                    transition={{duration: 0.3}}
                >
                    <div className="flex justify-center mb-4">
                        {hasUnanswered ? (
                            <BsExclamationCircle className="w-12 h-12 text-white animate-bounce"/>
                        ) : (
                            <BsCheckCircle className="w-12 h-12 text-white animate-bounce"/>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mb-4">
                        {hasUnanswered ? '⚠️ Warning!' : '✨ Ready to Submit?'}
                    </h2>

                    {hasUnanswered ? (
                        <>
                            <p className="text-md mb-4">
                                You have {unansweredQuestions.length} unanswered questions:
                            </p>
                            <div className="bg-white/10 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                                <div className="grid grid-cols-5 gap-2">
                                    {unansweredQuestions.map(questionNum => (
                                        <span key={questionNum} className="text-sm font-medium">
                                            #{questionNum}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm mb-4">
                                Are you sure you want to submit without answering these questions?
                            </p>
                        </>
                    ) : (
                        <p className="text-md mb-4">
                            You've answered all questions! Ready to submit your quiz?
                        </p>
                    )}

                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-warning"
                        >
                            Continue Quiz
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-success"
                        >
                            Submit Quiz
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};