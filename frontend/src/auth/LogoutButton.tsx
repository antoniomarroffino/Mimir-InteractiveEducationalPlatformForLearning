import React from "react";
import {FiLogOut} from 'react-icons/fi';
import {useAuth} from "../hooks/useAuth";
import {Spinner} from "../components/common/Spinner";

interface LogoutButtonProps {
    className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({className}) => {
    const {logout, isLoading} = useAuth();

    return (
        <button
            onClick={logout}
            className={`
                flex items-center gap-2 px-4 py-2 w-full
                text-error hover:bg-error/10 transition-colors
                ${isLoading ? 'loading' : ''}
                ${className || ''}
            `}
            disabled={isLoading}
        >
            {isLoading ? (
                <Spinner size="sm"/>
            ) : (
                <>
                    <FiLogOut className="w-4 h-4"/>
                    <span>Sign Out</span>
                </>
            )}
        </button>
    );
};

export default LogoutButton;