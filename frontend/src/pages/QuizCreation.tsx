import React from 'react';
import {useParams} from 'react-router-dom';
import {QuestionProvider} from '../provider/QuestionProvider';
import {QuizCreationContent} from "../components/quiz/QuizCreationContent.tsx";

export const QuizCreation: React.FC = () => {
    const {courseId, folderId, quizId} = useParams();

    return (
        <QuestionProvider
            courseId={courseId}
            folderId={folderId}
            quizId={quizId}
        >
            <QuizCreationContent/>
        </QuestionProvider>
    );
};