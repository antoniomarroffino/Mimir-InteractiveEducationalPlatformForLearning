import React, { useState } from 'react';
import { QuizDTO } from '@dti-isin/backend-api-client';
import { BsTrash, BsPencil } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../hooks/useQuiz';

interface QuizRowProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
}

export const QuizRow: React.FC<QuizRowProps> = ({
                                                    quiz,
                                                    courseId,
                                                    folderId,
                                                }) => {
    const { deleteQuiz } = useQuiz();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateQuiz = () => {
        navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/edit`);
    };

    const handleDeleteQuiz = async () => {
        try {
            setIsDeleting(true);
            setError(null);
            await deleteQuiz(quiz.id!);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete quiz:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete quiz');
        } finally {
            setIsDeleting(false);
        }
    };



    return (
        <>
            <div className="p-3 bg-base-200 rounded flex justify-between items-center">
                <span>{quiz.name}</span>
                <div className="flex gap-2">

                    <button
                        onClick={handleUpdateQuiz}
                        className="btn btn-sm btn-ghost"
                        title="Modifica quiz"
                    >
                        <BsPencil className="text-primary" />
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="btn btn-sm btn-ghost"
                        title="Elimina quiz"
                    >
                        <BsTrash className="text-error" />
                    </button>
                </div>
            </div>



            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Conferma eliminazione</h3>
                        {error && (
                            <div className="alert alert-error mt-4">
                                {error}
                            </div>
                        )}
                        <p className="py-4">
                            Sei sicuro di voler eliminare "{quiz.name}"?
                            Questa azione è irreversibile.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={handleDeleteQuiz}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    'Elimina'
                                )}
                            </button>
                            <button
                                className="btn"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};