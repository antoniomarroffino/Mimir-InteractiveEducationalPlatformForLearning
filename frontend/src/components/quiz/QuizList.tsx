import React from 'react';
import {QuizRow} from './QuizRow';
import {useQuizList} from "../../hooks/quiz/useQuizList.ts";

interface QuizListProps {
    courseId: string;
    folderId: string;
}

export const QuizList: React.FC<QuizListProps> = ({courseId, folderId}) => {
    const {quizzes} = useQuizList();

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