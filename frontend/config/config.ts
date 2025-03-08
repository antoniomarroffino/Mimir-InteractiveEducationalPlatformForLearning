import { Configuration, CourseControllerApi, FolderControllerApi } from '@dti-isin/backend-api-client';

const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_URL,
    baseOptions: {
        headers: {
            'Content-Type': 'application/json'
        }
    }
});

export const courseApi = new CourseControllerApi(config);
export const folderApi = new FolderControllerApi(config);