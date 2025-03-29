import { QuestionDTO } from '@dti-isin/backend-api-client';

interface ImportedQuestionsListProps {
    questions: QuestionDTO[];
    onDelete: (questionId: string) => void;
    onPreview: (question: QuestionDTO) => void;
    isLoading: boolean;
}

export const ImportedQuestionsList: React.FC<ImportedQuestionsListProps> = ({
                                                                                questions,
                                                                                onDelete,
                                                                                onPreview,
                                                                                isLoading
                                                                            }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Quiz Questions</h3>
            {isLoading && <div className="loading loading-spinner text-primary"></div>}
            {questions.map(question => (
                <div key={question.id} className="flex items-center justify-between p-3 bg-base-200 rounded">
                    <div
                        className="flex-1 truncate cursor-pointer hover:text-primary"
                        onClick={() => onPreview(question)}
                    >
                        {question.questionText}
                    </div>
                    <button
                        className="btn btn-circle btn-xs btn-error ml-2"
                        onClick={() => onDelete(question.id!)}
                        disabled={isLoading}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};