import React from 'react';
import {motion} from 'framer-motion';
import {ClockIcon} from '@heroicons/react/24/outline';

export const LoadingAccessCard: React.FC = () => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="card w-full sm:w-[28rem] bg-base-100 shadow-xl animate-pulse"
        >
            <div className="card-body items-center text-center">
                <div className="text-5xl mb-2 text-base-content/40">⏳</div>
                <div className="h-6 w-3/4 bg-base-300 rounded mb-3"/>
                <div className="h-4 w-1/2 bg-base-300 rounded mb-2"/>
                <div className="h-4 w-2/3 bg-base-300 rounded mb-6"/>

                <div className="flex items-center justify-center gap-2 mt-4 text-base-content/40">
                    <ClockIcon className="w-5 h-5"/>
                    <div className="h-4 w-20 bg-base-300 rounded"/>
                </div>

                <div className="card-actions justify-center mt-6">
                    <div className="btn btn-primary btn-wide disabled opacity-50 pointer-events-none">
                        Loading...
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
