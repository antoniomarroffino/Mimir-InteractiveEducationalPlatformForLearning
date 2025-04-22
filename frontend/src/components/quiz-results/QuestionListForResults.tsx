import React from "react";
import {QuestionDTO} from "@dti-isin/backend-api-client";
import {motion} from "framer-motion";

interface QuestionListForResultsProps {
    questions: QuestionDTO[];
}

export const QuestionListForResults: React.FC<QuestionListForResultsProps> = ({questions}) => {
    if (!questions.length) {
        return (
            <div className="w-full h-full flex items-center justify-center text-base-content/70">
                No questions available
            </div>
        );
    }

    return (
        <div className="relative h-full w-full max-w-xs">
            <div className="absolute inset-0 flex flex-col">
                <h3 className="text-sm font-semibold text-base-content/70 mb-2 px-2">
                    Questions List
                </h3>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <motion.ul
                        className="space-y-2 px-2"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                    >
                        {questions.map((q, index) => (
                            <motion.li
                                key={q.id}
                                variants={{
                                    hidden: {opacity: 0, x: -20},
                                    visible: {opacity: 1, x: 0}
                                }}
                                className="group flex items-start gap-2 p-2 bg-base-100 rounded-lg
                                         shadow-sm border border-base-200 hover:bg-base-200
                                         transition-all duration-200 hover:shadow-md"
                            >
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center
                                               bg-primary/10 rounded-full text-primary text-xs font-bold">
                                    {index + 1}
                                </span>
                                <span className="text-xs text-base-content/80 line-clamp-2 group-hover:line-clamp-none
                                               transition-all duration-200">
                                    {q.questionText}
                                </span>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </div>
        </div>
    );
};