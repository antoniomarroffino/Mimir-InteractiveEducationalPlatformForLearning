import React, { useState, useMemo, useCallback } from "react";
import { FolderSelectionContext } from "./FolderSelectionContext";
import {useFolderList} from "../../hooks/folder/useFolderList.ts";

export const FolderSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const { folders } = useFolderList();

    const selectedFolder = useMemo(
        () => folders.find(f => f.id === selectedFolderId) || null,
        [folders, selectedFolderId]
    );

    const validateSelection = useCallback(() => {
        if (selectedFolderId && !folders.some(f => f.id === selectedFolderId)) {
            setSelectedFolderId(null);
        }
    }, [folders, selectedFolderId]);

    const value = useMemo(() => ({
        selectedFolderId,
        selectedFolder,
        selectFolder: (id: string) => {
            if (folders.some(f => f.id === id)) {
                setSelectedFolderId(id);
            }
        },
        deselectFolder: () => setSelectedFolderId(null),
        validateSelection
    }), [selectedFolderId, selectedFolder, folders, validateSelection]);

    return (
        <FolderSelectionContext.Provider value={value}>
            {children}
        </FolderSelectionContext.Provider>
    );
};