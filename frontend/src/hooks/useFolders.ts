import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FolderControllerApi, Configuration, Folder } from '../api/generated';

const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_URL
});

const folderApi = new FolderControllerApi(config);

export const useFolders = (courseId: string) => {
    return useQuery(
        ['folders', courseId],
        () => folderApi.apiCoursesCourseIdFoldersGet(courseId)
            .then(response => response.data)
    );
};

export const useFolder = (courseId: string, folderId: string) => {
    return useQuery(
        ['folder', courseId, folderId],
        () => folderApi.apiCoursesCourseIdFoldersFolderIdGet(courseId, folderId)
            .then(response => response.data)
    );
};

export const useCreateFolder = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        (name: string) => folderApi.apiCoursesCourseIdFoldersPost(courseId, { name })
            .then(response => response.data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['folders', courseId]);
            }
        }
    );
};

export const useDeleteFolder = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        (folderId: string) =>
            folderApi.apiCoursesCourseIdFoldersFolderIdDelete(courseId, folderId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['folders', courseId]);
            }
        }
    );
};

export const useUpdateFolder = (courseId: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ folderId, folder }: { folderId: string; folder: Folder }) =>
            folderApi.apiCoursesCourseIdFoldersFolderIdPut(courseId, folderId, folder),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['folders', courseId]);
            }
        }
    );
};