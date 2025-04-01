import React, { useState } from 'react';
import { QuizDTO } from '@dti-isin/backend-api-client';
import {BsBarChart, BsPencil, BsPersonCheck, BsRocket, BsShieldLock, BsTrash} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useQuizPublicationCRUD } from '../../hooks/quizPublication/useQuizPublicationCRUD.ts';
import { useQuizCRUD } from "../../hooks/quiz/useQuizCRUD.ts";
import { FiAlertCircle } from "react-icons/fi";
import { useGetQuizPublicationsByQuizId } from "../../hooks/quizPublication/useGetQuizPublicationsByQuizId.ts";
import { LoadingSpinner } from "../common/LoadingSpinner.tsx";
import {AnimatePresence, motion} from 'framer-motion';
import {ErrorToast} from "../common/ErrorToast.tsx";

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
    const { deleteQuiz } = useQuizCRUD();
    const navigate = useNavigate();

    const { createPublication, isCreatingPublication: isPublishing } = useQuizPublicationCRUD();
    const { data: quizPublications, isLoading: isLoadingQuizPublications } = useGetQuizPublicationsByQuizId(quiz.id!);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [publishError, setPublishError] = useState<string | null>(null);

    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

    const [showPublicationError, setShowPublicationError] = useState(false);

    if (isLoadingQuizPublications) {
        return <LoadingSpinner fullScreen />;
    }

    const handlePublishQuiz = async () => {
        try {
            setPublishError(null);

            const existingPublication = quizPublications?.find(publication => publication.published);

            if (existingPublication) {
                navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/publications/${existingPublication.id}`);
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
                published: true,
                anonymous: isAnonymous
            });

            if (!publication?.id) {
                console.error('Publication created without a valid ID');
            }
            navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/publications/${publication.id}`);

        } catch (error) {
            handlePublishError(error);
        } finally {
            setShowPublishModal(false);
            setIsAnonymous(false);
        }
    };

    const handleResults = async () => {
        navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/results`);
    };

    const handlePublishError = (error: unknown) => {
        console.error('Error in publication:', error);
        setPublishError(
            error instanceof Error
                ? error.message
                : 'Unknown error during publication'
        );
    };

    const handleUpdateQuiz = () => {
        const activePublication = quizPublications?.find(publication => publication.published);
        if (activePublication) {
            setShowPublicationError(true);
            return;
        }
        navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/edit`);
    };

    const handleDeleteQuiz = async () => {
        try {
            setError(null);
            await deleteQuiz(courseId, folderId, quiz.id!);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Quiz deletion failed:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to delete the quiz'
            );
        }
    };

    return (
        <>
            <div
                className="p-4 bg-base-100 rounded-lg flex justify-between items-center border-2 border-base-200 hover:border-primary/30 shadow-sm hover:shadow-xs transition-all duration-200 ease-out"
            >
                <div className="flex items-center gap-2">
                    <span>{quiz.name}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePublishQuiz}
                        className="btn btn-sm btn-ghost"
                        title="Publish Quiz"
                    >
                        <BsRocket className="text-success" />
                    </button>
                    <button
                        onClick={handleResults}
                        className="btn btn-sm btn-ghost"
                        title="View Results"
                    >
                        <BsBarChart className="text-info" />
                    </button>
                    <button
                        onClick={handleUpdateQuiz}
                        className="btn btn-sm btn-ghost"
                        title="Edit Quiz"
                    >
                        <BsPencil className="text-primary" />
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="btn btn-sm btn-ghost"
                        title="Delete Quiz"
                    >
                        <BsTrash className="text-error" />
                    </button>
                </div>
            </div>

            {/* Publish Modal */}
            {showPublishModal && (
                <div className="modal modal-open">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="modal-box bg-gradient-to-br from-base-100 to-base-200 rounded-2xl shadow-2xl border border-base-200"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-base-content/10 pb-3">
                            <BsRocket className="text-success text-2xl" />
                            <h3 className="font-bold text-xl text-base-content/90">Confirm Publication</h3>
                        </div>

                        {publishError && (
                            <div className="alert alert-error mb-4">
                                {publishError}
                            </div>
                        )}

                        <p className="py-4 text-base-content/80">
                            Are you sure you want to publish the quiz <strong>"{quiz.name}"</strong>?<br />
                            Once published, it will be accessible to students via code.
                        </p>

                        <div className="bg-base-100 rounded-lg p-4 mb-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <BsShieldLock className={`text-lg ${isAnonymous ? 'text-secondary' : 'text-primary'}`} />
                                    <span className="font-medium text-base-content/70">
                            Allow quiz execution without login
                        </span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={isAnonymous}
                                    onChange={() => setIsAnonymous(!isAnonymous)}
                                />
                            </div>

                            <div
                                className={`
                        mt-3 p-3 rounded-lg 
                        ${isAnonymous
                                    ? 'bg-secondary/10 border-l-4 border-secondary'
                                    : 'bg-error/10 border-l-4 border-error'}
                    `}
                            >
                                <div className="flex items-center gap-2">
                                    {isAnonymous ? (
                                        <>
                                            <BsPersonCheck className="text-secondary" />
                                            <p className="text-secondary font-semibold">
                                                Students can take the quiz without logging in
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <BsPersonCheck className="text-error" />
                                            <p className="text-error font-semibold">
                                                Students must log in to take the quiz
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setShowPublishModal(false);
                                    setIsAnonymous(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={confirmPublish}
                                disabled={isPublishing}
                            >
                                {isPublishing ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    'Publish'
                                )}
                            </button>
                        </div>
                    </motion.div>
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
                                    <BsTrash className="text-2xl" />
                                </div>
                                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                            </div>

                            {error && (
                                <div className="alert alert-error">
                                    <FiAlertCircle className="text-lg" />
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
                                    <BsTrash />
                                    Delete Permanently
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}

            <AnimatePresence>
                {showPublicationError && (
                    <ErrorToast
                        message="This quiz has an active publication. Please close the current publication before making changes."
                        onClose={() => setShowPublicationError(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};