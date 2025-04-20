import {useState} from "react";
import {motion} from "framer-motion";
import {FiDatabase, FiPlusCircle} from "react-icons/fi";
import {QuestionBankCreationForm} from "../../components/questionBank/QuestionBankCreationForm.tsx";
import {QuestionBankSearch} from "../../components/questionBank/QuestionBankSearch.tsx";
import {QuestionBankGrid} from "../../components/questionBank/QuestionBankGrid.tsx";

export const QuestionBankDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{y: -20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-fuchsia-500 p-10 mb-12 text-white shadow-xl"
                >
                    <div className="flex items-center justify-between flex-col md:flex-row gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Question Bank</h1>
                            <p className="text-lg opacity-90">
                                Empower your learning journey through shared knowledge
                            </p>
                        </div>
                        <motion.div
                            animate={{rotate: [0, 5, -5, 0]}}
                            transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
                        >
                            <FiDatabase className="w-16 h-16 text-white/90"/>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.1}}
                    className="mb-10 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/40 p-4 flex items-start gap-4 shadow-sm"
                >
                    <motion.div
                        animate={{rotate: [0, 10, -10, 0]}}
                        transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
                        className="bg-white p-2 rounded-full shadow-md"
                    >
                        <FiDatabase className="w-6 h-6 text-purple-600"/>
                    </motion.div>

                    <div className="text-sm text-gray-800 leading-relaxed">
                        <p>
                            <strong>Question Banks</strong> are shared collections of questions that teachers can use and contribute to.
                            You can <span className="text-purple-700 font-medium">create your own</span>, or
                            <span className="text-purple-700 font-medium"> reuse questions</span> from existing ones — making quizzes faster, smarter, and more collaborative.
                        </p>
                    </div>
                </motion.div>


                {/* Main grid */}
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Left: Creation Card */}
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-xl border border-purple-100"
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-purple-900">
                            <FiPlusCircle className="w-5 h-5"/>
                            Create New Bank
                        </h2>
                        <QuestionBankCreationForm/>
                    </motion.div>

                    {/* Right: Search + Grid */}
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="lg:col-span-3 space-y-6"
                    >
                        <QuestionBankSearch searchTerm={searchTerm} onSearchChange={setSearchTerm}/>
                        <QuestionBankGrid searchTerm={searchTerm}/>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};
