// src/hooks/useFolders.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useFolderContext } from '../contexts/FoldersContext';
//import { Folder } from '../api/generated';
import { Folder } from "@dti-isin/backend-api-client";

export const useFolders = () => {
    const { folderApi } = useFolderContext();

    return useQuery<Folder[]>('folders', async () => {
        const response = await folderApi.apiFoldersGet();
        return response.data;
    });
};

export const useCreateFolder = () => {
    const { folderApi } = useFolderContext();
    const queryClient = useQueryClient();

    return useMutation(
        async (name: string) => {
            const response = await folderApi.apiFoldersPost({ folder: { name } });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('folders');
            },
        }
    );
};