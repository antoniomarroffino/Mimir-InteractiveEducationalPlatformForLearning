import { describe, expect, it, vi, afterAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetQuizzesInFolderIdInCourseId } from "../useGetQuizzesInFolderIdInCourseId";
import { quizApi } from "../../../../config/config";
import { QuizDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock the quizApi
vi.mock("../../../../config/config", () => ({
  quizApi: {
    apiCoursesCourseIdFoldersFolderIdQuizzesGet: vi.fn(),
  },
}));

describe("useGetQuizzesInFolderIdInCourseId", () => {
  const mockQuizzes: QuizDTO[] = [
    {
      id: "1",
      name: "Test Quiz 1",
      description: "Test Description 1",
      timeLimitMinutes: 30,
    },
    {
      id: "2",
      name: "Test Quiz 2",
      description: "Test Description 2",
      timeLimitMinutes: 45,
    },
  ];

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

  it("should fetch quizzes data successfully", async () => {
    (
      quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet as any
    ).mockResolvedValueOnce({
      data: mockQuizzes,
    });

    const { result } = renderHook(
      () => useGetQuizzesInFolderIdInCourseId("course1", "folder1"),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuizzes);
    expect(
      quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet
    ).toHaveBeenCalledWith({
      courseId: "course1",
      folderId: "folder1",
    });
  });

  it("should return empty array when courseId is not provided", async () => {
    const { result } = renderHook(
      () => useGetQuizzesInFolderIdInCourseId("", "folder1"),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("should handle error when fetching quizzes data", async () => {
    const error = new Error("Failed to fetch quizzes");
    (
      quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesGet as any
    ).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () => useGetQuizzesInFolderIdInCourseId("course1", "folder1"),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
