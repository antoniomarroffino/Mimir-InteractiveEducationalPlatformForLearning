import React, {useCallback, useMemo, useState} from "react";
import {QuizSelectionContext} from "../../contexts/quiz/QuizSelectionContext.tsx";
import {useQuizList} from "../../hooks/quiz/useQuizList.ts";

export const QuizSelectionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    const {quizzes} = useQuizList();

    const selectedQuiz = useMemo(
        () => quizzes.find(q => q.id === selectedQuizId) || null,
        [quizzes, selectedQuizId]
    )

    const validateSelection = useCallback(() => {
        if(selectedQuizId && !quizzes.some(q => q.id === selectedQuizId)) {
            setSelectedQuizId(null)
        }
    }, [quizzes, selectedQuizId])

    const value = useMemo(() => ({
        selectedQuizId,
        selectedQuiz,
        selectQuiz: (id: string) => {
            if(quizzes.some(q => q.id === id)) {
                setSelectedQuizId(id)
            }
        },
        deselectQuiz: () => setSelectedQuizId(null),
        validateSelection,
    }), [selectedQuizId, selectedQuiz, quizzes, validateSelection]);

    return (
      <QuizSelectionContext.Provider value={value}>
          {children}
      </QuizSelectionContext.Provider>
    );
}