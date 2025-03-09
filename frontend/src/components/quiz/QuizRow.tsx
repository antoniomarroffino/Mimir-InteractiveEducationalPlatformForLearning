import { QuizDTO } from '@dti-isin/backend-api-client';
import { BsFileEarmarkText, BsPencilSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface QuizRowProps {
    quiz: QuizDTO;
    folderId: string;
}

export const QuizRow = ({ quiz, folderId }: QuizRowProps) => {
    const [showDeleteConfirm] = useState(false);
    console.log('Quiz called with folderId:', folderId);

    return (
        <div className="bg-base-200 rounded-lg p-4 mb-2 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BsFileEarmarkText className="text-xl text-primary" />
                    <span className="font-medium">{quiz.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        to={`quiz/${quiz.id}/edit`}
                        className="btn btn-ghost btn-sm"
                        title="Edit Quiz"
                    >
                        <BsPencilSquare className="text-base-content/70" />
                    </Link>

                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Quiz</h3>
                        <p className="py-4">
                            Are you sure you want to delete "{quiz.name}"?
                            This action cannot be undone.
                        </p>

                    </div>
                </div>
            )}
        </div>
    );
};