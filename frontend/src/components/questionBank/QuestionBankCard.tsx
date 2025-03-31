import {QuestionBankDTO} from '@dti-isin/backend-api-client';
import {ArchiveBoxIcon, ArrowRightIcon} from '@heroicons/react/24/outline';
import {useNavigate} from 'react-router-dom';
import { motion } from 'framer-motion';

export const QuestionBankCard = ({bank}: { bank: QuestionBankDTO }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group border-2 border-transparent hover:border-purple-100"
            whileHover={{y: -5}}
            onClick={() => navigate(`/question_banks/${bank.id}`)}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                        <ArchiveBoxIcon className="w-6 h-6 text-purple-600"/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{bank.name}</h3>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-purple-600 font-medium group-hover:underline">
                        View Details
                    </span>
                    <ArrowRightIcon
                        className="w-5 h-5 text-purple-600 transform group-hover:translate-x-1 transition-transform"/>
                </div>
            </div>
        </motion.div>
    );
};