import { FolderDTO } from '@dti-isin/backend-api-client';
import { FolderRow } from './FolderRow';
import React from "react";

interface FolderListProps {
    folders: FolderDTO[];
    courseId: string;
}

export const FolderList: React.FC<FolderListProps> = ({ folders, courseId }) => {

    if (!folders?.length || !courseId) {
        return (
            <div className="text-center text-base-content/70 py-8">
                No folders yet. Create your first folder!
            </div>
        );
    }
    return (
        <div className="space-y-4">
            {folders.map((folder: FolderDTO) => (
                <FolderRow
                    key={folder.id}
                    folder={folder}
                    courseId={courseId}
                />
            ))}
        </div>
    );
};