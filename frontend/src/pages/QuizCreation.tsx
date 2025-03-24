import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionDTO, QuestionType } from '@dti-isin/backend-api-client';
import {useCourseList} from "../hooks/course/useCourseList.ts";
import {useQuestionList} from "../hooks/question/useQuestionList.ts";
import {useQuestionCRUD} from "../hooks/question/useQuestionCRUD.ts";
import {Breadcrumb} from "../components/common/Breadcrumb.tsx";
import {QuestionsList} from "../components/question/QuestionList.tsx";
import CreateQuestionForm from "../components/question/CreateQuestionForm.tsx";
import {QuestionEditor} from "../components/question/QuestionEditor.tsx";
import {QuestionTypeSelector} from "../components/question/QuestionTypeSelector.tsx";

export const QuizCreation: React.FC = () => {
    const { courseId, folderId, quizId } = useParams();
    const navigate = useNavigate();
    const { courses } = useCourseList();
    const {questions, isLoadingQuestions, errorQuestions} = useQuestionList();
    const {createQuestion, createQuestionTemplate} = useQuestionCRUD();

    const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
    const [questionTemplate, setQuestionTemplate] = useState<QuestionDTO | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [draftQuestion, setDraftQuestion] = useState<Partial<QuestionDTO>>({
        questionText: '',
        type: selectedQuestionType || undefined
    });

    const currentCourse = courses.find(course => course.id === courseId);
    const currentFolder = currentCourse?.folders?.find(folder => folder.id === folderId);
    const currentQuiz = currentFolder?.quizzes?.find(quiz => quiz.id === quizId);

    // Validation checks
    if (isLoadingQuestions) {
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
            setError(null);
            await createQuestion(questionData);

            // Resetta tutto tranne il fatto che stiamo creando una domanda
            setSelectedQuestionType(null);
            setQuestionTemplate(null);
            setDraftQuestion({ questionText: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save question');
        }
    };

    const handleQuestionTextChange = (text: string) => {
        setDraftQuestion(prev => ({
            ...prev,
            questionText: text
        }));
    };

    const handleTypeSelection = async (type: QuestionType) => {
        try {
            const template = await createQuestionTemplate(type);
            setSelectedQuestionType(type);
            setQuestionTemplate(template);

            // Mantieni il testo della domanda se giÃ  presente
            setDraftQuestion(prev => ({
                ...prev,
                type
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create question template');
        }
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

            {(error || errorQuestions) && (
                <div className="alert alert-error mb-4">
                    {error || errorQuestions?.message}
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
                                    setDraftQuestion({ questionText: '' });
                                }}
                                isDisabled={false}
                            />
                        )}
                    </div>
                </div>

                {/* Editor della domanda */}
                <div className="col-span-6">
                    <QuestionEditor
                        questionType={selectedQuestionType || QuestionType.TrueFalse}
                        template={questionTemplate || {
                            questionText: '',
                            type: QuestionType.TrueFalse,
                            correctAnswer: true
                        }}
                        onSave={handleSaveQuestion}
                        onCancel={() => {
                            setIsCreatingQuestion(false);
                            setSelectedQuestionType(null);
                            setQuestionTemplate(null);
                            setDraftQuestion({});
                        }}
                        isLoading={false}
                        onQuestionTextChange={handleQuestionTextChange}
                        disabled={!isCreatingQuestion || !selectedQuestionType}
                    />
                </div>

                {/* Selettore di tipo domanda */}
                <div className="col-span-3">
                    {isCreatingQuestion ? (
                        <QuestionTypeSelector
                            onSelectType={handleTypeSelection}
                            isLoading={false}
                            disabled={!!selectedQuestionType}
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
            </div>
        </div>
    );
};