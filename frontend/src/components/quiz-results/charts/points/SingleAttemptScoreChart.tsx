import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { QuestionDTO, QuizAttemptDTO } from '@dti-isin/backend-api-client';
import { ChartData, ChartOptions } from 'chart.js';
import {AttemptsTableMini} from "../../AttemptsTableMini.tsx";

interface SingleAttemptScoreChartProps {
    attempts: QuizAttemptDTO[];
    questions: QuestionDTO[];
}

export const SingleAttemptScoreChart: React.FC<SingleAttemptScoreChartProps> = ({
                                                                                    attempts,
                                                                                    questions
                                                                                }) => {
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptDTO | null>(
        attempts.length > 0 ? attempts[0] : null
    );

    const chartData: ChartData<'bar'> = useMemo(() => {
        if (!selectedAttempt) return { labels: [], datasets: [] };

        return {
            labels: questions.map((_, idx) => `Q${idx + 1}`),
            datasets: [
                {
                    label: 'Points Earned',
                    data: questions.map(q => {
                        const response = selectedAttempt.responses?.find(r => r.questionId === q.id);
                        return response?.earnedPoints|| 0;
                    }),
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    borderRadius: 8,
                },
                {
                    label: 'Available Points',
                    data: questions.map(q => q.points || 0),
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    borderRadius: 8,
                }
            ]
        };
    }, [selectedAttempt, questions]);

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    boxWidth: 15,
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#6366f1',
                bodyColor: '#1f2937',
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                beginAtZero: true,
                max: Math.max(...questions.map(q => q.points || 0)),
                ticks: { stepSize: 1 }
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3">
                <AttemptsTableMini
                    attempts={attempts}
                    selectedAttempt={selectedAttempt}
                    onSelect={setSelectedAttempt}
                />
            </div>
            <div className="lg:col-span-9 h-[400px]">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};