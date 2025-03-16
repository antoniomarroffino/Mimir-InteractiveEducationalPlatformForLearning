import React, {useEffect, useState} from "react";
import {useMsal} from "@azure/msal-react";
import {UserWithoutCoursesDTO} from "@dti-isin/backend-api-client";
import {loginRequest} from "../auth/authConfig.ts";
import {setAuthToken, userApi} from "../../config/config";
import {AuthContext} from "../contexts/AuthContext";
import {useQueryClient} from "react-query";

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const {instance, accounts} = useMsal();
    const [user, setUser] = useState<UserWithoutCoursesDTO | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async () => {
        setIsLoading(true);
        try {
            // 1. Effettua il login e ottieni l'account
            const loginResponse = await instance.loginPopup(loginRequest);

            // 2. Imposta l'account attivo
            instance.setActiveAccount(loginResponse.account);

            // 3. Ottieni il token usando l'account dal loginResponse
            const tokenResponse = await instance.acquireTokenSilent({
                ...loginRequest,
                account: loginResponse.account
            });
            console.log(tokenResponse.accessToken);
            // 4. Aggiorna lo stato con il nuovo token
            await handleTokenUpdate(tokenResponse.accessToken);

        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            throw error;
        }
    };

    const handleTokenUpdate = async (newToken: string) => {
        try {
            setAuthToken(newToken);
            setToken(newToken);

            console.log("CIAO");
            // 5. Carica i dati utente dopo aver impostato il token
            await loadUserData();
            console.log("CIAO");
            // 6. Invalida le query cache
            queryClient.invalidateQueries();

        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        const activeAccount = instance.getActiveAccount();
        if (!activeAccount) return;

        // 7. Configurazione corretta del logout
        const logoutRequest = {
            account: activeAccount,
            postLogoutRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI,
            mainWindowRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI
        };

        // 8. Effettua il logout e pulisci lo stato
        instance.logoutPopup(logoutRequest)
            .then(() => {
                setAuthToken(null);
                setToken(null);
                setUser(null);
                queryClient.clear();
            })
            .catch(e => {
                console.error("Logout error:", e);
            });
    };

    const loadUserData = async () => {
        try {
            const response = await userApi.apiUsersMeGet();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const hasRole = (role: string) => {
        return user?.role?.toUpperCase() === role.toUpperCase();
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {

                // Se MSAL ha degli account attivi, prova a ottenere un token silenzioso
                if (accounts.length > 0) {
                    const tokenResponse = await instance.acquireTokenSilent({
                        ...loginRequest,
                        account: accounts[0]
                    });

                    await handleTokenUpdate(tokenResponse.accessToken);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [accounts, handleTokenUpdate, instance]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                logout,
                hasRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};