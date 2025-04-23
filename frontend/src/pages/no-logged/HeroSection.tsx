import {motion} from 'framer-motion';
import {Link} from "react-router-dom";
import {FaRocket} from 'react-icons/fa';
import {FiCheckSquare, FiLogIn} from "react-icons/fi";
import {UserWithoutCoursesDTO} from "@dti-isin/backend-api-client";

interface HeroSectionProps {
    user: UserWithoutCoursesDTO | null;
    login: () => void;
    scrollToQuizSection: () => void;
    mimirLogo: string;
}

export const HeroSection = ({user, login, scrollToQuizSection, mimirLogo}: HeroSectionProps) => {
    return (
        <motion.div
            className="relative min-h-[90vh] sm:min-h-[80vh] bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.8}}
        >
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-base-200/50 to-transparent"></div>
            </div>

            <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center py-8 md:py-16">
                    <motion.div
                        initial={{x: -50, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{delay: 0.3, duration: 0.8}}
                        className="text-primary-content"
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                            Transform Your Learning Journey
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 opacity-90 leading-relaxed">
                            Dive into an interactive learning experience with real-time feedback and personalized
                            insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4">
                            <motion.button
                                onClick={scrollToQuizSection}
                                className="btn btn-primary btn-lg gap-2 group"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                Join in a quiz
                                <FaRocket className="transform group-hover:translate-x-1 transition-transform"/>
                            </motion.button>
                            {user ? (
                                <Link to="/quiz-review" className="w-full sm:w-auto">
                                    <motion.button
                                        className="btn btn-ghost btn-lg text-primary-content group w-full"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        Review Quizzes
                                        <FiCheckSquare
                                            className="ml-2 transform group-hover:translate-x-1 transition-transform"/>
                                    </motion.button>
                                </Link>
                            ) : (
                                <motion.button
                                    onClick={login}
                                    className="btn btn-ghost btn-lg text-primary-content group w-full sm:w-auto"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    Login
                                    <FiLogIn className="ml-2 transform group-hover:translate-x-1 transition-transform"/>
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{scale: 0.8, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{delay: 0.5, duration: 0.8}}
                        className="flex justify-center mt-8 md:mt-0"
                    >
                        <img
                            src={mimirLogo}
                            alt="Mimir Logo"
                            className="h-48 sm:h-64 md:h-80 filter drop-shadow-2xl"
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};