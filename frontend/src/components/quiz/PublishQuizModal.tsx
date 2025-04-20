import React from 'react';
import { BsPersonCheck, BsRocket, BsShieldLock } from 'react-icons/bs';
import { QuizDTO } from '@dti-isin/backend-api-client';
import { useQuizPublicationCRUD } from '../../hooks/quizPublication/useQuizPublicationCRUD';
import { useNavigate } from 'react-router-dom';
import {BaseModal} from "./BaseModal.tsx";

interface PublishQuizModalProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
    isAnonymous: boolean;
    setIsAnonymous: (value: boolean) => void;
    onClose: () => void;
    publishError: string | null;
    setPublishError: (msg: string | null) => void;
}

export const PublishQuizModal: React.FC<PublishQuizModalProps> = ({
                                                                      quiz,
                                                                      courseId,
                                                                      folderId,
                                                                      isAnonymous,
                                                                      setIsAnonymous,
                                                                      onClose,
                                                                      publishError,
                                                                      setPublishError
                                                                  }) => {
    const { createPublication, isCreatingPublication } = useQuizPublicationCRUD();
    const navigate = useNavigate();

    const handleConfirm = async () => {
        try {
            setPublishError(null);
            const publication = await createPublication({
                courseId,
                folderId,
                quizId: quiz.id!,
                published: true,
                anonymous: isAnonymous
            });

            if (!publication?.id) throw new Error("Invalid publication");

            navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/publications/${publication.id}`);
        } catch (err) {
            setPublishError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            onClose();
        }
    };

    return (
        <BaseModal
            title="Confirm Publication"
            icon={<BsRocket className="text-success text-2xl" />}
            onClose={onClose}
            actions={
                <>
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-success" onClick={handleConfirm} disabled={isCreatingPublication}>
                        {isCreatingPublication ? <span className="loading loading-spinner" /> : 'Publish'}
                    </button>
                </>
            }
        >
            {publishError && <div className="alert alert-error mb-4">{publishError}</div>}

            <p className="mb-4 text-base-content/80">
                Are you sure you want to publish <strong>"{quiz.name}"</strong>?<br />
                It will become accessible to students via code.
            </p>

            <div className="bg-base-100 rounded-lg p-4 shadow-sm mb-4">
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

                <div className={`mt-3 p-3 rounded-lg ${isAnonymous ? 'bg-secondary/10 border-l-4 border-secondary' : 'bg-error/10 border-l-4 border-error'}`}>
                    <div className="flex items-center gap-2">
                        <BsPersonCheck className={isAnonymous ? 'text-secondary' : 'text-error'} />
                        <p className={`font-semibold ${isAnonymous ? 'text-secondary' : 'text-error'}`}>
                            {isAnonymous
                                ? 'Students can take the quiz without logging in'
                                : 'Students must log in to take the quiz'}
                        </p>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};
