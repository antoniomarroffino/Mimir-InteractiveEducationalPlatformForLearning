import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { FolderDTO } from "@dti-isin/backend-api-client";
import { folderApi } from "../../../config/config";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";
import { FolderCRUDContext } from "./FolderCRUDContext.ts";
import {useFolderSelection} from "../../hooks/folder/useFolderSelection.ts";

export const FolderCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const { selectedCourseId } = useCourseSelection();
    const { deselectFolder } = useFolderSelection();

    const createFolderMutation = useMutation(
        async (name: string) => {
            if (!selectedCourseId) throw new Error("No course selected");
            const r = await folderApi.apiCoursesCourseIdFoldersPost({
                courseId: selectedCourseId,
                folderDTO: {name}
            });
            return r.data;
        },
        {
            onSuccess: (newFolder) => {
                queryClient.setQueryData<FolderDTO[]>(
                    ["folders", selectedCourseId],
                    (old) => old ? [...old, newFolder] : [newFolder]
                );
            },
            onError: (error: Error) => {
                console.error("Folder creation error:", error);
            }
        }
    );

    const updateFolderMutation = useMutation(
        async ({id, name}: { id: string; name: string }) => {
            if (!selectedCourseId) throw new Error("No course selected");
            const r = await folderApi.apiCoursesCourseIdFoldersFolderIdPut({
                courseId: selectedCourseId,
                folderId: id,
                folderDTO: {name}
            });
            return r.data;
        },
        {
            onSuccess: (updatedFolder) => {
                queryClient.setQueryData<FolderDTO[]>(
                    ["folders", selectedCourseId],
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
        (id: string) => {
            if (!selectedCourseId) throw new Error("No course selected");
            return folderApi.apiCoursesCourseIdFoldersFolderIdDelete({
                courseId: selectedCourseId,
                folderId: id
            })
        },
        {
            onSuccess: (_, id) => {
                queryClient.setQueryData<FolderDTO[]>(
                    ["folders", selectedCourseId],
                    (old) => old?.filter(f => f.id !== id) || []
                );
                deselectFolder();
            },
            onError: (error: Error) => {
                console.error("Folder delete error:", error);
            }
        }
    );

    const value = useMemo(() => ({
        createFolder: async (name: string) => {
            try {
                return await createFolderMutation.mutateAsync(name);
            } catch (err) {
                console.error("Folder creation failed:", err);
                throw err;
            }
        },

        updateFolder: async (id: string, name: string) => {
            try {
                return await updateFolderMutation.mutateAsync({ id, name });
            } catch (err) {
                console.error("Folder update failed:", err);
                throw err;
            }
        },

        deleteFolder: async (id: string) => {
            try {
                await deleteFolderMutation.mutateAsync(id);
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