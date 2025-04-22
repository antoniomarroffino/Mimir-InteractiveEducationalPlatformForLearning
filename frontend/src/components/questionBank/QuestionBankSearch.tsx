import React, {useEffect, useState} from "react";
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/react/16/solid";

interface QuestionBankSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const QuestionBankSearch: React.FC<QuestionBankSearchProps> = ({searchTerm, onSearchChange}) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => onSearchChange(localSearchTerm), 300);
        return () => clearTimeout(handler);
    }, [localSearchTerm, onSearchChange]);

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Search Question Bank..."
                className="input input-lg w-full pl-12 pr-12 border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/30 rounded-xl bg-white shadow-sm transition-all duration-300"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none"/>
            {localSearchTerm && (
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-100 rounded-full transition-all"
                    onClick={() => setLocalSearchTerm('')}
                >
                    <XMarkIcon className="w-5 h-5 text-purple-400 hover:text-purple-600"/>
                </button>
            )}
        </div>
    );
};
