import React from "react";
import { MultipleChoiceQuestionDTO, QuestionDTO, TrueFalseQuestionDTO } from '@dti-isin/backend-api-client';
import { QuestionElement } from './QuestionElement';

type SpecificQuestionDTO =
    | QuestionDTO
    | TrueFalseQuestionDTO
    | MultipleChoiceQuestionDTO;

interface QuestionsListProps {
    questions: SpecificQuestionDTO[];
    onEditQuestion?: (question: SpecificQuestionDTO) => void;
    onDeleteQuestion?: (questionId: string) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
                                                                questions,
                                                                onEditQuestion,
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
                            onEdit={onEditQuestion}
                            onDelete={onDeleteQuestion}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};