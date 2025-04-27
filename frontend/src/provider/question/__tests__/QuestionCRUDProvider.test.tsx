import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {describe, it, expect, vi, afterAll, Mock} from "vitest";
import React, { useContext } from "react";
import { QuestionCRUDProvider } from "../QuestionCRUDProvider";
import { QuestionCRUDContext } from "../../../contexts/question/QuestionCRUDContext";
import { questionApi } from "../../../../config/config";
import { QuestionDTO, QuestionType } from "@dti-isin/backend-api-client";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config.ts", () => ({
    questionApi: {
        apiQuestionsPost: vi.fn(),
        apiQuestionsQuestionIdPut: vi.fn(),
        apiQuestionsQuestionIdDelete: vi.fn(),
        apiQuestionsTypePost: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <QuestionCRUDProvider>{children}</QuestionCRUDProvider>
        </QueryClientProvider>
    );
};

const useTestHook = () => useContext(QuestionCRUDContext);

describe("QuestionCRUDProvider", () => {
    const mockQuestion: QuestionDTO = {
        id: "question-123",
        questionText: "Test Question",
        type: QuestionType.TrueFalse,
        points: 1,
        questionBankId: "bank-123",
    };

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("Create Question", () => {
        it("should handle successful creation", async () => {
            (questionApi.apiQuestionsPost as Mock).mockResolvedValue({ data: mockQuestion });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.createQuestion(mockQuestion);
            });

            expect(questionApi.apiQuestionsPost).toHaveBeenCalledWith({ questionDTO: mockQuestion });
            expect(result.current!.isCreatingQuestion).toBe(false);
        });

        it("should handle creation error", async () => {
            const error = new Error("Creation failed");
            (questionApi.apiQuestionsPost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.createQuestion(mockQuestion)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question creation error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question creation failed:", error);
            expect(result.current!.errorCreateQuestion).toEqual(error);
        });
    });

    describe("Update Question", () => {
        it("should handle successful update", async () => {
            (questionApi.apiQuestionsQuestionIdPut as Mock).mockResolvedValue({ data: mockQuestion });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.updateQuestion("question-123", mockQuestion);
            });

            expect(questionApi.apiQuestionsQuestionIdPut).toHaveBeenCalledWith({
                questionId: "question-123",
                questionDTO: mockQuestion,
            });
            expect(result.current!.isUpdatingQuestion).toBe(false);
        });

        it("should handle update error", async () => {
            const error = new Error("Update failed");
            (questionApi.apiQuestionsQuestionIdPut as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.updateQuestion("question-123", mockQuestion)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question updating error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question updating failed:", error);
            expect(result.current!.errorUpdateQuestion).toEqual(error);
        });
    });

    describe("Delete Question", () => {
        it("should handle successful deletion", async () => {
            (questionApi.apiQuestionsQuestionIdDelete as Mock).mockResolvedValue({});

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.deleteQuestion("question-123", "bank-123");
            });

            expect(questionApi.apiQuestionsQuestionIdDelete).toHaveBeenCalledWith({ questionId: "question-123" });
            expect(result.current!.isDeletingQuestion).toBe(false);
        });

        it("should handle deletion error", async () => {
            const error = new Error("Delete failed");
            (questionApi.apiQuestionsQuestionIdDelete as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.deleteQuestion("question-123", "bank-123")).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question delete error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question deletion failed:", error);
            expect(result.current!.errorDeleteQuestion).toEqual(error);
        });
    });

    describe("Create Question Template", () => {
        it("should handle successful creation of template", async () => {
            (questionApi.apiQuestionsTypePost as Mock).mockResolvedValue({ data: mockQuestion });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.createQuestionTemplate(QuestionType.TrueFalse);
            });

            expect(questionApi.apiQuestionsTypePost).toHaveBeenCalledWith({ type: QuestionType.TrueFalse });
            expect(result.current!.isCreatingQuestionTemplate).toBe(false);
        });

        it("should handle template creation error", async () => {
            const error = new Error("Template creation failed");
            (questionApi.apiQuestionsTypePost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.createQuestionTemplate(QuestionType.TrueFalse)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Question creation template error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Question deleted failed:", error);
            expect(result.current!.errorCreateQuestionTemplate).toEqual(error);
        });
    });
});
