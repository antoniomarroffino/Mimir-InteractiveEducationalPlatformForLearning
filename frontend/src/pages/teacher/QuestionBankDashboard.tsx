import {useState} from "react";
import {motion} from "framer-motion";
import {FiPlusCircle} from "react-icons/fi";
import {QuestionBankCreationForm} from "../../components/questionBank/QuestionBankCreationForm";
import {QuestionBankSearch} from "../../components/questionBank/QuestionBankSearch";
import {QuestionBankGrid} from "../../components/questionBank/QuestionBankGrid";
import {QuestionBankPageHeader} from "../../components/questionBank/QuestionBankPageHeader";
import {QuestionBankInfoAlert} from "../../components/questionBank/QuestionBankInfoAlert";

export const QuestionBankDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const handleToggleInfo = () => setShowInfo(prev => !prev);

    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <QuestionBankPageHeader
                    onToggleInfo={handleToggleInfo}
                    showInfoToggle
                />

                {showInfo && <QuestionBankInfoAlert />}

                <div className="grid lg:grid-cols-4 gap-8">
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
