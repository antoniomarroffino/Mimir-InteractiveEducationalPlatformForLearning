import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import LoginButton from "./auth/LoginButton";

const App: React.FC = () => {
    const { accounts } = useMsal();
    const [data] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Funzione per chiamare l'endpoint protetto del backend
    const fetchProtectedData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/secure/message", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accounts[0].idToken}`, // Invia il token
                },
            });

            if (!response.ok) {
                throw new Error(`Errore nella richiesta: ${response.statusText}`);
            }

            console.log(response.text());
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Applicazione di Esempio</h1>
            {accounts.length === 0 ? (
                // Mostra il pulsante di login se l'utente non è autenticato
                <LoginButton />
            ) : (
                // Mostra il pulsante per la dashboard se l'utente è autenticato
                <div>
                    <button onClick={fetchProtectedData}>Vai alla Dashboard</button>
                    {data && <p>Dati protetti: {data}</p>}
                    {error && <p>Errore: {error}</p>}
                </div>
            )}
        </div>
    );
};

export default App;