import {FolderRow} from './FolderRow';
import React from "react";
import {useFolderList} from "../../hooks/folder/useFolderList.ts";

interface FolderListProps {
    courseId: string;
    selectedFolders: string[];
    onToggleSelect: (folderId: string) => void;
}

export const FolderList: React.FC<FolderListProps> = ({courseId, selectedFolders, onToggleSelect}) => {
    const {folders, isLoadingFolders} = useFolderList();

    if (!courseId) return <Error message="Invalid course ID"/>;

    if (isLoadingFolders) return <Loader/>;

    if (!folders?.length) return <EmptyState/>;

    return (
        <div className="space-y-4">
            {folders.map((folder) => (
                <FolderRow
                    key={folder.id}
                    folder={folder}
                    courseId={courseId}
                    isSelected={selectedFolders.includes(folder.id!)}
                    onToggleSelect={() => onToggleSelect(folder.id!)}
                />
            ))}
        </div>
    );
};

const Loader = () => (
    <div className="text-center py-8">
        <span className="loading loading-spinner text-primary"></span>
    </div>
);

const EmptyState = () => (
    <div className="text-center text-base-content/70 py-8">
        No folders yet. Create your first folder!
    </div>
);

const Error = ({message}: { message: string }) => (
    <div className="text-center text-error py-8">
        {message}
    </div>
);