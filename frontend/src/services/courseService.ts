import { CourseDTO } from '../api/generated';
import { courseApi } from '../api/config';
import { AxiosError } from 'axios';

class CourseService {
    async getAllCourses(): Promise<CourseDTO[]> {
        try {
            const response = await courseApi.apiCoursesGet();
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    async createCourse(name: string): Promise<CourseDTO> {
        try {
            const response = await courseApi.apiCoursesPost({ name });
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    private handleError(error: AxiosError): Error {
        console.error('API Error:', error);
        if (error.response) {
            return new Error(`Server error: ${error.response.status}`);
        }
        if (error.request) {
            return new Error('Network error');
        }
        return new Error('An unexpected error occurred');
    }
}

export const courseService = new CourseService();