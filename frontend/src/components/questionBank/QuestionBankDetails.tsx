import {useNavigate, useParams} from "react-router-dom";
import {useGetQuestionBankById} from "../../hooks/questionBank/useSelectedQuestionBank.ts";
import {useQuestionBankCRUD} from "../../hooks/questionBank/useQuestionBankCRUD.ts";
import React, {useState} from "react";
import {Spinner} from "../common/Spinner.tsx";
import {SpecificQuestionDTO, useQuestionCreation} from "../../hooks/question/useQuizQuestionCreation.ts";
import {BsLayoutSidebar, BsListTask, BsListUl, BsPlusCircle, BsQuestionDiamond} from "react-icons/bs";
import {QuestionsList} from "../question/QuestionList.tsx";
import {DraftQuestionElement} from "../question/DraftQuestionElement.tsx";
import {CreateQuestionForm} from "../question/CreateQuestionForm.tsx";
import {QuestionEditor} from "../question/QuestionEditor.tsx";
import {QuestionTypeSelector} from "../question/QuestionTypeSelector.tsx";
import {QuestionType} from "@dti-isin/backend-api-client";

const QuestionBankDetails: React.FC = () => {
    const {questionBankId} = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {data: questionBank, isLoading, error: errorGetQuestionBank} = useGetQuestionBankById(questionBankId!);
    const {updateQuestionBank, deleteQuestionBank} = useQuestionBankCRUD();
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
    } = useQuestionCreation();


    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState('');

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
        if (questionBank && newName.trim()) {
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
        <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5 min-h-screen">
            <div className="container mx-auto px-4">
                {/*Breadcrumb*/}

                {/* Main Content */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-base-content/90 flex items-center gap-3">
                            <BsListTask className="text-primary"/>
                            {questionBank.name}
                        </h1>
                        <p className="text-base-content/70 mt-2 flex items-center gap-2 text-sm md:text-base">
                            <BsQuestionDiamond className="text-primary/70"/>
                            {questionBank.questions?.length || 0} questions
                        </p>
                    </div>
                    {!isCreatingQuestion && (
                        <button
                            className="btn btn-primary btn-sm md:btn-lg flex items-center gap-2"
                            onClick={startQuestionCreation}
                        >
                            <BsPlusCircle className="text-xl"/>
                            <span className="hidden md:inline">Create Question</span>
                        </button>
                    )}
                </div>

                {error && (
                    <div className="alert alert-error mb-4 shadow-lg">
                        {error}
                    </div>
                )}

                {questionBank.questions?.length === 0 && (
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
                        bg-base-100 
                        lg:bg-transparent 
                        p-6 
                        lg:p-0
                    `}>
                        <div className="bg-base-100 rounded-xl p-6 shadow-xl space-y-6">
                            <QuestionsList
                                questions={questionBank.questions || []}
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
                            onSave={saveNewQuestion}
                            onCancel={resetQuestionCreation}
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
                                <BsQuestionDiamond className="text-6xl mx-auto mb-4 text-base-content/30"/>
                                <h2 className="text-lg font-semibold mb-3">Question Type</h2>
                                <p className="text-base-content/70">
                                    Select "Create New Question" to start
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}

            </div>
        </section>
    );
};

export default QuestionBankDetails;