import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { quizPublicationApi } from "../../../../config/config";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetQuizPublicationsByQuizId } from "../useGetQuizPublicationsByQuizId";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config", () => ({
  quizPublicationApi: {
    apiPublicationsByQuizIdQuizIdGet: vi.fn(),
  },
}));

describe("useGetQuizPublicationsByQuizId", () => {
  const mockQuizPublications: QuizPublicationDTO[] = [
    {
      id: "test-publication-1",
      publicationCode: "TEST123",
      courseId: "test-course-id",
      folderId: "test-folder-id",
      quizId: "test-quiz-id",
      createdAt: "2024-04-19T10:00:00Z",
      closedAt: "2024-04-19T11:00:00Z",
      published: true,
    },
    {
      id: "test-publication-2",
      publicationCode: "TEST456",
      courseId: "test-course-id",
      folderId: "test-folder-id",
      quizId: "test-quiz-id",
      createdAt: "2024-04-19T12:00:00Z",
      closedAt: "2024-04-19T13:00:00Z",
      published: true,
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

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should fetch quiz publications data successfully", async () => {
    (
      quizPublicationApi.apiPublicationsByQuizIdQuizIdGet as Mock
    ).mockResolvedValueOnce({
      data: mockQuizPublications,
    });

    const { result } = renderHook(
      () => useGetQuizPublicationsByQuizId("test-quiz-id"),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuizPublications);
    expect(
      quizPublicationApi.apiPublicationsByQuizIdQuizIdGet
    ).toHaveBeenCalledWith({
      quizId: "test-quiz-id",
    });
  });

  it("should handle error when fetching quiz publications data", async () => {
    const error = new Error("Failed to fetch quiz publications");
    (
      quizPublicationApi.apiPublicationsByQuizIdQuizIdGet as Mock
    ).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () => useGetQuizPublicationsByQuizId("test-quiz-id"),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
