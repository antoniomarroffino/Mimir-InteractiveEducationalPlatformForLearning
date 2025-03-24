import {useContext} from "react";
import {FolderListContext} from "../../contexts/folder/FolderListContext.ts";

export const useFolderList = () => {
    const context = useContext(FolderListContext);
    if (context === undefined) {
        throw new Error('useFolderList must be used within a FolderListProvider');
    }
    return context;
};