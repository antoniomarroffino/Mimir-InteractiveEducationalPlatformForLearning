import React from "react";
import {motion} from "framer-motion";

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

const cardHoverVariants = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.3 }
    }
};

export const StatsCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
}> = ({ title, value, icon, description }) => (
    <motion.div
        variants={itemVariants}
        whileHover={cardHoverVariants.hover}
        className="bg-base-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl
                  transition-all duration-300 relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0
                      group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-start justify-between relative z-10">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <p className="text-sm font-medium text-base-content/70">{title}</p>
                <motion.p
                    className="text-3xl font-bold mt-2"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {value}
                </motion.p>
                <p className="text-sm text-base-content/60 mt-1">{description}</p>
            </motion.div>
            <motion.div
                whileHover={{
                    rotate: 5,
                    scale: 1.1,
                    transition: { duration: 0.2 }
                }}
                className="text-primary transition-colors duration-300
                         hover:text-secondary cursor-pointer"
            >
                {icon}
            </motion.div>
        </div>
    </motion.div>
);

export default StatsCard;