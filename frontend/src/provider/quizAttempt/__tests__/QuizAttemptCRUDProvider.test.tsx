import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {describe, it, expect, vi, afterEach, afterAll, beforeEach, Mock} from "vitest";
import React, { useContext } from "react";
import { QuizAttemptCRUDProvider } from "../QuizAttemptCRUDProvider";
import { QuizAttemptCRUDContext } from "../../../contexts/quizAttempt/QuizAttemptCRUDContext";
import { quizAttemptApi } from "../../../../config/config";
import { QuizAttemptDTO, BadgeType, Role } from "@dti-isin/backend-api-client";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config.ts", () => ({
    quizAttemptApi: {
        apiAttemptsPost: vi.fn(),
        apiAttemptsAttemptIdSubmitPost: vi.fn(),
        apiAttemptsAttemptIdBadgesPost: vi.fn(),
        apiAttemptsAttemptIdPatch: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <QuizAttemptCRUDProvider>{children}</QuizAttemptCRUDProvider>
        </QueryClientProvider>
    );
};

const useTestHook = () => useContext(QuizAttemptCRUDContext);

describe("QuizAttemptCRUDProvider", () => {
    const mockAttempt: QuizAttemptDTO = {
        id: "attempt-1",
        quizPublicationId: "pub-1",
        user: {
            azureOid: "user-1",
            name: "Test User",
            email: "test@example.com",
            role: Role.Student,
        },
        startedAt: "2024-04-15T10:00:00Z",
        responses: [],
        badges: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("createInitialAttempt", () => {
        it("should handle successful creation", async () => {
            (quizAttemptApi.apiAttemptsPost as Mock).mockResolvedValue({ data: mockAttempt });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                const response = await result.current!.createInitialAttempt(mockAttempt);
                expect(response).toEqual(mockAttempt);
            });

            expect(quizAttemptApi.apiAttemptsPost).toHaveBeenCalledWith({ quizAttemptDTO: mockAttempt });
            expect(result.current!.isCreatingQuizAttempt).toBe(false);
        });

        it("should handle creation error", async () => {
            const error = new Error("Creation failed");
            (quizAttemptApi.apiAttemptsPost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.createInitialAttempt(mockAttempt)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Quiz Attempt creation failed:", error);
            expect(result.current!.errorCreateQuizAttempt).toEqual(error);
        });
    });

    describe("submitAttemptFinal", () => {
        it("should handle successful submission", async () => {
            (quizAttemptApi.apiAttemptsAttemptIdSubmitPost as Mock).mockResolvedValue({ data: mockAttempt });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                const response = await result.current!.submitAttemptFinal("attempt-1", mockAttempt);
                expect(response).toEqual(mockAttempt);
            });

            expect(quizAttemptApi.apiAttemptsAttemptIdSubmitPost).toHaveBeenCalledWith({
                attemptId: "attempt-1",
                quizAttemptDTO: mockAttempt,
            });
        });

        it("should handle submission error", async () => {
            const error = new Error("Submit failed");
            (quizAttemptApi.apiAttemptsAttemptIdSubmitPost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.submitAttemptFinal("attempt-1", mockAttempt)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Final submission of Quiz Attempt failed:", error);
        });
    });

    describe("assignBadge", () => {
        it("should handle successful badge assignment", async () => {
            (quizAttemptApi.apiAttemptsAttemptIdBadgesPost as Mock).mockResolvedValue({});

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.assignBadge("attempt-1", BadgeType.BestAttempt, "publicationId");
            });

            expect(quizAttemptApi.apiAttemptsAttemptIdBadgesPost).toHaveBeenCalledWith({
                attemptId: "attempt-1",
                type: BadgeType.BestAttempt,
            });
            expect(result.current!.isAssigningBadge).toBe(false);
        });

        it("should handle badge assignment error", async () => {
            const error = new Error("Badge assignment failed");
            (quizAttemptApi.apiAttemptsAttemptIdBadgesPost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.assignBadge("attempt-1", BadgeType.BestAttempt, "publicationId")).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to assign badge:", error);
            expect(result.current!.errorAssignBadge).toEqual(error);
        });
    });

    describe("updateAttemptPartial", () => {
        it("should handle successful partial update", async () => {
            (quizAttemptApi.apiAttemptsAttemptIdPatch as Mock).mockResolvedValue({ data: mockAttempt });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                const response = await result.current!.updateAttemptPartial("attempt-1", mockAttempt);
                expect(response).toEqual(mockAttempt);
            });

            expect(quizAttemptApi.apiAttemptsAttemptIdPatch).toHaveBeenCalledWith({
                attemptId: "attempt-1",
                quizAttemptDTO: mockAttempt,
            });
        });

        it("should handle partial update error", async () => {
            const error = new Error("Update failed");
            (quizAttemptApi.apiAttemptsAttemptIdPatch as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.updateAttemptPartial("attempt-1", mockAttempt)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Partial update of Quiz Attempt failed:", error);
        });
    });
});
