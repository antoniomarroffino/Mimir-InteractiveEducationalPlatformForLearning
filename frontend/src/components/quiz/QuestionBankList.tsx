import { QuestionBankDTO } from '@dti-isin/backend-api-client';
import { QuestionBankItem } from "./QuestionBankItem.tsx";
import React, { useMemo, useState } from "react";
import { QuestionBankSearch } from "../questionBank/QuestionBankSearch.tsx";

interface QuestionBankListProps {
    banks: QuestionBankDTO[];
    isLoading: boolean;
    error: Error | null;
    selectedQuestions: string[];
    importedQuestion: string[];
    onQuestionSelect: (questionId: string) => void;
    onBankSelect: (bankId: string) => void;
    onImport: () => void;
    isImporting: boolean;
}

export const QuestionBankList: React.FC<QuestionBankListProps> = React.memo(({
                                                                                 banks,
                                                                                 isLoading,
                                                                                 error,
                                                                                 selectedQuestions,
                                                                                 importedQuestion,
                                                                                 onQuestionSelect,
                                                                                 onBankSelect,
                                                                                 onImport,
                                                                                 isImporting
                                                                             }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBanks = useMemo(() => {
        return banks.filter(bank =>
            bank.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [banks, searchTerm]);

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
        <div className="bg-base-100 rounded-xl p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-base font-semibold">Question Banks</h3>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={onImport}
                    disabled={selectedQuestions.length === 0 || isImporting}
                >
                    {isImporting ? 'Importing...' : `Import (${selectedQuestions.length})`}
                </button>
            </div>

            <QuestionBankSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <div className="overflow-y-auto max-h-[50vh] md:max-h-[60vh] lg:max-h-[calc(100vh-300px)]">
                {filteredBanks.length === 0 ? (
                    <div className="text-center p-4 text-sm text-gray-500">
                        No question banks found matching "{searchTerm}"
                    </div>
                ) : (
                    filteredBanks.map(bank => (
                        <QuestionBankItem
                            key={bank.id}
                            bank={bank}
                            selectedQuestions={selectedQuestions}
                            importedQuestions={importedQuestion}
                            onQuestionSelect={onQuestionSelect}
                            onBankSelect={onBankSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
});
