import React from "react";
import {motion} from "framer-motion";
import {FaTrophy} from "react-icons/fa";
import {GroupedBadge} from "../../utils/badgeUtils";
import {cardHoverVariants, itemVariants} from "./badgeCardVariants";

interface BadgeCardProps {
    groupedBadge: GroupedBadge;
    formatDate: (date: string | undefined) => string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({groupedBadge, formatDate}) => (
    <motion.div
        variants={itemVariants}
        whileHover={cardHoverVariants.hover}
        className="bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
    >
        <div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-300"/>
        <motion.div
            className="relative z-10"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{groupedBadge.type}</h3>
                <motion.div className="badge badge-warning gap-2" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                    <FaTrophy className="animate-pulse"/> x{groupedBadge.count}
                </motion.div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-4">
                {groupedBadge.badges.map((badge, index) => (
                    <div key={index} className="relative">
                        <div
                            className="group w-14 h-14 rounded-full bg-gradient-to-br from-warning to-warning/60 flex items-center justify-center text-white shadow-lg cursor-pointer">
                            <FaTrophy className="text-lg"/>
                            <div
                                className="absolute z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-base-100 border border-base-300 text-xs text-left text-base-content rounded-lg shadow-lg p-2 bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-max pointer-events-none">
                                <div className="font-semibold">Assigned by {badge.assignedBy.name}</div>
                                <div className="text-base-content/60">{formatDate(badge.assignedAt)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <motion.div
                className="text-sm text-base-content/70 text-center"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.4}}
            >
                Latest: {formatDate(groupedBadge.latestDate)}
            </motion.div>
        </motion.div>
    </motion.div>
);

export default BadgeCard;
