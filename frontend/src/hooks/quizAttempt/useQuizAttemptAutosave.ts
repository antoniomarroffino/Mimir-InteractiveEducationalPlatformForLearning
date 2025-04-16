import { useEffect, useRef } from 'react';
import { useQuizAttemptLocal } from './useQuizAttemptLocal';
import { useQuizAttemptCRUD } from './useQuizAttemptCRUD';
import {AttemptStatus} from "@dti-isin/backend-api-client";

export const useQuizAttemptAutosave = (intervalMs: number = 15000) => {
    const { currentAttempt } = useQuizAttemptLocal();
    const { updateAttemptPartial } = useQuizAttemptCRUD();
    const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!currentAttempt?.id) return;

        const startAutosave = () => {
            autosaveTimerRef.current = setInterval(async () => {
                try {
                    await updateAttemptPartial(currentAttempt.id!, {
                        quizPublicationId: currentAttempt.quizPublicationId!,
                        user: currentAttempt.user,
                        startedAt: currentAttempt.startedAt,
                        responses: currentAttempt.responses || [],
                        status: AttemptStatus.InProgress
                    });
                    console.debug('[Autosave] Tentativo salvato con successo');
                } catch (err) {
                    console.error('[Autosave] Errore nel salvataggio automatico', err);
                }
            }, intervalMs);
        };

        startAutosave();

        return () => {
            if (autosaveTimerRef.current) {
                clearInterval(autosaveTimerRef.current);
            }
        };
    }, [currentAttempt?.id, currentAttempt?.responses, intervalMs]);
};
