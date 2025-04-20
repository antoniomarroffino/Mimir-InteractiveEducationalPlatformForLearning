import { useEffect, useRef } from 'react';
import { useQuizAttemptLocal } from './useQuizAttemptLocal';
import { useQuizAttemptCRUD } from './useQuizAttemptCRUD';
import { AttemptStatus } from "@dti-isin/backend-api-client";

export const useQuizAttemptAutosave = (intervalMs: number = 15000) => {
    const { currentAttempt } = useQuizAttemptLocal();
    const { updateAttemptPartial } = useQuizAttemptCRUD();
    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    const attemptRef = useRef(currentAttempt);
    attemptRef.current = currentAttempt;

    useEffect(() => {
        if (!attemptRef.current?.id) return;

        autosaveTimerRef.current = setInterval(async () => {
            const attempt = attemptRef.current;
            if (!attempt?.id) return;

            try {
                await updateAttemptPartial(attempt.id, {
                    quizPublicationId: attempt.quizPublicationId!,
                    user: attempt.user,
                    startedAt: attempt.startedAt,
                    responses: attempt.responses || [],
                    status: AttemptStatus.InProgress
                });
            } catch (err) {
                console.error('[Autosave] Errore nel salvataggio automatico', err);
            }
        }, intervalMs);

        return () => {
            if (autosaveTimerRef.current) {
                clearInterval(autosaveTimerRef.current);
            }
        };
    }, [attemptRef.current?.id, intervalMs]);
};
