import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Badge, BadgeType } from '@dti-isin/backend-api-client';
import { FaTrophy, FaLock, FaStar, FaChartLine, FaMedal } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { badgeHolderApi } from "../../config/config.ts";
import confetti from 'canvas-confetti';

interface GroupedBadge {
    type: BadgeType | undefined;
    count: number;
    badges: Badge[];
    latestDate: string | undefined;
}

const BadgesPage: React.FC = () => {
    const { user } = useAuth();

    const { data: badgeHolder, isLoading } = useQuery(
        ['badgeHolder', user?.azureOid],
        async () => {
            if (!user?.azureOid) return null;
            return await badgeHolderApi.apiBadgeHoldersAzureOIDGet({
                azureOID: user.azureOid
            });
        },
        { enabled: !!user?.azureOid }
    );

    const badges = badgeHolder?.data.badges || [];

    React.useEffect(() => {
        if (badges.length > 0) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [badges.length]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const groupBadges = (badges: Badge[]): GroupedBadge[] => {
        const grouped = badges.reduce((acc, badge) => {
            const key = badge.type;
            const assignedAt = badge.assignedAt || new Date().toISOString(); // Fallback alla data corrente se undefined

            if (key && !acc[key]) {
                acc[key] = {
                    type: badge.type,
                    count: 0,
                    badges: [],
                    latestDate: assignedAt
                };
            }

            if(key) {
                acc[key].count++;
                acc[key].badges.push(badge);

                const currentDate = new Date(assignedAt);
                const existingDate = new Date(acc[key].latestDate!);

                acc[key].latestDate = currentDate > existingDate
                    ? assignedAt
                    : acc[key].latestDate;
            }

            return acc;
        }, {} as Record<string, GroupedBadge>);

        return Object.values(grouped);
    };

    const groupedBadges = groupBadges(badges);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100">
                <div className="p-8 rounded-2xl bg-base-100 shadow-2xl">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 mb-12">
                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold text-primary-content mb-4">
                            Achievement Gallery
                        </h1>
                        <p className="text-xl text-primary-content/80 max-w-2xl">
                            {badges.length > 0
                                ? `🌟 Impressive! You've earned ${badges.length} badge${badges.length > 1 ? 's' : ''}. Keep pushing your limits!`
                                : "🚀 Your journey to excellence begins here. Earn badges by mastering your quizzes!"}
                        </p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center opacity-20">
                        <FaTrophy className="text-[200px] text-primary-content" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            title: "Total Badges",
                            value: badges.length,
                            icon: <FaMedal className="text-4xl text-primary" />,
                            description: "Collected so far"
                        },
                        {
                            title: "Latest Achievement",
                            value: badges.length > 0 ? formatDate(badges[badges.length - 1].assignedAt) : "None yet",
                            icon: <FaChartLine className="text-4xl text-secondary" />,
                            description: "Keep the momentum"
                        },
                        {
                            title: "Progress",
                            value: `${(badges.length / 10 * 100).toFixed(0)}%`,
                            icon: <FaStar className="text-4xl text-accent" />,
                            description: "Toward mastery"
                        }
                    ].map((stat, index) => (
                        <div key={index}
                             className="bg-base-100 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-base-content/70">{stat.title}</p>
                                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                    <p className="text-sm text-base-content/60 mt-1">{stat.description}</p>
                                </div>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Badge Collection */}
                <h2 className="text-3xl font-bold mb-8">Your Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedBadges.map((groupedBadge, index) => (
                        <div key={index}
                             className="group bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300
                  transform hover:-translate-y-2 relative overflow-hidden">
                            <div className="flex flex-col gap-4">
                                {/* Header con conteggio */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">{groupedBadge.type}</h3>
                                    <div className="badge badge-warning gap-2">
                                        <FaTrophy /> x{groupedBadge.count}
                                    </div>
                                </div>

                                {/* Badge Stack Visualizzazione */}
                                <div className="relative h-32 flex items-center justify-center perspective-1000">
                                    {groupedBadge.badges.map((badge, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-warning to-warning/50
                                 flex items-center justify-center transform transition-all duration-500
                                 group-hover:rotate-y-180 hover:z-50 cursor-pointer"
                                            style={{
                                                transform: `
                                translateX(${Math.cos(i * (2 * Math.PI / groupedBadge.count)) * 30}px)
                                translateY(${Math.sin(i * (2 * Math.PI / groupedBadge.count)) * 30}px)
                                scale(${1 - (i * 0.05)})
                                rotate(${i * (360 / groupedBadge.count)}deg)
                            `,
                                                zIndex: groupedBadge.badges.length - i,
                                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                                                transformStyle: 'preserve-3d'
                                            }}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <FaTrophy className="text-2xl text-white" />
                                                <div className="text-xs text-white font-bold opacity-75">
                                                    {formatDate(badge.assignedAt)}
                                                </div>
                                            </div>

                                            {/* Info sul retro (visibile al hover) */}
                                            <div className="absolute inset-0 bg-base-100 rounded-full rotate-y-180 backface-hidden
                                      flex items-center justify-center p-2 text-center">
                                                <div className="text-xs">
                                                    <div className="font-bold">{badge.assignedBy}</div>
                                                    <div className="text-base-content/60">
                                                        {formatDate(badge.assignedAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer con ultima data */}
                                <div className="text-sm text-base-content/70 text-center mt-2">
                                    Latest achievement: {formatDate(groupedBadge.latestDate)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Future Badge Placeholder */}
                    <div className="bg-base-100/50 rounded-2xl p-6 border-2 border-dashed border-base-300
                                  flex flex-col items-center justify-center text-center gap-4 group
                                  hover:border-primary hover:bg-base-100/80 transition-all duration-300">
                        <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center
                                      group-hover:scale-110 transition-transform duration-300">
                            <FaLock className="text-2xl text-base-content/40 group-hover:text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-base-content/70">Next Achievement</h3>
                            <p className="text-sm text-base-content/50">Complete more quizzes to unlock</p>
                        </div>
                    </div>
                </div>

                {/* Motivational Section */}
                {badges.length === 0 && (
                    <div className="mt-12 bg-base-100 rounded-3xl p-12 text-center">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-7xl mb-6">🎯</div>
                            <h3 className="text-3xl font-bold mb-4">Begin Your Journey!</h3>
                            <p className="text-xl text-base-content/70">
                                Your first badge awaits! Complete quizzes with excellence and watch your
                                collection grow. Every badge tells a story of your success.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BadgesPage;