import {useQuery} from "react-query";
import {quizApi} from "../../../config/config.ts";
import {QuizDTO} from "@dti-isin/backend-api-client";

export const useQuizzesForFolder = (courseId: string, folderId: string) => {
    return useQuery<QuizDTO[], Error>({
        queryKey: ["quizzes", courseId, folderId],
        queryFn: async () => {
            if (!courseId || !folderId) return [];
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId,
                folderId
            });
            return response.data;
        },
        enabled: !!courseId && !!folderId
    });
};