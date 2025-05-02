import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import {QuizSessionComponent} from "../../components/common/QuizSessionComponent.tsx";
import {QuizHistorySection} from "../../components/quiz-results/QuizHistorySection.tsx";
import {UserWithoutCoursesDTO} from "@dti-isin/backend-api-client";

interface QuizSectionProps {
    user: UserWithoutCoursesDTO | null;
}

export const QuizSection = ({ user }: QuizSectionProps) => {
    return (
        <div id="quiz-section" className="container mx-auto px-4 py-12 sm:py-24">
            <motion.section
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 1}}
                className="bg-base-100 rounded-xl sm:rounded-3xl shadow-xl p-4 sm:p-8 md:p-12 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                <div className="relative">
                    <div className="text-center mb-6 sm:mb-12">
                        <FaGraduationCap className="text-4xl sm:text-5xl text-primary mx-auto mb-4 sm:mb-6"/>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                            Join a Quiz Session
                        </h2>
                        <p className="text-sm sm:text-base md:text-xl text-base-content/70 max-w-2xl mx-auto px-2">
                            Enter your access code below to start your learning journey
                        </p>
                    </div>
                    <QuizSessionComponent />
                </div>
            </motion.section>

            {user && (
                <motion.section
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 1.2}}
                    className="mt-8 sm:mt-16"
                >
                    <QuizHistorySection />
                </motion.section>
            )}
        </div>
    );
};