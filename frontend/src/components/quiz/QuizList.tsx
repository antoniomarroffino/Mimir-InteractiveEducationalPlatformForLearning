import React from 'react';
import {QuizRow} from './QuizRow';
import {useGetQuizzesInFolderIdInCourseId} from "../../hooks/quiz/useGetQuizzesInFolderIdInCourseId.ts";

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
        return (
            <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-md text-primary">Is loading quizzes</span>
            </div>
        );
    }

    if (errorQuizzes) {
        return (
            <p className="text-center text-error py-4">
                Error loading quizzes
            </p>
        );
    }

    if (!quizzes?.length) {
        return (
            <p className="text-center text-base-content/70 py-4">
                No quizzes in this folder
            </p>
        );
    }

    return (
        <div className="space-y-2">
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