import {useNavigate, useParams} from "react-router-dom";
import {useGetQuestionBankById} from "../../hooks/questionBank/useSelectedQuestionBank.ts";
import {useQuestionBankCRUD} from "../../hooks/questionBank/useQuestionBankCRUD.ts";
import React, {useEffect, useState} from "react";
import {Spinner} from "../common/Spinner.tsx";
import {SpecificQuestionDTO, useQuestionCreation} from "../../hooks/question/useQuestionCreation.ts";
import {
    BsLayoutSidebar,
    BsListUl,
    BsQuestionDiamond,
} from "react-icons/bs";
import {QuestionsList} from "../question/QuestionList.tsx";
import {DraftQuestionElement} from "../question/DraftQuestionElement.tsx";
import {QuestionEditor} from "../question/QuestionEditor.tsx";
import {QuestionTypeSelector} from "../question/QuestionTypeSelector.tsx";
import {QuestionType} from "@dti-isin/backend-api-client";
import {XMarkIcon} from "@heroicons/react/16/solid";
import {useQuestionCRUD} from "../../hooks/question/useQuestionCRUD.ts";
import {QuestionBankDetailsHeader} from "./QuestionBankDetailsHeader.tsx";
import {DeleteQuestionBankDialog} from "./DeleteQuestionBankPopup.tsx";

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
    }, [isCreatingQuestion, selectedQuestionType]);

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

    if (isLoading) {
        return <Spinner size="lg"/>;
    }

    if (errorGetQuestionBank) {
        return (
            <div className="alert alert-error shadow-lg mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                    <h3 className="font-bold">Error loading question bank!</h3>
                    <div className="text-xs">{errorGetQuestionBank.message}</div>
                </div>
            </div>
        );
    }

    if (!questionBank) {
        return <div>Question bank not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                    <div className="lg:hidden absolute top-0 right-0 z-50">
                        <button
                            className="btn btn-ghost"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <BsLayoutSidebar/> : <BsListUl/>}
                        </button>
                    </div>

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
                        bg-base-100/95 
                        backdrop-blur-sm
                        lg:bg-transparent 
                        px-6 pb-6 pt-0 
                        overflow-y-auto
                    `}>
                        <div className="bg-base-100 rounded-xl px-6 pb-6 shadow-xl space-y-6">
                            <div className="flex justify-between items-center mb-2">
                                <button
                                    className="btn btn-circle btn-sm lg:hidden"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <XMarkIcon className="w-4 h-4"/>
                                </button>
                            </div>
                            <QuestionsList
                                questions={questionBank.questions || []}
                                onStartEditing={startQuestionEditing}
                                onDeleteQuestion={handleDeleteQuestion}
                                onReorder={handleReorderQuestions}
                                onStartCreation={startQuestionCreation}
                                draftQuestionElement={
                                    isCreatingQuestion ? (
                                        <DraftQuestionElement
                                            questionText={draftQuestion.questionText}
                                            questionType={selectedQuestionType!}
                                        />
                                    ) : undefined
                                }
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-5 order-first lg:order-none">
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="card-title">
                                        {isCreatingQuestion ? "New Question" : "Question Editor"}
                                    </h3>
                                    {isCreatingQuestion && (
                                        <button
                                            onClick={resetQuestionCreation}
                                            className="btn btn-outline btn-secondary gap-2 hover:bg-secondary/10"
                                        >
                                            <XMarkIcon className="w-5 h-5"/>
                                            Discard Draft
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
                                    disabled={!isCreatingQuestion || !selectedQuestionType}
                                    isEditingExistingQuestion={isEditingExistingQuestion}
                                />
                            </div>
                        </div>
                    </div>

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
                                <BsQuestionDiamond className="text-6xl mx-auto mb-4 text-base-content/30"/>
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

export default QuestionBankDetails;
