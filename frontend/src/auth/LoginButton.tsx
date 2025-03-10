import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { BsPersonCircle } from 'react-icons/bs';

const LoginButton: React.FC = () => {
    const { instance} = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch(e => {
            console.error(e);
        });

    };

    return (
        <button
            onClick={handleLogin}
            className="btn btn-ghost normal-case"
        >
            <BsPersonCircle className="w-5 h-5 mr-2" />
            Login
        </button>
    );
};

export default LoginButton;