import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { quizPublicationApi } from "../../../../config/config";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetQuizPublicationByCode } from "../useGetQuizPublicationByCode";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config", () => ({
  quizPublicationApi: {
    apiPublicationsByCodeCodeGet: vi.fn(),
  },
}));

describe("useGetQuizPublicationByCode", () => {
  const mockQuizPublication: QuizPublicationDTO = {
    id: "test-publication-id",
    publicationCode: "TEST123",
    courseId: "test-course-id",
    folderId: "test-folder-id",
    quizId: "test-quiz-id",
    createdAt: "2024-04-19T10:00:00Z",
    closedAt: "2024-04-19T11:00:00Z",
    published: true,
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

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should fetch quiz publication data successfully", async () => {
    (
      quizPublicationApi.apiPublicationsByCodeCodeGet as Mock
    ).mockResolvedValueOnce({
      data: mockQuizPublication,
    });

    const { result } = renderHook(
      () => useGetQuizPublicationByCode("TEST123"),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuizPublication);
    expect(
      quizPublicationApi.apiPublicationsByCodeCodeGet
    ).toHaveBeenCalledWith({
      code: "TEST123",
    });
  });

  it("should handle error when fetching quiz publication data", async () => {
    const error = new Error("Failed to fetch quiz publication");
    (
      quizPublicationApi.apiPublicationsByCodeCodeGet as Mock
    ).mockRejectedValueOnce(error);

    const { result } = renderHook(
      () => useGetQuizPublicationByCode("TEST123"),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
