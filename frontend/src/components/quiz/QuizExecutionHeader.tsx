import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface QuizExecutionHeaderProps {
    title: string;
    description?: string;
}

export const QuizExecutionHeader: React.FC<QuizExecutionHeaderProps> = ({ title, description }) => {
    const [showDescription, setShowDescription] = useState(false);

    const toggleDescription = () => {
        setShowDescription(prev => !prev);
    };

    const hasDescription = description && description.trim().length > 0;

    return (
        <>
            <div className="bg-gradient-to-r from-primary to-secondary text-neutral-content">
                <div className="container mx-auto px-4 py-6 sm:py-10 text-center">
                    <motion.h1
                        className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {title}
                    </motion.h1>

                    <motion.button
                        onClick={toggleDescription}
                        className="btn btn-sm mt-2 bg-base-100 text-base-content hover:bg-base-200 shadow-md"
                        whileTap={{ scale: 0.95 }}
                    >
                        {showDescription ? (
                            <>
                                Hide info <ChevronUpIcon className="w-4 h-4 ml-1" />
                            </>
                        ) : (
                            <>
                                Show info <ChevronDownIcon className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            <AnimatePresence>
                {showDescription && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-base-200 text-base-content py-4 px-4 sm:px-8 shadow-md border-b border-base-300"
                    >
                        <div className="container mx-auto max-w-3xl text-center text-base leading-relaxed">
                            {hasDescription
                                ? description
                                : <span className="italic text-base-content/70">No info provided for this quiz.</span>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
