import React, {useCallback, useMemo, useState} from "react";
import {QuestionSelectionContext} from "../../contexts/question/QuestionSelectionContext.ts";
import {useQuestionList} from "../../hooks/question/useQuestionList.ts";

export const QuestionSelectionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [selectedQuestionId, setSeletedQuestionId] = useState<string | null>(null);
    const {questions} = useQuestionList();

    const selectedQuestion = useMemo(
        () => questions.find(q => q.id === selectedQuestionId) || null,
        [questions, selectedQuestionId]
    );

    const validateSelection = useCallback(() => {
        if(selectedQuestionId && !questions.some(q => q.id === selectedQuestionId)) {
            setSeletedQuestionId(null);
        }
    }, [questions, selectedQuestionId]);

    const value = useMemo(() => ({
        selectedQuestionId,
        selectedQuestion,
        selectQuestion: (id: string) => {
            if(questions.some(q => q.id === id)) {
                setSeletedQuestionId(id);
            }
        },
        deselectQuestion: () => setSeletedQuestionId(null),
        validateSelection,
    }), [selectedQuestionId, selectedQuestion, questions, validateSelection]);

    return (
      <QuestionSelectionContext.Provider value={value}>
          {children}
      </QuestionSelectionContext.Provider>
    );
}