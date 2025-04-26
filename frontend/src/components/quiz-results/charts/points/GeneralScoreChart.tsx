import React, {useMemo} from 'react';
import {Bar} from 'react-chartjs-2';
import {QuestionDTO, QuizAttemptDTO} from '@dti-isin/backend-api-client';
import {ChartData, ChartOptions} from 'chart.js';

interface GeneralScoreChartProps {
    attempts: QuizAttemptDTO[];
    questions: QuestionDTO[];
}

interface ChartStatistics {
    average: number;
    median: number;
    total: number;
    maxPossible: number;
}

export const GeneralScoreChart: React.FC<GeneralScoreChartProps> = ({
                                                                        attempts,
                                                                        questions
                                                                    }) => {
    const maxPossibleScore = useMemo(() =>
            questions.reduce((sum, q) => sum + (q.points ?? 0), 0),
        [questions]
    );

    const {chartData, statistics} = useMemo(() => {
        const attemptScores = attempts.map(attempt => {
            if (!attempt.responses) return 0;
            return attempt.responses.reduce((sum, response) =>
                sum + (response?.earnedPoints ?? 0), 0
            );
        });

        const scoreFrequency = new Array(maxPossibleScore + 1).fill(0);
        attemptScores.forEach(score => {
            if (score !== null && score !== undefined) {
                scoreFrequency[score]++;
            }
        });

        const totalAttempts = attempts.length;
        const averageScore = totalAttempts > 0
            ? attemptScores.reduce((sum, score) => sum + (score ?? 0), 0) / totalAttempts
            : 0;
        const medianScore = totalAttempts > 0
            ? [...attemptScores].sort((a, b) => (a ?? 0) - (b ?? 0))[Math.floor(totalAttempts / 2)]
            : 0;

        const statistics: ChartStatistics = {
            average: averageScore,
            median: medianScore ?? 0,
            total: totalAttempts,
            maxPossible: maxPossibleScore
        };

        const data: ChartData<'bar'> = {
            labels: Array.from({length: maxPossibleScore + 1}, (_, i) => i.toString()),
            datasets: [{
                label: 'Number of Students',
                data: scoreFrequency,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    if (!ctx || !context.chart.chartArea) {
                        return 'rgba(99, 102, 241, 0.8)';
                    }
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
                    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)');
                    return gradient;
                },
                borderColor: '#6366f1',
                borderWidth: 1,
                borderRadius: 8,
            }]
        };

        return {chartData: data, statistics};
    }, [attempts, maxPossibleScore]);

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {display: false},
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#6366f1',
                bodyColor: '#1f2937',
                bodyFont: {size: 14},
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    title: (items) => `Score: ${items[0].label}/${maxPossibleScore}`,
                    label: (context) => {
                        const count = Number(context.raw) || 0;
                        const percentage = attempts.length > 0
                            ? ((count / attempts.length) * 100).toFixed(1)
                            : '0.0';
                        return [
                            `${count} student${count !== 1 ? 's' : ''}`,
                            `${percentage}% of total attempts`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: `Score (max: ${maxPossibleScore})`,
                    color: '#6366f1'
                },
                grid: {display: false}
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Students',
                    color: '#6366f1'
                },
                beginAtZero: true,
                ticks: {stepSize: 1}
            }
        }
    };

    const passRate = useMemo(() => {
        if (statistics.total === 0) return 0;

        const data = chartData.datasets[0].data;
        const threshold = Math.ceil(maxPossibleScore * 0.6);
        let passingScores = 0;

        for (let i = threshold; i < data.length; i++) {
            const count = data[i];
            if (typeof count === 'number') {
                passingScores += count;
            }
        }

        return (passingScores / statistics.total) * 100;
    }, [chartData.datasets, maxPossibleScore, statistics.total]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Average Score</div>
                    <div className="stat-value text-primary">
                        {statistics.average.toFixed(1)}
                    </div>
                    <div className="stat-desc">out of {maxPossibleScore}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Median Score</div>
                    <div className="stat-value text-primary">
                        {statistics.median}
                    </div>
                    <div className="stat-desc">middle value</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Attempts</div>
                    <div className="stat-value text-primary">
                        {statistics.total}
                    </div>
                    <div className="stat-desc">submissions</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Pass Rate</div>
                    <div className="stat-value text-primary">
                        {passRate.toFixed(1)}%
                    </div>
                    <div className="stat-desc">score ≥ 60%</div>
                </div>
            </div>
            <div className="h-[400px]">
                <Bar data={chartData} options={chartOptions}/>
            </div>
        </div>
    );
};