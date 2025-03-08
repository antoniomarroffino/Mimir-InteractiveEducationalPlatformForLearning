import React from 'react';
import { QuizContext } from './QuizContext';
import { useQuiz } from '../../hooks/quiz/useQuiz';
import { useCourseContext } from '../course/CourseContext.tsx';
import { useFolderContext } from '../folder/FolderContext.tsx';

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { selectedCourseId } = useCourseContext();
    const { selectedFolderId } = useFolderContext();
    const quizState = useQuiz(selectedCourseId, selectedFolderId);

    return (
        <QuizContext.Provider value={quizState}>
            {children}
        </QuizContext.Provider>
    );
};