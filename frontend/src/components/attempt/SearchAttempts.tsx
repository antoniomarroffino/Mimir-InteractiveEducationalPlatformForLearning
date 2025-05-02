import React from 'react';
import {FiSearch} from 'react-icons/fi';

interface SearchAttemptProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const SearchAttempts: React.FC<SearchAttemptProps> = ({
                                                          searchQuery,
                                                          onSearchChange
                                                      }) => {
    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="Search quizzes..."
                className="input input-bordered flex-1"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="btn btn-square btn-primary">
                <FiSearch className="text-lg"/>
            </button>
        </div>
    );
};

export default SearchAttempts;