import { ResponseStrategy, ResponseProps } from './ResponseStrategy';
import { MultipleChoiceQuestionDTO, MultipleChoiceQuestionResponseDTO } from '@dti-isin/backend-api-client';
import {JSX} from "react";
import {MultipleChoiceResponseView} from "./MulitpleChoiceResponseView.tsx";


export class MultipleChoiceResponseStrategy implements ResponseStrategy {
    renderResponse({ question, response, isAnswered }: ResponseProps): JSX.Element {
        const mcQuestion = question as MultipleChoiceQuestionDTO;
        const mcResponse = response as MultipleChoiceQuestionResponseDTO;

        return (
            <div className="space-y-4">
                {isAnswered && (
                    <div>
                        <h4 className="text-sm font-medium text-base-content/70 mb-2">Your Response</h4>
                        <MultipleChoiceResponseView
                            choices={mcQuestion.choices}
                            selectedIndexes={mcResponse.selectedAnswerIndexes || []}
                            correctIndexes={mcQuestion.correctAnswerIndexes}
                            showCorrect={false}
                        />
                    </div>
                )}
                <div>
                    <h4 className="text-sm font-medium text-base-content/70 mb-2">
                        {isAnswered ? 'Correct Response' : 'You did not respond - Correct responses were:'}
                    </h4>
                    <MultipleChoiceResponseView
                        choices={mcQuestion.choices}
                        selectedIndexes={mcQuestion.correctAnswerIndexes}
                        correctIndexes={mcQuestion.correctAnswerIndexes}
                        showCorrect={true}
                    />
                </div>
            </div>
        );
    }
}