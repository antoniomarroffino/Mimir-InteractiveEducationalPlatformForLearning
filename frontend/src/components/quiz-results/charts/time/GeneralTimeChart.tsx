import React, {useMemo, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {QuestionDTO} from '@dti-isin/backend-api-client';
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
    Tooltip,
} from 'chart.js';
import {createVerticalGradient, formatSeconds, formatTicks} from '../../../../utils/chartUtils.ts';
import {QuestionListForResults} from "../../QuestionListForResults.tsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors);

interface GeneralTimeChartProps {
    questionStats: {
        question: QuestionDTO;
        averageTimeSpent: number;
    }[];
}

export const GeneralTimeChart: React.FC<GeneralTimeChartProps> = ({questionStats}) => {
    const [chartId] = useState(() => `chart-${Math.random().toString(36).slice(2, 11)}`);

    const chartData: ChartData<'bar'> = useMemo(() => ({
        labels: questionStats.map((_, index) => `Q${index + 1}`),
        datasets: [
            {
                label: 'Average Time',
                data: questionStats.map((stat) => stat.averageTimeSpent),
                backgroundColor: (context) => {
                    const {ctx, chartArea} = context.chart;
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
    }), [questionStats]);

    const chartOptions: ChartOptions<'bar'> = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {display: false},
            title: {display: false},
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#6366f1',
                bodyColor: '#1f2937',
                bodyFont: {size: 14},
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
                    font: {size: 12},
                },
            },
            x: {
                grid: {display: false},
                ticks: {font: {size: 12}},
            },
        },
    }), []);

    if (!questionStats.length) {
        return (
            <div className="flex items-center justify-center h-[400px] text-base-content/70">
                No time statistics available
            </div>
        );
    }

    return (
        <div className="flex gap-6 h-[400px]">
            <div className="flex-1 relative">
                <Bar
                    id={chartId}
                    data={chartData}
                    options={chartOptions}
                    className="filter drop-shadow-md"
                />
            </div>
            <QuestionListForResults questions={questionStats.map((q) => q.question)}/>
        </div>
    );
};