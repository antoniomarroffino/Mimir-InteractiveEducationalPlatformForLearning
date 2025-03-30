import React from 'react';
import {
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    TrueFalseQuestionDTO,
    MultipleChoiceQuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO
} from '@dti-isin/backend-api-client';
import {TrueFalseQuestionResultCard} from "./TrueFalseQuestionResultCard.tsx";
import {MultipleChoiceQuestionResultCard} from "./MultipleChoiceQuestionResultCard.tsx";

interface QuestionResultCardProps {
    question: QuestionDTO;
    response: QuestionResponseDTO;
    index: number;
}

export const QuestionResultCard: React.FC<QuestionResultCardProps> = (props) => {
    switch (props.question.type) {
        case QuestionType.TrueFalse:
            return <TrueFalseQuestionResultCard
                question={props.question as TrueFalseQuestionDTO}
                response={props.response as TrueFalseQuestionResponseDTO}
                index={props.index}
            />;
        case QuestionType.MultipleChoice:
            return <MultipleChoiceQuestionResultCard
                question={props.question as MultipleChoiceQuestionDTO}
                response={props.response as MultipleChoiceQuestionResponseDTO}
                index={props.index}
            />;
        default:
            return null;
    }
};