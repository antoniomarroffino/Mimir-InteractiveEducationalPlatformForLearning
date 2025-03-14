import React from 'react';
import {QuizDTO} from '@dti-isin/backend-api-client';
import {QuizRow} from './QuizRow';

interface QuizListProps {
    quizzes: QuizDTO[];
    courseId: string;
    folderId: string;
}

export const QuizList: React.FC<QuizListProps> = ({
                                                      quizzes,
                                                      courseId,
                                                      folderId
                                                  }) => {
    if (quizzes.length === 0) {
        return (
            <p className="text-center text-base-content/70">
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
                    folderId={folderId}/>
            ))}
        </div>
    );
};