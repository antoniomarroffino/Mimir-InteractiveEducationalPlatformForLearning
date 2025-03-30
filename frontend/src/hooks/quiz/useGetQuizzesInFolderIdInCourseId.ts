import {useQuery} from "react-query";
import {quizApi} from "../../../config/config.ts";
import {QuizDTO} from "@dti-isin/backend-api-client";

export const useGetQuizzesInFolderIdInCourseId = (courseId: string, folderId: string) => {
    return useQuery<QuizDTO[], Error>({
        queryKey: ["quizzes", courseId, folderId],
        queryFn: async () => {
            if (!courseId) return [];
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId,
                folderId
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5
    });
};