import { QuizAttemptDTO, QuizPublicationDTO } from "@dti-isin/backend-api-client";
import {useGetQuizById} from "../../hooks/quiz/useGetQuizById.ts";

export interface AttemptRowDetailsProps {
    attempt: QuizAttemptDTO;
    quizPublication: QuizPublicationDTO;
}

export const AttemptRowDetails = ({attempt, quizPublication} : AttemptRowDetailsProps) => {
    const {data: quiz, isLoading: isLoadingQuiz} = useGetQuizById(quizPublication.courseId, quizPublication.folderId, quizPublication.quizId);
    return (
        <div className="flex justify-between items-center">
            <div>
                <p className="font-medium text-start">Quiz: {isLoadingQuiz ? "" : quiz!.name}</p>
                <p className="text-sm text-base-content/70">
                    {new Date(attempt.completedAt!).toLocaleDateString('it-CH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
            {(attempt.badges ?? []).length > 0 && (
                <div className="badge badge-warning gap-1">
                    🏆 Best Attempt
                </div>
            )}
        </div>
    );
}