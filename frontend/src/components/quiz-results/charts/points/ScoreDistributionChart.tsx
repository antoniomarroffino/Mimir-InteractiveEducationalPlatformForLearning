import React, {useMemo, useState} from 'react';
import {QuestionDTO, QuizAttemptDTO} from '@dti-isin/backend-api-client';
import {FaTrophy} from 'react-icons/fa';
import {GeneralScoreChart} from "./GeneralScoreChart";
import {SingleAttemptScoreChart} from "./SingleAttemptScoreChart";
import {AnimatePresence, motion} from 'framer-motion';

interface ScoreDistributionChartProps {
    attempts: QuizAttemptDTO[];
    questions: QuestionDTO[];
}

const chartModes = {
    GENERAL: 'general',
    SINGLE: 'single'
} as const;

type ChartMode = typeof chartModes[keyof typeof chartModes];

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
                                                                                  attempts,
                                                                                  questions
                                                                              }) => {
    const [mode, setMode] = useState<ChartMode>(chartModes.GENERAL);

    const hasData = useMemo(() => {
        return attempts.length > 0 && questions.length > 0;
    }, [attempts.length, questions.length]);

    if (!hasData) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <FaTrophy className="text-primary w-12 h-12 mb-4 opacity-50"/>
                <h3 className="text-lg font-semibold text-base-content/70">
                    No Score Data
                </h3>
                <p className="mt-2 text-sm text-base-content/50 max-w-md">
                    Wait for students to complete the quiz to see score statistics
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FaTrophy className="text-primary w-6 h-6"/>
                        <h3 className="text-xl font-bold text-base-content">
                            Score Distribution
                        </h3>
                    </div>
                    <p className="mt-1 text-sm text-base-content/70">
                        {mode === chartModes.GENERAL
                            ? 'Overall performance analysis across all attempts'
                            : 'Detailed score breakdown for individual attempts'}
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
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.2}}
                    className="bg-base-200 rounded-xl p-6"
                >
                    {mode === chartModes.GENERAL ? (
                        <GeneralScoreChart
                            attempts={attempts}
                            questions={questions}
                        />
                    ) : (
                        <SingleAttemptScoreChart
                            attempts={attempts}
                            questions={questions}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};