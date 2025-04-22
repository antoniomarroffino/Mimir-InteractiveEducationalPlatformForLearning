import React from 'react';
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/24/outline';

interface NavigationToggleButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export const NavigationToggleButton: React.FC<NavigationToggleButtonProps> = ({isOpen, onClick}) => {
    return (
        <div
            className="min-h-[48px] bg-primary/10 px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap"
            onClick={onClick}
        >
            <span className="font-mono text-sm md:text-base leading-none text-primary">
                {isOpen ? 'Hide Navigation' : 'Show Navigation'}
            </span>
            {isOpen ? (
                <ChevronUpIcon className="w-5 h-5 text-primary"/>
            ) : (
                <ChevronDownIcon className="w-5 h-5 text-primary"/>
            )}
        </div>
    );
};
