import React from "react";
import {FiLogIn} from 'react-icons/fi';
import {Spinner} from "../components/common/Spinner";
import {useAuth} from "../hooks/auth/useAuth.ts";

interface LoginButtonProps {
    className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({className}) => {
    const {login, isLoading} = useAuth();

    return (
        <button
            onClick={login}
            className={`
                btn gap-2 hover:scale-105 transition-transform
                ${isLoading ? 'loading' : ''}
                ${className || ''}
            `}
            disabled={isLoading}
        >
            {isLoading ? (
                <Spinner size="sm"/>
            ) : (
                <>
                    <FiLogIn className="w-4 h-4"/>
                    <span className="hidden sm:inline">Sign In</span>
                </>
            )}
        </button>
    );
};

export default LoginButton;