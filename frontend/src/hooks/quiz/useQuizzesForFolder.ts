import {useQuery} from "react-query";
import {useCourseSelection} from "../course/useCourseSelection.ts";
import {quizApi} from "../../../config/config.ts";
import {QuizDTO} from "@dti-isin/backend-api-client";

export const useQuizzesForFolder = (folderId: string) => {
    const {selectedCourseId} = useCourseSelection();

    return useQuery<QuizDTO[], Error>({
        queryKey: ["quizzes", selectedCourseId, folderId],
        queryFn: async () => {
            if (!selectedCourseId || !folderId) return [];
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId: selectedCourseId,
                folderId: folderId
            });
            return response.data;
        },
        enabled: !!selectedCourseId && !!folderId
    });
};