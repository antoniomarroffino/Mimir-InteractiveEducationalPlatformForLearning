import React from "react";
import {FiFolderPlus} from "react-icons/fi";

export const EmptyStateFolders: React.FC = () => {
    return (
        <div className="text-center text-base-content/60 py-8 flex flex-col items-center gap-2">
            <FiFolderPlus className="text-3xl text-primary/60"/>
            <p className="italic">No folders yet. Create your first one! 📁</p>
        </div>
    );
};
