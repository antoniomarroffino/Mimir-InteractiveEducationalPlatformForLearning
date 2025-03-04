import { useQuery, useMutation, useQueryClient } from 'react-query';
import { courseApi } from '../contexts/CourseContext';
import { Course } from '../api/generated';

export const useCourses = () => {
    return useQuery<Course[]>('courses',
        () => courseApi.apiCoursesGet().then(res => res.data)
    );
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (name: string) => courseApi.apiCoursesPost({ name }).then(res => res.data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('courses');
            }
        }
    );
};