import React from "react";
import {useAuth} from "../hooks/useAuth.ts";

const LogoutButton: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dropdown dropdown-end">
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-bold">{user?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="btn btn-ghost"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default LogoutButton;