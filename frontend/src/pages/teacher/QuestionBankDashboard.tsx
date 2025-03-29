import { PlusCircleIcon } from '@heroicons/react/24/outline';
import {useState} from "react";
import {QuestionBankCreationForm} from "../../components/questionBank/QuestionBankCreationForm.tsx";
import {QuestionBankSearch} from "../../components/questionBank/QuestionBankSearch.tsx";
import {QuestionBankGrid} from "../../components/questionBank/QuestionBankGrid.tsx";
import {BanknotesIcon} from "@heroicons/react/16/solid";

export const QuestionBankDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div className="flex items-center gap-4">
                        <BanknotesIcon className="w-12 h-12 text-purple-600" />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Question Bank</h1>
                            <p className="text-lg text-gray-600 mt-2">Collaborative knowledge repository for educators</p>
                        </div>
                    </div>

                    <div className="w-full md:w-96">
                        <QuestionBankSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Creation Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 sticky top-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-purple-900">
                                <PlusCircleIcon className="w-6 h-6" />
                                Create New Vault
                            </h2>
                            <QuestionBankCreationForm />
                        </div>
                    </div>

                    {/* Question Bank Grid */}
                    <div className="lg:col-span-3">
                        <QuestionBankGrid searchTerm={searchTerm} />
                    </div>
                </div>
            </div>
        </section>
    );
};