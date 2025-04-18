import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface AnonymousAccessCardProps {
    onStart: () => void;
    loading: boolean;
    timeLimit: string;
}

export const AnonymousAccessCard: React.FC<AnonymousAccessCardProps> = ({
                                                                            onStart,
                                                                            loading,
                                                                            timeLimit,
                                                                        }) => {
    return (
        <div className="card w-full sm:w-[28rem] h-[28rem] bg-primary/20 shadow-xl backdrop-blur-sm">
            <div className="card-body items-center text-center justify-center">
                <div className="text-5xl mb-2">🧠</div>
                <h3 className="text-2xl font-bold text-primary">Ready to challenge yourself?</h3>

                <div className="flex items-center justify-center gap-2 mt-6 text-base-content/70">
                    <ClockIcon className="w-5 h-5" />
                    <span>{timeLimit}</span>
                </div>

                <div className="card-actions justify-center mt-6">
                    <button
                        onClick={onStart}
                        disabled={loading}
                        className="btn btn-primary btn-wide text-white hover:scale-105 transition-transform"
                    >
                        {loading ? 'Loading...' : 'Start the Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
};
