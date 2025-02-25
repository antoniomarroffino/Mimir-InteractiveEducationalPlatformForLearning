import React from "react";
import { useMsal } from "@azure/msal-react";
import {loginRequest} from "./authConfig.ts";

const LoginButton: React.FC = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch(e => {
            console.error(e);
        });
    };

    return (
        <><a onClick={handleLogin} className="text-decoration-none">
            <img
                className="custom-icon mb-1"
                src="../../public/login-icon.png"
                alt="Login Icon"
                style={{cursor: 'pointer'}}/>
        </a><a className="nav-link p-0" onClick={handleLogin}>Login</a></>
    );
};

export default LoginButton;