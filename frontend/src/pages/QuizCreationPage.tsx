import { useParams } from 'react-router-dom';
import { QuestionDTO, QuestionType } from '@dti-isin/backend-api-client';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsLayoutSidebar, BsListUl } from 'react-icons/bs';
import { useQuizCRUD } from "../hooks/quiz/useQuizCRUD.ts";
import { useQuestionBankList } from "../hooks/questionBank/useQuestionBankList.ts";
import { QuestionBankList } from "../components/quiz/QuestionBankList.tsx";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { QuestionEditor } from "../components/question/QuestionEditor.tsx";
import { SpecificQuestionDTO, useQuestionCreation } from "../hooks/question/useQuestionCreation.ts";
import { useGetQuizById } from "../hooks/quiz/useGetQuizById.ts";
import { useGetCourseById } from "../hooks/course/useGetCourseById.ts";
import { useGetFolderById } from "../hooks/folder/useGetFolderById.ts";
import { LoadingSpinner } from "../components/common/LoadingSpinner.tsx";
import { QuizCreationHeader } from "../components/quiz/QuizCreationHeader.tsx";
import {SidebarQuizCreation} from "../components/quiz/SidebarQuizCreation.tsx";

export const QuizCreationPage: React.FC = () => {
    const { courseId, folderId, quizId } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: currentQuiz, isLoading: isLoadingQuiz } = useGetQuizById(courseId!, folderId!, quizId!);
    const { data: currentFolder, isLoading: isLoadingFolder } = useGetFolderById(courseId!, folderId!);
    const { data: currentCourse, isLoading: isLoadingCourse } = useGetCourseById(courseId!);
    const [isEditingQuizName, setIsEditingQuizName] = useState(false);
    const [editedQuizName, setEditedQuizName] = useState(currentQuiz?.name || '');
    const { updateQuiz } = useQuizCRUD();
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const { questionBanks, isLoadingQuestionBanks, errorQuestionBanks } = useQuestionBankList();

    const {
        selectedQuestionType,
        questionTemplate,
        setDraftQuestion,
        handleSaveQuestion,
        resetQuestionCreation,
        startQuestionEditing,
        isEditingExistingQuestion
    } = useQuestionCreation();

    const stableSelectedQuestions = useMemo(() => selectedQuestions, [selectedQuestions]);
    const stableQuestionBanks = useMemo(() => questionBanks, [questionBanks]);
    const importedQuestionIds = useMemo(() => currentQuiz?.questions?.map(q => q.id!) || [], [currentQuiz?.questions]);
    useEffect(() => {
        setEditedQuizName(currentQuiz?.name || '');
    }, [currentQuiz?.name]);

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
    };

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

        setSelectedQuestions(prev =>
            prev.includes(questionId) ? prev.filter(q => q !== questionId) : [...prev, questionId]
        );
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

        const updatedQuestions = [...(currentQuiz.questions || []), ...questionsToAdd];

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
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
            <QuizCreationHeader
                course={currentCourse}
                folder={currentFolder}
                quiz={currentQuiz}
                isEditing={isEditingQuizName}
                newName={editedQuizName}
                onEditToggle={() => setIsEditingQuizName(!isEditingQuizName)}
                onNameChange={setEditedQuizName}
                onNameSave={handleQuizNameUpdate}
                onTimeLimitChange={handleTimeLimitChange}
                isSaving={updateQuiz.isLoading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                <div className="lg:hidden absolute top-0 right-0 z-50">
                    <button className="btn btn-ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <BsLayoutSidebar /> : <BsListUl />}
                    </button>
                </div>
                    <SidebarQuizCreation
                        isSidebarOpen={isSidebarOpen}
                        onCloseSidebar={() => setIsSidebarOpen(false)}
                        questions={currentQuiz!.questions || []}
                        onStartEditing={startQuestionEditing}
                        onDeleteQuestion={handleQuestionDelete}
                    />
                <div className="lg:col-span-5 order-first lg:order-none">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="card-title">Question Preview</h3>
                                {selectedQuestionType && (
                                    <button
                                        type="button"
                                        className="btn btn-error gap-2"
                                        onClick={resetQuestionCreation}
                                    >
                                        <XMarkIcon className="h-5 w-5" />
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
