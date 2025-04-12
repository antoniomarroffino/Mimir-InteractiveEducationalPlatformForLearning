import React from 'react';
import {QuizAttemptDTO, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {QuizResultHeader} from './QuizResultHeader';
import {QuizScoreStats} from './QuizScoreStats';
import {QuestionResult} from '../response/QuestionResult';
import {checkIfAnswered, isResponseCorrect} from '../../utils/responseUtils';
import {
    calculateEarnedPoints,
    calculateTotalAvailablePoints,
    getQuestionEarnedPoints,
    getQuestionTotalPoints
} from '../../utils/scoreUtils';

interface QuizReviewProps {
    attempt: QuizAttemptDTO;
    publication: QuizPublicationDTO;
    onClose?: () => void;
    showHeader?: boolean;
    showStats?: boolean;
    CustomHeader?: React.ComponentType<{
        attempt: QuizAttemptDTO;
        publication: QuizPublicationDTO;
        score: number;
        totalQuestions: number;
    }>;
}

export const QuizReview: React.FC<QuizReviewProps> = ({
                                                          attempt,
                                                          publication,
                                                          onClose,
                                                          showHeader = true,
                                                          showStats = true,
                                                          CustomHeader
                                                      }) => {
    const earnedPoints = calculateEarnedPoints(attempt);
    const totalPoints = calculateTotalAvailablePoints(publication);
    const totalQuestions = publication.questions?.length || 0;

    return (
        <div className="space-y-8">
            {CustomHeader ? (
                <CustomHeader
                    attempt={attempt}
                    publication={publication}
                    score={earnedPoints}
                    totalQuestions={totalQuestions}
                />
            ) : showHeader && (
                <QuizResultHeader
                    earnedPoints={earnedPoints}
                    totalPoints={totalPoints}
                    totalQuestions={totalQuestions}
                />
            )}

            {showStats && (
                <QuizScoreStats
                    earnedPoints={earnedPoints}
                    totalPoints={totalPoints}
                    totalQuestions={totalQuestions}
                />
            )}

            <div className="space-y-6">
                {publication.questions?.map((question) => {
                    const response = attempt.responses?.find(r => r.questionId === question.id);
                    const isAnswered = checkIfAnswered(question, response);
                    const correct = isAnswered && response ? isResponseCorrect(question, response) : false;

                    return (
                        <QuestionResult
                            key={question.id}
                            question={question}
                            response={response}
                            isAnswered={isAnswered}
                            isCorrect={correct}
                            earnedPoints={getQuestionEarnedPoints(response)}
                            totalPoints={getQuestionTotalPoints(question)}
                        />
                    );
                })}
            </div>

            {onClose && (
                <div className="text-center">
                    <button onClick={onClose} className="btn btn-primary">
                        Close revision
                    </button>
                </div>
            )}
        </div>
    );
};