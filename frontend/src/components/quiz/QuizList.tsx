import React from 'react';
import {QuizRow} from './QuizRow';
import {useGetQuizzesInFolderIdInCourseId} from "../../hooks/quiz/useGetQuizzesInFolderIdInCourseId.ts";
import {ErrorAlert} from "../common/ErrorAlert.tsx";
import {EmptyStateQuizzes} from "./EmptyStateQuizzes.tsx";
import {SkeletonLoaderQuizzes} from "./SkeletonLoaderQuizzes.tsx";

interface QuizListProps {
    courseId: string;
    folderId: string;
}

export const QuizList: React.FC<QuizListProps> = ({courseId, folderId}) => {
    const {
        data: quizzes,
        isLoading: isLoadingQuizzes,
        error: errorQuizzes
    } = useGetQuizzesInFolderIdInCourseId(courseId, folderId);

    if (isLoadingQuizzes) {
        return <SkeletonLoaderQuizzes />;
    }

    if (errorQuizzes) {
        return (
            <ErrorAlert
                title="Failed to load quizzes"
                message={errorQuizzes.message}
            />
        );
    }

    if (!quizzes?.length) {
        return <EmptyStateQuizzes />;
    }

    return (
        <div className="flex flex-col gap-4 w-full overflow-x-hidden">
            {quizzes.map(quiz => (
                <div className="min-w-0">
                    <QuizRow
                        key={quiz.id}
                        quiz={quiz}
                        courseId={courseId}
                        folderId={folderId}
                    />
                </div>
            ))}
        </div>

    );
};
