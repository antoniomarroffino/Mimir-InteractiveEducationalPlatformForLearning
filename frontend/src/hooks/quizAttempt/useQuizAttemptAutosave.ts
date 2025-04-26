import {useEffect, useRef} from 'react';
import {useQuizAttemptLocal} from './useQuizAttemptLocal';
import {useQuizAttemptCRUD} from './useQuizAttemptCRUD';
import {AttemptStatus} from "@dti-isin/backend-api-client";

export const useQuizAttemptAutosave = (intervalMs: number) => {
    const {currentAttempt} = useQuizAttemptLocal();
    const {updateAttemptPartial} = useQuizAttemptCRUD();
    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    const tickCountRef = useRef(0);
    const attemptRef = useRef(currentAttempt);
    attemptRef.current = currentAttempt;

    useEffect(() => {
        if (!attemptRef.current?.id) return;

        tickCountRef.current = 0;

        autosaveTimerRef.current = setInterval(async () => {
            const attempt = attemptRef.current;
            if (!attempt?.id) return;

            tickCountRef.current += 1;
            const multiplier = tickCountRef.current;
            const decrement = multiplier * (intervalMs / 1000);

            try {
                await updateAttemptPartial(attempt.id, {
                    quizPublicationId: attempt.quizPublicationId!,
                    user: attempt.user,
                    startedAt: attempt.startedAt,
                    responses: attempt.responses || [],
                    status: AttemptStatus.InProgress,
                    timeRemainingSeconds: attempt.timeRemainingSeconds? (attempt.timeRemainingSeconds - decrement) : undefined
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
