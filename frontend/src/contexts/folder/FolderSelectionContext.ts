import {createContext} from "react";
import {FolderDTO} from "@dti-isin/backend-api-client";

export type FolderSelectionContextType = {
    selectedFolderId: string | null;
    setSelectedFolderId: (id: string | null) => void;
    selectedFolder: FolderDTO | null;
    setSelectedFolder: (folder: FolderDTO | null) => void;
    deselectFolder: () => void;
    validateSelection: () => void;
};

export const FolderSelectionContext = createContext<FolderSelectionContextType | undefined>(undefined);