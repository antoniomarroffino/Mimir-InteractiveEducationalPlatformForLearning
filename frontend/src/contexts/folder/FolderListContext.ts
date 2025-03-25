import {createContext} from "react";
import {FolderDTO} from "@dti-isin/backend-api-client";

export type FolderListContextType = {
    folders: FolderDTO[];
    isLoadingFolders: boolean;
    errorFolders: Error | null;
    refetchFolders: () => Promise<void>;
};

export const FolderListContext = createContext<FolderListContextType | undefined>(undefined);