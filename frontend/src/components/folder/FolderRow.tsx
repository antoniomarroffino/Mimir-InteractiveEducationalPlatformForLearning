import { useState } from 'react';
import { FolderDTO } from '@dti-isin/backend-api-client';
import { BsFolder2, BsChevronDown, BsChevronUp } from 'react-icons/bs';

interface FolderRowProps {
    folder: FolderDTO;
}

export const FolderRow = ({ folder }: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-base-100 shadow-sm hover:shadow-md transition-all">
            {/* Header Row - Always visible */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <BsFolder2 className="text-xl text-primary" />
                    <h3 className="font-semibold">{folder.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-base-content/70">
                        {folder.quizzes?.length || 0} quizzes
                    </span>
                    {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-base-200 p-4">
                    {folder.quizzes && folder.quizzes.length > 0 ? (
                        <div className="space-y-2">
                            {folder.quizzes.map(quiz => (
                                <div
                                    key={quiz.id}
                                    className="p-2 bg-base-200 rounded-lg flex justify-between items-center"
                                >
                                    <span>{quiz.name}</span>
                                    <button className="btn btn-sm btn-primary">
                                        View Quiz
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-base-content/70 text-center py-4">
                            No quizzes in this folder yet
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};