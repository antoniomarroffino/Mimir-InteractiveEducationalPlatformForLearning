import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionDTO, QuestionType } from '@dti-isin/backend-api-client';
import { questionService } from '../services/questionService';
import { QuestionTypeSelector } from '../components/question/QuestionTypeSelector';
import { QuestionEditor } from '../components/question/QuestionEditor';
import { QuestionsList } from '../components/question/QuestionList';
import { useCourseContext } from '../contexts/course/CourseContext';
import { Breadcrumb } from "../components/common/Breadcrumb.tsx";
import CreateQuestionForm from '../components/question/CreateQuestionForm';

export const QuizCreation: React.FC = () => {
    const { courseId, folderId, quizId } = useParams();
    const navigate = useNavigate();
    const { courses } = useCourseContext();

    const [questions, setQuestions] = useState<QuestionDTO[]>([]);
    const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
    const [questionTemplate, setQuestionTemplate] = useState<QuestionDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [draftQuestion, setDraftQuestion] = useState<Partial<QuestionDTO>>({
        questionText: '',
        type: selectedQuestionType || undefined
    });

    const currentCourse = courses.find(course => course.id === courseId);
    const currentFolder = currentCourse?.folders?.find(folder => folder.id === folderId);
    const currentQuiz = currentFolder?.quizzes?.find(quiz => quiz.id === quizId);

    useEffect(() => {
        let isMounted = true;

        const initializePage = async () => {
            try {
                if (isMounted) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to initialize page:', error);
                if (isMounted) {
                    setIsLoading(false);
                    setError('Failed to load page');
                }
            }
        };

        initializePage();

        return () => {
            isMounted = false;
        };
    }, [courseId, folderId, quizId]);

    // Validation checks
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (!courseId || !folderId || !quizId || !currentCourse || !currentFolder || !currentQuiz) {
        return (
            <div className="alert alert-warning">
                Quiz not found.
                <button
                    className="btn btn-sm btn-outline ml-4"
                    onClick={() => navigate(`/courses/${courseId}`)}
                >
                    Back to Course
                </button>
            </div>
        );
    }

    const handleSaveQuestion = async (questionData: QuestionDTO) => {
        if (!courseId || !folderId || !quizId) {
            setError('Missing course, folder, or quiz information');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const savedQuestion = await questionService.addQuestionToQuiz(
                courseId,
                folderId,
                quizId,
                questionData
            );
            setQuestions(prev => [...prev, savedQuestion]);

            // Reset creation state
            setIsCreatingQuestion(false);
            setSelectedQuestionType(null);
            setQuestionTemplate(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save question');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        // Implementazione futura della cancellazione
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <Breadcrumb
                course={currentCourse}
                folder={currentFolder}
                quiz={currentQuiz}
            />

            {/* Quiz Title and Info */}
            <div className="bg-base-100 rounded-lg p-6 shadow-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">{currentQuiz.name}</h1>
                <p className="text-base-content/70">
                    {questions.length} questions
                </p>
            </div>

            {error && (
                <div className="alert alert-error mb-4">
                    {error}
                    <button
                        className="btn btn-sm btn-ghost ml-2"
                        onClick={() => setError(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6 mt-6">
                {/* Sidebar con la lista delle domande */}
                <div className="col-span-3">
                    <div className="bg-base-100 rounded-lg p-4 shadow space-y-4">
                        <QuestionsList
                            questions={questions}
                            onDeleteQuestion={handleDeleteQuestion}
                        />

                        {isCreatingQuestion && (
                            <div className="p-3 bg-base-200 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold">
                                        Draft Question
                                    </span>
                                    {selectedQuestionType && (
                                        <span className="badge badge-primary">
                                            {selectedQuestionType}
                                        </span>
                                    )}
                                </div>
                                <p className="text-base-content/70">
                                    {draftQuestion.questionText || 'Start typing your question...'}
                                </p>
                            </div>
                        )}

                        {!isCreatingQuestion && (
                            <CreateQuestionForm
                                onStartCreation={() => {
                                    setIsCreatingQuestion(true);
                                    // Resetta il draft question quando inizia la creazione
                                    setDraftQuestion({ questionText: '' });
                                }}
                                isDisabled={isLoading}
                            />
                        )}
                    </div>
                </div>

                {/* Selettore di tipo domanda */}
                <div className="col-span-3">
                    {isCreatingQuestion && !selectedQuestionType ? (
                        <QuestionTypeSelector
                            onSelectType={(type) => {
                                questionService.createQuestionTemplate(type)
                                    .then(template => {
                                        setSelectedQuestionType(type);
                                        setQuestionTemplate(template);
                                        setDraftQuestion(prev => ({
                                            ...prev,
                                            type
                                        }));
                                    })
                                    .catch(err => setError(err.message));
                            }}
                            isLoading={isLoading}
                        />
                    ) : (
                        <div className="bg-base-100 rounded-lg p-4 shadow opacity-50">
                            <h2 className="text-lg font-semibold mb-4">Question Type</h2>
                            <p className="text-center text-base-content/70">
                                Select "Create New Question" to start
                            </p>
                        </div>
                    )}
                </div>

                {/* Editor della domanda */}
                <div className="col-span-6">
                    {selectedQuestionType && questionTemplate ? (
                        <QuestionEditor
                            questionType={selectedQuestionType}
                            template={questionTemplate}
                            onSave={handleSaveQuestion}
                            onCancel={() => {
                                setIsCreatingQuestion(false);
                                setSelectedQuestionType(null);
                                setQuestionTemplate(null);
                                setDraftQuestion({});
                            }}
                            isLoading={isLoading}
                            onQuestionTextChange={(text) => {
                                setDraftQuestion(prev => ({
                                    ...prev,
                                    questionText: text
                                }));
                            }}
                        />
                    ) : (
                        <div className="bg-base-100 rounded-lg p-4 shadow opacity-50">
                            <h2 className="text-lg font-semibold mb-4">Question Editor</h2>
                            <p className="text-center text-base-content/70">
                                Select a question type to start editing
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};