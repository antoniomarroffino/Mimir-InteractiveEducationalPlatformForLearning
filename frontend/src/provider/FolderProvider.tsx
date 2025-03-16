import React from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {FolderContext} from "../contexts/FolderContext";
import {FolderDTO} from "@dti-isin/backend-api-client";
import {folderApi} from "../../config/config";
import {useCourse} from "../hooks/useCourse";

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();
    const {selectedCourseId, courses} = useCourse();

    // Verifica che il corso selezionato esista realmente
    const isValidCourse = courses.some(c => c.id === selectedCourseId);
    const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null);

    // Query per le folder
    const {
        data: folders = [],
        isLoading: isFetchingFolders,
        error: fetchError,
        refetch: refetchFolders
    } = useQuery<FolderDTO[], Error>({
        queryKey: ["folders", selectedCourseId],
        queryFn: async () => {
            if (!selectedCourseId || !isValidCourse) return [];
            const response = await folderApi.apiCoursesCourseIdFoldersGet({courseId: selectedCourseId});
            return response.data;
        },
        enabled: !!selectedCourseId && isValidCourse,
    });

    const {
        mutateAsync: createFolderMutation,
        isLoading: isCreatingFolder,
        error: createError
    } = useMutation<FolderDTO, Error, string>({
        mutationFn: async (name: string) => {
            if (!selectedCourseId) throw new Error("No course selected");
            const response = await folderApi.apiCoursesCourseIdFoldersPost({
                courseId: selectedCourseId,
                folderDTO: {name}
            });
            return response.data;
        },
        onSuccess: (newFolder) => {
            queryClient.setQueryData(
                ["folders", selectedCourseId],
                (oldData: FolderDTO[] | undefined) => {
                    return oldData ? [...oldData, newFolder] : [newFolder];
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["folders", selectedCourseId],
            });
        },
    });

    const createFolder = async (name: string) => {
        try {
            await createFolderMutation(name);
        } catch (err) {
            console.error("Folder creation failed:", err);
            throw err; // Rilancia l'errore per gestione nei componenti
        }
    };

    const fetchFolders = async () => {
        await refetchFolders();
    };

    const value = {
        folders,
        isFetchingFolders,
        fetchError,
        isCreatingFolder,
        createError,
        selectedFolderId,
        setSelectedFolderId,
        createFolder,
        fetchFolders
    }

    return (
        <FolderContext.Provider value={value}>
            {children}
        </FolderContext.Provider>
    );
};