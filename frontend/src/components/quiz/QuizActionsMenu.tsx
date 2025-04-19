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

    return (
        <div className="flex gap-2">
            <button
                onClick={onRequestPublish}
                className="btn btn-sm btn-ghost"
                title="Publish Quiz"
            >
                <BsRocket className="text-success" />
            </button>
            <button
                onClick={() => navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/results`)}
                className="btn btn-sm btn-ghost"
                title="View Results"
            >
                <BsBarChart className="text-info" />
            </button>
            <button
                onClick={() => navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/edit`)}
                className="btn btn-sm btn-ghost"
                title="Edit Quiz"
            >
                <BsPencil className="text-primary" />
            </button>
            <button
                onClick={onRequestDelete}
                className="btn btn-sm btn-ghost"
                title="Delete Quiz"
            >
                <BsTrash className="text-error" />
            </button>
        </div>
    );
};
