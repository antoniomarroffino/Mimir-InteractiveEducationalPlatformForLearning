import  {JSX} from 'react';
import { ResponseStrategy, ResponseProps } from './ResponseStrategy';
import { TrueFalseQuestionDTO, TrueFalseQuestionResponseDTO } from '@dti-isin/backend-api-client';
import { TrueFalseResponseView } from './TrueFalseResponseView';

export class TrueFalseResponseStrategy implements ResponseStrategy {
    renderResponse({ question, response, isAnswered }: ResponseProps): JSX.Element {
        const trueFalseQuestion = question as TrueFalseQuestionDTO;
        const trueFalseResponse = response as TrueFalseQuestionResponseDTO;
        const isCorrect = isAnswered &&
            trueFalseResponse.selectedAnswer === trueFalseQuestion.correctAnswer;

        return (
            <div className="space-y-3">
                <div className="flex gap-4">
                    {isAnswered && (
                        <TrueFalseResponseView
                            isCorrect={isCorrect}
                            answer={trueFalseResponse.selectedAnswer!}
                            label="Your answer"
                        />
                    )}
                    <TrueFalseResponseView
                        isCorrect={true}
                        answer={trueFalseQuestion.correctAnswer}
                        label="Correct answer"
                        highlight={!isAnswered || !isCorrect}
                    />
                </div>
                {isAnswered && !isCorrect && (
                    <div className="text-xs text-error/70 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                        Your answer was incorrect
                    </div>
                )}
            </div>
        );
    }
}
