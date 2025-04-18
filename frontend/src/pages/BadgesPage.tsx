import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/auth/useAuth.ts";
import { BadgeDTO, BadgeType } from "@dti-isin/backend-api-client";
import { FaTrophy, FaLock, FaStar, FaChartLine, FaMedal } from "react-icons/fa";
import confetti from "canvas-confetti";
import StatsCard from "../components/badge/StatsCard.tsx";
import BadgeCard from "../components/badge/BadgeCard.tsx";
import { useGetBadgeHolderByAzureOid } from "../hooks/badgeholder/useGetBadgeHolderByAzureOid.ts";

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

  const {
    data: badgeHolder,
    isLoading: isLoadingBadgeHolder,
    error: errorNotFoundBadgeHolder,
  } = useGetBadgeHolderByAzureOid(user!.azureOid!);
  const [groupedBadges, setGroupedBadges] = useState<GroupedBadge[]>();

  useEffect(() => {
    if (badgeHolder && badgeHolder.badges) {
      if (badgeHolder.badges.length > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      const groupedBadges = groupBadges(badgeHolder!.badges!);
      setGroupedBadges(groupedBadges);
    }
  }, [badgeHolder]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const groupBadges = (badges: BadgeDTO[]): GroupedBadge[] => {
    const grouped = badges.reduce((acc, badge) => {
      const key = badge.type;
      const assignedAt = badge.assignedAt || new Date().toISOString();

      if (key && !acc[key]) {
        acc[key] = {
          type: badge.type,
          count: 0,
          badges: [],
          latestDate: assignedAt,
        };
      }

      if (key) {
        acc[key].count++;
        acc[key].badges.push(badge);
        const currentDate = new Date(assignedAt);
        const existingDate = new Date(acc[key].latestDate!);
        acc[key].latestDate =
          currentDate > existingDate ? assignedAt : acc[key].latestDate;
      }

      return acc;
    }, {} as Record<string, GroupedBadge>);

    return Object.values(grouped);
  };

  if (isLoadingBadgeHolder) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100"
      >
        <motion.div
          className="p-8 rounded-2xl bg-base-100 shadow-2xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </motion.div>
      </motion.div>
    );
  }

  if (errorNotFoundBadgeHolder) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 py-12 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-12 mb-12"
          >
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaTrophy className="text-[120px] text-primary/50" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold text-base-content mb-4">
                  No Badges Yet
                </h1>
                <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                  You haven't earned any badges yet. Complete quizzes and
                  challenges to start collecting achievements!
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-base-100 rounded-3xl p-12 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-7xl mb-6"
              >
                🚀
              </motion.div>
              <h3 className="text-3xl font-bold mb-4">Start Your Journey!</h3>
              <p className="text-xl text-base-content/70">
                Your first badge is waiting! Participate in activities and
                demonstrate your skills to unlock amazing achievements.
              </p>
            </div>
          </motion.div>
        </div>
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
        {/* Hero Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-12 mb-12"
        >
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold text-primary-content mb-4">
                Achievement Gallery
              </h1>
              <p className="text-xl text-primary-content/90 max-w-2xl leading-relaxed">
                {badgeHolder!.badges!.length > 0
                  ? `🌟 Amazing progress! You've earned ${
                      badgeHolder!.badges!.length
                    } badge${badgeHolder!.badges!.length > 1 ? "s" : ""}.`
                  : "🚀 Ready to start your collection? Complete quizzes to earn badges!"}
              </p>
            </div>
            <motion.div
              animate={{
                rotate: [0, 5, 0],
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden md:block"
            >
              <FaTrophy className="text-[120px] text-primary-content opacity-80" />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <StatsCard
            title="Total Badges"
            value={badgeHolder!.badges!.length}
            icon={<FaMedal className="text-4xl text-primary" />}
            description="Collected so far"
          />
          <StatsCard
            title="Latest Achievement"
            value={
              badgeHolder!.badges!.length > 0
                ? formatDate(
                    badgeHolder!.badges![badgeHolder!.badges!.length - 1]
                      .assignedAt
                  )
                : "None yet"
            }
            icon={<FaChartLine className="text-4xl text-secondary" />}
            description="Keep the momentum"
          />
          <StatsCard
            title="Progress"
            value={`${((badgeHolder!.badges!.length / 10) * 100).toFixed(0)}%`}
            icon={<FaStar className="text-4xl text-accent" />}
            description="Toward mastery"
          />
        </motion.div>

        {/* Badge Collection */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold mb-8">Your Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedBadges &&
              groupedBadges.map((groupedBadge, index) => (
                <BadgeCard
                  key={index}
                  groupedBadge={groupedBadge}
                  formatDate={formatDate}
                />
              ))}

            {/* Future Badge Placeholder */}
            <motion.div
              className="bg-base-100/50 rounded-2xl p-6 border-2 border-dashed border-base-300
                                      flex flex-col items-center justify-center text-center gap-4 group
                                      hover:border-primary hover:bg-base-100/80 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center"
              >
                <FaLock className="text-2xl text-base-content/40 group-hover:text-primary" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-base-content/70">
                  Next Achievement
                </h3>
                <p className="text-sm text-base-content/50">
                  Complete more quizzes to unlock
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Motivational Section */}
        {badgeHolder!.badges!.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-base-100 rounded-3xl p-12 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-7xl mb-6"
              >
                🎯
              </motion.div>
              <h3 className="text-3xl font-bold mb-4">Begin Your Journey!</h3>
              <p className="text-xl text-base-content/70">
                Your first badge awaits! Complete quizzes with excellence and
                watch your collection grow. Every badge tells a story of your
                success.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BadgesPage;
