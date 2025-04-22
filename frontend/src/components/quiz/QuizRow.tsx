import React, {useState} from 'react';
import {QuizDTO} from '@dti-isin/backend-api-client';
import {QuizActionsMenu} from './QuizActionsMenu.tsx';
import {DeleteQuizPopup} from './DeleteQuizPopup.tsx';
import {PublishQuizPopup} from './PublishQuizPopup.tsx';
import {BsPatchQuestion} from 'react-icons/bs';
import {useQuizPublicationCRUD} from '../../hooks/quizPublication/useQuizPublicationCRUD.ts';
import {useGetQuizPublicationsByQuizId} from '../../hooks/quizPublication/useGetQuizPublicationsByQuizId.ts';
import {useQuizCRUD} from '../../hooks/quiz/useQuizCRUD.ts';
import {useNavigate} from 'react-router-dom';

interface QuizRowProps {
    quiz: QuizDTO;
    courseId: string;
    folderId: string;
}

export const QuizRow: React.FC<QuizRowProps> = ({quiz, courseId, folderId}) => {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showPublishPopup, setShowPublishPopup] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [publishError, setPublishError] = useState<string | null>(null);

    const navigate = useNavigate();
    const {createPublication, isCreatingPublication} = useQuizPublicationCRUD();
    const {deleteQuiz} = useQuizCRUD();
    const {data: publications} = useGetQuizPublicationsByQuizId(quiz.id!);

    const currentPublication = publications?.find(pub => pub.published);

    const handlePublishClick = () => {
        if (currentPublication) {
            navigate(`/courses/${courseId}/folders/${folderId}/quizzes/${quiz.id}/publications/${currentPublication.id}`);
        } else {
            setShowPublishPopup(true);
        }
    };

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

    const handleConfirmDelete = async () => {
        try {
            await deleteQuiz.mutateAsync({
                courseId,
                folderId,
                quizId: quiz.id!,
            });
            setShowDeletePopup(false);
        } catch (err) {
            console.error('Failed to delete quiz', err);
        }
    };

    return (
        <>
            <div
                className="group p-4 bg-white rounded-xl border border-base-200 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 ease-out flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <BsPatchQuestion className="text-xl sm:text-2xl"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium truncate">{quiz.name}</span>
                        {currentPublication && (
                            <span className="text-xs text-success font-medium mt-0.5">Published</span>
                        )}
                    </div>
                </div>

                <QuizActionsMenu
                    quiz={quiz}
                    courseId={courseId}
                    folderId={folderId}
                    onRequestDelete={() => setShowDeletePopup(true)}
                    onRequestPublish={handlePublishClick}
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
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
};
