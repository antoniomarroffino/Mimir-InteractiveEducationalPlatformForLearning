import {useQuery} from "react-query";
import {courseApi} from "../../../config/config.ts";
import {CourseDTO} from "@dti-isin/backend-api-client";

export const useGetCourseById = (courseId: string) => {
    return useQuery<CourseDTO, Error>({
        queryKey: ['course', courseId],
        queryFn: async () => courseApi.apiCoursesIdGet({
            id: courseId,
        }).then(response => response.data as CourseDTO),
        staleTime: 1000 * 60 * 5
    })
}