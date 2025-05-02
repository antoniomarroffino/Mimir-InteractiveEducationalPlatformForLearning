import {createContext} from "react";
import {FolderDTO} from "@dti-isin/backend-api-client";

export type FolderCRUDContextType = {
    createFolder: (courseId: string, folderDTO: FolderDTO) => Promise<FolderDTO>;
    updateFolder: (courseId: string, folderId: string, folderDTO: FolderDTO) => Promise<FolderDTO>;
    deleteFolder: (courseId: string, folderId: string) => Promise<void>;
    isCreatingFolder: boolean;
    isUpdatingFolder: boolean;
    isDeletingFolder: boolean;
    errorCreateFolder: Error | null;
    errorUpdateFolder: Error | null;
    errorDeleteFolder: Error | null;
};

export const FolderCRUDContext = createContext<FolderCRUDContextType | undefined>(undefined);