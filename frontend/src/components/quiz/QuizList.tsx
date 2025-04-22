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
        return <SkeletonLoaderQuizzes/>;
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
        return <EmptyStateQuizzes/>;
    }

    return (
        <div className="space-y-4">
            {quizzes.map(quiz => (
                <QuizRow
                    key={quiz.id}
                    quiz={quiz}
                    courseId={courseId}
                    folderId={folderId}
                />
            ))}
        </div>
    );
};
