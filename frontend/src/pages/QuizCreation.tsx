// src/pages/QuizCreation.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizDTO, FolderDTO } from '@dti-isin/backend-api-client';
import { quizService } from '../services/quizService';
import { useCourseContext } from '../contexts/course/CourseContext';
import { folderService } from '../services/folderService';
import { QuizBreadcrumb } from '../components/quiz/QuizBreadcrumb';
import { QuestionsList } from '../components/question/QuestionList';
import { QuestionTypeSelector } from '../components/question/QuestionTypeSelector';
import { QuestionEditor } from '../components/question/QuestionEditor';
import { QuestionType } from '../components/question/QuestionTypes';

interface Question {
    id: string;
    text: string;
    type: QuestionType;
    answers?: string[];
    correctAnswer?: number | boolean | number[];
}

export const QuizCreation: React.FC = () => {
    const { courseId, folderId, quizId } = useParams();
    const navigate = useNavigate();
    const { courses, selectedCourseId } = useCourseContext();

    // Stati base
    const [quiz, setQuiz] = useState<QuizDTO | null>(null);
    const [folder, setFolder] = useState<FolderDTO | null>(null);
    const [quizName, setQuizName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stati per la gestione delle domande
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>(
        QuestionType.MULTIPLE_CHOICE
    );

    // Trova il corso corrente
    const currentCourse = courses.find(course => course.id === selectedCourseId);

    useEffect(() => {
        const initializeData = async () => {
            if (!courseId || !folderId) return;

            try {
                setIsLoading(true);
                setError(null);

                // Carica la folder
                const folders = await folderService.getFoldersInCourse(courseId);
                const currentFolder = folders.find(f => f.id === folderId);
                if (currentFolder) {
                    setFolder(currentFolder);
                }

                // Carica il quiz se in modalità modifica
                if (quizId) {
                    const quizData = await quizService.getQuiz(courseId, folderId, quizId);
                    setQuiz(quizData);
                    setQuizName(quizData.name || '');
                    // Qui dovresti anche caricare le domande esistenti se ci sono
                    // setQuestions(quizData.questions || []);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [courseId, folderId, quizId]);

    const handleSaveQuestion = (questionData: Partial<Question>) => {
        const newQuestion: Question = {
            id: Date.now().toString(), // Temporaneo, dovrebbe essere generato dal backend
            text: questionData.text!,
            type: questionData.type!,
            answers: questionData.answers,
            correctAnswer: questionData.correctAnswer
        };

        setQuestions(prev => [...prev, newQuestion]);
    };

    if (!currentCourse || !courseId || !folderId) {
        return (
            <div className="alert alert-error">
                Invalid course or folder
                <button
                    className="btn btn-sm btn-outline ml-4"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <QuizBreadcrumb
                course={currentCourse}
                folder={folder}
                quiz={quiz}
                courseId={courseId}
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar con la lista delle domande */}
                <div className="col-span-3">
                    <QuestionsList questions={questions} />
                </div>

                {/* Area principale per la creazione delle domande */}
                <div className="col-span-6">
                    <QuestionEditor
                        questionType={selectedQuestionType}
                        onSave={handleSaveQuestion}
                    />
                </div>

                {/* Sidebar destra con il selettore del tipo di domanda */}
                <div className="col-span-3">
                    <QuestionTypeSelector
                        selectedType={selectedQuestionType}
                        onTypeChange={setSelectedQuestionType}
                    />
                </div>
            </div>

            {/* Pulsanti di azione principali */}
            <div className="mt-8 flex justify-end gap-4">
                <button
                    className="btn"
                    onClick={() => navigate(`/courses/${courseId}`)}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-primary"
                    disabled={questions.length === 0}
                    onClick={() => {
                        // Implementare il salvataggio finale del quiz
                        console.log('Saving quiz with questions:', questions);
                    }}
                >
                    Save Quiz
                </button>
            </div>
        </div>
    );
};