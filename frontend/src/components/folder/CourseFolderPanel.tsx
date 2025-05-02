import React, {useState} from 'react';
import {FiFolder} from 'react-icons/fi';
import {BsTrash} from 'react-icons/bs';
import {CourseDTO} from '@dti-isin/backend-api-client';
import {FolderList} from './FolderList.tsx';
import {DeleteFolderPopup} from "./DeleteFolderPopup.tsx";

interface CourseFoldersPanelProps {
    course: CourseDTO;
    selectedFolders: string[];
    onToggleSelect: (folderId: string) => void;
    onToggleSelectAll: () => void;
    onDeleteSelected: () => void;
    isDeletingFolder: boolean;
    errorDeleteFolder?: Error | null;
}

export const CourseFoldersPanel: React.FC<CourseFoldersPanelProps> = ({
                                                                          course,
                                                                          selectedFolders,
                                                                          onToggleSelect,
                                                                          onToggleSelectAll,
                                                                          onDeleteSelected,
                                                                          isDeletingFolder,
                                                                          errorDeleteFolder
                                                                      }) => {
    const [showPopup, setShowPopup] = useState(false);

    const selectedNames = course.folders
        ?.filter(f => selectedFolders.includes(f.id!))
        .map(f => f.name) || [];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary/20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FiFolder className="text-primary"/>
                    Course Folders
                </h2>

                <div className="flex gap-2 items-center">
                    {selectedFolders.length > 0 && (
                        <button
                            onClick={() => setShowPopup(true)}
                            className="btn btn-error btn-sm gap-2"
                            disabled={isDeletingFolder}
                        >
                            <BsTrash/>
                            Delete ({selectedFolders.length})
                        </button>
                    )}
                    <button
                        onClick={onToggleSelectAll}
                        className="btn btn-ghost btn-sm"
                    >
                        {course.folders!.length > 0 &&
                        selectedFolders.length === course.folders?.length
                            ? 'Deselect All'
                            : 'Select All'}
                    </button>
                </div>
            </div>

            {errorDeleteFolder && (
                <div className="alert alert-error text-sm">
                    {errorDeleteFolder.message}
                </div>
            )}

            <FolderList
                courseId={course.id!}
                selectedFolders={selectedFolders}
                onToggleSelect={onToggleSelect}
            />

            <DeleteFolderPopup
                isOpen={showPopup}
                folderNames={selectedNames}
                onCancel={() => setShowPopup(false)}
                onConfirm={() => {
                    onDeleteSelected();
                    setShowPopup(false);
                }}
            />
        </div>
    );
};
