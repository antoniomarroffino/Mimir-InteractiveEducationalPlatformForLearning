import { createContext, useContext } from "react";
import { FolderDTO } from "@dti-isin/backend-api-client";

type FolderContextType = {
    folders: FolderDTO[];
    isFetchingFolders: boolean;
    fetchError: Error | null;

    isCreatingFolder: boolean;
    createError: Error | null;

    selectedFolderId: string | null;
    setSelectedFolderId: (id: string | null) => void;

    createFolder: (name: string) => Promise<void>;
    fetchFolders: () => Promise<void>;
};

export const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const useFolderContext = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error("useFolderContext must be used within a FolderProvider");
    }
    return context;
};