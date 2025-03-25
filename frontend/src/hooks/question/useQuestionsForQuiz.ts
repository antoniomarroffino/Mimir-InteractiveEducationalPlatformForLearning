import {useCourseSelection} from "../course/useCourseSelection.ts";
import {useFolderSelection} from "../folder/useFolderSelection.ts";
import {useQuizSelection} from "../quiz/useQuizSelection.ts";
import {useQuery} from "react-query";
import {questionApi} from "../../../config/config.ts";
import {QuestionDTO} from "@dti-isin/backend-api-client";

export const useQuestionsForQuiz = (
    courseId?: string,
    folderId?: string,
    quizId?: string
) => {
    const {selectedCourseId} = useCourseSelection();
    const {selectedFolderId} = useFolderSelection();
    const {selectedQuizId} = useQuizSelection();

    const effectiveCourseId = courseId || selectedCourseId;
    const effectiveFolderId = folderId || selectedFolderId;
    const effectiveQuizId = quizId || selectedQuizId;

    return useQuery<QuestionDTO[], Error>({
        queryKey: ["questions", effectiveCourseId, effectiveFolderId, effectiveQuizId],
        queryFn: async () => {
            if (!effectiveCourseId || !effectiveFolderId || !effectiveQuizId) return [];

            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId: effectiveCourseId,
                folderId: effectiveFolderId,
                quizId: effectiveQuizId
            });

            return response.data;
        },
        enabled: !!effectiveCourseId && !!effectiveFolderId && !!effectiveQuizId
    });
};