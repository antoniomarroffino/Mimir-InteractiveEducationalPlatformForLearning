import { useParams, useNavigate } from 'react-router-dom';
import { QuestionType } from '@dti-isin/backend-api-client';
import { Breadcrumb } from "../components/common/Breadcrumb.tsx";
import { QuestionsList } from "../components/question/QuestionList.tsx";
import CreateQuestionForm from "../components/question/CreateQuestionForm.tsx";
import { QuestionEditor } from "../components/question/QuestionEditor.tsx";
import { QuestionTypeSelector } from "../components/question/QuestionTypeSelector.tsx";
import { useQuizQuestions } from "../hooks/quiz/useQuizQuestions.ts";
import { useQuizQuestionCreation } from "../hooks/question/useQuizQuestionCreation.ts";
import { useCourseList } from "../hooks/course/useCourseList.ts";
import React, { useMemo } from "react";

export const QuizCreation: React.FC = () => {
    const navigate = useNavigate();
    const { courseId, folderId, quizId } = useParams();

    // Gestione dei dati dei corsi
    const { courses } = useCourseList();

    // Query per ottenere le domande del quiz
    const quizQuestionsQuery = useQuizQuestions(courseId, folderId, quizId);

    // Hook personalizzato per la creazione delle domande
    const {
        isCreatingQuestion,
        selectedQuestionType,
        questionTemplate,
        draftQuestion,
        error,
        handleTypeSelection,
        handleSaveQuestion,
        setDraftQuestion,
        resetQuestionCreation,
        startQuestionCreation
    } = useQuizQuestionCreation(courseId!, folderId!, quizId!);

    // Memoizzazione per trovare corso, cartella e quiz correnti
    const currentCourse = useMemo(() =>
            courses.find(course => course.id === courseId),
        [courses, courseId]
    );

    const currentFolder = useMemo(() =>
            currentCourse?.folders?.find(folder => folder.id === folderId),
        [currentCourse, folderId]
    );

    const currentQuiz = useMemo(() =>
            currentFolder?.quizzes?.find(quiz => quiz.id === quizId),
        [currentFolder, quizId]
    );

    // Gestione caricamento
    if (quizQuestionsQuery.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // Gestione errore se corso, cartella o quiz non trovati
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

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumb
                course={currentCourse}
                folder={currentFolder}
                quiz={currentQuiz}
            />

            <div className="bg-base-100 rounded-lg p-6 shadow-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">{currentQuiz.name}</h1>
                <p className="text-base-content/70">
                    {quizQuestionsQuery.data?.length || 0} questions
                </p>
            </div>

            {(error || quizQuestionsQuery.error) && (
                <div className="alert alert-error mb-4">
                    {error || quizQuestionsQuery.error?.message}
                </div>
            )}

            {quizQuestionsQuery.data?.length === 0 && (
                <div className="alert alert-info mb-4">
                    No questions found. Start creating your first question!
                </div>
            )}

            <div className="grid grid-cols-12 gap-6 mt-6">
                <div className="col-span-3">
                    <div className="bg-base-100 rounded-lg p-4 shadow space-y-4">
                        <QuestionsList
                            questions={quizQuestionsQuery.data || []}
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
                                onStartCreation={startQuestionCreation}
                                isDisabled={false}
                            />
                        )}
                    </div>
                </div>

                <div className="col-span-6">
                    <QuestionEditor
                        questionType={selectedQuestionType || QuestionType.TrueFalse}
                        template={questionTemplate || {
                            questionText: '',
                            type: QuestionType.TrueFalse,
                            correctAnswer: true
                        }}
                        onSave={handleSaveQuestion}
                        onCancel={resetQuestionCreation}
                        isLoading={quizQuestionsQuery.isLoading}
                        onQuestionTextChange={(text) => setDraftQuestion(prev => ({...prev, questionText: text}))}
                        disabled={!isCreatingQuestion || !selectedQuestionType}
                    />
                </div>

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