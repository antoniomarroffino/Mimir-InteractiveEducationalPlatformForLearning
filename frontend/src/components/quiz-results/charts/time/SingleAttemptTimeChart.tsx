import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Colors,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import { QuestionDTO, QuizAttemptDTO, QuestionResponseDTO } from '@dti-isin/backend-api-client';
import { createVerticalGradient, formatSeconds, formatTicks } from '../../../../utils/chartUtils.ts';
import { QuestionListForResults } from "../../QuestionListForResults.tsx";
import { AttemptsTableMini } from "../../AttemptsTableMini.tsx";
import { AnimatePresence, motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors);

interface SingleAttemptTimeChartProps {
    attempts: QuizAttemptDTO[];
    questions: QuestionDTO[];
}

export const SingleAttemptTimeChart: React.FC<SingleAttemptTimeChartProps> = ({
                                                                                  attempts = [],
                                                                                  questions = []
                                                                              }) => {
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptDTO | null>(() =>
        attempts.length > 0 ? attempts[0] : null
    );

    const chartData: ChartData<'bar'> = useMemo(() => ({
        labels: questions.map((_, index) => `Q${index + 1}`),
        datasets: [{
            label: 'Time Spent',
            data: questions.map((question) => {
                const response = selectedAttempt?.responses?.find((r: QuestionResponseDTO) => r.questionId === question.id);
                return response?.timeSpent ?? 0;
            }),
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return undefined;
                return createVerticalGradient(ctx, chartArea);
            },
            borderColor: '#6366f1',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: '#8b5cf6',
            barThickness: 'flex',
            maxBarThickness: 50,
        }],
    }), [selectedAttempt, questions]);

    const chartOptions: ChartOptions<'bar'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 500,
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#6366f1',
                bodyColor: '#1f2937',
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (items) => `Question ${items[0].dataIndex + 1}`,
                    label: (context) => formatSeconds(context.raw as number),
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatTicks(Number(value)),
                    font: { size: 12 },
                },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 12 } },
            },
        },
    }), []);

    if (!questions.length || !attempts.length) {
        return (
            <div className="flex items-center justify-center h-[400px] text-base-content/70">
                No attempt data available
            </div>
        );
    }

    return (
        <div className="overflow-x-hidden w-full">
            <div className="flex flex-col lg:flex-row gap-6 w-full min-w-0">

                <div className="w-full lg:w-1/4 min-w-0">
                    <AttemptsTableMini
                        attempts={attempts}
                        selectedAttempt={selectedAttempt}
                        onSelect={setSelectedAttempt}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedAttempt?.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full lg:w-2/4 min-h-[300px] max-h-[400px] min-w-0"
                    >
                        <Bar data={chartData} options={chartOptions} />
                    </motion.div>
                </AnimatePresence>

                <div className="w-full lg:w-1/4 min-w-0">
                    <QuestionListForResults questions={questions} />
                </div>

            </div>
        </div>

    );
};
