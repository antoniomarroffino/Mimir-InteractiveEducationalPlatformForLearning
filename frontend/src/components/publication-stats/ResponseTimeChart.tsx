import React, { useState, useMemo } from 'react';
import { QuestionDTO, QuizAttemptDTO } from '@dti-isin/backend-api-client';
import { FaClock } from 'react-icons/fa';
import { GeneralTimeChart } from "../quiz-results/GeneralTimeChart.tsx";
import { SingleAttemptTimeChart } from "../quiz-results/SingleAttemptTimeChart.tsx";
import { motion, AnimatePresence } from 'framer-motion';

interface ResponseTimeChartProps {
    questionStats: {
        question: QuestionDTO;
        averageTimeSpent: number;
    }[];
    attempts: QuizAttemptDTO[];
    questions: QuestionDTO[];
}

const chartModes = {
    GENERAL: 'general',
    SINGLE: 'single'
} as const;

type ChartMode = typeof chartModes[keyof typeof chartModes];

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({
                                                                        questionStats,
                                                                        attempts,
                                                                        questions
                                                                    }) => {
    const [mode, setMode] = useState<ChartMode>(chartModes.GENERAL);

    const hasData = useMemo(() => {
        return attempts.length > 0 && questionStats.length > 0;
    }, [attempts.length, questionStats.length]);

    if (!hasData) {
        return (
            <div className="bg-base-100 rounded-xl p-6 border border-base-200 shadow-lg">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FaClock className="text-primary w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold text-base-content/70">
                            No response time data available
                        </h3>
                        <p className="mt-2 text-base-content/50">
                            Wait for students to complete the quiz to see time statistics
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 rounded-xl p-6 border border-base-200 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-primary w-5 h-5" />
                        <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-black text-transparent">
                            Response Time Analysis
                        </h3>
                    </div>
                    <p className="mt-1 text-sm sm:text-base text-base-content/80 font-medium pl-7">
                        {mode === chartModes.GENERAL
                            ? 'Average time spent per question'
                            : 'Individual attempt response times'}
                    </p>
                </div>

                <div className="join border border-base-300 rounded-lg">
                    {Object.values(chartModes).map((chartMode) => (
                        <button
                            key={chartMode}
                            onClick={() => setMode(chartMode)}
                            className={`
                                btn join-item capitalize
                                ${mode === chartMode ? 'btn-primary' : 'btn-ghost'}
                                hover:bg-primary/10 transition-colors
                            `}
                        >
                            {chartMode}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {mode === chartModes.GENERAL ? (
                        <GeneralTimeChart
                            questionStats={questionStats}
                        />
                    ) : (
                        <SingleAttemptTimeChart
                            questions={questions}
                            attempts={attempts}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};