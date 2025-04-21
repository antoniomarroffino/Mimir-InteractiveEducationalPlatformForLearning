import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SpecificQuestionDTO } from "../../hooks/question/useQuestionCreation";
import { QuestionElement } from "./QuestionElement";

interface SortableQuestionElementProps {
    question: SpecificQuestionDTO;
    index: number;
    onDelete?: (id: string) => void;
    onStartEditing?: (q: SpecificQuestionDTO) => void;
}

export const SortableQuestionElement: React.FC<SortableQuestionElementProps> = ({
                                                                                    question,
                                                                                    index,
                                                                                    onDelete,
                                                                                    onStartEditing
                                                                                }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: question.id! });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? transition : "transform 0s",
        zIndex: isDragging ? 999 : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <QuestionElement
                question={question}
                index={index}
                onDelete={onDelete}
                onStartEditing={() => onStartEditing?.(question)}
                dragListeners={listeners}
            />
        </div>
    );
};
