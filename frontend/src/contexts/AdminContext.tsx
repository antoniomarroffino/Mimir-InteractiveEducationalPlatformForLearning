import {createContext} from "react";
import {Role} from "@dti-isin/backend-api-client";

type AdminContextType = {
    isLoading: boolean;
    promoteUser: (email: string, newRole: Role) => void;
    error: Error | null;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);