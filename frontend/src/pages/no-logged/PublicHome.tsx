import { useAuth } from '../../hooks/useAuth';
import { QuizSessionComponent } from "../../components/common/QuizSessionComponent";
import { QuizHistorySection } from "../../components/quiz-results/QuizHistorySection";
import { motion } from 'framer-motion';
import mimirLogo from '../../assets/mimir-logo.png';

const PublicHome = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-base-200">
            <motion.div
                className="hero min-h-[60vh] bg-gradient-to-r from-primary to-secondary relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>

                <div className="hero-content text-center text-neutral-content flex flex-col">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <img
                            src={mimirLogo}
                            alt="Mimir Logo"
                            className="h-32 md:h-40 mx-auto"
                        />
                    </motion.div>
                    <div className="max-w-3xl">
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold mb-6"
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                        >
                            Welcome to Mimir
                        </motion.h1>
                        <motion.p
                            className="text-xl mb-8 opacity-90"
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                        >
                            Enhance your learning journey through interactive quizzes and real-time feedback
                        </motion.p>
                        {!user && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >

                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-12">
                <div className="space-y-16">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-base-100 rounded-3xl shadow-xl p-8"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-4">
                                Join a Quiz Session
                            </h2>
                            <p className="text-base-content/70">
                                Enter the access code to participate in a quiz session
                            </p>
                        </div>
                        <QuizSessionComponent />
                    </motion.section>

                    {user && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <QuizHistorySection />
                        </motion.section>
                    )}
                </div>
            </div>

            <motion.section
                className="py-16 bg-base-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 mb-12">
                        <img
                            src={mimirLogo}
                            alt="Mimir Logo"
                            className="h-12"
                        />
                        <h2 className="text-3xl font-bold">
                            Why Choose Mimir?
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="card bg-base-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <div className="card-body items-center text-center">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="card-title">{feature.title}</h3>
                                    <p className="text-base-content/70">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

const features = [
    {
        icon: "📚",
        title: "Smart Learning",
        description: "Experience intelligent quiz adaptation and personalized feedback"
    },
    {
        icon: "🏆",
        title: "Achievement System",
        description: "Earn badges and track your progress with Mimir's reward system"
    },
    {
        icon: "📊",
        title: "Detailed Analytics",
        description: "Get comprehensive insights into your learning journey"
    }
];

export default PublicHome;