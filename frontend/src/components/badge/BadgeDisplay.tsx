import React from "react";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import { BadgeDTO } from "@dti-isin/backend-api-client";

interface BadgeDisplayProps {
    badges: BadgeDTO[];
    formatDate: (date: string | undefined) => string;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges, formatDate }) => (
    <div className="relative h-32 flex items-center justify-center perspective-1000">
        {badges.map((badge, i) => (
            <motion.div
                key={i}
                whileHover={{ scale: 1.1, zIndex: 50 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-warning to-warning/50 flex items-center justify-center transition-all duration-500 cursor-pointer"
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
                    <FaTrophy className="text-2xl text-white group-hover:scale-110 transition-transform" />
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

export default BadgeDisplay;
