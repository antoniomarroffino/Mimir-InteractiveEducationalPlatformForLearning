import { renderHook, act } from "@testing-library/react";
import { useTrackTimeSpent } from "../useTrackTimeSpent";
import { QuestionResponseDTO, QuestionType } from "@dti-isin/backend-api-client";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useTrackTimeSpent", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should increment timeSpent every second for the current question", () => {
        let responses: QuestionResponseDTO[] = [
            { questionId: "q1", responseType: QuestionType.TrueFalse, timeSpent: 0 },
            { questionId: "q2", responseType: QuestionType.TrueFalse, timeSpent: 0 },
        ];

        const setResponses: React.Dispatch<React.SetStateAction<QuestionResponseDTO[]>> = (updater) => {
            responses = typeof updater === "function" ? updater(responses) : updater;
        };

        renderHook(() => useTrackTimeSpent(0, setResponses));

        // Simuliamo il passare di 3 secondi
        act(() => {
            vi.advanceTimersByTime(3000);
        });

        // Verifica
        expect(responses[0].timeSpent).toBe(3);
        expect(responses[1].timeSpent).toBe(0);
    });

    it("should increment timeSpent for the new currentIndex when it changes", () => {
        let responses: QuestionResponseDTO[] = [
            { questionId: "q1", responseType: QuestionType.TrueFalse, timeSpent: 0 },
            { questionId: "q2", responseType: QuestionType.TrueFalse, timeSpent: 0 },
        ];

        const setResponses: React.Dispatch<React.SetStateAction<QuestionResponseDTO[]>> = (updater) => {
            responses = typeof updater === "function" ? updater(responses) : updater;
        };

        const {unmount } = renderHook(
            ({ index }: { index: number }) => useTrackTimeSpent(index, setResponses),
            {
                initialProps: { index: 0 },
            }
        );

        // 2 secondi su q1
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        // Cambia domanda su q2
        unmount(); // interrompo il precedente timer
        renderHook(
            ({ index }: { index: number }) => useTrackTimeSpent(index, setResponses),
            {
                initialProps: { index: 1 },
            }
        );

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(responses[0].timeSpent).toBe(2);
        expect(responses[1].timeSpent).toBe(3);
    });
});
