import {useEffect, useMemo, useRef, useState} from 'react';
import {QuestionBankDTO} from '@dti-isin/backend-api-client';
import {QuestionItem} from "./QuestionItem.tsx";

interface QuestionBankItemProps {
    bank: QuestionBankDTO;
    selectedQuestions: string[];
    importedQuestions: string[];
    onQuestionSelect: (questionId: string) => void;
    onBankSelect: (bankId: string) => void;
}

export const QuestionBankItem: React.FC<QuestionBankItemProps> = ({
                                                                      bank,
                                                                      selectedQuestions,
                                                                      importedQuestions,
                                                                      onQuestionSelect,
                                                                      onBankSelect
                                                                  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const checkboxRef = useRef<HTMLInputElement>(null);

    const {allSelected, someSelected, allImported} = useMemo(() => {
        const bankQuestions = bank.questions || [];
        const selectedCount = bankQuestions.filter(q => selectedQuestions.includes(q.id!)).length;
        const importedCount = bankQuestions.filter(q => importedQuestions.includes(q.id!)).length;

        return {
            allSelected: selectedCount === bankQuestions.length && bankQuestions.length > 0,
            someSelected: selectedCount > 0 && selectedCount < bankQuestions.length,
            allImported: importedCount === bankQuestions.length && bankQuestions.length > 0
        };
    }, [bank.questions, selectedQuestions, importedQuestions]);

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    const handleBankSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (allImported) return;
        e.stopPropagation();
        const bankQuestionIds = bank.questions?.map(q => q.id!) || [];

        if (allSelected || someSelected) {
            bankQuestionIds.forEach(id => onQuestionSelect(id));
        } else {
            onBankSelect(bank.id!);
        }
    };

    return (
        <div className={`collapse collapse-arrow border border-base-300 rounded-box mb-4 
            ${allImported ? 'bg-success/10 border-success/20' : ''}`}>
            <input
                type="checkbox"
                className="hidden"
                checked={isExpanded}
                onChange={() => setIsExpanded(!isExpanded)}
            />
            <div
                className="collapse-title font-medium flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div
                    className="flex items-center gap-2"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <input
                        ref={checkboxRef}
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-primary"
                        checked={allSelected}
                        onChange={handleBankSelect}
                        onClick={(e) => e.stopPropagation()}
                        disabled={allImported}
                    />
                    <span>{bank.name}</span>
                </div>
                <span className="text-sm text-base-content/60">
                    {bank.questions?.length} questions
                </span>
            </div>
            <div className="collapse-content pl-8">
                {bank.questions?.map(question => (
                    <QuestionItem
                        key={question.id}
                        question={question}
                        isSelected={selectedQuestions.includes(question.id!)}
                        isImported={importedQuestions.includes(question.id!)}
                        onSelect={onQuestionSelect}
                    />
                ))}
            </div>
        </div>
    );
};