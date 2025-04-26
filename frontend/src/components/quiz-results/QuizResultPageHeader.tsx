import React from "react";
import {BsPatchQuestion} from "react-icons/bs";
import {CourseDTO, FolderDTO, QuizDTO} from "@dti-isin/backend-api-client";
import {BreadcrumbQuizResult} from "./BreadcrumbQuizResult.tsx";

interface QuizResultsPageHeaderProps {
    course: CourseDTO;
    folder: FolderDTO;
    quiz: QuizDTO;
}

export const QuizResultsPageHeader: React.FC<QuizResultsPageHeaderProps> = ({
                                                                                course,
                                                                                folder,
                                                                                quiz,
                                                                            }) => {
    return (
        <header className="space-y-2 mb-2">
            <div
                className="bg-gradient-to-tr from-primary/5 to-base-100 border border-primary/10 p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl">
                <BreadcrumbQuizResult course={course} folder={folder} quiz={quiz}/>

                <div className="flex items-start gap-4 mt-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                        <BsPatchQuestion className="w-6 h-6"/>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary truncate text-start">
                            Quiz Analytics: {quiz.name}
                        </h1>
                        <p className="text-sm text-base-content/60 italic text-start">
                            Review statistics and detailed responses.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};
