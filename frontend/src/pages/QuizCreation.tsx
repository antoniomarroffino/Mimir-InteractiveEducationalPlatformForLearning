import { useNavigate, useParams } from 'react-router-dom';
import { QuestionType } from '@dti-isin/backend-api-client';
import { Breadcrumb } from "../components/common/Breadcrumb.tsx";
import { QuestionsList } from "../components/question/QuestionList.tsx";
import { CreateQuestionForm } from "../components/question/CreateQuestionForm.tsx";
import { QuestionEditor } from "../components/question/QuestionEditor.tsx";
import { QuestionTypeSelector } from "../components/question/QuestionTypeSelector.tsx";
import { DraftQuestionElement } from "../components/question/DraftQuestionElement.tsx";
import { useQuizQuestions } from "../hooks/quiz/useQuizQuestions.ts";
import { useQuizQuestionCreation } from "../hooks/question/useQuizQuestionCreation.ts";
import { useCourseList } from "../hooks/course/useCourseList.ts";
import React, { useMemo, useState } from "react";
import {
    BsPlusCircle,
    BsQuestionDiamond,
    BsListTask,
    BsListUl,
    BsLayoutSidebar
} from 'react-icons/bs';

export const QuizCreation: React.FC = () => {
    const navigate = useNavigate();
    const { courseId, folderId, quizId } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { courses } = useCourseList();
    const quizQuestionsQuery = useQuizQuestions(courseId, folderId, quizId);
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
        startQuestionCreation,
        startQuestionEditing,
        isEditingExistingQuestion
    } = useQuizQuestionCreation(courseId!, folderId!, quizId!);

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

    if (quizQuestionsQuery.isLoading) {
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

    return (
        <div className="min-h-screen bg-base-200 my-3">
            <div className="container mx-auto px-4 lg:px-8 xl:px-16">
                <Breadcrumb
                    course={currentCourse}
                    folder={currentFolder}
                    quiz={currentQuiz}
                />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-base-content/90 flex items-center gap-3">
                            <BsListTask className="text-primary" />
                            {currentQuiz.name}
                        </h1>
                        <p className="text-base-content/70 mt-2 flex items-center gap-2 text-sm md:text-base">
                            <BsQuestionDiamond className="text-primary/70" />
                            {quizQuestionsQuery.data?.length || 0} questions
                        </p>
                    </div>
                    {!isCreatingQuestion && (
                        <button
                            className="btn btn-primary btn-sm md:btn-lg flex items-center gap-2"
                            onClick={startQuestionCreation}
                        >
                            <BsPlusCircle className="text-xl" />
                            <span className="hidden md:inline">Create Question</span>
                        </button>
                    )}
                </div>

                {(error || quizQuestionsQuery.error) && (
                    <div className="alert alert-error mb-4 shadow-lg">
                        {error || quizQuestionsQuery.error?.message}
                    </div>
                )}

                {quizQuestionsQuery.data?.length === 0 && (
                    <div className="alert alert-info mb-4 shadow-lg">
                        No questions found. Start creating your first question!
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                    {/* Mobile Sidebar Toggle */}
                    <div className="lg:hidden absolute top-0 right-0 z-50">
                        <button
                            className="btn btn-ghost"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <BsLayoutSidebar /> : <BsListUl />}
                        </button>
                    </div>

                    {/* Sidebar for Questions List */}
                    <div className={`
                        lg:col-span-4 
                        fixed 
                        lg:static 
                        top-0 
                        left-0 
                        w-full 
                        h-full 
                        lg:w-auto 
                        lg:h-auto 
                        z-40 
                        transform 
                        transition-transform 
                        duration-300 
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                        lg:translate-x-0
                        bg-base-100 
                        lg:bg-transparent 
                        p-6 
                        lg:p-0
                    `}>
                        <div className="bg-base-100 rounded-xl p-6 shadow-xl space-y-6">
                            <QuestionsList
                                questions={quizQuestionsQuery.data || []}
                                onStartEditing={startQuestionEditing}
                            />

                            {isCreatingQuestion && (
                                <DraftQuestionElement
                                    questionText={draftQuestion.questionText}
                                    questionType={selectedQuestionType!}
                                />
                            )}

                            {!isCreatingQuestion && (
                                <CreateQuestionForm
                                    onStartCreation={startQuestionCreation}
                                    isDisabled={false}
                                />
                            )}
                        </div>
                    </div>

                    {/* Main Question Editor */}
                    <div className="lg:col-span-5 order-first lg:order-none">
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
                            isEditingExistingQuestion={isEditingExistingQuestion}
                        />
                    </div>

                    {/* Question Type Selector */}
                    <div className="lg:col-span-3">
                        {isCreatingQuestion ? (
                            <QuestionTypeSelector
                                onSelectType={handleTypeSelection}
                                isLoading={false}
                                disabled={false}
                                currentType={selectedQuestionType}
                            />
                        ) : (
                            <div className="bg-base-100 rounded-xl p-6 shadow-xl opacity-50 text-center">
                                <BsQuestionDiamond className="text-6xl mx-auto mb-4 text-base-content/30" />
                                <h2 className="text-lg font-semibold mb-3">Question Type</h2>
                                <p className="text-base-content/70">
                                    Select "Create New Question" to start
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};