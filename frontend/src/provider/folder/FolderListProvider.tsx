import React, {useMemo} from "react";
import {useQuery} from "react-query";
import {FolderDTO} from "@dti-isin/backend-api-client";
import {folderApi} from "../../../config/config.ts";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import {FolderListContext} from "../../contexts/folder/FolderListContext.ts";

export const FolderListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {selectedCourseId} = useCourseSelection();

    const foldersQuery = useQuery<FolderDTO[], Error>({
        queryKey: ["folders", selectedCourseId],
        queryFn: async () => {
            if (!selectedCourseId) return [];
            const response = await folderApi.apiCoursesCourseIdFoldersGet({courseId: selectedCourseId});
            return response.data;
        },
        enabled: !!selectedCourseId
    });

    const value = useMemo(() => ({
        folders: foldersQuery.data || [],
        isLoadingFolders: foldersQuery.isLoading,
        errorFolders: foldersQuery.error || null,
        refetchFolders: async () => {
            await foldersQuery.refetch();
        }
    }), [foldersQuery]);

    return (
        <FolderListContext.Provider value={value}>
            {children}
        </FolderListContext.Provider>
    );
};