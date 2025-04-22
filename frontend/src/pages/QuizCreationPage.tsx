import { useParams } from 'react-router-dom';
import { QuestionDTO, QuestionType } from '@dti-isin/backend-api-client';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuizCRUD } from "../hooks/quiz/useQuizCRUD.ts";
import { useQuestionBankList } from "../hooks/questionBank/useQuestionBankList.ts";
import { QuestionBankList } from "../components/quiz/QuestionBankList.tsx";
import { SpecificQuestionDTO, useQuestionCreation } from "../hooks/question/useQuestionCreation.ts";
import { useGetQuizById } from "../hooks/quiz/useGetQuizById.ts";
import { useGetCourseById } from "../hooks/course/useGetCourseById.ts";
import { useGetFolderById } from "../hooks/folder/useGetFolderById.ts";
import { LoadingSpinner } from "../components/common/LoadingSpinner.tsx";
import { QuizCreationHeader } from "../components/quiz/QuizCreationHeader.tsx";
import { SidebarQuizCreation } from "../components/quiz/SidebarQuizCreation.tsx";
import { QuestionEditorPreview } from "../components/quiz/QuestionEditorPreview.tsx";
import { ThreeColumnLayout } from "../components/common/ThreeColumnLayout.tsx";

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
        }).catch(console.error);
    }, [courseId, folderId, quizId, currentQuiz, updateQuiz]);

    const saveNewQuestion = async (questionDTO: SpecificQuestionDTO) => {
        if (questionDTO) await handleSaveQuestion(questionDTO);
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
        const bankQuestionIds = bank?.questions?.map(q => q.id).filter(id => !currentQuiz!.questions?.some(q => q.id === id)).filter((id): id is string => id !== undefined) || [];
        setSelectedQuestions(prev => [...new Set([...prev, ...bankQuestionIds])]);
    }, [questionBanks, currentQuiz]);

    const handleImportQuestions = useCallback(async () => {
        if (!currentQuiz || !folderId || !quizId) return;
        const questionsToAdd = selectedQuestions.map(id => {
            for (const bank of questionBanks) {
                const question = bank.questions?.find(q => q.id === id);
                if (question) return question;
            }
            return null;
        }).filter(q => q !== null) as QuestionDTO[];

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
            if (questionTemplate?.id === questionId) resetQuestionCreation();
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    if (isLoadingQuiz || isLoadingFolder || isLoadingCourse || isLoadingQuestionBanks || !currentQuiz || !currentCourse || !currentFolder) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-6 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
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

            <ThreeColumnLayout
                isSidebarOpen={isSidebarOpen}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onSidebarClose={() => setIsSidebarOpen(false)}
                lgSidebarCols={3}
                lgMainCols={5}
                lgRightCols={4}
                sidebarTitle="Quiz Questions"
                sidebarContent={
                    <SidebarQuizCreation
                        isSidebarOpen={isSidebarOpen}
                        onCloseSidebar={() => setIsSidebarOpen(false)}
                        questions={currentQuiz.questions || []}
                        onStartEditing={startQuestionEditing}
                        onDeleteQuestion={handleQuestionDelete}
                    />
                }
                mainContent={
                    <QuestionEditorPreview
                        selectedQuestionType={selectedQuestionType}
                        questionTemplate={questionTemplate || {
                            questionText: '',
                            type: QuestionType.TrueFalse,
                            correctAnswer: true,
                            points: 1
                        }}
                        isEditingExistingQuestion={isEditingExistingQuestion}
                        onCancel={resetQuestionCreation}
                        onSave={saveNewQuestion}
                        onQuestionTextChange={(text) => setDraftQuestion(prev => ({ ...prev, questionText: text }))}
                        isDisabled={!selectedQuestionType}
                    />
                }
                rightContent={
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
                }
            />
        </div>
        </div>
    );
};
