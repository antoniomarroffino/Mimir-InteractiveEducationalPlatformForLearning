import {useQuery} from "react-query";
import {quizApi} from "../../../config/config.ts";
import {QuizDTO} from "@dti-isin/backend-api-client";

export const useGetQuizById = (courseId: string, folderId: string, quizId: string, options?: { enabled?: boolean }) => {
    return useQuery<QuizDTO, Error>({
        queryKey: ['quiz', courseId, folderId, quizId],
        queryFn: async () => quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet({
            courseId,
            folderId,
            quizId
        }).then(response => response.data as QuizDTO),
        staleTime: 1000 * 60 * 5,
        enabled: options?.enabled !== false,
    })
}