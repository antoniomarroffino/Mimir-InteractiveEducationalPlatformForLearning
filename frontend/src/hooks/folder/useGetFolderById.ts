import {useQuery} from "react-query";
import {folderApi} from "../../../config/config.ts";
import {FolderDTO} from "@dti-isin/backend-api-client";

export const useGetFolderById = (courseId: string, folderId: string) => {
    return useQuery<FolderDTO, Error>({
        queryKey: ['folder', folderId],
        queryFn: async () => folderApi.apiCoursesCourseIdFoldersFolderIdGet({
            courseId,
            folderId
        })
            .then(response => response.data as FolderDTO),
        staleTime: 1000 * 60 * 5
    })
}