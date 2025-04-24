import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {BsChevronDown, BsChevronUp, BsClockHistory, BsPatchQuestion} from 'react-icons/bs';
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {formatMinutesDuration} from "../../utils/timeUtils";

interface QuizExecutionHeaderProps {
    quiz: QuizDTO;
    publication: QuizPublicationDTO;
    quizTimeLimit?: number | null;
}

export const QuizExecutionHeader: React.FC<QuizExecutionHeaderProps> = ({quiz, publication, quizTimeLimit}) => {
    const [showDescription, setShowDescription] = useState(false);
    const hasDescription = quiz.description && quiz.description.trim().length > 0;
    const hasTimeLimit = quizTimeLimit !== undefined && quizTimeLimit !== null;

    return (
        <header className="space-y-2 mb-2">
            <div className="bg-gradient-to-tr from-primary/5 to-base-100 border border-primary/10 p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                    <div className="flex-1 flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary">
                            <BsPatchQuestion className="w-5 h-5 sm:w-6 sm:h-6"/>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-4">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                                    {quiz.name}
                                </h1>

                                {hasDescription && (
                                    <motion.button
                                        onClick={() => setShowDescription(prev => !prev)}
                                        className="btn btn-sm btn-ghost gap-2 text-primary"
                                        whileTap={{scale: 0.95}}
                                    >
                                        {showDescription ? (
                                            <>
                                                Hide info
                                                <BsChevronUp className="w-4 h-4"/>
                                            </>
                                        ) : (
                                            <>
                                                Show info
                                                <BsChevronDown className="w-4 h-4"/>
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60">
                                <span className="flex items-center gap-1">
                                    <BsClockHistory/>
                                    {hasTimeLimit
                                        ? `Time limit: ${formatMinutesDuration(quizTimeLimit!)}`
                                        : 'No time limits'}
                                </span>
                                <span>•</span>
                                <span>
                                    Access Code: {publication.publicationCode}
                                </span>
                            </div>

                            <AnimatePresence>
                                {showDescription && hasDescription && (
                                    <motion.div
                                        initial={{opacity: 0, height: 0}}
                                        animate={{opacity: 1, height: "auto"}}
                                        exit={{opacity: 0, height: 0}}
                                        transition={{duration: 0.2}}
                                    >
                                        <p className="text-base text-base-content/80 mt-2">
                                            {quiz.description}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};