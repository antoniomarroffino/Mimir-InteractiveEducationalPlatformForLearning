import React from "react";
import {AdminContext} from "../contexts/AdminContext.tsx";
import {useMutation, useQueryClient} from "react-query";
import {Role} from "@dti-isin/backend-api-client";
import {userApi} from "../../config/config.ts";

export const AdminProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: promoteUserMutation,
        isLoading: isPromotingUser,
        error: errorPromoteUser,
    } = useMutation<void, Error, { email: string; role: Role }>({
        mutationFn: async (payload: { email: string; role: Role }) => {
            await userApi.apiUsersPromotePut({promotionRequestDTO: payload});
        },
        onSuccess: () => {
            queryClient.invalidateQueries("users");
        },
    });

    const promoteUser = async (email: string, newRole: Role) => {
        try {
            await promoteUserMutation({ email, role: newRole });
        } catch (err) {
            console.error("Errore nella promozione/demozione utente:", err);
            throw err;
        }
    };

    const value = {
        isLoading: isPromotingUser,
        promoteUser,
        error: errorPromoteUser,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}