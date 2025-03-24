import {FolderRow} from './FolderRow';
import React from "react";
import { QuizProvider } from '../../provider/QuizProvider';
import {useFolderList} from "../../hooks/folder/useFolderList.ts";

interface FolderListProps {
    courseId: string;
}

export const FolderList: React.FC<FolderListProps> = ({courseId}) => {
    const {folders, isLoadingFolders} = useFolderList();

    if (!courseId) return <Error message="Invalid course ID" />;

    if (isLoadingFolders) return <Loader />;

    if (!folders?.length) return <EmptyState />;

    return (
        <div className="space-y-4">
            {folders.map((folder) => (
                <QuizProvider
                    key={folder.id}
                    courseId={courseId}
                    folderId={folder.id}
                >
                    <FolderRow
                        folder={folder}
                        courseId={courseId}
                    />
                </QuizProvider>
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

const Error = ({message}: {message: string}) => (
    <div className="text-center text-error py-8">
        {message}
    </div>
);