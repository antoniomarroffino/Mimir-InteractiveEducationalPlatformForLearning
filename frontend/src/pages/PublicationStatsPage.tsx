import React from 'react';
import {
    BsAward,
    BsTrophy,
    BsEmojiSmile,
    BsEmojiSunglasses,
    BsEmojiHeartEyes
} from 'react-icons/bs';

interface PublicationStatsPageProps {
    studentName: string;
    score: number;
    totalQuestions: number;
    timeTaken: string;
}

export const PublicationStatsPage: React.FC = () => {
    // Dati di esempio - in futuro verranno passati come props
    const mockResults: PublicationStatsPageProps[] = [
        {
            studentName: "Mario Rossi",
            score: 8,
            totalQuestions: 10,
            timeTaken: "00:05:23"
        },
        {
            studentName: "Giulia Bianchi",
            score: 6,
            totalQuestions: 10,
            timeTaken: "00:07:45"
        }
    ];

    const getPerformanceEmoji = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return <BsEmojiHeartEyes className="text-4xl text-yellow-500" />;
        if (percentage >= 70) return <BsEmojiSunglasses className="text-4xl text-green-500" />;
        if (percentage >= 50) return <BsEmojiSmile className="text-4xl text-blue-500" />;
        return <BsTrophy className="text-4xl text-gray-500" />;
    };

    const getPerformanceMessage = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return "Eccezionale!";
        if (percentage >= 70) return "Ottimo lavoro!";
        if (percentage >= 50) return "Buon risultato!";
        return "Continua ad allenarti!";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-primary/90 text-white p-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BsAward className="text-yellow-300" />
                        Risultati del Quiz
                    </h1>
                </div>

                <div className="p-8 space-y-6">
                    {mockResults.map((result) => (
                        <div
                            key={result.studentName}
                            className="bg-base-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {getPerformanceEmoji(result.score, result.totalQuestions)}
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            {result.studentName}
                                        </h2>
                                        <p className="text-base-content/70">
                                            {getPerformanceMessage(result.score, result.totalQuestions)}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="stat">
                                        <div className="stat-title">Punteggio</div>
                                        <div className="stat-value text-primary">
                                            {result.score}/{result.totalQuestions}
                                        </div>
                                        <div className="stat-desc">Tempo: {result.timeTaken}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-primary h-2.5 rounded-full"
                                        style={{
                                            width: `${(result.score / result.totalQuestions) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-base-200 p-6 text-center">
                    <button className="btn btn-primary btn-wide">
                        Scarica Report Completo
                    </button>
                </div>
            </div>
        </div>
    );
};