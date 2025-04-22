import React from 'react';
import { QuizDTO } from '@dti-isin/backend-api-client';
import { useNavigate } from 'react-router-dom';
import { BsBarChart, BsPencil, BsRocket, BsTrash } from 'react-icons/bs';

interface QuizActionsMenuProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
    onRequestDelete: () => void;
    onRequestPublish: () => void;
}

export const QuizActionsMenu: React.FC<QuizActionsMenuProps> = ({
                                                                    quiz,
                                                                    courseId,
                                                                    folderId,
                                                                    onRequestDelete,
                                                                    onRequestPublish
                                                                }) => {
    const navigate = useNavigate();

    const ActionButton = ({
                              onClick,
                              icon,
                              label,
                              color
                          }: {
        onClick: () => void;
        icon: React.ReactNode;
        label: string;
        color: string;
    }) => (
        <button
            onClick={onClick}
            className={`group flex flex-col items-center text-${color} hover:text-${color} transition`}
            aria-label={label}
            title={label}
        >
            <div className={`btn btn-sm btn-circle bg-${color}/10 hover:bg-${color}/20`}>
                {icon}
            </div>
            <span className="text-[10px] mt-1 opacity-70 group-hover:opacity-100">
                {label}
            </span>
        </button>
    );

    return (
        <div className="flex gap-3">
            <ActionButton
                onClick={onRequestPublish}
                icon={<BsRocket />}
                label="Publish"
                color="success"
            />
            <ActionButton
                onClick={() =>
                    navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/results`)
                }
                icon={<BsBarChart />}
                label="Results"
                color="info"
            />
            <ActionButton
                onClick={() =>
                    navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/edit`)
                }
                icon={<BsPencil />}
                label="Edit"
                color="primary"
            />
            <ActionButton
                onClick={onRequestDelete}
                icon={<BsTrash />}
                label="Delete"
                color="error"
            />
        </div>
    );
};
