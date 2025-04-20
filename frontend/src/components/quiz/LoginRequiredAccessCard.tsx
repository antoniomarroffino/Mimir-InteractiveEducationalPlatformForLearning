import React from 'react';

interface LoginRequiredAccessCardProps {
    onLogin: () => void;
}

export const LoginRequiredAccessCard: React.FC<LoginRequiredAccessCardProps> = ({ onLogin }) => {
    return (
        <div className="card w-full sm:w-[28rem] h-[28rem] bg-warning/20 shadow-xl backdrop-blur-sm">
            <div className="card-body items-center text-center justify-center">
                <div className="text-5xl mb-2">🔒</div>
                <h3 className="text-2xl font-bold text-warning">Login Required</h3>
                <p className="text-base-content/70 mt-4 max-w-xs">You must log in to access this quiz.</p>

                <div className="card-actions justify-center mt-8">
                    <button onClick={onLogin} className="btn btn-warning btn-wide text-white hover:scale-105 transition-transform">
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};
