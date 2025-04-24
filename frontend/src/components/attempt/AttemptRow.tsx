import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {useGetQuizPublicationById} from "../../hooks/quizPublication/useGetQuizPublicationById.ts";
import {AttemptRowDetails} from "./AttemptRowDetails.tsx";
import {SkeletonLoader} from "../common/SkeletonLoader.tsx";

interface AttemptRowProps {
    attempt: QuizAttemptDTO;
}

export const AttemptRow = ({attempt}: AttemptRowProps) => {
    const {
        data: quizPublication,
        isLoading: isLoadingQuizPublication
    } = useGetQuizPublicationById(attempt.quizPublicationId);

    if (isLoadingQuizPublication) {
        return <SkeletonLoader/>
    }

    return (
        <div className="p-3 bg-base-200 rounded-lg">
            {quizPublication && (
                <AttemptRowDetails attempt={attempt} quizPublication={quizPublication}/>
            )}
        </div>
    );
}