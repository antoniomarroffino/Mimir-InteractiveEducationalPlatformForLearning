import React from 'react';
import {motion} from 'framer-motion';
import {FaTrophy} from 'react-icons/fa';
import {BadgeDTO} from '@dti-isin/backend-api-client';

interface Props {
    badge: BadgeDTO;
    index: number;
    total: number;
    formatDate: (date?: string) => string;
}

export const BadgeIconCircle: React.FC<Props> = ({badge, index, total, formatDate}) => {
    const angle = (index / total) * 360;
    const radius = 40;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return (
        <motion.div
            whileHover={{scale: 1.1, zIndex: 50}}
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-warning to-warning/60
                       flex items-center justify-center cursor-pointer shadow-md"
            style={{
                transform: `translate(${x}px, ${y}px)`,
                zIndex: total - index,
            }}
        >
            <div className="group relative">
                <FaTrophy className="text-white text-lg"/>
                <motion.div
                    initial={{opacity: 0}}
                    whileHover={{opacity: 1}}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full
                               bg-base-100 p-2 rounded-md shadow-xl text-xs whitespace-nowrap z-50"
                >
                    <div><strong>By:</strong> {badge.assignedBy.name}</div>
                    <div className="text-base-content/60">{formatDate(badge.assignedAt)}</div>
                </motion.div>
            </div>
        </motion.div>
    );
};
