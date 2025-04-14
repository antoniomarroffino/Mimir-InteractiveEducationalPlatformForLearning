import React from "react";
import {motion} from "framer-motion";
import {FaTrophy} from "react-icons/fa";
import {BadgeDTO} from "@dti-isin/backend-api-client";

interface GroupedBadge {
    type: string | undefined;
    count: number;
    badges: BadgeDTO[];
    latestDate: string | undefined;
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

const cardHoverVariants = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.3 }
    }
};

const BadgeDisplay: React.FC<{
    badges: BadgeDTO[];
    formatDate: (date: string | undefined) => string;
}> = ({badges, formatDate}) => (
    <div className="relative h-32 flex items-center justify-center perspective-1000">
        {badges.map((badge, i) => (
            <motion.div
                key={i}
                whileHover={{ scale: 1.1, zIndex: 50 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-warning to-warning/50
                         flex items-center justify-center transition-all duration-500 cursor-pointer"
                style={{
                    transform: `
                        translateX(${Math.cos(i * (2 * Math.PI / badges.length)) * 30}px)
                        translateY(${Math.sin(i * (2 * Math.PI / badges.length)) * 30}px)
                        scale(${1 - (i * 0.05)})
                    `,
                    zIndex: badges.length - i,
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}
            >
                <div className="flex flex-col items-center gap-1 group">
                    <FaTrophy className="text-2xl text-white group-hover:scale-110 transition-transform"/>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute bottom-0 transform translate-y-full bg-base-100 rounded-lg p-2 shadow-xl"
                    >
                        <div className="text-xs whitespace-nowrap">
                            <div className="font-bold">Assigned by {badge.assignedBy.name}</div>
                            <div className="text-base-content/60">{formatDate(badge.assignedAt)}</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        ))}
    </div>
);

export const BadgeCard: React.FC<{
    groupedBadge: GroupedBadge;
    formatDate: (date: string | undefined) => string;
}> = ({ groupedBadge, formatDate }) => (
    <motion.div
        variants={itemVariants}
        whileHover={cardHoverVariants.hover}
        className="group bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl
                  transition-all duration-300 relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0
                      group-hover:opacity-100 transition-opacity duration-300"></div>
        <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{groupedBadge.type}</h3>
                <motion.div
                    className="badge badge-warning gap-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaTrophy className="animate-pulse"/> x{groupedBadge.count}
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