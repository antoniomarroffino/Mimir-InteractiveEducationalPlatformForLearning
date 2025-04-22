import {useNavigate, useParams} from "react-router-dom";
import {useGetQuestionBankById} from "../../hooks/questionBank/useSelectedQuestionBank.ts";
import {useQuestionBankCRUD} from "../../hooks/questionBank/useQuestionBankCRUD.ts";
import React, {useEffect, useState} from "react";
import {Spinner} from "../common/Spinner.tsx";
import {SpecificQuestionDTO, useQuestionCreation} from "../../hooks/question/useQuestionCreation.ts";
import {QuestionTypeSelector} from "../question/QuestionTypeSelector.tsx";
import {QuestionType} from "@dti-isin/backend-api-client";
import {useQuestionCRUD} from "../../hooks/question/useQuestionCRUD.ts";
import {QuestionBankDetailsHeader} from "./QuestionBankDetailsHeader.tsx";
import {DeleteQuestionBankDialog} from "./DeleteQuestionBankPopup.tsx";
import {SidebarQuestionList} from "../question/SidebarQuestionList.tsx";
import {QuestionEditorCard} from "../question/QuestionEditorCard.tsx";
import {EmptyQuestionTypeCard} from "../question/EmptyQuestionTypeCard.tsx";
import {ErrorAlert} from "../common/ErrorAlert.tsx";
import {ThreeColumnLayout} from "../common/ThreeColumnLayout.tsx";

const QuestionBankDetails: React.FC = () => {
    const {questionBankId} = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const {data: questionBank, isLoading, error: errorGetQuestionBank} = useGetQuestionBankById(questionBankId!);
    const {updateQuestionBank, deleteQuestionBank, reorderQuestionBank} = useQuestionBankCRUD();
    const {deleteQuestion} = useQuestionCRUD();
    const {
        isCreatingQuestion,
        selectedQuestionType,
        questionTemplate,
        draftQuestion,
        handleTypeSelection,
        handleSaveQuestion,
        setDraftQuestion,
        resetQuestionCreation,
        startQuestionCreation,
        startQuestionEditing,
        isEditingExistingQuestion
    } = useQuestionCreation();

    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [isCreatingQuestion, isSidebarOpen, selectedQuestionType]);

    const saveNewQuestion = async (questionDTO: SpecificQuestionDTO) => {
        if (questionDTO) {
            questionDTO = {
                ...questionDTO,
                questionBankId: questionBank!.id,
            }
            await handleSaveQuestion(questionDTO);
        }
    }

    const handleUpdateName = async () => {
        if (questionBank && newName.trim() && questionBank.name !== newName) {
            await updateQuestionBank(questionBank.id!, {name: newName});
            setEditMode(false);
        }
    };

    const handleDelete = async () => {
        if (questionBank) {
            await deleteQuestionBank(questionBank.id!);
            navigate('/question_banks');
        }
    };

    const handleReorderQuestions = async (reorderedQuestions: SpecificQuestionDTO[]) => {
        if (!questionBank) return;
        const orderedIds = reorderedQuestions.map(q => q.id!);
        await reorderQuestionBank(questionBank.id!, orderedIds);
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (questionBank?.id) {
            await deleteQuestion(questionId, questionBank.id);
        }
    };

    if (isLoading) return <Spinner size="lg"/>;

    if (errorGetQuestionBank) {
        return <ErrorAlert title="Error loading question bank!" message={errorGetQuestionBank.message}/>
    }

    if (!questionBank) {
        return <ErrorAlert title="Error loading question bank!" message={"Question bank not found!"}/>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-6 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <QuestionBankDetailsHeader
                    questionBankDTO={questionBank}
                    isEditing={editMode}
                    newName={newName}
                    onEditToggle={() => {
                        setNewName(questionBank.name);
                        setEditMode(!editMode);
                    }}
                    onNameChange={setNewName}
                    onNameSave={handleUpdateName}
                    onDeleteClick={() => setShowDeleteDialog(true)}
                />

                <DeleteQuestionBankDialog
                    isOpen={showDeleteDialog}
                    onCancel={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    questionBankName={questionBank.name}
                    questionCount={questionBank.questions?.length || 0}
                />

                <ThreeColumnLayout
                    isSidebarOpen={isSidebarOpen}
                    onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    onSidebarClose={() => setIsSidebarOpen(false)}
                    lgSidebarCols={4}
                    lgMainCols={5}
                    lgRightCols={3}
                    sidebarContent={
                        <SidebarQuestionList
                            isSidebarOpen={isSidebarOpen}
                            onClose={() => setIsSidebarOpen(false)}
                            questions={questionBank.questions || []}
                            onStartEditing={startQuestionEditing}
                            onDeleteQuestion={handleDeleteQuestion}
                            onReorder={handleReorderQuestions}
                            onStartCreation={startQuestionCreation}
                            draftQuestion={draftQuestion}
                            selectedQuestionType={selectedQuestionType ?? undefined}
                            isCreatingQuestion={isCreatingQuestion}
                        />
                    }
                    mainContent={
                        <QuestionEditorCard
                            isCreatingQuestion={isCreatingQuestion}
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
                            onQuestionTextChange={(text) => setDraftQuestion(prev => ({...prev, questionText: text}))}
                        />
                    }
                    rightContent={
                        isCreatingQuestion ? (
                            <QuestionTypeSelector
                                onSelectType={handleTypeSelection}
                                isLoading={false}
                                disabled={false}
                                currentType={selectedQuestionType}
                            />
                        ) : (
                            <EmptyQuestionTypeCard/>
                        )
                    }
                />
            </div>
        </div>
    );
};

export default QuestionBankDetails;
