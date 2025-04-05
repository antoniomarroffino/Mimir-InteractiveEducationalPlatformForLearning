import React from 'react';
import { QuizAttemptDTO, QuizPublicationDTO } from '@dti-isin/backend-api-client';
import { AttemptHeader } from './AttemptHeader';
import { checkIfAnswered, isResponseCorrect } from '../../utils/responseUtils';
import {QuestionResult} from "../response/QuestionResult.tsx";

interface AttemptDetailsProps {
    attempt: QuizAttemptDTO;
    publication: QuizPublicationDTO;
}

export const AttemptDetails: React.FC<AttemptDetailsProps> = ({ attempt, publication }) => {
    return (
        <div className="p-4">
            <AttemptHeader attempt={attempt} />

            <div className="space-y-6">
                {publication.questions?.map((question) => {
                    const response = attempt.responses?.find(r => r.questionId === question.id);
                    const isAnswered = checkIfAnswered(question, response);
                    const isCorrect = isAnswered && response ? isResponseCorrect(question, response) : false;

                    return (
                        <QuestionResult
                            key={question.id}
                            question={question}
                            response={response}
                            isAnswered={isAnswered}
                            isCorrect={isCorrect}
                        />
                    );
                })}
            </div>
        </div>
    );
};