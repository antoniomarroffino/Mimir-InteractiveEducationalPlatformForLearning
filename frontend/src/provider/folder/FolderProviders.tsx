import React from "react";
import {FolderCRUDProvider} from "./FolderCRUDProvider.tsx";

export const FolderProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <FolderCRUDProvider>
            {children}
        </FolderCRUDProvider>
    );
};