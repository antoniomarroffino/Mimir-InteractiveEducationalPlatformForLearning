import { FolderDTO } from '../api/generated';
import { folderApi } from '../api/config';
import { AxiosError } from 'axios';

class FolderService {
    async getFoldersInCourse(courseId: string): Promise<FolderDTO[]> {
        try {
            const response = await folderApi.apiCoursesCourseIdFoldersGet(courseId);
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    async createFolder(courseId: string, name: string): Promise<FolderDTO> {
        try {
            const response = await folderApi.apiCoursesCourseIdFoldersPost(courseId, { name });
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

export const folderService = new FolderService();