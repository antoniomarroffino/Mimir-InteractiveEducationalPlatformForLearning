import {useState} from 'react';
import {useQuestionBankCRUD} from "../../hooks/questionBank/useQuestionBankCRUD.ts";
import {useQuestionBankList} from "../../hooks/questionBank/useQuestionBankList.ts";
import {PlusCircleIcon} from "@heroicons/react/24/outline";

export const QuestionBankCreationForm = () => {
    const [name, setName] = useState('');
    const {createQuestionBank, isCreatingQuestionBank, errorCreateQuestionBank} = useQuestionBankCRUD();
    const {fetchQuestionBanks} = useQuestionBankList();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createQuestionBank({name});
            setName('');
            await fetchQuestionBanks();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
                <input
                    type="text"
                    placeholder="Es. Fisica 101 - Termodinamica"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            {errorCreateQuestionBank && (
                <div className="alert alert-error mt-2">
                    <span>{errorCreateQuestionBank.message}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isCreatingQuestionBank}
                className="btn btn-primary w-full gap-2"
            >
                {isCreatingQuestionBank ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    <>
                        <PlusCircleIcon className="w-5 h-5"/>
                        Crea Question Bank
                    </>
                )}
            </button>
        </form>
    );
};