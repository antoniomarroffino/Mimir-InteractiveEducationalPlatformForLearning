import { QuizDTO } from '@dti-isin/backend-api-client';
import { quizApi } from '../../config/config.ts';
import { AxiosError } from 'axios';

class QuizService {
    async getQuizzesInFolder(courseId: string, folderId: string): Promise<QuizDTO[]> {
        try {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet({
                courseId,
                folderId
            });
            response.data.forEach((quiz: QuizDTO) => {
                console.log('Quiz:', {
                    id: quiz.id,
                    name: quiz.name
                });
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    async createQuiz(courseId: string, folderId: string, name: string): Promise<QuizDTO> {
        try {
            const response = await quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost({
                courseId,
                folderId,
                quizDTO: { name: name }
            });
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

export const quizService = new QuizService();