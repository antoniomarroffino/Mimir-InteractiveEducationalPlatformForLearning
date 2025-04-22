import React from 'react';
import { BsBoxArrowRight } from 'react-icons/bs';

interface LeaveCourseButtonProps {
    onClick: () => void;
}

export const LeaveCourseButton: React.FC<LeaveCourseButtonProps> = ({ onClick }) => {
    return (
        <div className="bg-warning/10 rounded-xl p-3 sm:p-4 text-sm text-warning/80 max-w-xs w-full sm:w-auto h-fit">
            <button
                className="btn btn-outline border-white text-warning bg-white hover:brightness-90 w-full"
                onClick={onClick}
            >
                <BsBoxArrowRight className="mr-2" />
                Leave Course
            </button>
        </div>
    );
};
