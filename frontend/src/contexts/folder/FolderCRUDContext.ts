import {createContext} from "react";
import {FolderDTO} from "@dti-isin/backend-api-client";

export type FolderCRUDContextType = {
    createFolder: (name: string) => Promise<FolderDTO>;
    updateFolder: (id: string, name: string) => Promise<FolderDTO>;
    deleteFolder: (id: string) => Promise<void>;
    isCreatingFolder: boolean;
    isUpdatingFolder: boolean;
    isDeletingFolder: boolean;
    errorCreateFolder: Error | null;
    errorUpdateFolder: Error | null;
    errorDeleteFolder: Error | null;
};

export const FolderCRUDContext = createContext<FolderCRUDContextType | undefined>(undefined);