import { FolderDTO } from '@dti-isin/backend-api-client';
import { folderApi } from '../../config/config.ts';
import { AxiosError } from 'axios';

class FolderService {
    async getFoldersInCourse(courseId: string): Promise<FolderDTO[]> {
        try {
            const response = await folderApi.apiCoursesCourseIdFoldersGet({courseId});
            response.data.forEach((folder: FolderDTO) => {
                console.log('Folder:', {
                    id: folder.id,
                    name: folder.name
                });
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    async createFolder(courseId: string, name: string): Promise<FolderDTO> {
        try {
            const response = await folderApi.apiCoursesCourseIdFoldersPost({courseId, folderDTO: {name: name}});
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