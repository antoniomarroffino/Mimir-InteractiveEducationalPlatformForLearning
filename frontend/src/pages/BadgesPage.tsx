import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import confetti from 'canvas-confetti';
import {useGetBadgeHolderByAzureOid} from '../hooks/badgeholder/useGetBadgeHolderByAzureOid';
import {BadgesPageHeader} from '../components/badge/BadgesPageHeader';
import {BadgesInfoAlert} from '../components/badge/BadgesInfoAlert';
import {BadgeStatsGrid} from '../components/badge/BadgeStatsGrid';
import {BadgeCollectionGrid} from '../components/badge/BadgeCollectionGrid';
import {EmptyBadgeState} from '../components/badge/EmptyBadgeState';
import {formatBadgeDate, groupBadges, GroupedBadge} from '../utils/badgeUtils';
import {useAuth} from "../hooks/auth/useAuth.ts";

const BadgesPage = () => {
    const {user} = useAuth();
    const {data: badgeHolder, isLoading, error} = useGetBadgeHolderByAzureOid(user!.azureOid!);
    const [groupedBadges, setGroupedBadges] = useState<GroupedBadge[]>();
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (badgeHolder?.badges?.length) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: {y: 0.6},
            });
            setGroupedBadges(groupBadges(badgeHolder.badges));
        }
    }, [badgeHolder]);

    if (isLoading) {
        return (
            <motion.div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100">
                <motion.div
                    className="p-8 rounded-2xl bg-base-100 shadow-2xl"
                    animate={{scale: [1, 1.1, 1], rotate: [0, 180, 360]}}
                    transition={{duration: 2, repeat: Infinity, ease: 'easeInOut'}}
                >
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <BadgesPageHeader
                    totalBadges={badgeHolder?.badges?.length ?? 0}
                    showInfoToggle
                    onToggleInfo={() => setShowInfo(prev => !prev)}
                />

                {showInfo && <BadgesInfoAlert/>}

                {error || !badgeHolder || badgeHolder.badges!.length === 0 ? (
                    <EmptyBadgeState/>
                ) : (
                    <>
                        <BadgeStatsGrid badges={badgeHolder.badges!}/>
                        <BadgeCollectionGrid groupedBadges={groupedBadges!} formatDate={formatBadgeDate}/>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default BadgesPage;
