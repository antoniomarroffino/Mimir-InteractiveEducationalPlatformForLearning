import {
    BadgeHolderControllerApi,
    Configuration,
    CourseControllerApi,
    FolderControllerApi,
    QuestionBankControllerApi,
    QuestionControllerApi,
    QuizAttemptControllerApi,
    QuizControllerApi,
    QuizPublicationControllerApi,
    UserControllerApi
} from '@dti-isin/backend-api-client';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "https://backend-service-1031980811194.europe-west12.run.app",
    headers: {
        'Content-Type': 'application/json'
    }
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_URL || "https://backend-service-1031980811194.europe-west12.run.app",
    baseOptions: axiosInstance.defaults
});

export const courseApi = new CourseControllerApi(config);
export const folderApi = new FolderControllerApi(config);
export const quizApi = new QuizControllerApi(config);
export const questionApi = new QuestionControllerApi(config);
export const userApi = new UserControllerApi(config);
export const quizPublicationApi = new QuizPublicationControllerApi(config);
export const quizAttemptApi = new QuizAttemptControllerApi(config);
export const questionBankApi = new QuestionBankControllerApi(config);
export const badgeHolderApi = new BadgeHolderControllerApi(config);