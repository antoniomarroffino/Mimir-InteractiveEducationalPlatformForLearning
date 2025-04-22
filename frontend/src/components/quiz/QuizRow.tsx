import React, { useState } from 'react';
import { QuizDTO } from '@dti-isin/backend-api-client';
import { QuizActionsMenu } from './QuizActionsMenu.tsx';
import { DeleteQuizPopup } from './DeleteQuizPopup.tsx';
import { PublishQuizPopup } from './PublishQuizPopup.tsx';
import { BsPatchQuestion } from 'react-icons/bs';
import { useQuizPublicationCRUD } from '../../hooks/quizPublication/useQuizPublicationCRUD.ts';
import { useNavigate } from 'react-router-dom';

interface QuizRowProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
}

export const QuizRow: React.FC<QuizRowProps> = ({ quiz, courseId, folderId }) => {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showPublishPopup, setShowPublishPopup] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    const { createPublication, isCreatingPublication } = useQuizPublicationCRUD();
    const navigate = useNavigate();

    const handleConfirmPublish = async () => {
        try {
            setPublishError(null);
            const publication = await createPublication({
                courseId,
                folderId,
                quizId: quiz.id!,
                published: true,
                anonymous: isAnonymous,
            });

            if (!publication?.id) throw new Error('Invalid publication');

            navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/publications/${publication.id}`);
        } catch (err) {
            setPublishError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setShowPublishPopup(false);
            setIsAnonymous(false);
        }
    };

    return (
        <>
            <div className="group p-4 bg-white rounded-xl border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 ease-out flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <BsPatchQuestion className="text-xl sm:text-2xl" />
                    </div>
                    <span className="font-medium truncate">{quiz.name}</span>
                </div>

                <QuizActionsMenu
                    quiz={quiz}
                    courseId={courseId}
                    folderId={folderId}
                    onRequestDelete={() => setShowDeletePopup(true)}
                    onRequestPublish={() => setShowPublishPopup(true)}
                />
            </div>

            {showPublishPopup && (
                <PublishQuizPopup
                    quiz={quiz}
                    courseId={courseId}
                    folderId={folderId}
                    isAnonymous={isAnonymous}
                    setIsAnonymous={setIsAnonymous}
                    onClose={() => {
                        setShowPublishPopup(false);
                        setIsAnonymous(false);
                    }}
                    onConfirm={handleConfirmPublish}
                    isCreating={isCreatingPublication}
                    error={publishError}
                />
            )}

            {showDeletePopup && (
                <DeleteQuizPopup
                    quiz={quiz}
                    onCancel={() => setShowDeletePopup(false)}
                    onConfirm={() => {
                        console.log('Elimina quiz:', quiz.name);
                        setShowDeletePopup(false);
                    }}
                />
            )}
        </>
    );
};
