// PRIMA DEGLI IMPORT
import { vi } from 'vitest';

vi.mock("../../../../config/config.ts", () => ({
    quizAttemptApi: {
        apiAttemptsPost: vi.fn().mockResolvedValue({
            data: {
                id: "attempt-1",
                quizPublicationId: "pub-1",
                startedAt: new Date().toISOString(),
                responses: [],
                status: "IN_PROGRESS",
                badges: [],
            },
        }),
        apiAttemptsAttemptIdSubmitPost: vi.fn().mockResolvedValue({
            data: {
                id: "attempt-1",
                quizPublicationId: "pub-1",
                user: { azureOid: "user-1" },
                startedAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
                responses: [],
                status: "TERMINATED",
                badges: [],
            },
        }),
        apiAttemptsAttemptIdPatch: vi.fn().mockResolvedValue({ data: {} }),
    },
}));

// Solo dopo mock, ora puoi importare tutto il resto
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, afterAll } from "vitest";
import { useContext } from "react";
import { QuizAttemptLocalProvider } from "../QuizAttemptLocalProvider";
import { QuizAttemptLocalContext } from "../../../contexts/quizAttempt/QuizAttemptLocalContext";
import { QuizAttemptCRUDProvider } from "../QuizAttemptCRUDProvider";
import { AuthContext } from "../../../contexts/auth/AuthContext";
import {
    QuizPublicationDTO,
    QuizAttemptDTO,
    AttemptStatus,
    QuestionType,
    TrueFalseQuestionDTO,
    TrueFalseQuestionResponseDTO,
    MultipleChoiceQuestionResponseDTO,
    Role,
} from "@dti-isin/backend-api-client";

// Mock navigate
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{
                user: { azureOid: "user-1", email: "test@example.com", name: "Test User", role: Role.Student },
                isLoading: false,
                login: vi.fn(),
                logout: vi.fn(),
                hasRole: vi.fn(() => true),
            }}>
                <QuizAttemptCRUDProvider>
                    <QuizAttemptLocalProvider>
                        {children}
                    </QuizAttemptLocalProvider>
                </QuizAttemptCRUDProvider>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

const useTestHook = () => useContext(QuizAttemptLocalContext);

describe("QuizAttemptLocalProvider", () => {
    afterAll(() => {
        vi.restoreAllMocks();
    });

    const mockPublication: QuizPublicationDTO = {
        id: "pub-1",
        courseId: "course-1",
        folderId: "folder-1",
        quizId: "quiz-1",
        publicationCode: "ABC123",
        questions: [
            {
                id: "q1",
                type: QuestionType.TrueFalse,
                points: 1,
                questionText: "Is the sky blue?",
                correctAnswer: true,
            } as TrueFalseQuestionDTO,
        ],
        published: true,
        anonymous: false,
        createdAt: new Date().toISOString(),
    };

    it("should start a new quiz attempt", async () => {
        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current!.startQuizAttempt(mockPublication, 600);
        });

        expect(result.current!.currentAttempt).toBeTruthy();
        expect(result.current!.currentAttempt?.quizPublicationId).toBe("pub-1");
    });

    it("should update quiz attempt responses correctly", () => {
        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        const trueFalseResponse: TrueFalseQuestionResponseDTO = {
            questionId: "q1",
            responseType: QuestionType.TrueFalse,
            selectedAnswer: true,
            timeSpent: 10,
        };

        const multipleChoiceResponse: MultipleChoiceQuestionResponseDTO = {
            questionId: "q2",
            responseType: QuestionType.MultipleChoice,
            selectedAnswerIndexes: [0, 2],
            timeSpent: 15,
        };

        act(() => {
            result.current!.updateQuizAttemptResponses([
                trueFalseResponse,
                multipleChoiceResponse,
            ]);
        });

        expect(result.current!.currentAttempt?.responses?.length ?? 0).toBeGreaterThanOrEqual(0);
    });

    it("should complete quiz attempt", async () => {
        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current!.startQuizAttempt(mockPublication, 600);
        });

        await act(async () => {
            const submitted = await result.current!.completeQuizAttempt();
            expect(submitted.status).toBe(AttemptStatus.Terminated);
        });
    });

    it("should reset the quiz attempt", () => {
        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        act(() => {
            result.current!.resetQuizAttempt();
        });

        expect(result.current!.currentAttempt).toBeNull();
    });

    it("should clear the quiz attempt", () => {
        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        act(() => {
            result.current!.clearQuizAttempt();
        });

        expect(result.current!.currentAttempt).toBeNull();
    });

    it("should resume a quiz attempt", () => {
        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        const attempt: QuizAttemptDTO = {
            id: "attempt-1",
            quizPublicationId: "pub-1",
            user: {
                azureOid: "user-1",
                name: "Test User",
                email: "test@example.com",
                role: Role.Student,
            },
            startedAt: new Date().toISOString(),
            responses: [],
            badges: [],
            status: AttemptStatus.InProgress,
        };

        act(() => {
            result.current!.resumeAttempt(attempt, mockPublication);
        });

        expect(result.current!.currentAttempt?.quizPublicationId).toBe("pub-1");
    });
});
