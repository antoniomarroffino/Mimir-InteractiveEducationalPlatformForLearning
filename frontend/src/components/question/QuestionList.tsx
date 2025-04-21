import React from "react";
import { SpecificQuestionDTO } from "../../hooks/question/useQuestionCreation";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { SortableQuestionElement } from "./SortableQuestionElement";
import { CreateQuestionForm } from "./CreateQuestionForm.tsx";

interface QuestionsListProps {
    questions: SpecificQuestionDTO[];
    onStartEditing?: (question: SpecificQuestionDTO) => void;
    onDeleteQuestion?: (questionId: string) => void;
    onReorder?: (reorderedQuestions: SpecificQuestionDTO[]) => void;
    onStartCreation?: () => void;
    draftQuestionElement?: React.ReactNode;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
                                                                questions,
                                                                onStartEditing,
                                                                onDeleteQuestion,
                                                                onReorder,
                                                                onStartCreation,
                                                                draftQuestionElement
                                                            }) => {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = questions.findIndex(q => q.id === active.id);
            const newIndex = questions.findIndex(q => q.id === over!.id);
            const newOrder = arrayMove(questions, oldIndex, newIndex);
            onReorder?.(newOrder);
        }
    };

    return (
        <div className="flex flex-col gap-6">

        <h2 className="text-lg font-semibold">Questions</h2>

            <div className="flex-1 max-h-[400px] overflow-y-auto pr-2">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={questions.map(q => q.id!)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {questions.length === 0 && (
                                <p className="text-center text-base-content/70">No questions yet</p>
                            )}
                            {questions.map((question, index) => (
                                <SortableQuestionElement
                                    key={question.id}
                                    question={question}
                                    index={index}
                                    onDelete={onDeleteQuestion}
                                    onStartEditing={onStartEditing}
                                />
                            ))}
                            {draftQuestionElement && (
                                <div>{draftQuestionElement}</div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div className="pt-2">
                <CreateQuestionForm onStartCreation={onStartCreation ?? (() => {})} />
            </div>
        </div>
    );
};
