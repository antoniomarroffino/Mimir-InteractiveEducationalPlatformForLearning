import { motion } from 'framer-motion';

export const StatsSection = () => {
    const stats = [
        {value: "∞", label: "Work hours"},
        {value: "50+", label: "Students approved"},
        {value: "100%", label: "Backend Tests coverage"},
        {value: "50k+", label: "Lines of code"}
    ];

    return (
        <motion.div
            initial={{y: 50, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay: 0.8}}
            className="container mx-auto px-4 -mt-16 relative z-10"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                    <div key={index}
                         className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl text-center
                                  transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                        <div className="text-sm sm:text-base text-base-content/70">{stat.label}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};