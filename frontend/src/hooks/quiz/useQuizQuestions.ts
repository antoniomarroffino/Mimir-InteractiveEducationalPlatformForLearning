import {useQuery} from "react-query";
import {QuestionDTO} from "@dti-isin/backend-api-client";
import {questionApi} from "../../../config/config";

export const useQuizQuestions = (
    courseId?: string,
    folderId?: string,
    quizId?: string
) => {
    return useQuery<QuestionDTO[], Error>({
        queryKey: ["questions", courseId, folderId, quizId],
        queryFn: async () => {
            if (!courseId || !folderId || !quizId) return [];

            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId,
                folderId,
                quizId
            });

            return response.data;
        },
        enabled: !!courseId && !!folderId && !!quizId
    });
};