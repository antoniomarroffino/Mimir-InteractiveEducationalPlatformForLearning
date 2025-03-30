import React, {useState} from 'react';
import {QuizDTO} from '@dti-isin/backend-api-client';
import {BsBarChart, BsPencil, BsRocket, BsTrash} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
import {useQuizPublicationCRUD} from '../../hooks/quizPublication/useQuizPublicationCRUD.ts';
import {useQuizPublicationVerification} from '../../hooks/quizPublication/useQuizPublicationVerification.ts';
import {useQuizCRUD} from "../../hooks/quiz/useQuizCRUD.ts";
import {FiAlertCircle} from "react-icons/fi";

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

    const handleResults = async () => {
        try {

            const existing = await getPublicationByReferences(
                courseId,
                folderId,
                quiz.id!
            );


            navigate(`/courses/${courseId}/publications/${existing!.id}/results`);


        } catch (error) {
            handlePublishError(error);
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
            await deleteQuiz(folderId, quiz.id!);
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
            <div
                className="p-4 bg-base-100 rounded-lg flex justify-between items-center border-2 border-base-200 hover:border-primary/30 shadow-sm hover:shadow-xs transition-all duration-200 ease-out">
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
                        onClick={handleResults}
                        className="btn btn-sm btn-ghost"
                        title="Vedi Risultati"
                    >
                        <BsBarChart className="text-info"/>
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
                <dialog
                    id="delete_course_modal"
                    open={showDeleteModal}
                    className="modal"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <div className="modal-box bg-base-100 border border-error/20">
                        <form method="dialog" className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-error/10 text-error">
                                    <BsTrash className="text-2xl"/>
                                </div>
                                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                            </div>

                            {error && (
                                <div className="alert alert-error">
                                    <FiAlertCircle className="text-lg"/>
                                    {error}
                                </div>
                            )}

                            <p className="py-4 text-base-content/80">
                                You're about to permanently delete <strong>{quiz.name}</strong>.
                                This action cannot be undone.
                            </p>

                            <div className="modal-action flex justify-end gap-3">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-error gap-2"
                                    onClick={handleDeleteQuiz}
                                >
                                    <BsTrash/>
                                    Delete Permanently
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </>
    );
};