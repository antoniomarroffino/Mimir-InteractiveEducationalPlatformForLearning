import React from "react";
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from "../hooks/useAuth.ts";
import {Spinner} from "../components/common/Spinner.tsx";

const LogoutButton: React.FC<{ className?: string }> = ({ className }) => {
    const { logout, isLoading } = useAuth();

    return (
        <button
            onClick={logout}
            className={`btn btn-ghost gap-2 ${className}`}
            disabled={isLoading}
        >
            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <>
                    <FiLogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Esci</span>
                </>
            )}
        </button>
    );
};

export default LogoutButton;