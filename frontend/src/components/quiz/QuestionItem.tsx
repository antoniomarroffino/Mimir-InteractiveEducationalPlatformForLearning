import { QuestionDTO } from '@dti-isin/backend-api-client';

interface QuestionItemProps {
    question: QuestionDTO;
    isSelected: boolean;
    onSelect: (questionId: string) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
                                                              question,
                                                              isSelected,
                                                              onSelect
                                                          }) => {
    return (
        <div className="flex items-center p-2 hover:bg-base-200 rounded">
            <input
                type="checkbox"
                className="checkbox checkbox-xs mr-2"
                checked={isSelected}
                onChange={() => onSelect(question.id!)}
            />
            <span className="text-sm truncate">{question.questionText}</span>
        </div>
    );
};