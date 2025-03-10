import { QuestionDTO, QuestionType } from '@dti-isin/backend-api-client';
import { questionApi } from '../../config/config.ts';
import { AxiosError } from 'axios';

class QuestionService {
    async getQuestionsInQuiz(courseId: string, folderId: string, quizId: string): Promise<QuestionDTO[]> {
        try {
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsGet({
                courseId,
                folderId,
                quizId
            });
            response.data.forEach((question: QuestionDTO) => {
                console.log('Question:', {
                    id: question.id,
                    text: question.questionText
                });
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    async createQuestionTemplate(type?: QuestionType): Promise<QuestionDTO> {
        try {
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsTypePost({
                type
            });
            return response.data;
        } catch (error) {
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
            const response = await questionApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdQuestionsPost({
                courseId,
                folderId,
                quizId,
                questionDTO
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

export const questionService = new QuestionService();