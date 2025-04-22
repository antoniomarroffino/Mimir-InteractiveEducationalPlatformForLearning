import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaTrophy, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { QuestionDTO, QuizAttemptDTO } from '@dti-isin/backend-api-client';
import { ResponseTimeChart } from "./time/ResponseTimeChart";
import { ScoreDistributionChart } from "./points/ScoreDistributionChart";

interface ChartSelectorProps {
    questionStats: {
        question: QuestionDTO;
        averageTimeSpent: number;
        totalResponses: number;
        correctResponses: number;
        percentageCorrect: number;
    }[];
    attempts: QuizAttemptDTO[];
    questions: QuestionDTO[];
}

interface ChartOption {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    component: React.ReactNode;
}

export const ChartSelector: React.FC<ChartSelectorProps> = ({
                                                                questionStats,
                                                                attempts,
                                                                questions
                                                            }) => {
    const [activeCharts, setActiveCharts] = useState<Set<string>>(new Set(['time']));

    const chartOptions: ChartOption[] = [
        {
            id: 'time',
            icon: <FaClock className="w-6 h-6" />,
            label: 'Response Time',
            description: 'Analyze time spent on questions',
            component: (
                <ResponseTimeChart
                    questionStats={questionStats}
                    attempts={attempts}
                    questions={questions}
                />
            )
        },
        {
            id: 'score',
            icon: <FaTrophy className="w-6 h-6" />,
            label: 'Score Distribution',
            description: 'View score statistics',
            component: (
                <ScoreDistributionChart
                    attempts={attempts}
                    questions={questions}
                />
            )
        },
    ];

    const toggleChart = (chartId: string) => {
        setActiveCharts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chartId)) {
                newSet.delete(chartId);
            } else {
                newSet.add(chartId);
            }
            return newSet;
        });
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <FaChartLine className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Interactive Analytics Dashboard
                    </h2>
                </div>
                <p className="text-base-content/70 max-w-2xl mx-auto">
                    Explore detailed insights about your quiz through various interactive visualizations.
                    Select multiple charts to create your custom analysis view.
                </p>
            </div>

            {/* Chart Selection Section */}
            <div className="bg-base-200/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-sm font-medium text-base-content/60 mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-base-content/20"></span>
                    SELECT VISUALIZATIONS
                    <span className="flex-1 h-px bg-base-content/20"></span>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    {chartOptions.map((chart) => (
                        <motion.button
                            key={chart.id}
                            onClick={() => toggleChart(chart.id)}
                            className={`
                                relative group flex items-center gap-3 p-4 rounded-xl
                                transition-all duration-300 transform hover:scale-105
                                ${activeCharts.has(chart.id)
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white hover:bg-base-100 shadow-md'
                            }
                            `}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="relative">
                                {chart.icon}
                                {activeCharts.has(chart.id) && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 bg-success rounded-full p-1"
                                    >
                                        <FaCheckCircle className="w-3 h-3 text-white" />
                                    </motion.div>
                                )}
                            </div>
                            <div className="text-left">
                                <div className="font-bold">{chart.label}</div>
                                <div className="text-sm opacity-80">{chart.description}</div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Active Charts Section */}
            <AnimatePresence mode="popLayout">
                {Array.from(activeCharts).map((chartId) => {
                    const chart = chartOptions.find(c => c.id === chartId);
                    if (!chart) return null;

                    return (
                        <motion.div
                            key={chartId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="card bg-white shadow-lg"
                        >
                            <div className="card-body">
                                {chart.component}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Empty State */}
            {activeCharts.size === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-base-content/60"
                >
                    <FaChartLine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Charts Selected</h3>
                    <p>Select one or more visualizations above to begin your analysis</p>
                </motion.div>
            )}
        </div>
    );
};