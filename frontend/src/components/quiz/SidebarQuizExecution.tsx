import React from 'react';
import { QuestionDTO, QuestionResponseDTO } from '@dti-isin/backend-api-client';
import { RemainingTimeIndicator } from './RemainingTimeIndicator';
import { QuizNavigation } from './QuizNavigation';

interface SidebarQuizExecutionProps {
    timeRemaining: number | null;
    questions: QuestionDTO[];
    currentQuestionIndex: number;
    onQuestionChange: (index: number) => void;
    onCompleteQuiz: () => void;
    userResponses: QuestionResponseDTO[];
}

export const SidebarQuizExecution: React.FC<SidebarQuizExecutionProps> = ({
                                                                              timeRemaining,
                                                                              questions,
                                                                              currentQuestionIndex,
                                                                              onQuestionChange,
                                                                              onCompleteQuiz,
                                                                              userResponses
                                                                          }) => {
    return (
        <div className="hidden md:block w-[300px] sticky top-[5rem] max-h-[calc(100vh-5rem)] overflow-y-auto border-l border-base-300 pl-4">
            {timeRemaining !== null && (
                <div className="flex justify-end mb-4 px-2 pt-2">
                    <RemainingTimeIndicator timeRemaining={timeRemaining} />
                </div>
            )}

            <QuizNavigation
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                onQuestionChange={onQuestionChange}
                onCompleteQuiz={onCompleteQuiz}
                userResponses={userResponses}
            />
        </div>
    );
};
