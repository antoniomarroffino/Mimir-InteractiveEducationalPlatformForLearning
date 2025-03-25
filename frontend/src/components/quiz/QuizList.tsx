import React from 'react';
import {QuizDTO} from '@dti-isin/backend-api-client';
import {QuizRow} from './QuizRow';
import {useQuiz} from "../../hooks/useQuiz.ts";

interface QuizListProps {
    quizzes: QuizDTO[];
    courseId: string;
    folderId: string;
}

export const QuizList: React.FC<QuizListProps> = ({courseId, folderId}) => {
    const {quizzes} = useQuiz();

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