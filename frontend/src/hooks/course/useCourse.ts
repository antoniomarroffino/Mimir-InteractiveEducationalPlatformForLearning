import { useState, useCallback, useEffect, useRef } from 'react';
import { CourseDTO } from '@dti-isin/backend-api-client';
import { courseService } from '../../services/courseService';

export const useCourse = () => {
    const [courses, setCourses] = useState<CourseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const initialized = useRef(false);

    const fetchCourses = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await courseService.getAllCourses();
            setCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error fetching courses'));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const createCourse = useCallback(async (name: string) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError(null);
            await courseService.createCourse(name);
            await fetchCourses();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error creating course'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [fetchCourses, isLoading]);

    useEffect(() => {
        if (!initialized.current) {
            (async () => {
                try {
                    await fetchCourses();
                    initialized.current = true;
                } catch (error) {
                    console.error('Failed to fetch courses:', error);
                }
            })();
        }
    }, [fetchCourses]);

    return {
        courses,
        isLoading,
        error,
        fetchCourses,
        createCourse,
        selectedCourseId,
        setSelectedCourseId
    };
};