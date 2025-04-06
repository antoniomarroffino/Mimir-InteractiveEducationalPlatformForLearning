import React from 'react';
import { QuizAttemptDTO, QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { QuizResultHeader } from './QuizResultHeader';
import { QuizScoreStats } from './QuizScoreStats';
import { QuestionResult } from '../response/QuestionResult';
import { checkIfAnswered, isResponseCorrect } from '../../utils/responseUtils';

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
    const calculateScore = () => {
        return attempt.responses?.filter((response, index) => {
            const question = publication.questions?.[index];
            return question ? isResponseCorrect(question, response) : false;
        }).length || 0;
    };

    const totalQuestions = publication.questions?.length || 0;
    const score = calculateScore();

    return (
        <div className="space-y-8">
            {CustomHeader ? (
                <CustomHeader
                    attempt={attempt}
                    publication={publication}
                    score={score}
                    totalQuestions={totalQuestions}
                />
            ) : showHeader && (
                <QuizResultHeader
                    score={score}
                    totalQuestions={totalQuestions}
                />
            )}

            {showStats && (
                <QuizScoreStats
                    score={score}
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
                        />
                    );
                })}
            </div>

            {onClose && (
                <div className="text-center">
                    <button
                        onClick={onClose}
                        className="btn btn-primary"
                    >
                        Close revision
                    </button>
                </div>
            )}
        </div>
    );
};