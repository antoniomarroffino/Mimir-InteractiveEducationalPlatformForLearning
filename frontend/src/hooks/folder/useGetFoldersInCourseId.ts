import {useQuery} from "react-query";
import {folderApi} from "../../../config/config.ts";
import { FolderDTO } from "@dti-isin/backend-api-client";

export const useGetFoldersInCourseId = (courseId: string) => {
    return useQuery<FolderDTO[], Error>({
        queryKey: ["folders", courseId],
        queryFn: async () => {
            if(!courseId) return [];
            const response = await folderApi.apiCoursesCourseIdFoldersGet({
                courseId
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5
    });
};