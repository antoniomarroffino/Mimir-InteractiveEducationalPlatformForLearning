import React from "react";
import { FiLogIn } from 'react-icons/fi';
import { useAuth } from "../hooks/useAuth.ts";
import {Spinner} from "../components/common/Spinner.tsx";

const LoginButton: React.FC<{ className?: string }> = ({ className }) => {
    const { login, isLoading } = useAuth();

    return (
        <button
            onClick={login}
            className={`btn btn-outline gap-2 ${className}`}
            disabled={isLoading}
        >
            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <>
                    <FiLogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Accedi</span>
                </>
            )}
        </button>
    );
};

export default LoginButton;