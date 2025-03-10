import { QuestionDTO } from '@dti-isin/backend-api-client';
import React from "react";

interface QuestionsListProps {
    questions: QuestionDTO[];
    onDeleteQuestion: (questionId: string) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
                                                                questions,
                                                                onDeleteQuestion
                                                            }) => (
    <div>
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        {questions.length === 0 ? (
            <p className="text-center text-base-content/70">
                No questions yet
            </p>
        ) : (
            <div className="space-y-2">
                {questions.map((question, index) => (
                    <div
                        key={question.id}
                        className="flex justify-between items-center p-2 bg-base-200 rounded"
                    >
                        <span>{index + 1}. {question.questionText}</span>
                        <button
                            className="btn btn-xs btn-error"
                            onClick={() => question.id && onDeleteQuestion(question.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
);