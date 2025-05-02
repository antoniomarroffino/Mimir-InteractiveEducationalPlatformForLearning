import { renderHook } from "@testing-library/react";
import {describe, it, expect, vi, beforeEach, afterEach, Mock} from "vitest";
import { useQuizAttemptAutosave } from "../useQuizAttemptAutosave";
import { AttemptStatus, QuizAttemptDTO } from "@dti-isin/backend-api-client";
import { useQuizAttemptLocal } from "../useQuizAttemptLocal";
import { useQuizAttemptCRUD } from "../useQuizAttemptCRUD";

// Mock delle dipendenze
vi.mock("../useQuizAttemptLocal", () => ({
    useQuizAttemptLocal: vi.fn(),
}));

vi.mock("../useQuizAttemptCRUD", () => ({
    useQuizAttemptCRUD: vi.fn(),
}));

describe("useQuizAttemptAutosave", () => {
    let updateAttemptPartialMock: ReturnType<typeof vi.fn>;
    let mockCurrentAttempt: Partial<QuizAttemptDTO>;

    beforeEach(() => {
        vi.useFakeTimers();
        mockCurrentAttempt = {
            id: "attempt-1",
            quizPublicationId: "pub-1",
            user: { azureOid: "user-1" },
            startedAt: new Date().toISOString(),
            responses: [],
            status: AttemptStatus.InProgress,
            timeRemainingSeconds: 600,
        };

        (useQuizAttemptLocal as unknown as Mock).mockReturnValue({
            currentAttempt: mockCurrentAttempt,
        });

        updateAttemptPartialMock = vi.fn().mockResolvedValue({});
        (useQuizAttemptCRUD as unknown as Mock).mockReturnValue({
            updateAttemptPartial: updateAttemptPartialMock,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it("should call updateAttemptPartial periodically", async () => {
        renderHook(() => useQuizAttemptAutosave(1000)); // 1 secondo

        expect(updateAttemptPartialMock).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000); // Avanza 1 secondo
        await Promise.resolve(); // aspetta l'eventuale promise
        expect(updateAttemptPartialMock).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1000);
        await Promise.resolve();
        expect(updateAttemptPartialMock).toHaveBeenCalledTimes(2);
    });

    it("should clear interval on unmount", () => {
        const { unmount } = renderHook(() => useQuizAttemptAutosave(1000));

        unmount();
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
    });

    it("should not start autosave if no current attempt", () => {
        (useQuizAttemptLocal as unknown as Mock).mockReturnValue({
            currentAttempt: null,
        });

        renderHook(() => useQuizAttemptAutosave(1000));
        vi.advanceTimersByTime(3000);

        expect(updateAttemptPartialMock).not.toHaveBeenCalled();
    });
});
