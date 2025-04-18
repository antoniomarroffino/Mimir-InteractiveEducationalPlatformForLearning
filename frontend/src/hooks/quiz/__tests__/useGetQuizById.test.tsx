import { describe, expect, it, vi, afterAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetQuizById } from "../useGetQuizById";
import { quizApi } from "../../../../config/config";
import { QuizDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock the quizApi
vi.mock("../../../../config/config", () => ({
  quizApi: {
    apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet: vi.fn(),
  },
}));

describe("useGetQuizById", () => {
  const mockQuiz: QuizDTO = {
    id: "1",
    name: "Test Quiz",
    description: "Test Description",
    timeLimitMinutes: 30,
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

  it("should fetch quiz data successfully", async () => {
    (
      quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet as any
    ).mockResolvedValueOnce({
      data: mockQuiz,
    });

    const { result } = renderHook(
      () => useGetQuizById("course1", "folder1", "quiz1"),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuiz);
    expect(
      quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet
    ).toHaveBeenCalledWith({
      courseId: "course1",
      folderId: "folder1",
      quizId: "quiz1",
    });
  });

  it("should handle error when fetching quiz data", async () => {
    const error = new Error("Failed to fetch quiz");
    (
      quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdGet as any
    ).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () => useGetQuizById("course1", "folder1", "quiz1"),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
