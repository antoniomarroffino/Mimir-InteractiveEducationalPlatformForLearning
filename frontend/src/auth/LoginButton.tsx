import React from "react";
import { BsPersonCircle } from 'react-icons/bs';
import {useAuth} from "../hooks/useAuth.ts";

const LoginButton: React.FC = () => {
    const { login, isLoading } = useAuth();

    return (
        <button
            onClick={() => login()}
            className="btn btn-ghost normal-case"
            disabled={isLoading}
        >
            <BsPersonCircle className="w-5 h-5 mr-2"/>
            {isLoading ? 'Loading...' : 'Login'}
        </button>
    );
};

export default LoginButton;