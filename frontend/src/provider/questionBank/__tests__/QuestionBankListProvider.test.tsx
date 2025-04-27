import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {describe, it, expect, vi, afterAll, beforeEach, Mock} from "vitest";
import { useContext } from "react";
import { QuestionBankListProvider } from "../QuestionBankListProvider";
import { QuestionBankListContext } from "../../../contexts/questionBank/QuestionBankListContext";
import { questionBankApi } from "../../../../config/config";
import { QuestionBankDTO } from "@dti-isin/backend-api-client";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config.ts", () => ({
    questionBankApi: {
        apiQuestionBanksGet: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <QuestionBankListProvider>{children}</QuestionBankListProvider>
        </QueryClientProvider>
    );
};

const useTestHook = () => useContext(QuestionBankListContext);

describe("QuestionBankListProvider", () => {
    const mockBanks: QuestionBankDTO[] = [
        { id: "bank-1", name: "Bank 1", questions: [] },
        { id: "bank-2", name: "Bank 2", questions: [] },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should provide question banks data", async () => {
        (questionBankApi.apiQuestionBanksGet as Mock).mockResolvedValue({ data: mockBanks });

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current!.questionBanks).toEqual(mockBanks);
        expect(result.current!.isLoadingQuestionBanks).toBe(false);
        expect(result.current!.errorQuestionBanks).toBeNull();

    });

    it("should show loading state initially", async () => {
        (questionBankApi.apiQuestionBanksGet as Mock).mockImplementation(
            () => new Promise(() => {}) // pending
        );

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        expect(result.current!.isLoadingQuestionBanks).toBe(true);
    });

    it("should handle error state", async () => {
        const error = new Error("Fetch failed");
        (questionBankApi.apiQuestionBanksGet as Mock).mockRejectedValue(error);

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(result.current!.errorQuestionBanks).toEqual(error);
    });

    it("should allow manual refetch", async () => {
        (questionBankApi.apiQuestionBanksGet as Mock).mockResolvedValue({ data: mockBanks });

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        await act(async () => {
            await result.current!.fetchQuestionBanks();
        });

        expect(questionBankApi.apiQuestionBanksGet).toHaveBeenCalledTimes(2);
    });

});
