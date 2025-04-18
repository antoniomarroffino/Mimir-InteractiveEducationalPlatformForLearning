import { describe, expect, it, vi, afterAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetQuizAttemptById } from "../useGetQuizAttemptById";
import { quizAttemptApi } from "../../../../config/config";
import {
  QuizAttemptDTO,
  UserWithoutCoursesDTO,
  Role,
} from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock the quizAttemptApi
vi.mock("../../../../config/config", () => ({
  quizAttemptApi: {
    apiAttemptsAttemptIdGet: vi.fn(),
  },
}));

describe("useGetQuizAttemptById", () => {
  const mockUser: UserWithoutCoursesDTO = {
    azureOid: "user1",
    name: "John Doe",
    email: "user1@example.com",
    role: Role.Student,
  };

  const mockQuizAttempt: QuizAttemptDTO = {
    id: "1",
    quizPublicationId: "pub1",
    user: mockUser,
    startedAt: "2024-04-15T10:00:00Z",
    completedAt: "2024-04-15T10:30:00Z",
    responses: [],
    badges: [],
  };

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should fetch quiz attempt data successfully", async () => {
    (quizAttemptApi.apiAttemptsAttemptIdGet as any).mockResolvedValueOnce({
      data: mockQuizAttempt,
    });

    const { result } = renderHook(() => useGetQuizAttemptById("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuizAttempt);
    expect(quizAttemptApi.apiAttemptsAttemptIdGet).toHaveBeenCalledWith({
      attemptId: "1",
    });
  });

  it("should handle error when fetching quiz attempt data", async () => {
    const error = new Error("Failed to fetch quiz attempt");
    (quizAttemptApi.apiAttemptsAttemptIdGet as any).mockRejectedValueOnce(
      error
    );

    const { result } = renderHook(() => useGetQuizAttemptById("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
