import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {describe, it, expect, vi, afterAll, Mock} from "vitest";
import { useContext } from "react";
import { QuestionBankCRUDProvider } from "../QuestionBankCRUDProvider";
import { QuestionBankCRUDContext } from "../../../contexts/questionBank/QuestionBankCRUDContext";
import { questionBankApi } from "../../../../config/config";
import { QuestionBankDTO } from "@dti-isin/backend-api-client";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config.ts", () => ({
    questionBankApi: {
        apiQuestionBanksPost: vi.fn(),
        apiQuestionBanksIdPut: vi.fn(),
        apiQuestionBanksIdDelete: vi.fn(),
        apiQuestionBanksIdReorderPatch: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <QuestionBankCRUDProvider>{children}</QuestionBankCRUDProvider>
        </QueryClientProvider>
    );
};

const useTestHook = () => useContext(QuestionBankCRUDContext);

describe("QuestionBankCRUDProvider", () => {
    const mockBank: QuestionBankDTO = {
        id: "bank-123",
        name: "Test Bank",
        questions: [],
    };

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("Create Question Bank", () => {
        it("should handle successful creation", async () => {
            (questionBankApi.apiQuestionBanksPost as Mock).mockResolvedValue({ data: mockBank });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.createQuestionBank(mockBank);
            });

            expect(questionBankApi.apiQuestionBanksPost).toHaveBeenCalledWith({ questionBankDTO: mockBank });
            expect(result.current!.isCreatingQuestionBank).toBe(false);
        });

        it("should handle creation error", async () => {
            const error = new Error("Creation failed");
            (questionBankApi.apiQuestionBanksPost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.createQuestionBank(mockBank)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question bank creation error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question bank creation failed:", error);
            expect(result.current!.errorCreateQuestionBank).toEqual(error);
        });
    });

    describe("Update Question Bank", () => {
        it("should handle successful update", async () => {
            (questionBankApi.apiQuestionBanksIdPut as Mock).mockResolvedValue({ data: mockBank });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.updateQuestionBank("bank-123", mockBank);
            });

            expect(questionBankApi.apiQuestionBanksIdPut).toHaveBeenCalledWith({
                id: "bank-123",
                questionBankDTO: mockBank,
            });
            expect(result.current!.isUpdatingQuestionBank).toBe(false);
        });

        it("should handle update error", async () => {
            const error = new Error("Update failed");
            (questionBankApi.apiQuestionBanksIdPut as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.updateQuestionBank("bank-123", mockBank)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question bank update error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question bank updating failed:", error);
            expect(result.current!.errorUpdateQuestionBank).toEqual(error);
        });
    });

    describe("Delete Question Bank", () => {
        it("should handle successful deletion", async () => {
            (questionBankApi.apiQuestionBanksIdDelete as Mock).mockResolvedValue({});

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.deleteQuestionBank("bank-123");
            });

            expect(questionBankApi.apiQuestionBanksIdDelete).toHaveBeenCalledWith({ id: "bank-123" });
            expect(result.current!.isDeletingQuestionBank).toBe(false);
        });

        it("should handle deletion error", async () => {
            const error = new Error("Deletion failed");
            (questionBankApi.apiQuestionBanksIdDelete as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.deleteQuestionBank("bank-123")).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question bank delete error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question bank delete failed:", error);
            expect(result.current!.errorDeleteQuestionBank).toEqual(error);
        });
    });

    describe("Reorder Questions", () => {
        it("should handle successful reorder", async () => {
            (questionBankApi.apiQuestionBanksIdReorderPatch as Mock).mockResolvedValue({});

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.reorderQuestionBank("bank-123", ["q1", "q2", "q3"]);
            });

            expect(questionBankApi.apiQuestionBanksIdReorderPatch).toHaveBeenCalledWith({
                id: "bank-123",
                requestBody: ["q1", "q2", "q3"],
            });
            expect(result.current!.isReorderingQuestions).toBe(false);
        });

        it("should handle reorder error", async () => {
            const error = new Error("Reorder failed");
            (questionBankApi.apiQuestionBanksIdReorderPatch as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.reorderQuestionBank("bank-123", ["q1", "q2", "q3"])).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question reorder failed:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question reorder failed:", error);
            expect(result.current!.errorReorderQuestions).toEqual(error);
        });
    });
});
