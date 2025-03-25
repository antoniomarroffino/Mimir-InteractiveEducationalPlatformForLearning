import React, {useState, useMemo, useCallback, useEffect} from "react";
import {useFolderList} from "../../hooks/folder/useFolderList.ts";
import { FolderSelectionContext } from "../../contexts/folder/FolderSelectionContext.ts";
import { FolderDTO } from "@dti-isin/backend-api-client";


export const FolderSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<FolderDTO | null>(null);
    const { folders } = useFolderList();

    const validateSelection = useCallback(() => {
        if (selectedFolderId && !folders.some(f => f.id === selectedFolderId)) {
            setSelectedFolderId(null);
        }
    }, [folders, selectedFolderId]);

    useEffect(() => {
        validateSelection();
    }, [folders, selectedFolderId, validateSelection]);

    const value = useMemo(() => ({
        selectedFolderId,
        setSelectedFolderId,
        selectedFolder,
        setSelectedFolder,
        deselectFolder: () => setSelectedFolderId(null),
        validateSelection
    }), [selectedFolderId, selectedFolder, validateSelection]);

    return (
        <FolderSelectionContext.Provider value={value}>
            {children}
        </FolderSelectionContext.Provider>
    );
};