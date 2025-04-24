import React from 'react';
import {motion} from 'framer-motion';
import {BsLock, BsShieldLock} from 'react-icons/bs';

interface LoginRequiredAccessCardProps {
    onLogin: () => void;
}

export const LoginRequiredAccessCard: React.FC<LoginRequiredAccessCardProps> = ({onLogin}) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="relative overflow-visible w-full max-w-md mx-auto"
        >
            <motion.div
                className="absolute -right-20 -top-20 w-64 h-64 bg-warning/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="card w-full max-w-md bg-gradient-to-br from-warning/5 to-warning/10 shadow-xl backdrop-blur-sm border border-white/10">
                <div className="card-body items-center text-center p-8 relative z-10">
                    <motion.div
                        className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mb-6"
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <BsShieldLock className="w-10 h-10 text-warning"/>
                    </motion.div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-warning mb-4">
                        Login Required
                    </h3>

                    <p className="text-base-content/70 mb-8 max-w-xs">
                        Please log in to access this quiz and track your progress.
                    </p>

                    <motion.button
                        onClick={onLogin}
                        className="btn btn-warning btn-wide gap-2 text-white"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        Login to Continue
                        <BsLock className="w-4 h-4"/>
                    </motion.button>

                    <p className="text-xs text-base-content/50 mt-4">
                        Secure access • Track your progress
                    </p>
                </div>
            </div>
        </motion.div>
    );
};