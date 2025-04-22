import React, { useState, useMemo } from 'react';
import { QuestionDTO, QuizAttemptDTO } from '@dti-isin/backend-api-client';
import { FaClock } from 'react-icons/fa';
import { GeneralTimeChart } from "./GeneralTimeChart.tsx";
import { SingleAttemptTimeChart } from "./SingleAttemptTimeChart.tsx";
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
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaClock className="text-primary w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-base-content/70">
                    No Response Time Data
                </h3>
                <p className="mt-2 text-sm text-base-content/50 max-w-md">
                    Wait for students to complete the quiz to see time statistics
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FaClock className="text-primary w-6 h-6" />
                        <h3 className="text-xl font-bold text-base-content">
                            Response Time Analysis
                        </h3>
                    </div>
                    <p className="mt-1 text-sm text-base-content/70">
                        {mode === chartModes.GENERAL
                            ? 'Average time spent per question across all attempts'
                            : 'Detailed time analysis for individual attempts'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {Object.values(chartModes).map((chartMode) => (
                        <button
                            key={chartMode}
                            onClick={() => setMode(chartMode)}
                            className={`
                                btn btn-sm capitalize min-w-[100px]
                                ${mode === chartMode
                                ? 'btn-primary'
                                : 'btn-ghost hover:bg-base-200'
                            }
                            `}
                        >
                            {chartMode === chartModes.GENERAL ? 'Overview' : 'Individual'}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-base-200 rounded-xl p-6"
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