import React, { useState } from "react";
import { QuestionElement } from './QuestionElement';
import { SpecificQuestionDTO } from "../../hooks/question/useQuestionCreation";
import {
    DndContext,
    closestCenter,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface QuestionsListProps {
    questions: SpecificQuestionDTO[];
    onStartEditing?: (question: SpecificQuestionDTO) => void;
    onDeleteQuestion?: (questionId: string) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
                                                                questions: initialQuestions,
                                                                onStartEditing,
                                                                onDeleteQuestion
                                                            }) => {
    const [questions, setQuestions] = useState(initialQuestions);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = questions.findIndex(q => q.id === active.id);
            const newIndex = questions.findIndex(q => q.id === over?.id);

            const newOrder = arrayMove(questions, oldIndex, newIndex);
            setQuestions(newOrder);
        }
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Questions</h2>

            {questions.length === 0 ? (
                <p className="text-center text-base-content/70">No questions yet</p>
            ) : (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={questions.map(q => q.id!)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {questions.map((question, index) => (
                                <SortableQuestionElement
                                    key={question.id}
                                    question={question}
                                    index={index}
                                    onDelete={onDeleteQuestion}
                                    onStartEditing={onStartEditing}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
};

interface SortableQuestionElementProps {
    question: SpecificQuestionDTO;
    index: number;
    onDelete?: (id: string) => void;
    onStartEditing?: (q: SpecificQuestionDTO) => void;
}

const SortableQuestionElement: React.FC<SortableQuestionElementProps> = ({ question, index, onDelete, onStartEditing }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id! });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <QuestionElement
                question={question}
                index={index}
                onDelete={onDelete}
                onStartEditing={() => onStartEditing?.(question)}
            />
        </div>
    );
};
