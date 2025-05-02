import {QuestionType} from '@dti-isin/backend-api-client';
import {ResponseStrategy} from './ResponseStrategy';
import {TrueFalseResponseStrategy} from './TrueFalseResponseStrategy';
import {MultipleChoiceResponseStrategy} from './MultipleChoiceResponseStrategy';

export class ResponseStrategyFactory {
    static createStrategy(questionType: QuestionType): ResponseStrategy {
        switch (questionType) {
            case QuestionType.TrueFalse:
                return new TrueFalseResponseStrategy();
            case QuestionType.MultipleChoice:
                return new MultipleChoiceResponseStrategy();
            default:
                throw new Error(`Unsupported question type: ${questionType}`);
        }
    }
}