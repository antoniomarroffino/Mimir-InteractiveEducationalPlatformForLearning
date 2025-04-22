import {useAuth} from '../../hooks/useAuth';
import {QuizSessionComponent} from "../../components/common/QuizSessionComponent";
import {QuizHistorySection} from "../../components/quiz-results/QuizHistorySection";
import {motion} from 'framer-motion';
import mimirLogo from '../../assets/mimir-logo.png';
import {FaBrain, FaChartLine, FaGraduationCap, FaRocket, FaTrophy} from 'react-icons/fa';
import {Link} from "react-router-dom";
import {FiAward, FiCheckSquare, FiLogIn} from "react-icons/fi";

const PublicHome = () => {
    const {login, user} = useAuth();

    const scrollToQuizSection = () => {
        const quizSection = document.querySelector('#quiz-section');
        quizSection?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div className="min-h-screen bg-base-200">
            <motion.div
                className="relative min-h-[80vh] bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8}}
            >
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-base-200/50 to-transparent"></div>
                </div>

                <div className="relative container mx-auto px-4 h-full flex items-center">
                    <div className="grid md:grid-cols-2 gap-12 items-center py-16">
                        <motion.div
                            initial={{x: -50, opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            transition={{delay: 0.3, duration: 0.8}}
                            className="text-primary-content"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                Transform Your Learning Journey
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                                Dive into an interactive learning experience with real-time feedback and personalized
                                insights.
                            </p>
                            <div className="flex flex-wrap gap-4">
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
                                    <Link to="/quiz-review">
                                        <motion.button
                                            className="btn btn-ghost btn-lg text-primary-content group"
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
                                        className="btn btn-ghost btn-lg text-primary-content group"
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        Login
                                        <FiLogIn
                                            className="ml-2 transform group-hover:translate-x-1 transition-transform"/>

                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{delay: 0.5, duration: 0.8}}
                            className="flex justify-center"
                        >
                            <img
                                src={mimirLogo}
                                alt="Mimir Logo"
                                className="h-64 md:h-80 filter drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{y: 50, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{delay: 0.8}}
                className="container mx-auto px-4 -mt-16 relative z-10"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        {value: "10K+", label: "Students"},
                        {value: "500+", label: "Quizzes"},
                        {value: "95%", label: "Success Rate"},
                        {value: "24/7", label: "Support"}
                    ].map((stat, index) => (
                        <div key={index}
                             className="bg-base-100 rounded-2xl p-6 shadow-xl text-center
                                      transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-base-content/70">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div id="quiz-section" className="container mx-auto px-4 py-24">
                <motion.section
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 1}}
                    className="bg-base-100 rounded-3xl shadow-xl p-12 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
                    <div className="relative">
                        <div className="text-center mb-12">
                            <FaGraduationCap className="text-5xl text-primary mx-auto mb-6"/>
                            <h2 className="text-4xl font-bold mb-4">
                                Join a Quiz Session
                            </h2>
                            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                                Enter your access code below to start your learning journey
                            </p>
                        </div>
                        <QuizSessionComponent/>
                    </div>
                </motion.section>

                {user && (
                    <motion.section
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 1.2}}
                        className="mt-16"
                    >
                        <QuizHistorySection/>
                    </motion.section>
                )}
            </div>

            <motion.section
                className="py-24 bg-base-100"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 1.4}}
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Why Choose Mimir?
                        </h2>
                        <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                            Experience the future of learning with our innovative features
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaBrain className="text-primary"/>,
                                title: "Smart Learning",
                                description: "Adaptive quizzes that evolve with your progress"
                            },
                            {
                                icon: <FaTrophy className="text-warning"/>,
                                title: "Achievement System",
                                description: "Earn badges and track your milestones"
                            },
                            {
                                icon: <FaChartLine className="text-success"/>,
                                title: "Detailed Analytics",
                                description: "Comprehensive insights into your performance"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-base-200 rounded-2xl p-8 shadow-lg hover:shadow-xl
                                          transform hover:-translate-y-2 transition-all duration-300"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 1.6 + index * 0.1}}
                            >
                                <div className="text-4xl mb-6">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-base-content/70 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="py-24 bg-gradient-to-br from-primary to-secondary text-primary-content relative overflow-hidden"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 1.8}}
            >
                <div className="absolute inset-0 bg-pattern opacity-10"></div>

                <motion.div
                    className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
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
                    >
                        <FiAward className="text-6xl mx-auto mb-6 text-warning"/>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Unlock Your Achievement Badges
                        </h2>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                            Showcase your expertise and progress with our badge system.
                            Each badge represents a milestone in your learning journey.
                        </p>
                    </motion.div>

                    <Link to="/badges">
                        <motion.button
                            className="btn btn-lg btn-primary glass gap-2 group"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            View All Badges
                            <FiAward className="transform group-hover:rotate-12 transition-transform"/>
                        </motion.button>
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};

export default PublicHome;
