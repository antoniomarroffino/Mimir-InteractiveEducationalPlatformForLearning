import { QuestionDTO, QuestionResponseDTO } from "@dti-isin/backend-api-client";
import {JSX} from "react";

export interface ResponseStrategy {
    renderResponse(props: ResponseProps): JSX.Element;
}

export interface ResponseProps {
    question: QuestionDTO;
    response?: QuestionResponseDTO;
    isAnswered: boolean;
}