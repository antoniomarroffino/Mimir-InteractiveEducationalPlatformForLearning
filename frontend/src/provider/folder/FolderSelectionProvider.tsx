import React, { useState, useMemo } from "react";
import { FolderSelectionContext } from "../../contexts/folder/FolderSelectionContext.ts";
import { FolderDTO } from "@dti-isin/backend-api-client/dist/models/folder-dto";

export const FolderSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<FolderDTO | null>(null);

    const value = useMemo(() => ({
        selectedFolderId,
        setSelectedFolderId,
        selectedFolder,
        setSelectedFolder,
        selectFolder: (folder: FolderDTO) => {
            setSelectedFolderId(folder.id || null);
            setSelectedFolder(folder);
        },
        deselectFolder: () => {
            setSelectedFolderId(null);
            setSelectedFolder(null);
        },
    }), [selectedFolderId, selectedFolder]);

    return (
        <FolderSelectionContext.Provider value={value}>
            {children}
        </FolderSelectionContext.Provider>
    );
};