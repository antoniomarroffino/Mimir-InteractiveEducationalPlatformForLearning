import React, {useCallback, useEffect, useState} from "react";
import {useMsal} from "@azure/msal-react";
import {Role, UserWithoutCoursesDTO} from "@dti-isin/backend-api-client";
import {loginRequest} from "../auth/authConfig.ts";
import {setAuthToken, userApi} from "../../config/config";
import {AuthContext} from "../contexts/AuthContext";
import {useQueryClient} from "react-query";

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const {instance, accounts, inProgress} = useMsal();
    const [user, setUser] = useState<UserWithoutCoursesDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleTokenUpdate = useCallback(async (newToken: string) => {
        try {
            setAuthToken(newToken);

            await loadUserData();

            await queryClient.invalidateQueries();

        } finally {
            setIsLoading(false);
        }
    }, [queryClient]);

    useEffect(() => {
        const checkExistingSession = async () => {
            if (inProgress !== "none") return;

            try {
                if (accounts.length > 0) {
                    const tokenResponse = await instance.acquireTokenSilent({
                        ...loginRequest,
                        account: accounts[0],
                    });
                    await handleTokenUpdate(tokenResponse.accessToken);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Session check error:", error);
                setIsLoading(false);
            }
        };

        checkExistingSession();
    }, [inProgress, accounts, instance, handleTokenUpdate]);

    const login = async () => {
        setIsLoading(true);
        try {
            const loginResponse = await instance.loginPopup(loginRequest);

            instance.setActiveAccount(loginResponse.account);

            const tokenResponse = await instance.acquireTokenSilent({
                ...loginRequest,
                account: loginResponse.account
            });

            await handleTokenUpdate(tokenResponse.accessToken);

        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            throw error;
        }
    };


    const logout = async () => {
        if (accounts.length > 0) {
            await instance.logoutPopup({
                account: accounts[0],
                postLogoutRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI,
                mainWindowRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI
            });
        }
        // 7. Configurazione corretta del logout
        /*const logoutRequest = {
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
            });*/
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

    const hasRole = (role: Role) => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
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