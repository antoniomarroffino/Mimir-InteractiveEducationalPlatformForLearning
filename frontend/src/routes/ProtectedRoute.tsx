import {Navigate} from 'react-router-dom';
import {Role} from "@dti-isin/backend-api-client";
import {useAuth} from "../hooks/useAuth.ts";
import React from "react";

type Props = {
    children: React.ReactNode;
    allowedRoles: Role[];
};

const ProtectedRoute = ({children, allowedRoles}: Props) => {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role!)) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;