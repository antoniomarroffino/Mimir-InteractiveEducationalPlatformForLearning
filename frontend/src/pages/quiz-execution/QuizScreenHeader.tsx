import React from "react";
import {BsClockHistory, BsPatchQuestion} from "react-icons/bs";
import {QuizDTO, QuizPublicationDTO} from "@dti-isin/backend-api-client";
import {formatMinutesDuration} from "../../utils/timeUtils";

interface QuizScreenHeaderProps {
    quiz: QuizDTO;
    publication: QuizPublicationDTO;
}

export const QuizScreenHeader: React.FC<QuizScreenHeaderProps> = ({quiz, publication}) => {
    return (
        <header className="space-y-2 mb-2">
            <div className="bg-gradient-to-tr from-primary/5 to-base-100 border border-primary/10 p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                    <div className="flex-1 flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary">
                            <BsPatchQuestion className="w-5 h-5 sm:w-6 sm:h-6"/>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                                {quiz.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/60">
                                <span className="flex items-center gap-1">
                                    <BsClockHistory/>
                                    Time limit: {formatMinutesDuration(quiz.timeLimitMinutes)}
                                </span>
                                <span>•</span>
                                <span>
                                    Access Code: {publication.publicationCode}
                                </span>
                            </div>

                            {quiz.description && (
                                <p className="text-base text-base-content/80 mt-2">
                                    {quiz.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
