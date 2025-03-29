import {useQuestionBankList} from "../../hooks/questionBank/useQuestionBankList.ts";
import {ClipboardDocumentListIcon} from "@heroicons/react/16/solid";
import {QuestionBankCard} from "./QuestionBankCard.tsx";


export const QuestionBankGrid = ({ searchTerm }: { searchTerm: string }) => {
    const { questionBanks, isLoadingQuestionBanks, errorQuestionBanks } = useQuestionBankList();

    const filteredBanks = questionBanks.filter(bank =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoadingQuestionBanks) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-md h-64 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3 mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded-xl"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (errorQuestionBanks) {
        return (
            <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 className="font-bold">Loading Error!</h3>
                    <div className="text-xs">{errorQuestionBanks.message}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBanks.map(bank => (
                <QuestionBankCard key={bank.id} bank={bank} />
            ))}

            {filteredBanks.length === 0 && (
                <div className="col-span-full text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-2xl mb-4">
                        <ClipboardDocumentListIcon className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {searchTerm ? "No matching vaults found" : "Empty Knowledge Vault"}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        {searchTerm
                            ? "Try adjusting your search terms"
                            : "Be the first to create a new question collection!"}
                    </p>
                </div>
            )}
        </div>
    );
};