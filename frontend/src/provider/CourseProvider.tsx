import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { CourseContext } from "../contexts/CourseContext.tsx";
import { CourseDTO } from "@dti-isin/backend-api-client";
import { courseApi } from "../../config/config";

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);

    const { data: courses = [], isLoading, error } = useQuery<CourseDTO[], Error>({
        queryKey: ["courses"],
        queryFn: async () => {
            const response = await courseApi.apiCoursesGet();
            return response.data;
        },
    });

    const createCourseMutation = useMutation({
        mutationFn: async (name: string) => {
            const response = await courseApi.apiCoursesPost({ courseDTO: { name } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });

    const createCourse = async (name: string) => {
        await createCourseMutation.mutateAsync(name);
    };

    return (
        <CourseContext.Provider
            value={{
                courses,
                isLoading,
                error,
                fetchCourses: () => queryClient.invalidateQueries("courses"),
                createCourse,
                selectedCourseId,
                setSelectedCourseId,
            }}
        >
            {children}
        </CourseContext.Provider>
    );
};