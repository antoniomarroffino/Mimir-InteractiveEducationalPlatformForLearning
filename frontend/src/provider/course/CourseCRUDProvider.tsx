import React, {useMemo} from "react";
import {useMutation, useQueryClient} from "react-query";
import {CourseDTO} from "@dti-isin/backend-api-client";
import {courseApi} from "../../../config/config.ts";
import {CourseCRUDContext} from "../../contexts/course/CourseCRUDContext.ts";

export const CourseCRUDProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const queryClient = useQueryClient();

    const createCourseMutation = useMutation(
        (courseDTO: CourseDTO) =>
            courseApi.apiCoursesPost({courseDTO}).then(response => response.data),
        {
            onSuccess: (newCourse) => {
                queryClient.setQueryData<CourseDTO[]>(["courses"], (oldCourses) =>
                    oldCourses ? [...oldCourses, newCourse] : [newCourse]
                );
                queryClient.invalidateQueries(["courses"]);
            },
            onError: (error: Error) => {
                console.error("Course creation error:", error);
            }
        }
    );

    const updateCourseMutation = useMutation(
        ({id, courseDTO}: { id: string; courseDTO: CourseDTO }) =>
            courseApi.apiCoursesIdPut({id, courseDTO}).then(response => response.data),
        {
            onSuccess: (updatedCourse) => {
                queryClient.setQueryData<CourseDTO[]>(["courses"], (oldCourses) =>
                    oldCourses ? oldCourses.map(course =>
                        course.id === updatedCourse.id ? updatedCourse : course
                    ) : [updatedCourse]
                );
                queryClient.invalidateQueries(["courses"]);
            },
            onError: (error: Error) => {
                console.error("Course update error:", error);
            }
        }
    );

    const deleteCourseMutation = useMutation(
        (id: string) => courseApi.apiCoursesIdDelete({id}),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["courses"]);
            },
            onError: (error: Error) => {
                console.error("Course delete error:", error);
            }
        }
    );

    const value = useMemo(() => ({
        createCourse: async (courseDTO: CourseDTO) => {
            try {
                return await createCourseMutation.mutateAsync(courseDTO);
            } catch (err) {
                console.error("Course creation failed:", err);
                throw err;
            }
        },

        updateCourse: async (id: string, courseDTO: CourseDTO) => {
            try {
                console.log(courseDTO);
                return await updateCourseMutation.mutateAsync({id, courseDTO});
            } catch (err) {
                console.error("Course update failed:", err);
                throw err;
            }
        },

        deleteCourse: async (id: string) => {
            try {
                await deleteCourseMutation.mutateAsync(id);
            } catch (err) {
                console.error("Course deletion failed:", err);
                throw err;
            }
        },

        isCreatingCourse: createCourseMutation.isLoading,
        isUpdatingCourse: updateCourseMutation.isLoading,
        isDeletingCourse: deleteCourseMutation.isLoading,
        errorCreateCourse: createCourseMutation.error,
        errorUpdateCourse: updateCourseMutation.error,
        errorDeleteCourse: deleteCourseMutation.error,
    }), [createCourseMutation, deleteCourseMutation, updateCourseMutation]);

    return (
        <CourseCRUDContext.Provider value={value}>
            {children}
        </CourseCRUDContext.Provider>
    );
};