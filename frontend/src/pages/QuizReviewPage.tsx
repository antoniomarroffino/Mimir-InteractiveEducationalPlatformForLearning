import { AttemptDetails } from "../components/attempt/AttemptDetails.tsx";
import { AttemptsList } from "../components/attempt/AttemptsList.tsx";
import { ReviewHeader } from "../components/attempt/ReviewHeader.tsx";
import { useAuth } from "../hooks/auth/useAuth.ts";
import { useGetQuizAttemptsByUser } from "../hooks/quizAttempt/useGetQuizAttemptsByUser.ts";
import { useGetQuizPublicationById } from "../hooks/quizPublication/useGetQuizPublicationById.ts";
import React from "react";
import { QuizAttemptDTO } from "@dti-isin/backend-api-client";
import { AttemptBadgeDisplay } from "../components/badge/AttemptBadgeDisplay.tsx";

const QuizReviewPage: React.FC = () => {
  const { user } = useAuth();
  const { data: attempts = [], isLoading: isLoadingAttempts } =
    useGetQuizAttemptsByUser(user?.azureOid);
  const [selectedAttempt, setSelectedAttempt] = React.useState<
    QuizAttemptDTO | null | undefined
  >(null);

  const { data: publication, isLoading: isLoadingPublication } =
    useGetQuizPublicationById(selectedAttempt?.quizPublicationId || "", {
      enabled: !!selectedAttempt,
    });

  const hasBadge = selectedAttempt?.badges && selectedAttempt.badges.length > 0;
  const badge = selectedAttempt?.badges?.[0];

  const handleViewDetails = (attemptId: string | null) => {
    setSelectedAttempt(
      attemptId ? attempts.find((a) => a.id === attemptId) : null
    );
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full bg-gradient-to-r from-primary/5 to-secondary/5 p-4 sm:p-6 flex flex-col">
        <ReviewHeader totalAttempts={attempts.length} />

        <div className="flex-1 flex gap-6 min-h-0">
          {" "}
          {/* min-h-0 è importante per il flex container */}
          {/* Lista tentativi con scroll indipendente */}
          <div className="w-96 flex-shrink-0">
            <AttemptsList
              attempts={attempts}
              isLoading={isLoadingAttempts}
              selectedAttemptId={selectedAttempt?.id}
              onSelectAttempt={handleViewDetails}
            />
          </div>
          {/* Contenitore principale con scroll indipendente */}
          <div className="flex-grow flex flex-col min-h-0">
            {" "}
            {/* min-h-0 per nested flex */}
            {/* Badge Display - altezza fissa */}
            {selectedAttempt && hasBadge && badge && (
              <div className="animate-fadeIn shrink-0">
                {" "}
                {/* shrink-0 per mantenere l'altezza */}
                <AttemptBadgeDisplay badge={badge} />
              </div>
            )}
            {/* Quiz Review Box con scroll interno */}
            <div className="flex-1 bg-base-200 rounded-xl overflow-hidden flex flex-col min-h-0">
              {selectedAttempt ? (
                isLoadingPublication ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : publication ? (
                  <div className="flex-1 overflow-auto">
                    {" "}
                    {/* Scroll container */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewPage;
