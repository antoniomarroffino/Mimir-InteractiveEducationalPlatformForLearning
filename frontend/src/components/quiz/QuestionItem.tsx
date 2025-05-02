import {QuestionDTO} from "@dti-isin/backend-api-client";

interface QuestionItemProps {
    question: QuestionDTO;
    isSelected: boolean;
    isImported: boolean;
    onSelect: (questionId: string) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
                                                              question,
                                                              isSelected,
                                                              isImported,
                                                              onSelect
                                                          }) => {
    const handleSelect = () => {
        if (!isImported) {
            onSelect(question.id!);
        }
    };

    return (
        <div className={`flex items-center p-2 hover:bg-base-200 rounded 
            ${isImported ? 'bg-success/10 opacity-50' : ''}`}>
            <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-primary mr-2"
                checked={isSelected || isImported}
                onChange={handleSelect}
                disabled={isImported}
            />
            <span className={`text-sm truncate ${isImported ? 'line-through' : ''}`}>
                {question.questionText}
            </span>
            {isImported && (
                <span className="text-xs text-success ml-2">(imported)</span>
            )}
        </div>
    );
};