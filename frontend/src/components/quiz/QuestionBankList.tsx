import { QuestionBankDTO } from '@dti-isin/backend-api-client';
import {QuestionBankItem} from "./QuestionBankItem.tsx";

interface QuestionBankListProps {
    banks: QuestionBankDTO[];
    isLoading: boolean;
    error: Error | null;
    selectedQuestions: Set<string>;
    onQuestionSelect: (questionId: string) => void;
    onBankSelect: (bankId: string) => void;
    onImport: () => void;
    isImporting: boolean;
}

export const QuestionBankList: React.FC<QuestionBankListProps> = ({
                                                                      banks,
                                                                      isLoading,
                                                                      error,
                                                                      selectedQuestions,
                                                                      onQuestionSelect,
                                                                      onBankSelect,
                                                                      onImport,
                                                                      isImporting
                                                                  }) => {
    if (error) {
        return (
            <div className="alert alert-error shadow-lg">
                Error loading question banks: {error.message}
            </div>
        );
    }

    if (isLoading) {
        return <div className="loading loading-spinner text-primary"></div>;
    }

    return (
        <div className="bg-base-100 rounded-xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Question Banks</h3>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={onImport}
                    disabled={selectedQuestions.size === 0 || isImporting}
                >
                    {isImporting ? 'Importing...' : `Import (${selectedQuestions.size})`}
                </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                {banks.map(bank => (
                    <QuestionBankItem
                        key={bank.id}
                        bank={bank}
                        selectedQuestions={selectedQuestions}
                        onQuestionSelect={onQuestionSelect}
                        onBankSelect={onBankSelect}
                    />
                ))}
            </div>
        </div>
    );
};