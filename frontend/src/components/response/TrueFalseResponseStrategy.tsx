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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isAnswered && (
                    <div>
                        <h4 className="font-medium mb-2">Your Response</h4>
                        <TrueFalseResponseView
                            isCorrect={isCorrect}
                            answer={trueFalseResponse.selectedAnswer!}
                        />
                    </div>
                )}
                <div>
                    <h4 className="font-medium mb-2">
                        {isAnswered ? 'Correct Response' : 'You did not respond - Correct was:'}
                    </h4>
                    <TrueFalseResponseView
                        isCorrect={true}
                        answer={trueFalseQuestion.correctAnswer}
                    />
                </div>
            </div>
        );
    }
}