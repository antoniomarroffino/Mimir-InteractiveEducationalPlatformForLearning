import React from 'react';
import { QuizAttemptDTO, QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { QuizResultHeader } from './QuizResultHeader';
import { QuizScoreStats } from './QuizScoreStats';
import { QuestionResult } from '../response/QuestionResult';
import { checkIfAnswered, isResponseCorrect } from '../../utils/responseUtils';
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
        <div className="space-y-6">
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
                <div className="border-y border-base-200 py-6">
                    <QuizScoreStats
                        earnedPoints={earnedPoints}
                        totalPoints={totalPoints}
                        totalQuestions={totalQuestions}
                    />
                </div>
            )}

            <div className="space-y-6">
                {publication.questions?.map((question) => {
                    const response = attempt.responses?.find(r => r.questionId === question.id);
                    const isAnswered = checkIfAnswered(question, response);
                    const correct = isAnswered && response ? isResponseCorrect(question, response) : false;

                    return (
                        <div
                            key={question.id}
                            className="border border-base-200 rounded-xl overflow-hidden"
                        >
                            <QuestionResult
                                question={question}
                                response={response}
                                isAnswered={isAnswered}
                                isCorrect={correct}
                                earnedPoints={getQuestionEarnedPoints(response)}
                                totalPoints={getQuestionTotalPoints(question)}
                            />
                        </div>
                    );
                })}
            </div>

            {onClose && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={onClose}
                        className="btn btn-primary btn-wide"
                    >
                        Close Review
                    </button>
                </div>
            )}
        </div>
    );
};