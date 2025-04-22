import React from 'react';
import {motion} from 'framer-motion';

interface BaseModalProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    onClose: () => void;
    actions?: React.ReactNode;
    className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
                                                        title,
                                                        icon,
                                                        children,
                                                        actions,
                                                        className = ''
                                                    }) => {
    return (
        <div className="modal modal-open z-50">
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{duration: 0.3}}
                className={`modal-box bg-base-100 rounded-2xl shadow-xl border border-base-200 ${className}`}
            >
                <div className="flex items-center gap-3 mb-6 border-b border-base-content/10 pb-3">
                    {icon}
                    <h3 className="font-bold text-xl text-base-content/90">{title}</h3>
                </div>

                {children}

                <div className="modal-action flex justify-end gap-3">
                    {actions}
                </div>
            </motion.div>
        </div>
    );
};
