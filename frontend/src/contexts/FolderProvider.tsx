import React from 'react';
import { FolderContext } from './FolderContext';
import { useFolder } from '../hooks/folder/useFolder';
import { useCourseContext } from './CourseContext';

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { selectedCourseId } = useCourseContext();
    const folderState = useFolder(selectedCourseId);

    return (
        <FolderContext.Provider value={folderState}>
            {children}
        </FolderContext.Provider>
    );
};