import {QuestionDTO} from '@dti-isin/backend-api-client';

interface QuestionPreviewProps {
    question: QuestionDTO | null;
    onClose: () => void;
}

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
                                                                    question,
                                                                    onClose
                                                                }) => {
    if (!question) {
        return (
            <div className="bg-base-100 rounded-xl p-6 shadow-xl h-full flex items-center justify-center">
                <div className="text-center text-base-content/50">
                    Select a question to preview
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 rounded-xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Question Preview</h3>
                <button className="btn btn-sm btn-ghost" onClick={onClose}>✕</button>
            </div>
            <div className="prose">
                <h4>{question.questionText}</h4>
            </div>
        </div>
    );
};