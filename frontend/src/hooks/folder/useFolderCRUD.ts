import {useContext} from "react";
import {FolderCRUDContext} from "../../contexts/folder/FolderCRUDContext.ts";

export const useFolderCRUD = () => {
    const context = useContext(FolderCRUDContext);
    if (context === undefined) {
        throw new Error('useFolderCRUD must be used within a FolderCRUDProvider');
    }
    return context;
};