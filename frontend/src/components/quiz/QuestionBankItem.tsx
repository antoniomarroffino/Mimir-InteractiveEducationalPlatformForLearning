import { useState } from 'react';
import { QuestionBankDTO } from '@dti-isin/backend-api-client';
import {QuestionItem} from "./QuestionItem.tsx";

interface QuestionBankItemProps {
    bank: QuestionBankDTO;
    selectedQuestions: Set<string>;
    onQuestionSelect: (questionId: string) => void;
    onBankSelect: (bankId: string) => void;
}

export const QuestionBankItem: React.FC<QuestionBankItemProps> = ({
                                                                      bank,
                                                                      selectedQuestions,
                                                                      onQuestionSelect,
                                                                      onBankSelect
                                                                  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const allSelected = bank.questions?.every(q => selectedQuestions.has(q.id!));

    return (
        <div className="collapse collapse-arrow border border-base-300 rounded-box mb-4">
            <input
                type="checkbox"
                checked={isExpanded}
                onChange={() => setIsExpanded(!isExpanded)}
            />
            <div className="collapse-title font-medium flex justify-between items-center">
                <span>{bank.name}</span>
                <button
                    className="btn btn-xs btn-ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        onBankSelect(bank.id!);
                    }}
                >
                    {allSelected ? 'Deselect All' : 'Select All'}
                </button>
            </div>
            <div className="collapse-content">
                {bank.questions?.map(question => (
                    <QuestionItem
                        key={question.id}
                        question={question}
                        isSelected={selectedQuestions.has(question.id!)}
                        onSelect={onQuestionSelect}
                    />
                ))}
            </div>
        </div>
    );
};