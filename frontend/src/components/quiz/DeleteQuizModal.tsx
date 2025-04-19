import React from 'react';
import { BsTrash } from 'react-icons/bs';
import { FiAlertCircle } from 'react-icons/fi';
import { QuizDTO } from '@dti-isin/backend-api-client';
import { useQuizCRUD } from '../../hooks/quiz/useQuizCRUD';
import {BaseModal} from "./BaseModal.tsx";

interface DeleteQuizModalProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
    onClose: () => void;
    error: string | null;
    setError: (msg: string | null) => void;
}

export const DeleteQuizModal: React.FC<DeleteQuizModalProps> = ({
                                                                    quiz,
                                                                    courseId,
                                                                    folderId,
                                                                    onClose,
                                                                    error,
                                                                    setError
                                                                }) => {
    const { deleteQuiz } = useQuizCRUD();

    const handleDelete = async () => {
        try {
            setError(null);
            await deleteQuiz(courseId, folderId, quiz.id!);
            onClose();
        } catch (err) {
            console.error('Quiz deletion failed:', err);
            setError(err instanceof Error ? err.message : 'Unable to delete the quiz');
        }
    };

    return (
        <BaseModal
            title="Confirm Deletion"
            icon={<BsTrash className="text-error text-2xl" />}
            onClose={onClose}
            actions={
                <>
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-error gap-2" onClick={handleDelete}>
                        <BsTrash />
                        Delete Permanently
                    </button>
                </>
            }
        >
            {error && (
                <div className="alert alert-error">
                    <FiAlertCircle className="text-lg" />
                    {error}
                </div>
            )}

            <p className="py-4 text-base-content/80">
                You're about to permanently delete <strong>{quiz.name}</strong>.<br />
                This action cannot be undone.
            </p>
        </BaseModal>
    );
};
