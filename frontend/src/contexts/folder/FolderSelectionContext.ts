import { createContext } from "react";
import { FolderDTO } from "@dti-isin/backend-api-client";

export type FolderSelectionContextType = {
    selectedFolderId: string | null;
    setSelectedFolderId: (id: string | null) => void;
    selectedFolder: FolderDTO | null;
    setSelectedFolder: (folder: FolderDTO) => void;
    selectFolder: (folder: FolderDTO) => void;
    deselectFolder: () => void;
};

export const FolderSelectionContext = createContext<FolderSelectionContextType | undefined>(undefined);