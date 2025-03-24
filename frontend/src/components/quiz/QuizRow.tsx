import React, {useState} from 'react';
import {QuizDTO} from '@dti-isin/backend-api-client';
import {BsPencil, BsRocket, BsTrash} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
import {useQuizPublicationCRUD} from '../../hooks/quizPublication/useQuizPublicationCRUD.ts';
import {useQuizPublicationVerification} from '../../hooks/quizPublication/useQuizPublicationVerification.ts';
import {useQuizCRUD} from "../../hooks/quiz/useQuizCRUD.ts";

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
    const {deleteQuiz} = useQuizCRUD();
    const navigate = useNavigate();

    const {createPublication, isCreatingPublication: isPublishing} = useQuizPublicationCRUD();
    const {getPublicationByReferences} = useQuizPublicationVerification();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [publishError, setPublishError] = useState<string | null>(null);


    const handlePublishQuiz = async () => {
        try {
            setPublishError(null);

            const existing = await getPublicationByReferences(
                courseId,
                folderId,
                quiz.id!
            );

            if (existing?.published) {
                navigate(`/courses/${courseId}/publications/${existing.id}/stats`);
                return;
            }

            setShowPublishModal(true);

        } catch (error) {
            handlePublishError(error);
        }
    };

    const confirmPublish = async () => {
        try {
            setPublishError(null);

            const publication = await createPublication({
                courseId,
                folderId,
                quizId: quiz.id!,
                published: true
            });

            if (!publication?.id) {
                throw new Error('Pubblicazione creata senza ID valido');
            }
            navigate(`/courses/${courseId}/publications/${publication.id}/stats`);

        } catch (error) {
            handlePublishError(error);
        } finally {
            setShowPublishModal(false);
        }
    };

    const handlePublishError = (error: unknown) => {
        console.error('Errore nella pubblicazione:', error);
        setPublishError(
            error instanceof Error
                ? error.message
                : 'Errore sconosciuto durante la pubblicazione'
        );
    };

    // Naviga alla pagina di modifica del quiz
    const handleUpdateQuiz = () => {
        navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/edit`);
    };

    // Elimina il quiz
    const handleDeleteQuiz = async () => {
        try {
            setError(null);
            await deleteQuiz(quiz.id!);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Eliminazione quiz fallita:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Impossibile eliminare il quiz'
            );
        }
    };

    return (
        <>
            <div className="p-3 bg-base-200 rounded flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span>{quiz.name}</span>

                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePublishQuiz}
                        className="btn btn-sm btn-ghost"
                        title="Pubblica quiz"
                    >
                        <BsRocket className="text-success"/>
                    </button>
                    <button
                        onClick={handleUpdateQuiz}
                        className="btn btn-sm btn-ghost"
                        title="Modifica quiz"
                    >
                        <BsPencil className="text-primary"/>
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="btn btn-sm btn-ghost"
                        title="Elimina quiz"
                    >
                        <BsTrash className="text-error"/>
                    </button>
                </div>
            </div>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Conferma pubblicazione</h3>
                        {publishError && (
                            <div className="alert alert-error mt-4">
                                {publishError}
                            </div>
                        )}
                        <p className="py-4">
                            Sei sicuro di voler pubblicare il quiz "{quiz.name}"?<br/>
                            Una volta pubblicato, sarà accessibile agli studenti tramite codice.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-success"
                                onClick={confirmPublish}
                                disabled={isPublishing}
                            >
                                {isPublishing ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    'Pubblica'
                                )}
                            </button>
                            <button
                                className="btn"
                                onClick={() => setShowPublishModal(false)}
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
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
                            >
                                Elimina
                            </button>
                            <button
                                className="btn"
                                onClick={() => setShowDeleteModal(false)}
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