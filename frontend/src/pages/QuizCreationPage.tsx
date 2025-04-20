import {useParams} from 'react-router-dom';
import {QuestionDTO, QuestionType} from '@dti-isin/backend-api-client';
import {BreadcrumbCourses} from "../components/common/BreadcrumbCourses.tsx";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {BsLayoutSidebar, BsListTask, BsListUl, BsPencil, BsQuestionDiamond} from 'react-icons/bs';
import {useQuizCRUD} from "../hooks/quiz/useQuizCRUD.ts";
import {useQuestionBankList} from "../hooks/questionBank/useQuestionBankList.ts";
import {QuestionBankList} from "../components/quiz/QuestionBankList.tsx";
import {format} from "date-fns";
import {CheckIcon, XMarkIcon} from "@heroicons/react/16/solid";
import {QuestionsList} from "../components/question/QuestionList.tsx";
import {QuestionEditor} from "../components/question/QuestionEditor.tsx";
import {SpecificQuestionDTO, useQuestionCreation} from "../hooks/question/useQuestionCreation.ts";
import {useGetQuizById} from "../hooks/quiz/useGetQuizById.ts";
import {useGetCourseById} from "../hooks/course/useGetCourseById.ts";
import {useGetFolderById} from "../hooks/folder/useGetFolderById.ts";
import {LoadingSpinner} from "../components/common/LoadingSpinner.tsx";
import {QuizTimeLimit} from "../components/quiz/QuizTimeLimit.tsx";

