import { Navigate } from 'react-router-dom';
import {useAuth} from "../hooks/useAuth.ts";
import {Role} from "@dti-isin/backend-api-client";
import React from "react";

const TeacherRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="text-center py-8">
            <span className="loading loading-spinner text-primary"></span>
        </div>;
    }

    if (user?.role !== Role.Teacher) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default TeacherRoute;