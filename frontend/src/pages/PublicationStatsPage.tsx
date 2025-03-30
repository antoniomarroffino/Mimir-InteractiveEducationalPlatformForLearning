import React, {useEffect, useState} from 'react';
import {
    BsCheckCircle,
    BsEmojiHeartEyes,
    BsEmojiSmile,
    BsEmojiSunglasses,
    BsGraphUp,
    BsStars,
    BsTrophy,
    BsXCircle
} from 'react-icons/bs';
import {QuestionType, QuizPublicationDTO} from '@dti-isin/backend-api-client';
import {useParams} from "react-router-dom";
import {useQuizPublicationCRUD} from "../hooks/quizPublication/useQuizPublicationCRUD.ts";
import {PublicationDetails} from "../components/quizPublication/PublicationDetails.tsx";
import {motion} from 'framer-motion';
import {useQuizPublicationSelection} from "../hooks/quizPublication/useQuizPublicationSelection.ts";

interface QuestionResult {
    questionText: string;
    type: QuestionType;
    correctAnswer: string | string[];
    studentAnswer: string | string[];
    isCorrect: boolean;
}

interface StudentResult {
    studentName: string;
    score: number;
    totalQuestions: number;
    timeTaken: string;
    questionResults: QuestionResult[];
}

export const PublicationStatsPage: React.FC = () => {
    const {quizId} = useParams();
    const {
        getPublicationsByQuizId,
        isGettingPublicationsByQuizId
    } = useQuizPublicationCRUD();
    const {
        selectedPublication,
        setSelectedPublication
    } = useQuizPublicationSelection();

    const [publications, setPublications] = useState<QuizPublicationDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const mockResults: StudentResult[] = [
        {
            studentName: "Mario Rossi",
            score: 8,
            totalQuestions: 10,
            timeTaken: "00:05:23",
            questionResults: [
                {
                    questionText: "La capitale dell'Italia è Roma?",
                    type: QuestionType.TrueFalse,
                    correctAnswer: "true",
                    studentAnswer: "true",
                    isCorrect: true
                },
                {
                    questionText: "Quali sono le capitali europee?",
                    type: QuestionType.MultipleChoice,
                    correctAnswer: ["Parigi", "Berlino", "Roma"],
                    studentAnswer: ["Parigi", "Roma"],
                    isCorrect: false
                }
            ]
        },
        {
            studentName: "Giulia Bianchi",
            score: 6,
            totalQuestions: 10,
            timeTaken: "00:07:45",
            questionResults: [
                {
                    questionText: "La capitale dell'Italia è Roma?",
                    type: QuestionType.TrueFalse,
                    correctAnswer: "true",
                    studentAnswer: "false",
                    isCorrect: false
                },
                {
                    questionText: "Quali sono le capitali europee?",
                    type: QuestionType.MultipleChoice,
                    correctAnswer: ["Parigi", "Berlino", "Roma"],
                    studentAnswer: ["Londra"],
                    isCorrect: false
                }
            ]
        }
    ];
    const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(mockResults[0]);

    const getPerformanceEmoji = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return <BsEmojiHeartEyes className="text-4xl text-yellow-500"/>;
        if (percentage >= 70) return <BsEmojiSunglasses className="text-4xl text-green-500"/>;
        if (percentage >= 50) return <BsEmojiSmile className="text-4xl text-blue-500"/>;
        return <BsTrophy className="text-4xl text-gray-500"/>;
    };

    const getPerformanceTitle = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return "Genius Level!";
        if (percentage >= 70) return "Excellent Performance!";
        if (percentage >= 50) return "Good Job!";
        return "Keep Practicing!";
    };

    const renderQuestionResult = (result: QuestionResult) => {
        const isMultipleChoice = result.type === QuestionType.MultipleChoice;

        return (
            <div
                key={result.questionText}
                className={`
                p-4 rounded-lg mb-4 
                ${result.isCorrect ? 'bg-success/10' : 'bg-error/10'}
            `}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{result.questionText}</h3>
                    {result.isCorrect ? (
                        <BsCheckCircle className="text-success"/>
                    ) : (
                        <BsXCircle className="text-error"/>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-base-content/70">Correct Answer</h4>
                        {isMultipleChoice ? (
                            <ul className="list-disc pl-5">
                                {(result.correctAnswer as string[]).map(ans => (
                                    <li key={ans} className="text-success">{ans}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-success">{result.correctAnswer}</p>
                        )}
                    </div>

                    <div>
                        <h4 className="font-medium text-base-content/70">Student Answer</h4>
                        {isMultipleChoice ? (
                            <ul className="list-disc pl-5">
                                {(result.studentAnswer as string[]).map(ans => (
                                    <li
                                        key={ans}
                                        className={
                                            (result.correctAnswer as string[]).includes(ans)
                                                ? "text-success"
                                                : "text-error"
                                        }
                                    >
                                        {ans}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={result.isCorrect ? "text-success" : "text-error"}>
                                {result.studentAnswer}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const fetchPublications = async () => {
            try {
                setIsLoading(true);
                const fetchedPublications = await getPublicationsByQuizId(quizId!);
                setPublications(fetchedPublications);

                const activePublication = fetchedPublications
                    .filter(pub => pub.published)
                    .sort((a, b) =>
                        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                    )[0];

                const selectedPub = activePublication ||
                    fetchedPublications.sort((a, b) =>
                        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                    )[0];

                setSelectedPublication(selectedPub);

                if (mockResults.length > 0) {
                    setSelectedStudent(mockResults[0]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (quizId) {
            fetchPublications();
        }
    }, [quizId]);

    if (isLoading || isGettingPublicationsByQuizId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (publications.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="alert alert-warning">
                    Nessuna pubblicazione trovata per questo quiz.
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
            className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-8"
        >
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-primary text-white p-6 flex justify-between items-center">
                    <motion.h1
                        initial={{x: -50, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        className="text-3xl font-bold flex items-center gap-3"
                    >
                        <BsStars className="text-yellow-300"/>
                        Quiz Performance Analytics
                    </motion.h1>
                </div>

                {/* Publication Selector */}
                <div className="p-4 bg-base-200">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Select Publication</span>
                        </label>
                        <select
                            className="select select-primary"
                            value={selectedPublication?.id || ''}
                            onChange={(e) => {
                                const publication = publications.find(p => p.id === e.target.value);
                                setSelectedPublication(publication || null);
                            }}
                        >
                            {publications.map(publication => {
                                const createdDate = publication.createdAt
                                    ? new Date(publication.createdAt).toLocaleDateString()
                                    : 'Unavailable Date';

                                return (
                                    <option key={publication.id} value={publication.id}>
                                        {createdDate} - Code: {publication.publicationCode}
                                        {publication.anonymous ? ' (Anonymous)' : ''}
                                        {publication.published ? ' (Active)' : ' (Closed)'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Publication Details */}
                {selectedPublication && (
                    <div className="p-4">
                        <PublicationDetails publication={selectedPublication}/>
                    </div>
                )}

                {/* Student Selector */}
                <div className="p-4 bg-base-200 flex gap-2 overflow-x-auto">
                    {mockResults.map(result => (
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            key={result.studentName}
                            onClick={() => setSelectedStudent(result)}
                            className={`
                                btn btn-sm 
                                ${selectedStudent?.studentName === result.studentName
                                ? 'btn-primary'
                                : 'btn-ghost'}
                            `}
                        >
                            {result.studentName}
                        </motion.button>
                    ))}
                </div>

                {/* Selected Student Details */}
                {selectedStudent && (
                    <motion.div
                        initial={{y: 50, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        className="p-8"
                    >
                        <div className="bg-base-100 rounded-xl p-6 shadow-md mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {getPerformanceEmoji(selectedStudent.score, selectedStudent.totalQuestions)}
                                    <div>
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <BsTrophy className="text-primary"/>
                                            {selectedStudent.studentName}
                                        </h2>
                                        <p className="text-base-content/70">
                                            {getPerformanceTitle(selectedStudent.score, selectedStudent.totalQuestions)}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="stat">
                                        <div className="stat-title flex items-center gap-2">
                                            <BsGraphUp className="text-primary"/>
                                            Score
                                        </div>
                                        <div className="stat-value text-primary">
                                            {selectedStudent.score}/{selectedStudent.totalQuestions}
                                        </div>
                                        <div className="stat-desc">Time: {selectedStudent.timeTaken}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Question Results */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <BsCheckCircle className="text-primary"/>
                                Answer Details
                            </h3>
                            {selectedStudent.questionResults.map(renderQuestionResult)}
                        </div>
                    </motion.div>
                )}

                {/* Footer */}
                <div className="bg-base-200 p-6 text-center">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        className="btn btn-primary btn-wide"
                    >
                        Download Full Report
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};