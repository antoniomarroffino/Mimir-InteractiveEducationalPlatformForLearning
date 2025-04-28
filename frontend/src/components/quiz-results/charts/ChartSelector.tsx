import React, {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {FaChartLine, FaCheckCircle, FaClock, FaTrophy} from 'react-icons/fa';
import {QuestionDTO, QuizAttemptDTO} from '@dti-isin/backend-api-client';
import {ResponseTimeChart} from "./time/ResponseTimeChart";
import {ScoreDistributionChart} from "./points/ScoreDistributionChart";

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
            icon: <FaClock className="w-6 h-6"/>,
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
            icon: <FaTrophy className="w-6 h-6"/>,
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
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <FaChartLine className="text-primary w-6 h-6"/>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Analytics Dashboard</h2>
                    <p className="text-sm text-base-content/70">
                        Select charts to analyze quiz performance
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4">
                {chartOptions.map((chart) => (
                    <motion.button
                        key={chart.id}
                        onClick={() => toggleChart(chart.id)}
                        className={`
                relative flex items-center gap-2 sm:gap-3
                p-3 sm:p-4 rounded-xl
                transition-all duration-300
                w-full sm:w-auto
                ${activeCharts.has(chart.id)
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-base-200 hover:bg-base-300'
                        }
            `}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        <div className="relative flex-shrink-0">
                            {chart.icon}
                            {activeCharts.has(chart.id) && (
                                <motion.div
                                    initial={{scale: 0}}
                                    animate={{scale: 1}}
                                    className="absolute -top-2 -right-2 bg-success rounded-full p-1"
                                >
                                    <FaCheckCircle className="w-3 h-3 text-white" />
                                </motion.div>
                            )}
                        </div>
                        <div className="text-left text-sm sm:text-base">
                            <div className="font-bold">{chart.label}</div>
                            <div className="text-xs opacity-80">{chart.description}</div>
                        </div>
                    </motion.button>
                ))}
            </div>


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
                            className="bg-base-200 rounded-xl p-6 w-full overflow-hidden"
                        >
                            <div className="w-full max-w-full min-w-0">
                                {chart.component}
                            </div>
                        </motion.div>


                    );
                })}
            </AnimatePresence>

            {activeCharts.size === 0 && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="flex flex-col items-center justify-center py-12 text-base-content/60"
                >
                    <FaChartLine className="w-12 h-12 mb-4 opacity-50"/>
                    <h3 className="text-lg font-semibold">No Charts Selected</h3>
                    <p className="text-sm mt-2">Select visualizations above to begin analysis</p>
                </motion.div>
            )}
        </div>
    );
};