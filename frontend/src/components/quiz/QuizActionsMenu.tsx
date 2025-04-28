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
            className={`group flex flex-col items-center text-${color} hover:text-${color} transition-all duration-200 w-14 sm:w-16`}
            aria-label={label}
            title={label}
        >
            <div
                className={`btn btn-xs sm:btn-sm btn-circle bg-${color}/10 hover:bg-${color}/20`}
            >
                {icon}
            </div>
            <span className="text-[8px] sm:text-[10px] mt-1 opacity-70 group-hover:opacity-100 text-center leading-tight truncate">
                {label}
            </span>
        </button>
    );

    return (
        <div className="flex justify-end items-center gap-2 sm:gap-3 overflow-hidden max-w-full min-w-0">
            <ActionButton
                onClick={onRequestPublish}
                icon={<BsRocket className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Publish"
                color="success"
            />
            <ActionButton
                onClick={() =>
                    navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/results`)
                }
                icon={<BsBarChart className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Results"
                color="info"
            />
            <ActionButton
                onClick={() =>
                    navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/edit`)
                }
                icon={<BsPencil className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Edit"
                color="primary"
            />
            <ActionButton
                onClick={onRequestDelete}
                icon={<BsTrash className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Delete"
                color="error"
            />
        </div>
    );
};
