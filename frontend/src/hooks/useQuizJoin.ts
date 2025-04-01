import {useGetQuizPublicationByCode} from "./quizPublication/useGetQuizPublicationByCode.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { QuizPublicationDTO, QuizDTO } from "@dti-isin/backend-api-client";

export const useQuizJoin = (
    code: string,
    retrieveQuiz: (publication: QuizPublicationDTO) => Promise<QuizDTO | null>
) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {data: publication, error} = useGetQuizPublicationByCode(code);

    const handleJoin = async () => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            if (error) {
                console.error(error);
            }

            if (!publication) {
                setErrorMessage('Invalid code. Please try again.');
                return;
            }

            if (!publication.published) {
                setErrorMessage('Publication is not active.');
                return;
            }

            await retrieveQuiz(publication);
            navigate(`/quiz/${code}`);
        } catch (error) {
            setErrorMessage('Error verifying code. Please try again.');
            console.error('Error verifying code:', error);
        } finally {
            setIsLoading(false);
        }

        return { errorMessage, isLoading };
    };

    return { handleJoin, errorMessage, isLoading };
};