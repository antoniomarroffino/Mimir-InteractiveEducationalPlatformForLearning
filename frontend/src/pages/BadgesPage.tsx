import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { BadgeDTO, BadgeType } from '@dti-isin/backend-api-client';
import { FaLock, FaStar, FaChartLine, FaMedal } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import StatsCard from '../components/badge/StatsCard';
import BadgeCard from '../components/badge/BadgeCard';
import { useGetBadgeHolderByAzureOid } from '../hooks/badgeholder/useGetBadgeHolderByAzureOid';
import { BadgesPageHeader } from '../components/badge/BadgesPageHeader';
import {BadgesInfoAlert} from "../components/badge/BadgesInfoAlert.tsx";

interface GroupedBadge {
    type: BadgeType | undefined;
    count: number;
    badges: BadgeDTO[];
    latestDate: string | undefined;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const BadgesPage = () => {
    const { user } = useAuth();
    const { data: badgeHolder, isLoading, error } = useGetBadgeHolderByAzureOid(user!.azureOid!);
    const [groupedBadges, setGroupedBadges] = useState<GroupedBadge[]>();
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (badgeHolder?.badges?.length) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
            setGroupedBadges(groupBadges(badgeHolder.badges));
        }
    }, [badgeHolder]);

    const groupBadges = (badges: BadgeDTO[]): GroupedBadge[] => {
        const grouped = badges.reduce((acc, badge) => {
            const key = badge.type;
            const assignedAt = badge.assignedAt || new Date().toISOString();

            if (key && !acc[key]) {
                acc[key] = {
                    type: key,
                    count: 0,
                    badges: [],
                    latestDate: assignedAt,
                };
            }

            if (key) {
                acc[key].count++;
                acc[key].badges.push(badge);
                const current = new Date(assignedAt);
                const existing = new Date(acc[key].latestDate!);
                acc[key].latestDate = current > existing ? assignedAt : acc[key].latestDate;
            }

            return acc;
        }, {} as Record<string, GroupedBadge>);

        return Object.values(grouped);
    };

    const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : 'N/A';

    if (isLoading) {
        return (
            <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100">
                <motion.div
                    className="p-8 rounded-2xl bg-base-100 shadow-2xl"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <BadgesPageHeader
                    totalBadges={badgeHolder?.badges?.length ?? 0}
                    showInfoToggle
                    onToggleInfo={() => setShowInfo(prev => !prev)}
                />
                {showInfo && <BadgesInfoAlert />}

                {error || !badgeHolder || badgeHolder.badges!.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12 bg-base-100 rounded-3xl p-12 text-center"
                    >
                        <div className="max-w-2xl mx-auto">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="text-7xl mb-6"
                            >
                                🚀
                            </motion.div>
                            <h3 className="text-3xl font-bold mb-4">Start Your Journey!</h3>
                            <p className="text-xl text-base-content/70">
                                Your first badge is waiting! Participate in activities and demonstrate your skills to unlock amazing achievements.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                        >
                            <StatsCard
                                title="Total Badges"
                                value={badgeHolder.badges!.length}
                                icon={<FaMedal className="text-4xl text-primary" />}
                                description="Collected so far"
                            />
                            <StatsCard
                                title="Latest Achievement"
                                value={formatDate(badgeHolder.badges!.at(-1)?.assignedAt)}
                                icon={<FaChartLine className="text-4xl text-secondary" />}
                                description="Keep the momentum"
                            />
                            <StatsCard
                                title="Progress"
                                value={`${(badgeHolder.badges!.length / 10 * 100).toFixed(0)}%`}
                                icon={<FaStar className="text-4xl text-accent" />}
                                description="Toward mastery"
                            />
                        </motion.div>

                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <h2 className="text-3xl font-bold mb-8">Your Collection</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {groupedBadges?.map((group, index) => (
                                    <BadgeCard
                                        key={index}
                                        groupedBadge={group}
                                        formatDate={formatDate}
                                    />
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
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default BadgesPage;
