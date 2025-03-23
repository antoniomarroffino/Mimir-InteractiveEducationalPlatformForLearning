import { Configuration, CourseControllerApi, FolderControllerApi, QuizControllerApi, QuestionControllerApi, UserControllerApi } from '@dti-isin/backend-api-client';
import axios from 'axios';

// Creare un'istanza Axios correttamente configurata
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers:{
        'Content-Type': 'application/json'
    }
});

// Funzione per impostare il token nell'istanza Axios
export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// Configurare il client API con le opzioni dell'istanza Axios
const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_URL,
    baseOptions: axiosInstance.defaults
});

export const courseApi = new CourseControllerApi(config);
export const folderApi = new FolderControllerApi(config);
export const quizApi = new QuizControllerApi(config);
export const questionApi = new QuestionControllerApi(config);
export const userApi = new UserControllerApi(config);