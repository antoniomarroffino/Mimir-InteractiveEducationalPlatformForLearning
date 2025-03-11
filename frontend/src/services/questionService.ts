import {
    QuestionDTO,
    QuestionType,
    QuestionControllerApi
} from '@dti-isin/backend-api-client';
import { questionApi } from '../../config/config.ts';
import { AxiosError } from 'axios';

class QuestionService {
    private api: QuestionControllerApi;

    constructor() {
        this.api = questionApi;
    }

    async getQuestionsInQuiz(
        courseId: string,
        folderId: string,
        quizId: string
    ): Promise<QuestionDTO[]> {
        try {
            const response = await this.api.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId,
                folderId,
                quizId
            });

            console.log(`Retrieved ${response.data.length} questions`);

            return response.data;
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw this.handleError(error as AxiosError);
        }
    }

    async createQuestionTemplate(type?: QuestionType): Promise<QuestionDTO> {
        try {
            console.log(`Creating question template for type: ${type}`);

            const response = await this.api.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsTypePost({
                type
            });

            console.log('Question template created:', response.data);

            return response.data;
        } catch (error) {
            console.error(`Error creating question template for type ${type}:`, error);
            throw this.handleError(error as AxiosError);
        }
    }

    async addQuestionToQuiz(
        courseId: string,
        folderId: string,
        quizId: string,
        questionDTO: QuestionDTO
    ): Promise<QuestionDTO> {
        try {
            console.log('Adding question to quiz:', {
                courseId,
                folderId,
                quizId,
                questionType: questionDTO.type
            });

            const response = await this.api.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsPost({
                courseId,
                folderId,
                quizId,
                questionDTO
            });

            console.log('Question added successfully:', response.data);

            return response.data;
        } catch (error) {
            console.error('Error adding question to quiz:', error);
            throw this.handleError(error as AxiosError);
        }
    }

    private handleError(error: AxiosError): Error {
        console.error('API Error:', error);

        if (error.response) {
            switch (error.response.status) {
                case 400:
                    return new Error('Invalid request parameters');
                case 401:
                    return new Error('Unauthorized access');
                case 403:
                    return new Error('Forbidden action');
                case 404:
                    return new Error('Resource not found');
                case 500:
                    return new Error('Internal server error');
                default:
                    return new Error(`Server error: ${error.response.status}`);
            }
        }

        if (error.request) {
            return new Error('Network error: No response received');
        }

        return new Error('An unexpected error occurred');
    }
}

export const questionService = new QuestionService();