export const QuizCreationPage: React.FC = () => {
    const {courseId, folderId, quizId} = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {data: currentQuiz, isLoading: isLoadingQuiz} = useGetQuizById(courseId!, folderId!, quizId!);
    const {data: currentFolder, isLoading: isLoadingFolder} = useGetFolderById(courseId!, folderId!);
    const {data: currentCourse, isLoading: isLoadingCourse} = useGetCourseById(courseId!);
    const [isEditingQuizName, setIsEditingQuizName] = useState(false);
    const [editedQuizName, setEditedQuizName] = useState(currentQuiz?.name || '');
    const {updateQuiz} = useQuizCRUD();
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const {questionBanks, isLoadingQuestionBanks, errorQuestionBanks} = useQuestionBankList();

    const stableSelectedQuestions = useMemo(() => selectedQuestions, [selectedQuestions]);
    const stableQuestionBanks = useMemo(() => questionBanks, [questionBanks]);


    const {
        selectedQuestionType,
        questionTemplate,
        setDraftQuestion,
        handleSaveQuestion,
        resetQuestionCreation,
        startQuestionEditing,
        isEditingExistingQuestion
    } = useQuestionCreation();

    const importedQuestionIds = useMemo(() => {
        return currentQuiz?.questions?.map(q => q.id!) || [];
    }, [currentQuiz?.questions]);

    useEffect(() => {
        console.log("currentQuiz changed", currentQuiz);
    }, [currentQuiz]);

    useEffect(() => {
        setEditedQuizName(currentQuiz?.name || '');
    }, [currentQuiz?.name]);

    const quizTimeLimit = useMemo(() => currentQuiz?.timeLimitMinutes, [currentQuiz?.timeLimitMinutes]);

    const handleTimeLimitChange = useCallback((minutes: number | undefined) => {
        if (!currentQuiz) return;

        updateQuiz.mutateAsync({
            courseId: courseId!,
            folderId: folderId!,
            quizId: quizId!,
            quizDTO: {
                ...currentQuiz,
                timeLimitMinutes: minutes
            }
        }).catch((error) => {
            console.error("Failed to update time limit:", error);
        });
    }, [courseId, folderId, quizId, currentQuiz, updateQuiz]);


    const saveNewQuestion = async (questionDTO: SpecificQuestionDTO) => {
        if (questionDTO) {
            await handleSaveQuestion(questionDTO);
        }
    }

    const handleQuizNameUpdate = async () => {
        if (!currentQuiz || editedQuizName.trim() === currentQuiz.name) {
            setIsEditingQuizName(false);
            return;
        }

        try {
            await updateQuiz.mutateAsync({
                courseId: courseId!,
                folderId: folderId!,
                quizId: quizId!,
                quizDTO: {
                    ...currentQuiz,
                    name: editedQuizName.trim()
                }
            });
        } catch (error) {
            console.error('Failed to update quiz name:', error);
        } finally {
            setIsEditingQuizName(false);
        }
    };


    const handleQuestionSelect = useCallback((questionId: string) => {
        const isImported = currentQuiz!.questions?.some(q => q.id === questionId);
        if (isImported) return;

        setSelectedQuestions(prev => {
            if (prev.includes(questionId)) {
                return prev.filter(q => q !== questionId);
            } else {
                return [...prev, questionId];
            }
        });
    }, [currentQuiz]);


    const handleBankSelect = useCallback((bankId: string) => {
        const bank = questionBanks.find(b => b.id === bankId);
        const bankQuestionIds = bank?.questions
            ?.map(q => q.id)
            .filter(id => !currentQuiz!.questions?.some(q => q.id === id))
            .filter((id): id is string => id !== undefined) || [];

        setSelectedQuestions(prev => [...new Set([...prev, ...bankQuestionIds])]);
    }, [questionBanks, currentQuiz]);


    const handleImportQuestions = useCallback(async () => {
        if (!currentQuiz || !folderId || !quizId) return;

        const questionsToAdd = selectedQuestions
            .map(id => {
                for (const bank of questionBanks) {
                    const question = bank.questions?.find(q => q.id === id);
                    if (question) return question;
                }
                return null;
            })
            .filter(q => q !== null) as QuestionDTO[];

        const updatedQuestions = [
            ...(currentQuiz.questions || []),
            ...questionsToAdd
        ];

        try {
            await updateQuiz.mutateAsync({
                courseId: courseId!,
                folderId: folderId!,
                quizId: quizId!,
                quizDTO: {
                    ...currentQuiz,
                    questions: updatedQuestions
                }
            });
            setSelectedQuestions([]);
        } catch (error) {
            console.error('Failed to import questions:', error);
        }
    }, [courseId, folderId, quizId, currentQuiz, questionBanks, selectedQuestions, updateQuiz]);

    const handleQuestionDelete = async (questionId: string) => {
        if (!currentQuiz || !folderId || !quizId) return;

        const updatedQuestions = currentQuiz.questions?.filter(q => q.id !== questionId) || [];

        try {
            await updateQuiz.mutateAsync({
                courseId: courseId!,
                folderId: folderId!,
                quizId: quizId!,
                quizDTO: {
                    ...currentQuiz,
                    questions: updatedQuestions
                }
            });

            if (questionTemplate?.id === questionId) {
                resetQuestionCreation();
            }
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };



    if (isLoadingQuiz || isLoadingFolder || isLoadingCourse || isLoadingQuestionBanks) {
        return <LoadingSpinner fullScreen/>;
    }

    return (
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
            <BreadcrumbCourses
                course={currentCourse}
                folder={currentFolder}
                quiz={currentQuiz}
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div className="flex-1 flex items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm">
                    <BsListTask className="text-primary w-8 h-8 shrink-0"/>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex flex-col gap-2 w-full">
                                {isEditingQuizName ? (
                                    <>
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                value={editedQuizName}
                                                onChange={(e) => setEditedQuizName(e.target.value)}
                                                className="text-3xl font-bold text-primary bg-transparent border-b-2 border-primary focus:outline-none w-full"
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && handleQuizNameUpdate()}
                                            />
                                            <button
                                                className="btn btn-ghost btn-square hover:bg-transparent"
                                                onClick={() => setIsEditingQuizName(false)}
                                            >
                                                <XMarkIcon className="w-5 h-5 text-base-content/60"/>
                                            </button>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                className="btn btn-ghost"
                                                onClick={() => {
                                                    setIsEditingQuizName(false);
                                                    setEditedQuizName(currentQuiz!.name);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn btn-primary gap-2"
                                                onClick={handleQuizNameUpdate}
                                                disabled={updateQuiz.isLoading}

                                            >
                                                {updateQuiz.isLoading ? (
                                                    <span className="loading loading-spinner"></span>
                                                ) : (
                                                    <CheckIcon className="w-5 h-5"/>
                                                )}
                                                Save Changes
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 group">
                                        <h1 className="text-3xl font-bold text-primary truncate">
                                            {currentQuiz!.name}
                                        </h1>
                                        <button
                                            className="btn btn-ghost btn-square hover:bg-transparent"
                                            onClick={() => setIsEditingQuizName(true)}
                                        >
                                            <BsPencil className="text-xl text-primary"/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-base-content/60 mt-1">
    <span className="flex items-center gap-1">
        <BsQuestionDiamond/>
        {currentQuiz!.questions?.length || 0} questions
    </span>
                            <span>•</span>
                            <span>•</span>
                            <span>
        Last modified: {format(new Date(currentQuiz!.updatedAt!), 'dd MMM yyyy HH:mm')}
    </span>
                        </div>
                    </div>
                </div>


                <div
                    className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3 flex-1 max-w-lg mx-4">
                    <QuizTimeLimit
                        timeLimit={quizTimeLimit}
                        onTimeChange={handleTimeLimitChange}
                        disabled={updateQuiz.isLoading}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                {/* Mobile Sidebar Toggle */}
                <div className="lg:hidden absolute top-0 right-0 z-50">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <BsLayoutSidebar/> : <BsListUl/>}
                    </button>
                </div>

                {/* Imported Questions Sidebar */}
                <div className={`
                    lg:col-span-3 
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
                    bg-base-100/95 
                    backdrop-blur-sm
                    lg:bg-transparent 
                    p-6 
                    lg:p-0
                    overflow-y-auto
                `}>
                    <div className="bg-base-100 rounded-xl p-6 shadow-xl space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Quiz Questions</h3>
                            <button
                                className="btn btn-circle btn-sm lg:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <XMarkIcon className="w-4 h-4"/>
                            </button>
                        </div>
                        <QuestionsList
                            questions={currentQuiz!.questions || []}
                            onStartEditing={startQuestionEditing}
                            onDeleteQuestion={handleQuestionDelete}
                        />
                    </div>
                </div>

                <div className="lg:col-span-5 order-first lg:order-none">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="card-title">
                                    Question Preview
                                </h3>
                                {selectedQuestionType && (
                                    <button
                                        type="button"
                                        className="btn btn-error gap-2"
                                        onClick={resetQuestionCreation}
                                    >
                                        <XMarkIcon className="h-5 w-5"/>
                                        Exit Preview
                                    </button>
                                )}
                            </div>
                            <QuestionEditor
                                questionType={selectedQuestionType || QuestionType.TrueFalse}
                                template={questionTemplate || {
                                    questionText: '',
                                    type: QuestionType.TrueFalse,
                                    correctAnswer: true,
                                    points: 1
                                }}
                                onSave={saveNewQuestion}
                                onCancel={resetQuestionCreation}
                                onQuestionTextChange={(text) => setDraftQuestion(prev => ({
                                    ...prev,
                                    questionText: text
                                }))}
                                disabled={!selectedQuestionType}
                                isEditingExistingQuestion={isEditingExistingQuestion}
                                isPreview={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Question Banks Panel */}
                <div className="lg:col-span-4">
                    <QuestionBankList
                        banks={stableQuestionBanks}
                        isLoading={isLoadingQuestionBanks}
                        error={errorQuestionBanks}
                        importedQuestion={importedQuestionIds}
                        selectedQuestions={stableSelectedQuestions}
                        onQuestionSelect={handleQuestionSelect}
                        onBankSelect={handleBankSelect}
                        onImport={handleImportQuestions}
                        isImporting={updateQuiz.isLoading}
                    />

                </div>
            </div>
        </div>
    );
};