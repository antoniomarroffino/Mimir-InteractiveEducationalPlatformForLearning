import React, {useCallback, useMemo, useState} from "react";
import {QuestionSelectionContext} from "../../contexts/question/QuestionSelectionContext.ts";
import {useQuestionList} from "../../hooks/question/useQuestionList.ts";

export const QuestionSelectionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
    const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
    const {questions} = useQuestionList();

    const selectedQuestion = useMemo(
        () => questions.find(q => q.id === selectedQuestionId) || null,
        [questions, selectedQuestionId]
    );

    const validateSelection = useCallback(() => {
        if (selectedQuestionId && !questions.some(q => q.id === selectedQuestionId)) {
            setSelectedQuestionId(null);
        }
    }, [questions, selectedQuestionId]);

    const value = useMemo(() => ({
        selectedQuestionId,
        selectedQuestion,
        currentQuizId,
        selectQuestion: (id: string) => {
            if (questions.some(q => q.id === id)) {
                setSelectedQuestionId(id);
            }
        },
        deselectQuestion: () => setSelectedQuestionId(null),
        validateSelection,
        setCurrentQuiz: (quizId: string) => {
            setCurrentQuizId(quizId);
            setSelectedQuestionId(null);
        }
    }), [
        selectedQuestionId,
        selectedQuestion,
        questions,
        validateSelection,
        currentQuizId
    ]);

    return (
        <QuestionSelectionContext.Provider value={value}>
            {children}
        </QuestionSelectionContext.Provider>
    );
}