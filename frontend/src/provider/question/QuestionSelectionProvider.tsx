import React, {useState} from "react";
import {QuestionSelectionContext} from "../../contexts/question/QuestionSelectionContext.ts";
import { QuestionDTO } from "@dti-isin/backend-api-client/dist/models/question-dto";

export const QuestionSelectionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionDTO | null>(null);


    const value = {

    }

    return (
      <QuestionSelectionContext.Provider value={value}>
          {children}
      </QuestionSelectionContext.Provider>
    );
}