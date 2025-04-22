import React, {useState} from 'react';
import {useQuestionBankCRUD} from "../../hooks/questionBank/useQuestionBankCRUD.ts";
import {useQuestionBankList} from "../../hooks/questionBank/useQuestionBankList.ts";
import {FiCheckCircle, FiPlusCircle} from "react-icons/fi";
import {AnimatePresence, motion} from "framer-motion";

export const QuestionBankCreationForm = () => {
    const [name, setName] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const {createQuestionBank, isCreatingQuestionBank, errorCreateQuestionBank} = useQuestionBankCRUD();
    const {fetchQuestionBanks} = useQuestionBankList();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createQuestionBank({name});
            setName('');
            await fetchQuestionBanks();

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2500);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div className="form-control">
                <input
                    type="text"
                    placeholder="e.g. Design Patterns"
                    className="input input-lg w-full rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-0 bg-white shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            {errorCreateQuestionBank && (
                <div className="text-sm text-error bg-error/10 px-3 py-2 rounded-md shadow-sm">
                    {errorCreateQuestionBank.message}
                </div>
            )}

            <button
                type="submit"
                disabled={isCreatingQuestionBank}
                className="btn btn-primary w-full gap-2 rounded-xl text-base shadow-md hover:shadow-lg transition-all duration-300"
            >
                {isCreatingQuestionBank ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : (
                    <>
                        <FiPlusCircle className="w-5 h-5"/>
                        Create Bank
                    </>
                )}
            </button>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.8}}
                        transition={{duration: 0.4}}
                        className="absolute -top-10 right-0 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-xl shadow-md flex items-center gap-2"
                    >
                        <FiCheckCircle className="w-5 h-5 text-green-600"/>
                        <span>Question bank created!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
};
