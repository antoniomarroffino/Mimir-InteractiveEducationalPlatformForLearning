import React, {useMemo} from "react";
import {useMutation, useQueryClient} from "react-query";
import {FolderDTO} from "@dti-isin/backend-api-client";
import {folderApi} from "../../../config/config.ts";
import {FolderCRUDContext} from "../../contexts/folder/FolderCRUDContext.ts";

export const FolderCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();

    const createFolderMutation = useMutation(
        async ({courseId, folderDTO}: {courseId: string, folderDTO: FolderDTO}) => {
            if (!courseId) throw new Error("No course selected");
            const response = await folderApi.apiCoursesCourseIdFoldersPost({
                courseId,
                folderDTO
            });
            return response.data;
        },
        {
            onSuccess: (newFolder, params) => {
                queryClient.setQueryData<FolderDTO[]>(
                    ["folders", params.courseId],
                    (old) => old ? [...old, newFolder] : [newFolder]
                );
            },
            onError: (error: Error) => {
                console.error("Folder creation error:", error);
            }
        }
    );

    const updateFolderMutation = useMutation(
        async ({courseId, folderId, folderDTO}: { courseId: string, folderId: string, folderDTO: FolderDTO }) => {
            if (!courseId) throw new Error("No course selected");
            const response = await folderApi.apiCoursesCourseIdFoldersFolderIdPut({
                courseId,
                folderId,
                folderDTO
            });
            return response.data;
        },
        {
            onSuccess: (updatedFolder, params) => {
                queryClient.setQueryData<FolderDTO[]>(
                    ["folders", params.courseId],
                    (old) => old?.map(f =>
                        f.id === updatedFolder.id ? updatedFolder : f
                    ) || [updatedFolder]
                );
            },
            onError: (error: Error) => {
                console.error("Folder update error:", error);
            }
        }
    );

    const deleteFolderMutation = useMutation(
        ({courseId, folderId}: {courseId: string, folderId: string}) => {
            if (!courseId) throw new Error("No course selected");
            return folderApi.apiCoursesCourseIdFoldersFolderIdDelete({
                courseId,
                folderId
            })
        },
        {
            onSuccess: (_, params) => {
                queryClient.setQueryData<FolderDTO[]>(
                    ["folders", params.courseId],
                    (old) => old?.filter(f => f.id !== params.folderId) || []
                );
            },
            onError: (error: Error) => {
                console.error("Folder delete error:", error);
            }
        }
    );

    const value = useMemo(() => ({
        createFolder: async (courseId: string, folderDTO: FolderDTO) => {
            try {
                return await createFolderMutation.mutateAsync({courseId, folderDTO});
            } catch (err) {
                console.error("Folder creation failed:", err);
                throw err;
            }
        },

        updateFolder: async (courseId: string, folderId: string, folderDTO: FolderDTO) => {
            try {
                return await updateFolderMutation.mutateAsync({courseId, folderId, folderDTO});
            } catch (err) {
                console.error("Folder update failed:", err);
                throw err;
            }
        },

        deleteFolder: async (courseId: string, folderId: string) => {
            try {
                await deleteFolderMutation.mutateAsync({courseId, folderId});
            } catch (err) {
                console.error("Folder deletion failed:", err);
                throw err;
            }
        },

        isCreatingFolder: createFolderMutation.isLoading,
        isUpdatingFolder: updateFolderMutation.isLoading,
        isDeletingFolder: deleteFolderMutation.isLoading,

        errorCreateFolder: createFolderMutation.error,
        errorUpdateFolder: updateFolderMutation.error,
        errorDeleteFolder: deleteFolderMutation.error
    }), [createFolderMutation, updateFolderMutation, deleteFolderMutation]);

    return (
        <FolderCRUDContext.Provider value={value}>
            {children}
        </FolderCRUDContext.Provider>
    );
};