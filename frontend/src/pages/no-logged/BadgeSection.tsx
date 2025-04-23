import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import { Link } from "react-router-dom";

export const BadgeSection = () => {
    return (
        <motion.section
            className="py-12 sm:py-24 bg-gradient-to-br from-primary to-secondary text-primary-content relative overflow-hidden"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 1.8}}
        >
            <div className="absolute inset-0 bg-pattern opacity-10"></div>

            <motion.div
                className="absolute -right-20 -top-20 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    transition={{delay: 0.2}}
                    className="max-w-4xl mx-auto px-4"
                >
                    <FiAward className="text-4xl sm:text-6xl mx-auto mb-4 sm:mb-6 text-warning"/>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                        Unlock Your Achievement Badges
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
                        Showcase your expertise and progress with our badge system.
                        Each badge represents a milestone in your learning journey.
                    </p>
                </motion.div>

                <Link to="/badges">
                    <motion.button
                        className="btn btn-md sm:btn-lg btn-primary glass gap-2 group w-full sm:w-auto"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        View All Badges
                        <FiAward className="transform group-hover:rotate-12 transition-transform"/>
                    </motion.button>
                </Link>
            </div>
        </motion.section>
    );
};