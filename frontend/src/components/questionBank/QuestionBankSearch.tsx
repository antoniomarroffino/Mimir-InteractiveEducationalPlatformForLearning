import {useEffect, useState} from "react";
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
    }, [localSearchTerm]);

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search knowledge vaults..."
                className="input input-lg w-full pl-12 pr-12 border-2 border-gray-200 focus:border-purple-300 focus:ring-0 rounded-xl bg-white"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            {localSearchTerm && (
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    onClick={() => setLocalSearchTerm('')}
                >
                    <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600"/>
                </button>
            )}
        </div>
    );
};