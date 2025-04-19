import React, { useState } from 'react';
import { QuizDTO } from '@dti-isin/backend-api-client';
import {QuizActionsMenu} from "./QuizActionsMenu.tsx";
import {PublishQuizModal} from "./PublishQuizModal.tsx";
import {DeleteQuizModal} from "./DeleteQuizModal.tsx";
interface QuizRowProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
}

export const QuizRow: React.FC<QuizRowProps> = ({ quiz, courseId, folderId }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [publishError, setPublishError] = useState<string | null>(null);

    return (
        <>
            <div className="p-4 bg-base-100 rounded-lg flex justify-between items-center border-2 border-base-200 hover:border-primary/30 shadow-sm hover:shadow-xs transition-all duration-200 ease-out">
                <div className="flex items-center gap-2">
                    <span>{quiz.name}</span>
                </div>
                <QuizActionsMenu
                    quiz={quiz}
                    courseId={courseId}
                    folderId={folderId}
                    onRequestDelete={() => setShowDeleteModal(true)}
                    onRequestPublish={() => setShowPublishModal(true)}
                />
            </div>

            {showPublishModal && (
                <PublishQuizModal
                    quiz={quiz}
                    courseId={courseId}
                    folderId={folderId}
                    isAnonymous={isAnonymous}
                    setIsAnonymous={setIsAnonymous}
                    onClose={() => {
                        setShowPublishModal(false);
                        setIsAnonymous(false);
                    }}
                    publishError={publishError}
                    setPublishError={setPublishError}
                />
            )}

            {showDeleteModal && (
                <DeleteQuizModal
                    quiz={quiz}
                    courseId={courseId}
                    folderId={folderId}
                    onClose={() => setShowDeleteModal(false)}
                    error={error}
                    setError={setError}
                />
            )}
        </>
    );
};
