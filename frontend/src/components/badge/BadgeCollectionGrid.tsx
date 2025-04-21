import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { GroupedBadge } from '../../utils/badgeUtils';
import BadgeCard from './BadgeCard';
import React from "react";

interface Props {
    groupedBadges?: GroupedBadge[];
    formatDate: (date?: string) => string;
}

export const BadgeCollectionGrid: React.FC<Props> = ({ groupedBadges = [], formatDate }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                },
            }}
            initial="hidden"
            animate="visible"
        >
            <h2 className="text-3xl font-bold mb-8">Your Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedBadges.map((group, index) => (
                    <BadgeCard key={index} groupedBadge={group} formatDate={formatDate} />
                ))}

                <motion.div
                    className="bg-base-100/50 rounded-2xl p-6 border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary hover:bg-base-100/80 transition-all duration-300"
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center"
                    >
                        <FaLock className="text-2xl text-base-content/40 group-hover:text-primary" />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-bold text-base-content/70">Next Achievement</h3>
                        <p className="text-sm text-base-content/50">Complete more quizzes to unlock</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
