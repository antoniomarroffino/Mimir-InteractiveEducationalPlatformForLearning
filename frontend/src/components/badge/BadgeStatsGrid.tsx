import {motion} from 'framer-motion';
import {FaChartLine, FaMedal, FaStar} from 'react-icons/fa';
import StatsCard from './StatsCard';
import {formatBadgeDate} from '../../utils/badgeUtils';
import {BadgeDTO} from '@dti-isin/backend-api-client';
import React from "react";

interface Props {
    badges: BadgeDTO[];
}

export const BadgeStatsGrid: React.FC<Props> = ({badges}) => {
    return (
        <motion.div
            variants={{
                hidden: {opacity: 0},
                visible: {
                    opacity: 1,
                    transition: {staggerChildren: 0.1},
                },
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
            <StatsCard
                title="Total Badges"
                value={badges.length}
                icon={<FaMedal className="text-4xl text-primary"/>}
                description="Collected so far"
            />
            <StatsCard
                title="Latest Achievement"
                value={formatBadgeDate(badges.at(-1)?.assignedAt)}
                icon={<FaChartLine className="text-4xl text-secondary"/>}
                description="Keep the momentum"
            />
            <StatsCard
                title="Progress"
                value={`${(badges.length / 10 * 100).toFixed(0)}%`}
                icon={<FaStar className="text-4xl text-accent"/>}
                description="Toward mastery"
            />
        </motion.div>
    );
};
