import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    Colors
} from 'chart.js';
import { QuizAttemptDTO, QuestionDTO } from '@dti-isin/backend-api-client';
import { formatSeconds, formatTicks, createVerticalGradient } from '../../utils/chartUtils';
import { QuestionListForResults } from "./QuestionListForResults.tsx";
import { AttemptsTableMini } from "./AttemptsTableMini.tsx";
import { motion, AnimatePresence } from 'framer-motion';

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
                const response = selectedAttempt?.responses?.find(r => r.questionId === question.id);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3">
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
                    className="lg:col-span-6 h-[400px]"
                >
                    <Bar data={chartData} options={chartOptions} />
                </motion.div>
            </AnimatePresence>

            <div className="lg:col-span-3 h-[400px]">
                <QuestionListForResults questions={questions} />
            </div>
        </div>
    );
};