import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { CourseContext } from "../contexts/CourseContext";
import { CourseDTO } from "@dti-isin/backend-api-client";
import { courseApi } from "../../config/config";

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);

    const {
        data: courses = [],
        isLoading: isLoadingCourses,
        error: errorCourses,
        refetch: refetchCourses,
    } = useQuery<CourseDTO[], Error>({
        queryKey: ["courses"],
        queryFn: async () => (await courseApi.apiCoursesGet()).data,
    });

    const {
        mutateAsync: createCourseMutation,
        isLoading: isCreatingCourse,
        error: errorCreateCourse,
    } = useMutation<CourseDTO, Error, string>({
        mutationFn: async (name: string) =>
            (await courseApi.apiCoursesPost({ courseDTO: { name } })).data,
        onSuccess: () => {
            queryClient.invalidateQueries(["courses"]);
        },
    });

    const createCourse = async (name: string) => {
        try {
            await createCourseMutation(name);
        } catch (err) {
            console.error("Creation failed:", err);
            throw err;
        }
    };


    const value = {
        courses,
        isLoadingCourses,
        errorCourses,
        selectedCourseId,
        setSelectedCourseId,
        createCourse,
        fetchCourses: refetchCourses,
        isCreatingCourse,
        errorCreateCourse,
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};