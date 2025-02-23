import React, { useState } from "react";
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import LoginButton from "./auth/LoginButton.tsx";
import {loginRequest} from "./auth/authConfig.ts";

const App: React.FC = () => {
    const { instance, accounts } = useMsal();
    const [data, setData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchProtectedData = async () => {
        if (accounts.length === 0) return;

        try {
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            });

            const token = response.accessToken;

            console.log("Access token: ", token);

            const res = await fetch("http://localhost:8080/api/secure/message", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Errore nella richiesta: ${res.statusText}`);
            }

            const text = await res.text();
            setData(text);
        } catch (err: unknown) {
            if(err instanceof Error) {
                setError(err.message);
            } else {
                setError("Si è verificato un errore sconosciuto");
            }
        }
    };

    return (
        <div>
            <h1>Applicazione di Esempio</h1>
            <UnauthenticatedTemplate>
                <LoginButton />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <button onClick={fetchProtectedData}>Vai alla Dashboard</button>
                {data && <p>Dati protetti: {data}</p>}
                {error && <p>Errore: {error}</p>}
            </AuthenticatedTemplate>
        </div>
    );
};

export default App;
