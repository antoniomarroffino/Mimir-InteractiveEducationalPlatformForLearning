import {QuestionDTO, QuestionType, TrueFalseQuestionDTO} from '@dti-isin/backend-api-client';
import React from "react";

type SpecificQuestionDTO =
    | QuestionDTO
    | TrueFalseQuestionDTO;

interface QuestionsListProps {
    questions: SpecificQuestionDTO[];
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
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{index + 1}. {question.questionText}</span>
                                <span className="badge badge-primary">
                                    {question.type}
                                </span>
                            </div>

                            {/* Dettagli specifici per TRUE/FALSE */}
                            {question.type === QuestionType.TrueFalse && (
                                <div className="text-sm text-base-content/70 mt-1">
                                    Correct
                                    Answer: {(question as TrueFalseQuestionDTO).correctAnswer ? 'True' : 'False'}
                                </div>
                            )}

                            {/* Aggiungi altri tipi di domande in futuro */}
                        </div>

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