import React from 'react';
import { FolderContext } from './FolderContext.tsx';
import { useFolder } from '../../hooks/folder/useFolder.ts';
import { useCourseContext } from '../course/CourseContext.tsx';

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { selectedCourseId } = useCourseContext();
    const folderState = useFolder(selectedCourseId);

    return (
        <FolderContext.Provider value={folderState}>
            {children}
        </FolderContext.Provider>
    );
};