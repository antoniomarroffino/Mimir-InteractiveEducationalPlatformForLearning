import React, { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { CourseDTO } from "@dti-isin/backend-api-client";
import { courseApi } from "../../../config/config";
import { CourseCRUDContext } from "./CourseCRUDContext";

export const CourseCRUDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();

    const createCourseMutation = useMutation<CourseDTO, Error, string>({
        mutationFn: async (name: string) =>
            (await courseApi.apiCoursesPost({ courseDTO: { name } })).data,
        onSuccess: (newCourse) => {
            queryClient.setQueryData<CourseDTO[]>(["courses"], (oldCourses) =>
                oldCourses ? [...oldCourses, newCourse] : [newCourse]
            );
            queryClient.invalidateQueries(["courses"]);
        },
    });
/*
    const updateCourseMutation = useMutation<CourseDTO, Error, {
        id: string;
        name: string
    }>({
        mutationFn: async ({ id, name }) =>
            (await courseApi.apiCoursesIdPut({
                id,
                courseDTO: { name }
            })).data,
        onSuccess: (updatedCourse) => {
            queryClient.setQueryData<CourseDTO[]>(["courses"], (oldCourses) =>
                oldCourses ? oldCourses.map(course =>
                    course.id === updatedCourse.id ? updatedCourse : course
                ) : [updatedCourse]
            );
            queryClient.invalidateQueries(["courses"]);
        },
    });

 */

    /*
    const deleteCourseMutation = useMutation<void, Error, string>({
        mutationFn: async (id: string) =>
            await courseApi.apiCoursesIdDelete({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries(["courses"]);
        },
    });

     */

    const value = useMemo(() => ({
        createCourse: async (name: string) => {
            try {
                return await createCourseMutation.mutateAsync(name);
            } catch (err) {
                console.error("Course creation failed:", err);
                throw err;
            }
        },
        /*
        updateCourse: async (id: string, name: string) => {
            try {
                return await updateCourseMutation.mutateAsync({ id, name });
            } catch (err) {
                console.error("Course update failed:", err);
                throw err;
            }
        },

         */
        /*
        deleteCourse: async (id: string) => {
            try {
                await deleteCourseMutation.mutateAsync(id);
            } catch (err) {
                console.error("Course deletion failed:", err);
                throw err;
            }
        },

         */
        isCreatingCourse: createCourseMutation.isLoading,
        //isUpdatingCourse: updateCourseMutation.isLoading,
        //isDeletingCourse: deleteCourseMutation.isLoading,
        errorCreateCourse: createCourseMutation.error,
        //errorUpdateCourse: updateCourseMutation.error,
        //errorDeleteCourse: deleteCourseMutation.error,
    }), [createCourseMutation]);

    return (
        <CourseCRUDContext.Provider value={value}>
            {children}
        </CourseCRUDContext.Provider>
    );
};