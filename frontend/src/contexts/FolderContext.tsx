import { createContext, useContext } from "react";
import { FolderDTO } from "backend/target/backend-api-client/index.ts";

interface FolderContextType {
    folders: FolderDTO[];
    isLoading: boolean;
    error: Error | null;
    createFolder: (name: string) => Promise<void>;
    selectedFolderId: string | null;
    setSelectedFolderId: (id: string | null) => void;
    fetchFolders: () => Promise<void>;
}

export const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const useFolderContext = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error("useFolderContext must be used within a FolderProvider");
    }
    return context;
};