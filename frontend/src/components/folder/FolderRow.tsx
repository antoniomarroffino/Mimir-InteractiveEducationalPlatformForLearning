import { useState } from 'react';
import { FolderDTO } from '@dti-isin/backend-api-client';
import { BsFolder2, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useQuizContext } from '../../contexts/quiz/QuizContext';
import { QuizRow } from '../quiz/QuizRow';
import { CreateQuizButton } from '../quiz/CreateQuizButton';

interface FolderRowProps {
    folder: FolderDTO;
}

export const FolderRow = ({ folder }: FolderRowProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { quizzes, isLoading } = useQuizContext();

    return (
        <div className="bg-base-100 shadow-sm hover:shadow-md transition-all">
            {/* Header Row */}
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
                        {quizzes.length} quizzes
                    </span>
                    {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-base-200 p-4">
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner"></span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {quizzes.map(quiz => (
                                <QuizRow
                                    key={quiz.id}
                                    quiz={quiz}
                                    onDelete={(quizId) => {
                                        // Implementare la cancellazione
                                        console.log('Delete quiz:', quizId);
                                    }}
                                />
                            ))}
                            <CreateQuizButton />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};