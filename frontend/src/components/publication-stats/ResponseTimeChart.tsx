import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { QuestionDTO } from '@dti-isin/backend-api-client';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
    Colors,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { FaClock } from 'react-icons/fa';
import {
    formatSeconds,
    formatTicks,
    createVerticalGradient,
} from '../../utils/chartUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
);

interface ResponseTimeChartProps {
    questionStats: {
        question: QuestionDTO;
        averageTimeSpent: number;
    }[];
}

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({
                                                                        questionStats,
                                                                    }) => {
    const [chartId] = useState(() => `chart-${Math.random().toString(36).slice(2, 11)}`);

    const chartData: ChartData<'bar'> = {
        labels: questionStats.map((_, index) => `Q${index + 1}`),
        datasets: [
            {
                label: 'Average Time',
                data: questionStats.map((stat) => stat.averageTimeSpent),
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
            },
        ],
    };

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: { display: false },
            title: { display: false },
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
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    display: true,
                },
                ticks: {
                    callback: (value) => formatTicks(Number(value)),
                    font: { size: 12 },
                },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 12 } },
            },
        },
    };

    return (
        <div className="bg-base-100 rounded-xl p-6 border border-base-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-black bg-clip-text text-transparent">
                    <FaClock className="text-primary" />
                    Response Time Analysis
                </h3>
                <div className="text-sm text-base-content/70">
                    Average time spent per question
                </div>
            </div>
            <div className="h-[400px] relative">
                <Bar
                    id={chartId}
                    data={chartData}
                    options={chartOptions}
                    className="filter drop-shadow-md"
                />
            </div>
        </div>
    );
};
