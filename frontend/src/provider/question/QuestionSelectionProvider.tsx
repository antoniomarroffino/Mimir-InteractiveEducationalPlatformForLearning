import React, {useState} from "react";
import {QuestionSelectionContext} from "../../contexts/question/QuestionSelectionContext.ts";
import { QuestionDTO } from "@dti-isin/backend-api-client/dist/models/question-dto";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {useFolder} from "../../hooks/useFolder.ts";

export const QuestionSelectionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionDTO | null>(null);
    const { selectedCourseId: contextCourseId } = useCourseSelection();
    const { selectedFolderId: contextFolderId } = useFolder();

    const courseId =  contextCourseId;
    const folderId = contextFolderId;
    const quizId = propQuizId;


    const value = {

    }

    return (
      <QuestionSelectionContext.Provider value={value}>
          {children}
      </QuestionSelectionContext.Provider>
    );
}