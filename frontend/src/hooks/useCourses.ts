// src/hooks/useCourses.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CourseControllerApi, Configuration, Course } from '../api/generated';

const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_URL
});

const courseApi = new CourseControllerApi(config);

export const useCourses = () => {
    return useQuery<Course[]>(
        'courses',
        () => courseApi.apiCoursesGet()
            .then(response => response.data)
    );
};

export const useCourse = (courseId: string) => {
    return useQuery<Course>(
        ['course', courseId],
        () => courseApi.apiCoursesIdGet(courseId)
            .then(response => response.data),
        {
            enabled: !!courseId
        }
    );
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (name: string) => courseApi.apiCoursesPost({ name })
            .then(response => response.data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('courses');
            }
        }
    );
};

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ id, course }: { id: string; course: Course }) =>
            courseApi.apiCoursesIdPut(id, course)
                .then(response => response.data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('courses');
            }
        }
    );
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (id: string) => courseApi.apiCoursesIdDelete(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('courses');
            }
        }
    );
};