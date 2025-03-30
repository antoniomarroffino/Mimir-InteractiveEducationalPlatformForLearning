import React, {ReactNode, useState} from 'react';

interface TooltipProps {
    text: string;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
                                                    text,
                                                    children,
                                                    position = 'top',
                                                    className = ''
                                                }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div
            className="relative inline-block group"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            {isVisible && (
                <div
                    className={`
                        absolute z-50 
                        ${positionClasses[position]}
                        bg-neutral text-neutral-content 
                        px-2 py-1 
                        rounded-md 
                        text-xs 
                        whitespace-nowrap
                        shadow-md
                        transition-all
                        duration-200
                        opacity-0
                        group-hover:opacity-100
                        ${className}
                    `}
                    role="tooltip"
                >
                    {text}
                </div>
            )}
        </div>
    );
};