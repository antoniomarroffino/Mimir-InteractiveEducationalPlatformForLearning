import React from 'react';
import { motion } from 'framer-motion';

interface QuizExecutionHeaderProps {
    title: string;
    description?: string;
}

export const QuizExecutionHeader: React.FC<QuizExecutionHeaderProps> = ({ title, description }) => {
    return (
        <div className="bg-gradient-to-r from-primary to-secondary">
            <div className="container mx-auto px-4 py-10 text-center text-neutral-content">
                <motion.h1
                    className="text-4xl font-extrabold tracking-tight mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        className="text-lg max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {description}
                    </motion.p>
                )}
            </div>
        </div>
    );
};
