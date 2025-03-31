import {useNavigate, useParams} from "react-router-dom";
import {useGetQuestionBankById} from "../../hooks/questionBank/useSelectedQuestionBank.ts";
import {useQuestionBankCRUD} from "../../hooks/questionBank/useQuestionBankCRUD.ts";
import React, {useEffect, useState} from "react";
import {Spinner} from "../common/Spinner.tsx";
import {SpecificQuestionDTO, useQuestionCreation} from "../../hooks/question/useQuestionCreation.ts";
import {
    BsLayoutSidebar,
    BsListTask,
    BsListUl,
    BsPencil,
    BsPlusCircle,
    BsQuestionDiamond,
    BsTrash
} from "react-icons/bs";
import {QuestionsList} from "../question/QuestionList.tsx";
import {DraftQuestionElement} from "../question/DraftQuestionElement.tsx";
import {CreateQuestionForm} from "../question/CreateQuestionForm.tsx";
import {QuestionEditor} from "../question/QuestionEditor.tsx";
import {QuestionTypeSelector} from "../question/QuestionTypeSelector.tsx";
import {QuestionType} from "@dti-isin/backend-api-client";
import {CheckIcon, XMarkIcon} from "@heroicons/react/16/solid";
import {format} from "date-fns";
import {LightBulbIcon} from "@heroicons/react/24/outline";
import {useQuestionCRUD} from "../../hooks/question/useQuestionCRUD.ts";
import {BreadcrumbQuestionBank} from "../common/BreadcrumbQuestionBank.tsx";

const QuestionBankDetails: React.FC = () => {
    const {questionBankId} = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {data: questionBank, isLoading, error: errorGetQuestionBank} = useGetQuestionBankById(questionBankId!);
    const {updateQuestionBank, deleteQuestionBank} = useQuestionBankCRUD();
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

    const handleDeleteQuestion = async (questionId: string) => {
        if (questionBank) {
            await deleteQuestion(questionId, questionBankId!);
        }
    }

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
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
            <BreadcrumbQuestionBank questionBankDTO={questionBank}/>
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div className="flex-1 flex items-center gap-4 bg-base-100 p-4 rounded-xl shadow-sm">
                    {editMode ? (
                        <div className="flex-1 flex items-center gap-3">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="text-3xl font-bold bg-transparent border-b-2 border-primary focus:outline-none flex-1"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdateName}
                                    className="btn btn-circle btn-sm btn-success"
                                    disabled={questionBank.name === newName}
                                >
                                    <CheckIcon className="w-4 h-4"/>
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="btn btn-circle btn-sm btn-error"
                                >
                                    <XMarkIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <BsListTask className="text-primary w-8 h-8 shrink-0"/>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-3xl font-bold text-primary truncate">
                                        {questionBank.name}
                                    </h1>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-ghost btn-square hover:bg-primary/10 p-2"
                                            onClick={() => {
                                                setNewName(questionBank.name);
                                                setEditMode(true);
                                            }}
                                        >
                                            <BsPencil className="text-lg text-primary"/>
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-square hover:bg-error/10 p-2"
                                            onClick={() => (document.getElementById('delete_question_bank_modal') as HTMLDialogElement)?.showModal()}
                                        >
                                            <BsTrash className="text-lg text-error"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-base-content/60 mt-1">
                        <span className="flex items-center gap-1">
                            <BsQuestionDiamond/>
                            {questionBank.questions?.length || 0} questions
                        </span>
                                    <span>•</span>
                                    <span>
                            Last modified: {format(new Date(questionBank.lastModified!), 'dd MMM yyyy HH:mm')}
                        </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div
                    className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3 flex-1 max-w-lg mx-4">
                    <LightBulbIcon className="w-6 h-6 text-primary shrink-0"/>
                    <div className="text-base-content/70 text-sm">
                        Quality questions create quality minds!
                    </div>
                </div>

                {!isCreatingQuestion && (
                    <button
                        className="btn btn-primary gap-2 shrink-0"
                        onClick={startQuestionCreation}
                    >
                        <BsPlusCircle className="text-xl"/>
                        <span>New Question</span>
                    </button>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <dialog id="delete_question_bank_modal" className="modal">
                <div className="modal-box bg-base-100 border border-error/20">
                    <form method="dialog" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-error/10 text-error">
                                <BsTrash className="text-2xl"/>
                            </div>
                            <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        </div>

                        <p className="py-4 text-base-content/80">
                            You're about to permanently delete <strong>{questionBank.name} </strong>
                            and all its {questionBank.questions?.length} questions.
                            <span className="block mt-2 text-error/80">This action cannot be undone!</span>
                        </p>

                        <div className="modal-action flex justify-end gap-3">
                            <button className="btn btn-ghost">Cancel</button>
                            <button
                                className="btn btn-error gap-2"
                                onClick={handleDelete}
                            >
                                <BsTrash/>
                                Delete Permanently
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

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
    bg-base-100/95 
    backdrop-blur-sm
    lg:bg-transparent 
    p-6 
    lg:p-0
    overflow-y-auto
`}>
                    <div className="bg-base-100 rounded-xl p-6 shadow-xl space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Questions</h3>
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
                                    correctAnswer: true
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
    );
};

export default QuestionBankDetails;