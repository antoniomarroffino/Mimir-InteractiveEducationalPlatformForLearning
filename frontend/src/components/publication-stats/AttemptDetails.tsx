import React from "react";
import {
    MultipleChoiceQuestionDTO,
    MultipleChoiceQuestionResponseDTO,
    QuestionDTO,
    QuestionResponseDTO,
    QuestionType,
    QuizAttemptDTO,
    QuizPublicationDTO,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO
} from "@dti-isin/backend-api-client";
import {BsCheckCircle, BsQuestionCircle, BsXCircle} from 'react-icons/bs';

interface AttemptDetailsProps {
    attempt: QuizAttemptDTO;
    publication: QuizPublicationDTO;
}

const TrueFalseAnswer: React.FC<{ isCorrect: boolean; answer: boolean }> = ({isCorrect, answer}) => (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${
        isCorrect ? 'bg-success/20' : 'bg-error/20'
    }`}>
        <div className={`text-2xl ${isCorrect ? 'text-success' : 'text-error'}`}>
            {isCorrect ? <BsCheckCircle/> : <BsXCircle/>}
        </div>
        <span className="font-medium">{answer ? 'True' : 'False'}</span>
    </div>
);

const MultipleChoiceAnswer: React.FC<{
    choices: string[];
    selectedIndexes: number[];
    correctIndexes: number[];
}> = ({choices, selectedIndexes, correctIndexes}) => (
    <div className="grid gap-2">
        {choices.map((choice, index) => {
            const isSelected = selectedIndexes.includes(index);
            const isCorrect = correctIndexes.includes(index);

            return (
                <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center gap-2 ${
                        isSelected
                            ? isCorrect
                                ? 'bg-success/20'
                                : 'bg-error/20'
                            : isCorrect
                                ? 'bg-success/10'
                                : 'bg-base-200'
                    }`}
                >
                    <div className={`text-xl ${
                        isSelected
                            ? isCorrect
                                ? 'text-success'
                                : 'text-error'
                            : isCorrect
                                ? 'text-success/50'
                                : 'text-base-content/30'
                    }`}>
                        {isSelected
                            ? isCorrect
                                ? <BsCheckCircle/>
                                : <BsXCircle/>
                            : <BsQuestionCircle/>}
                    </div>
                    <span className={`font-medium ${
                        isSelected && !isCorrect ? 'text-error' : ''
                    }`}>
                        {choice}
                    </span>
                </div>
            );
        })}
    </div>
);


export const AttemptDetails: React.FC<AttemptDetailsProps> = ({attempt, publication}) => {
    const isResponseCorrect = (question: QuestionDTO, response: QuestionResponseDTO): boolean => {
        if (question.type === QuestionType.TrueFalse) {
            const trueFalseQuestion = question as TrueFalseQuestionDTO;
            const trueFalseResponse = response as TrueFalseQuestionResponseDTO;
            return trueFalseResponse.selectedAnswer === trueFalseQuestion.correctAnswer;
        }

        if (question.type === QuestionType.MultipleChoice) {
            const multipleChoiceQuestion = question as MultipleChoiceQuestionDTO;
            const multipleChoiceResponse = response as MultipleChoiceQuestionResponseDTO;

            const responseIndexes = multipleChoiceResponse.selectedAnswerIndexes || [];
            const correctIndexes = multipleChoiceQuestion.correctAnswerIndexes || [];

            return JSON.stringify(responseIndexes.sort()) === JSON.stringify(correctIndexes.sort());
        }

        return false;
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>Quiz Results</span>
                <span className="text-sm font-normal text-base-content/70">
                    ({attempt.userAzureOID || 'Anonymous'})
                </span>
            </h2>

            <div className="space-y-6">
                {publication.questions?.map((question) => {
                    const response = attempt.responses?.find(r => r.questionId === question.id);

                    // Verifica se la risposta è effettivamente stata data
                    const isAnswered = response && (
                        (question.type === QuestionType.TrueFalse &&
                            (response as TrueFalseQuestionResponseDTO).selectedAnswer !== null) ||
                        (question.type === QuestionType.MultipleChoice &&
                            (response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes!.length > 0)
                    );

                    const isCorrect = isAnswered ? isResponseCorrect(question, response!) : false;

                    return (
                        <div key={question.id}
                             className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="card-body">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="card-title flex-1">{question.questionText}</h3>
                                    {isAnswered ? (
                                        <div className={`badge ${
                                            isCorrect ? 'badge-success' : 'badge-error'
                                        } gap-1`}>
                                            {isCorrect ? (
                                                <>
                                                    <BsCheckCircle/>
                                                    Correct
                                                </>
                                            ) : (
                                                <>
                                                    <BsXCircle/>
                                                    Incorrect
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="badge badge-warning gap-1">
                                            <BsQuestionCircle/>
                                            No Answer
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">
                                    {question.type === QuestionType.TrueFalse ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {isAnswered && (
                                                <div>
                                                    <h4 className="font-medium mb-2">Your Answer</h4>
                                                    <TrueFalseAnswer
                                                        isCorrect={isCorrect}
                                                        answer={(response as TrueFalseQuestionResponseDTO).selectedAnswer!}
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-medium mb-2">
                                                    {isAnswered ? 'Correct Answer' : 'You did not answer - Correct was:'}
                                                </h4>
                                                <TrueFalseAnswer
                                                    isCorrect={true}
                                                    answer={(question as TrueFalseQuestionDTO).correctAnswer}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {isAnswered && (
                                                <div>
                                                    <h4 className="font-medium mb-2">Selected Answers</h4>
                                                    <MultipleChoiceAnswer
                                                        choices={(question as MultipleChoiceQuestionDTO).choices}
                                                        selectedIndexes={(response as MultipleChoiceQuestionResponseDTO).selectedAnswerIndexes || []}
                                                        correctIndexes={(question as MultipleChoiceQuestionDTO).correctAnswerIndexes}
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-medium mb-2">
                                                    {isAnswered ? 'Correct Answers' : 'You did not answer - Correct answers were:'}
                                                </h4>
                                                <MultipleChoiceAnswer
                                                    choices={(question as MultipleChoiceQuestionDTO).choices}
                                                    selectedIndexes={(question as MultipleChoiceQuestionDTO).correctAnswerIndexes}
                                                    correctIndexes={(question as MultipleChoiceQuestionDTO).correctAnswerIndexes}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};