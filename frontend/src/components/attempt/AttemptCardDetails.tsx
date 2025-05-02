import {MultipleChoiceQuestionResponseDTO, QuizAttemptDTO, QuizPublicationDTO, TrueFalseQuestionResponseDTO } from "@dti-isin/backend-api-client";
import {useGetQuizById} from "../../hooks/quiz/useGetQuizById.ts";
import {FaTrophy} from "react-icons/fa";
import {useMemo} from "react";

export interface AttemptCardDetailsProps {
    attempt: QuizAttemptDTO;
    quizPublication: QuizPublicationDTO;
}

export const AttemptCardDetails = ({attempt, quizPublication} : AttemptCardDetailsProps) => {
    const {data: quiz} = useGetQuizById(quizPublication.courseId, quizPublication.folderId, quizPublication.quizId);

    const score = useMemo(() => {
        const answeredResponses = attempt.responses?.filter(response => {
            if (!response) return false;

            if ('selectedAnswer' in response) {
                const tfResponse = response as TrueFalseQuestionResponseDTO;
                return tfResponse.selectedAnswer !== null && tfResponse.selectedAnswer !== undefined;
            }

            if ('selectedAnswerIndexes' in response) {
                const mcResponse = response as MultipleChoiceQuestionResponseDTO;
                return mcResponse.selectedAnswerIndexes && mcResponse.selectedAnswerIndexes.length > 0;
            }

            return false;
        }) || [];

        const totalQuestions = attempt.responses?.length || 0;
        const answeredCount = answeredResponses.length;

        return {
            answered: answeredCount,
            total: totalQuestions
        };
    }, [attempt]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
                <h3 className="font-medium flex items-center gap-2">
                    Quiz: {quiz && (quiz!.name)}
                    {attempt.badges?.map(badge => (
                        <div
                            key={badge.type}
                            className="tooltip"
                            data-tip={`Awarded ${new Date(badge.assignedAt!).toLocaleDateString("it-CH")}`}
                        >
                            <FaTrophy className="text-warning text-sm"/>
                        </div>
                    ))}
                </h3>
                <span className="text-sm font-medium text-primary">
                        {score.answered}/{score.total}
                    </span>
            </div>

            <div className="text-sm text-base-content/70">
                {new Date(attempt.completedAt!).toLocaleDateString('it-CH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
    );
}