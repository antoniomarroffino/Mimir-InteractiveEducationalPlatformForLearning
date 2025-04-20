import {motion} from "framer-motion";
import React, {ReactNode} from "react";

interface PageInfoAlertProps {
    icon: ReactNode;
    title: string;
    message: string;
    colorFrom?: string;
    colorTo?: string;
    iconColor?: string;
}

export const PageInfoAlert: React.FC<PageInfoAlertProps> = ({
                                                                icon,
                                                                title,
                                                                message,
                                                                colorFrom = 'from-purple-50',
                                                                colorTo = 'to-indigo-50',
                                                                iconColor = 'text-purple-600',
                                                            }) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
            className={`mb-10 rounded-xl bg-gradient-to-r ${colorFrom} ${colorTo} border border-purple-200/40 p-4 flex items-start gap-4 shadow-sm`}
        >
            <motion.div
                animate={{rotate: [0, 10, -10, 0]}}
                transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
                className="bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md"
            >
                <div className={`text-xl ${iconColor}`}>
                    {icon}
                </div>
            </motion.div>

            <div className="text-sm text-gray-800 leading-relaxed">
                <p className="mb-1 font-semibold">{title}</p>
                <p>{message}</p>
            </div>
        </motion.div>
    );
};
