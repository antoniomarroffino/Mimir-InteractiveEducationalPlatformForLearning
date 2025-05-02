import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { QuestionDTO, QuizAttemptDTO } from '@dti-isin/backend-api-client';
import { ChartData, ChartOptions } from 'chart.js';
import { AttemptsTableMini } from "../../AttemptsTableMini.tsx";

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
                        return response?.earnedPoints || 0;
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
                position: 'top',
                labels: {
                    boxWidth: 15,
                    padding: 15,
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
                grid: { display: false },
                ticks: {
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                }
            },
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
                grid: { color: 'rgba(0,0,0,0.1)' },
                suggestedMax: Math.max(5, ...questions.map(q => q.points || 0)),
            }
        }
    };

    return (
        <div className="w-full overflow-x-hidden">
            <div className="flex flex-col lg:flex-row gap-6 w-full">

                <div className="w-full lg:w-1/4">
                    <div className="h-full rounded-lg bg-base-200 p-2">
                        <AttemptsTableMini
                            attempts={attempts}
                            selectedAttempt={selectedAttempt}
                            onSelect={setSelectedAttempt}
                        />
                    </div>
                </div>

                <div className="w-full lg:w-3/4">
                    <div className="h-[400px]">
                        <Bar data={chartData} options={chartOptions} className="w-full" />
                    </div>
                </div>

            </div>
        </div>
    );
};
