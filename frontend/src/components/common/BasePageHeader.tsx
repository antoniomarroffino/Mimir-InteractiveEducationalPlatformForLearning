import {motion} from 'framer-motion';
import React, {ReactNode} from 'react';
import {FiInfo} from 'react-icons/fi';

interface BasePageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    gradientFrom?: string;
    gradientTo?: string;
    showInfoToggle?: boolean;
    onToggleInfo?: () => void;
}

export const BasePageHeader: React.FC<BasePageHeaderProps> = ({
                                                                  title,
                                                                  subtitle,
                                                                  icon,
                                                                  gradientFrom = 'from-purple-500',
                                                                  gradientTo = 'to-fuchsia-500',
                                                                  showInfoToggle = false,
                                                                  onToggleInfo,
                                                              }) => {
    return (
        <motion.div
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientFrom} via-indigo-500 ${gradientTo} p-10 mb-12 text-white shadow-xl`}
        >
            <div className="flex items-center justify-between flex-col md:flex-row gap-6">
                <div className="relative w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold">{title}</h1>
                        {showInfoToggle && (
                            <motion.button
                                whileHover={{scale: 1.15}}
                                whileTap={{scale: 0.95}}
                                onClick={onToggleInfo}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-sm border border-white/20"
                                title="More info"
                            >
                                <FiInfo className="w-5 h-5"/>
                            </motion.button>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-lg opacity-90 text-left max-w-3xl">{subtitle}</p>
                    )}
                </div>

                {icon && (
                    <motion.div
                        animate={{rotate: [0, 5, -5, 0]}}
                        transition={{duration: 4, repeat: Infinity, ease: 'easeInOut'}}
                    >
                        {icon}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
