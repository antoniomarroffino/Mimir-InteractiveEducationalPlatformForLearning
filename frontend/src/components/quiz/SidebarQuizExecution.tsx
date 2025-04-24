import React, {useEffect, useState} from 'react';
import {QuestionDTO, QuestionResponseDTO, QuizAttemptDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {RemainingTimeIndicator} from './RemainingTimeIndicator';
import {QuizNavigation} from './QuizNavigation';
import {NavigationToggleButton} from '../common/NavigationToggleButton';
import {TimeWarningPopup} from './TimeWarningPopup';
import {NavigateFunction} from 'react-router-dom';
import {useCountdownTimer} from "../../hooks/quizAttempt/useCountdownTimer.ts";

interface SidebarQuizExecutionProps {
    quizTimeLimit?: number | null;
    questions: QuestionDTO[];
    currentQuestionIndex: number;
    onQuestionChange: (index: number) => void;
    onCompleteQuiz: () => void;
    userResponses: QuestionResponseDTO[];
    updateQuizAttemptResponses: (responses: QuestionResponseDTO[]) => void;
    completeQuizAttempt: (responses: QuestionResponseDTO[]) => Promise<QuizAttemptDTO>;
    publication: QuizPublicationDTO;
    navigate: NavigateFunction;
    onMinuteLeft: () => void;
    onExpire: () => void;
}

export const SidebarQuizExecution: React.FC<SidebarQuizExecutionProps> = ({
                                                                              quizTimeLimit,
                                                                              questions,
                                                                              currentQuestionIndex,
                                                                              onQuestionChange,
                                                                              onCompleteQuiz,
                                                                              userResponses,
                                                                              onMinuteLeft,
                                                                              onExpire
                                                                          }) => {
    const [showNavigation, setShowNavigation] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isDesktop, setIsDesktop] = useState<boolean>(
        typeof window !== 'undefined' && window.innerWidth >= 768
    );

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const timeRemaining = useCountdownTimer({
        durationSeconds: quizTimeLimit ? quizTimeLimit * 60 : undefined,

        onMinuteLeft: () => {
            setShowPopup(true);
            onMinuteLeft();
        },
        onExpire: () => {
            onExpire();
        }
    });

    return (
        <div
            className={`bg-base-100 px-4 py-2 md:py-4 ${
                isDesktop
                    ? 'w-[300px] sticky top-[5rem] max-h-[calc(100vh-5rem)] overflow-y-auto border-l border-base-300'
                    : 'w-full border-b border-base-300 mb-4'
            }`}
        >
            {!isDesktop && (
                <div className="flex justify-between items-center min-h-[56px]">
                    {timeRemaining && (<RemainingTimeIndicator timeRemaining={timeRemaining!}/>)}
                    <NavigationToggleButton
                        isOpen={showNavigation}
                        onClick={() => setShowNavigation(prev => !prev)}
                    />
                </div>
            )}

            {timeRemaining && isDesktop && (
                <div className="flex justify-end mb-4 px-2 pt-2">
                    <RemainingTimeIndicator timeRemaining={timeRemaining!}/>
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

            {timeRemaining && showPopup && <TimeWarningPopup onClose={() => setShowPopup(false)}/>}
        </div>
    );
};
