import {QuestionBankDTO} from '@dti-isin/backend-api-client';
import {FiArchive, FiArrowRight} from 'react-icons/fi';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';

export const QuestionBankCard = ({bank}: { bank: QuestionBankDTO }) => {
    const navigate = useNavigate();
    const questionCount = bank.questions?.length ?? 0;

    return (
        <motion.div
            className="bg-white rounded-2xl p-6 shadow-md border-2 border-transparent hover:border-purple-200 cursor-pointer group transition-all"
            whileHover={{y: -6, scale: 1.02}}
            onClick={() => navigate(`/question_banks/${bank.id}`)}
        >
            <div className="flex flex-col h-full justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-200 to-purple-400 flex items-center justify-center">
                        <FiArchive className="text-purple-800 text-xl"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{bank.name}</h3>
                        {questionCount > 0 ? (
                            <span className="text-xs text-gray-500 mt-1 block">
                                {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                            </span>
                        ) : (
                            <span className="text-xs italic text-gray-400 mt-1 block">
                                No questions yet
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center text-purple-600 mt-auto">
                    <span className="text-sm font-medium group-hover:underline">View Details</span>
                    <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform"/>
                </div>
            </div>
        </motion.div>
    );
};
