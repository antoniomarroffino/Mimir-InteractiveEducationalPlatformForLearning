import React, { useState, useEffect } from 'react';
import { QuestionDTO, QuestionResponseDTO } from '@dti-isin/backend-api-client';
import { RemainingTimeIndicator } from './RemainingTimeIndicator';
import { QuizNavigation } from './QuizNavigation';
import { NavigationToggleButton } from '../common/NavigationToggleButton.tsx';

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
    const [showNavigation, setShowNavigation] = useState(false);
    const [isDesktop, setIsDesktop] = useState<boolean>(
        typeof window !== 'undefined' && window.innerWidth >= 768
    );

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`bg-base-100 px-4 py-2 md:py-4 ${isDesktop ? 'w-[300px] sticky top-[5rem] max-h-[calc(100vh-5rem)] overflow-y-auto border-l border-base-300' : 'w-full border-b border-base-300 mb-4'}`}>
            {/* Mobile layout */}
            {!isDesktop && (
                <div className="flex justify-between items-center min-h-[56px]">
                    {typeof timeRemaining === 'number' && (
                        <RemainingTimeIndicator timeRemaining={timeRemaining} />
                    )}
                    <NavigationToggleButton
                        isOpen={showNavigation}
                        onClick={() => setShowNavigation(prev => !prev)}
                    />
                </div>
            )}

            {/* Desktop layout */}
            {isDesktop && typeof timeRemaining === 'number' && (
                <div className="flex justify-end mb-4 px-2 pt-2">
                    <RemainingTimeIndicator timeRemaining={timeRemaining} />
                </div>
            )}

            {(showNavigation || isDesktop) && (
                <div className="mt-4 md:mt-0 w-full">
                    <QuizNavigation
                        questions={questions}
                        currentQuestionIndex={currentQuestionIndex}
                        onQuestionChange={onQuestionChange}
                        onCompleteQuiz={onCompleteQuiz}
                        userResponses={userResponses}
                    />
                </div>
            )}
        </div>
    );
};
