import { createContext } from "react";
import { FolderDTO } from "@dti-isin/backend-api-client";

export type FolderSelectionContextType = {
    selectedFolderId: string | null;
    selectedFolder: FolderDTO | null;
    selectFolder: (id: string) => void;
    deselectFolder: () => void;
    validateSelection: () => void;
};

export const FolderSelectionContext = createContext<FolderSelectionContextType | undefined>(undefined);