import React from "react";
import {FolderRow} from "./FolderRow";
import {useGetFoldersInCourseId} from "../../hooks/folder/useGetFoldersInCourseId";
import {SkeletonLoader} from "../common/SkeletonLoader";
import {ErrorAlert} from "../common/ErrorAlert";
import {EmptyStateFolders} from "./EmptyStateFolders";

interface FolderListProps {
    courseId: string;
    selectedFolders: string[];
    onToggleSelect: (folderId: string) => void;
}

export const FolderList: React.FC<FolderListProps> = ({
                                                          courseId,
                                                          selectedFolders,
                                                          onToggleSelect,
                                                      }) => {
    const {data: folders, isLoading, error} = useGetFoldersInCourseId(courseId);

    if (!courseId) {
        return (
            <ErrorAlert
                title="Invalid Course ID"
                message="Please make sure you're accessing a valid course."
            />
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <SkeletonLoader key={i} className="h-14 rounded-xl w-full"/>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <ErrorAlert
                title="Error loading folders"
                message={error.message}
            />
        );
    }

    if (!folders?.length) {
        return <EmptyStateFolders/>;
    }

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
