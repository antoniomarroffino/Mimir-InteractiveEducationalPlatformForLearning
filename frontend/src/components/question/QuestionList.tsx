import React from "react";
import { MultipleChoiceQuestionDTO, QuestionDTO, TrueFalseQuestionDTO } from '@dti-isin/backend-api-client';
import { QuestionElement } from './QuestionElement';

type SpecificQuestionDTO =
    | QuestionDTO
    | TrueFalseQuestionDTO
    | MultipleChoiceQuestionDTO;

interface QuestionsListProps {
    questions: SpecificQuestionDTO[];
    onStartEditing?: (question: SpecificQuestionDTO) => void;
    onDeleteQuestion?: (questionId: string) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
                                                                questions,
                                                                onStartEditing,
                                                                onDeleteQuestion
                                                            }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Questions</h2>

            {questions.length === 0 ? (
                <p className="text-center text-base-content/70">
                    No questions yet
                </p>
            ) : (
                <div className="space-y-2">
                    {questions.map((question, index) => (
                        <QuestionElement
                            key={question.id}
                            question={question}
                            index={index}
                            onDelete={onDeleteQuestion}
                            onStartEditing={() => onStartEditing?.(question)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};