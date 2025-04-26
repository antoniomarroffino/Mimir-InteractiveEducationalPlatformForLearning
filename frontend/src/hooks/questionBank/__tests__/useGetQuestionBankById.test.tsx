import { describe, expect, it, vi, afterEach, afterAll, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetQuestionBankById } from "../useSelectedQuestionBank";
import { questionBankApi } from "../../../../config/config";
import { QuestionBankDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock console.error
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock dell'API
vi.mock("../../../../config/config", () => ({
  questionBankApi: {
    apiQuestionBanksIdGet: vi.fn(),
  },
}));

describe("useGetQuestionBankById", () => {
  const mockQuestionBank: QuestionBankDTO = {
    id: "1",
    name: "Test Question Bank",
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should fetch question bank data successfully", async () => {
    (questionBankApi.apiQuestionBanksIdGet as Mock).mockResolvedValueOnce({
      data: mockQuestionBank,
    });

    const { result } = renderHook(() => useGetQuestionBankById("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuestionBank);
    expect(questionBankApi.apiQuestionBanksIdGet).toHaveBeenCalledTimes(1);
    expect(questionBankApi.apiQuestionBanksIdGet).toHaveBeenCalledWith({
      id: "1",
    });
  });

  it("should handle error when fetching question bank data", async () => {
    const error = new Error("Failed to fetch question bank");
    (questionBankApi.apiQuestionBanksIdGet as Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useGetQuestionBankById("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
    expect(questionBankApi.apiQuestionBanksIdGet).toHaveBeenCalledTimes(1);
  });
});
