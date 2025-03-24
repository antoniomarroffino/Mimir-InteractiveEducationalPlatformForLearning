import {useContext} from "react";
import {FolderSelectionContext} from "../../contexts/folder/FolderSelectionContext.ts";

export const useFolderSelection = () => {
    const context = useContext(FolderSelectionContext);
    if (context === undefined) {
        throw new Error('useFolderSelection must be used within a FolderSelectionProvider');
    }
    return context;
};