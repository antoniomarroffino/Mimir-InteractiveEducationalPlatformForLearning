import React from "react";
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "./authConfig";
import {BsPersonCircle} from 'react-icons/bs';

const LoginButton: React.FC = () => {
    const {instance} = useMsal();

    const handleLogin = async () => {

        try {
            await instance.loginPopup(loginRequest);

            const token = await instance.acquireTokenSilent({
                ...loginRequest,
                account: instance.getAllAccounts()[0]
            });

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.accessToken}`
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleLogin}
            className="btn btn-ghost normal-case"
        >
            <BsPersonCircle className="w-5 h-5 mr-2"/>
            Login
        </button>
    );
};

export default LoginButton;