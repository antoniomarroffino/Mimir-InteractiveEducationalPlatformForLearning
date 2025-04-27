import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, vi } from "vitest";
import { useRecoverQuizAttempt } from "../useRecoverQuizAttempt";
import { quizAttemptApi } from "../../../../config/config";
import { AttemptStatus, QuizAttemptDTO } from "@dti-isin/backend-api-client";
import { Mock } from "vitest";

vi.mock("../../../../config/config", () => ({
    quizAttemptApi: {
        apiAttemptsRecoverGet: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };
};

describe("useRecoverQuizAttempt", () => {
    const mockAttempt: QuizAttemptDTO = {
        id: "attempt-1",
        quizPublicationId: "quiz-123",
        startedAt: new Date().toISOString(),
        responses: [],
        badges: [],
        status: AttemptStatus.InProgress,
    };

    it("should return recovered attempt when successful", async () => {
        (quizAttemptApi.apiAttemptsRecoverGet as Mock).mockResolvedValue({ data: mockAttempt });

        const { result } = renderHook(() => useRecoverQuizAttempt("user-1", "quiz-123"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(mockAttempt);
        });
    });

    it("should return null if 404 is thrown", async () => {
        const error404 = {
            response: { status: 404 },
        };
        (quizAttemptApi.apiAttemptsRecoverGet as Mock).mockRejectedValue(error404);

        const { result } = renderHook(() => useRecoverQuizAttempt("user-1", "quiz-123"), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.data).toBeNull();
        });
    });
});
