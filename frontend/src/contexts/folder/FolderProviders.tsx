import React from "react";
import {FolderSelectionProvider} from "./FolderSelectionProvider.tsx";
import {FolderListProvider} from "./FolderListProvider.tsx";
import {FolderCRUDProvider} from "./FolderCRUDProvider.tsx";

export const FolderProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <FolderListProvider>
            <FolderSelectionProvider>
                <FolderCRUDProvider>
                    {children}
                </FolderCRUDProvider>
            </FolderSelectionProvider>
        </FolderListProvider>
    );
};