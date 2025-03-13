import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FolderContext } from "./FolderContext";
import { FolderDTO } from "@dti-isin/backend-api-client";
import { folderApi } from "../../../config/config";
import { useCourseContext } from "../course/CourseContext";

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const { selectedCourseId } = useCourseContext();
    const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null);

    const { data: folders = [], isLoading, error: queryError } = useQuery<FolderDTO[], Error>({
        queryKey: ["folders", selectedCourseId],
        queryFn: async () => {
            if (!selectedCourseId) return [];
            const response = await folderApi.apiCoursesCourseIdFoldersGet({ courseId: selectedCourseId });
            return response.data;
        },
        enabled: !!selectedCourseId,
    });

    const createFolderMutation = useMutation<FolderDTO, Error, string>({
        mutationFn: async (name: string) => {
            if (!selectedCourseId) throw new Error("No course selected");
            const response = await folderApi.apiCoursesCourseIdFoldersPost({
                courseId: selectedCourseId,
                folderDTO: { name }
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders", selectedCourseId] });
        },
    });

    const createFolder = async (name: string) => {
        await createFolderMutation.mutateAsync(name);
    };

    const fetchFolders = async () => {
        await queryClient.invalidateQueries({ queryKey: ["folders", selectedCourseId] });
    };

    return (
        <FolderContext.Provider
            value={{
                folders,
                isLoading: isLoading || createFolderMutation.isLoading,
                error: queryError ?? createFolderMutation.error ?? null,
                createFolder,
                selectedFolderId,
                setSelectedFolderId,
                fetchFolders,
            }}
        >
            {children}
        </FolderContext.Provider>
    );
};