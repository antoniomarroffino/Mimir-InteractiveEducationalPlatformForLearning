import { motion } from 'framer-motion';
import { FaBrain, FaTrophy, FaChartLine } from 'react-icons/fa';

const features = [
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
];

export const FeaturesSection = () => {
    return (
        <motion.section
            className="py-12 sm:py-24 bg-base-100"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 1.4}}
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                        Why Choose Mimir?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto px-4">
                        Experience the future of learning with our innovative features
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-base-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl
                                      transform hover:-translate-y-2 transition-all duration-300"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 1.6 + index * 0.1}}
                        >
                            <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{feature.icon}</div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                            <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};