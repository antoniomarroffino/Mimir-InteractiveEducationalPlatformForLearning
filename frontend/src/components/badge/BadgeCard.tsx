import React from "react";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import { GroupedBadge } from "../../utils/badgeUtils";
import BadgeDisplay from "./BadgeDisplay";
import { itemVariants, cardHoverVariants } from "./badgeCardVariants";

interface BadgeCardProps {
    groupedBadge: GroupedBadge;
    formatDate: (date: string | undefined) => string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ groupedBadge, formatDate }) => (
    <motion.div
        variants={itemVariants}
        whileHover={cardHoverVariants.hover}
        className="group bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{groupedBadge.type}</h3>
                <motion.div className="badge badge-warning gap-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <FaTrophy className="animate-pulse" /> x{groupedBadge.count}
                </motion.div>
            </div>
            <BadgeDisplay badges={groupedBadge.badges} formatDate={formatDate} />
            <motion.div
                className="text-sm text-base-content/70 text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Latest: {formatDate(groupedBadge.latestDate)}
            </motion.div>
        </motion.div>
    </motion.div>
);

export default BadgeCard;
