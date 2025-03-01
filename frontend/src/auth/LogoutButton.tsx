import React from "react";
import {useMsal} from "@azure/msal-react";

const LogoutButton: React.FC = () => {
    const { instance, accounts } = useMsal();

    const handleLogout = () => {
        if(accounts.length === 0) return;

        //LOGOUT CON DISCONNESSIONE DA MICROSOFT

        const logoutRequest = {
            account: instance.getActiveAccount(),
            postLogoutRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI!,
            mainWindowRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI
        };

        instance.logoutPopup(logoutRequest).then(() => {
            console.log("Utente disconnesso e token rimossi.");
        }).catch(e => {
            console.error("Errore durante il logout:", e);
        });


        //LOGOUT SENZA DISCONNESSIONE --> ASSOLUTAMENTE DA RIVEDERE / CHIEDERE
        /*const msalKeyPrefixes = [
            "login.windows.net",
            "access_token",
            "id_token",
            "refresh_token",
            "msal.account.keys",
            "msal.token.keys"
        ];

        Object.keys(sessionStorage).forEach(key => {
            if (msalKeyPrefixes.some(prefix => key.includes(prefix)))
                sessionStorage.removeItem(key);
        });

        instance.setActiveAccount(null);

        window.location.href = import.meta.env.VITE_LOGOUT_REDIRECT_URI!;*/

        console.log("Logout locale effettuato");
    };

    return (
        <><a onClick={handleLogout} className="text-decoration-none">
            <img
                className="custom-icon mb-1"
                src="../../public/logout-icon.png"
                alt="Logout Icon"
                style={{cursor: 'pointer'}}/>
        </a><a className="nav-link p-0" onClick={handleLogout}>Logout</a></>
    );
};

export default LogoutButton;