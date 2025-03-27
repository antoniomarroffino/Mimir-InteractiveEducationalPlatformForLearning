import React, {useMemo} from "react";
import {useQuery} from "react-query";
import {CourseDTO} from "@dti-isin/backend-api-client";
import {courseApi} from "../../../config/config.ts";
import {CourseListContext} from "../../contexts/course/CourseListContext.ts";

export const CourseListProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const coursesQuery = useQuery<CourseDTO[], Error>({
        queryKey: ["courses"],
        queryFn: async () => (await courseApi.apiCoursesGet()).data,
    });

    const value = useMemo(() => ({
        courses: coursesQuery.data || [],
        isLoadingCourses: coursesQuery.isLoading,
        errorCourses: coursesQuery.error,
        fetchCourses: async () => {
            await coursesQuery.refetch();
        },
    }), [coursesQuery]);

    return (
        <CourseListContext.Provider value={value}>
            {children}
        </CourseListContext.Provider>
    );
};