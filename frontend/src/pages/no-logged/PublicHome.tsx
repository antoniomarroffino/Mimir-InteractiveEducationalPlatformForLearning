import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import mimirLogo from '../../assets/mimir-logo.png';
import { StatsSection } from './StatsSection';
import {QuizSection} from "./QuizSection.tsx";
import {HeroSection} from "./HeroSection.tsx";
import {FeaturesSection} from "./FeaturesSection.tsx";
import {BadgeSection} from "./BadgeSection.tsx";

const PublicHome = () => {
    const { login, user } = useAuth();

    const scrollToQuizSection = () => {
        const quizSection = document.querySelector('#quiz-section');
        quizSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.div
            className="min-h-screen bg-base-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <HeroSection
                user={user}
                login={login}
                scrollToQuizSection={scrollToQuizSection}
                mimirLogo={mimirLogo}
            />

            <StatsSection />

            <QuizSection user={user} />

            <FeaturesSection />

            <BadgeSection />
        </motion.div>
    );
};

export default PublicHome;