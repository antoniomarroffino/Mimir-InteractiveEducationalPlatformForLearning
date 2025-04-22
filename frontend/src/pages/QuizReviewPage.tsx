import {AttemptDetails} from "../components/attempt/AttemptDetails.tsx";
import {AttemptsList} from "../components/attempt/AttemptsList.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {useGetQuizAttemptsByUser} from "../hooks/quizAttempt/useGetQuizAttemptsByUser.ts";
import {useGetQuizPublicationById} from "../hooks/quizPublication/useGetQuizPublicationById.ts";
import React, {useState} from "react";
import {QuizAttemptDTO} from "@dti-isin/backend-api-client";
import {AttemptBadgeDisplay} from "../components/badge/AttemptBadgeDisplay.tsx";
import {QuizReviewPageHeader} from "../components/quiz-results/QuizReviewPageHeader.tsx";
import {QuizReviewInfoAlert} from "../components/quiz-results/QuizReviewInfoAlert.tsx";
import {motion} from "framer-motion";

const QuizReviewPage: React.FC = () => {
    const {user} = useAuth();
    const {data: attempts = [], isLoading: isLoadingAttempts} = useGetQuizAttemptsByUser(user?.azureOid);
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptDTO | null | undefined>(null);
    const [showInfo, setShowInfo] = useState(false);

    const {data: publication, isLoading: isLoadingPublication} = useGetQuizPublicationById(
        selectedAttempt?.quizPublicationId || '',
        {enabled: !!selectedAttempt}
    );

    const hasBadge = selectedAttempt?.badges && selectedAttempt.badges.length > 0;
    const badge = selectedAttempt?.badges?.[0];

    const handleViewDetails = (attemptId: string | null) => {
        setSelectedAttempt(attemptId ? attempts.find(a => a.id === attemptId) : null);
    };

    if (!user) return null;

    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <QuizReviewPageHeader
                    totalAttempts={attempts.length}
                    onToggleInfo={() => setShowInfo(prev => !prev)}
                    showInfoToggle
                />

                {showInfo && <QuizReviewInfoAlert/>}

                <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] mt-6">
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="lg:w-80 flex-shrink-0"
                    >
                        <AttemptsList
                            attempts={attempts}
                            isLoading={isLoadingAttempts}
                            selectedAttemptId={selectedAttempt?.id}
                            onSelectAttempt={handleViewDetails}
                        />
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="flex-grow flex flex-col"
                    >
                        {selectedAttempt && hasBadge && badge && (
                            <div className="animate-fadeIn shrink-0 mb-4">
                                <AttemptBadgeDisplay badge={badge}/>
                            </div>
                        )}

                        <div className="flex-1 bg-base-200 rounded-xl overflow-hidden flex flex-col min-h-0">
                            {selectedAttempt ? (
                                isLoadingPublication ? (
                                    <div className="flex justify-center items-center h-full">
                                        <span className="loading loading-spinner loading-lg"></span>
                                    </div>
                                ) : publication ? (
                                    <div className="flex-1 overflow-auto">
                                        <AttemptDetails
                                            attempt={selectedAttempt}
                                            publication={publication}
                                            showBadgeAssignment={false}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-full text-error">
                                        Error loading quiz details
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-base-content/70">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">👆</div>
                                        <p className="text-lg font-medium">
                                            Select an attempt to view details
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default QuizReviewPage;