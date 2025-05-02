import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {describe, it, expect, vi, afterAll, beforeEach, Mock} from "vitest";
import React, { useContext } from "react";
import { QuizCRUDProvider } from "../QuizCRUDProvider";
import { QuizCRUDContext } from "../../../contexts/quiz/QuizCRUDContext";
import { quizApi } from "../../../../config/config";
import { QuizDTO } from "@dti-isin/backend-api-client";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config.ts", () => ({
    quizApi: {
        apiCoursesCourseIdFoldersFolderIdQuizzesPost: vi.fn(),
        apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut: vi.fn(),
        apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <QuizCRUDProvider>{children}</QuizCRUDProvider>
        </QueryClientProvider>
    );
};

const useTestHook = () => useContext(QuizCRUDContext);

describe("QuizCRUDProvider", () => {
    const mockQuiz: QuizDTO = {
        id: "quiz-123",
        name: "Sample Quiz",
        timeLimitMinutes: 30,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("Create Quiz", () => {
        it("should handle successful creation", async () => {
            (quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost as Mock).mockResolvedValue({ data: mockQuiz });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.createQuiz("course-1", "folder-1", mockQuiz);
            });

            expect(quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost).toHaveBeenCalledWith({
                courseId: "course-1",
                folderId: "folder-1",
                quizDTO: mockQuiz,
            });

            expect(result.current!.isCreatingQuiz).toBe(false);
        });

        it("should handle creation error", async () => {
            const error = new Error("Creation failed");
            (quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesPost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.createQuiz("course-1", "folder-1", mockQuiz)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Quiz creation error:", error);
            expect(result.current!.errorCreateQuiz).toEqual(error);
        });
    });

    describe("Update Quiz", () => {
        it("should handle successful update", async () => {
            (quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut as Mock).mockResolvedValue({ data: mockQuiz });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.updateQuiz("course-1", "folder-1", "quiz-123", mockQuiz);
            });

            expect(quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut).toHaveBeenCalledWith({
                courseId: "course-1",
                folderId: "folder-1",
                quizId: "quiz-123",
                quizDTO: mockQuiz,
            });

            expect(result.current!.isUpdatingQuiz).toBe(false);
        });

        it("should handle update error", async () => {
            const error = new Error("Update failed");
            (quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.updateQuiz("course-1", "folder-1", "quiz-123", mockQuiz)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Quiz update error:", error);
            expect(result.current!.errorUpdateQuiz).toEqual(error);
        });
    });

    describe("Delete Quiz", () => {
        it("should handle successful deletion", async () => {
            (quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete as Mock).mockResolvedValue({});

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.deleteQuiz("course-1", "folder-1", "quiz-123");
            });

            expect(quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete).toHaveBeenCalledWith({
                courseId: "course-1",
                folderId: "folder-1",
                quizId: "quiz-123",
            });

            expect(result.current!.isDeletingQuiz).toBe(false);
        });

        it("should handle deletion error", async () => {
            const error = new Error("Delete failed");
            (quizApi.apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.deleteQuiz("course-1", "folder-1", "quiz-123")).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Quiz delete error:", error);
            expect(result.current!.errorDeleteQuiz).toEqual(error);
        });
    });
});
