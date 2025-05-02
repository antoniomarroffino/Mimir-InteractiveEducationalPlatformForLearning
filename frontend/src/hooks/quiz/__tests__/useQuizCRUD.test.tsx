import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useQuizCRUD } from "../useQuizCRUD";
import {
  QuizCRUDContext,
  QuizCRUDContextType,
} from "../../../contexts/quiz/QuizCRUDContext";
import { QuizDTO } from "@dti-isin/backend-api-client";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useQuizCRUD", () => {
  const mockQuiz: QuizDTO = {
    id: "1",
    name: "Test Quiz",
    description: "Test Description",
    timeLimitMinutes: 30,
  };

  const mockContextValue: QuizCRUDContextType = {
    createQuiz: vi.fn().mockResolvedValue(mockQuiz),
    updateQuiz: vi.fn().mockResolvedValue(mockQuiz),
    deleteQuiz: vi.fn().mockResolvedValue(undefined),
    isCreatingQuiz: false,
    isUpdatingQuiz: false,
    isDeletingQuiz: false,
    errorCreateQuiz: null,
    errorUpdateQuiz: null,
    errorDeleteQuiz: null,
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should throw error when context is undefined", () => {
    (useContext as Mock).mockReturnValue(undefined);

    expect(() => renderHook(() => useQuizCRUD())).toThrowError(
      "useQuizCRUD must be used within a QuizCRUDProvider"
    );
  });

  it("should return context when available", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useQuizCRUD());

    expect(result.current).toMatchObject(mockContextValue);
    expect(useContext).toHaveBeenCalledWith(QuizCRUDContext);
  });

  it("should maintain referential equality between renders", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result, rerender } = renderHook(() => useQuizCRUD());
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should handle createQuiz function", async () => {
    const createQuizMock = vi.fn().mockResolvedValue(mockQuiz);
    const createContext: QuizCRUDContextType = {
      ...mockContextValue,
      createQuiz: createQuizMock,
    };

    (useContext as Mock).mockReturnValue(createContext);

    const { result } = renderHook(() => useQuizCRUD());

    const response = await result.current.createQuiz(
      "course1",
      "folder1",
      mockQuiz
    );
    expect(createQuizMock).toHaveBeenCalledTimes(1);
    expect(createQuizMock).toHaveBeenCalledWith("course1", "folder1", mockQuiz);
    expect(response).toBe(mockQuiz);
  });

  it("should handle updateQuiz function", async () => {
    const updateQuizMock = vi.fn().mockResolvedValue(mockQuiz);
    const updateContext: QuizCRUDContextType = {
      ...mockContextValue,
      updateQuiz: updateQuizMock,
    };

    (useContext as Mock).mockReturnValue(updateContext);

    const { result } = renderHook(() => useQuizCRUD());

    const response = await result.current.updateQuiz(
      "course1",
      "folder1",
      "quiz1",
      mockQuiz
    );
    expect(updateQuizMock).toHaveBeenCalledTimes(1);
    expect(updateQuizMock).toHaveBeenCalledWith(
      "course1",
      "folder1",
      "quiz1",
      mockQuiz
    );
    expect(response).toBe(mockQuiz);
  });

  it("should handle deleteQuiz function", async () => {
    const deleteQuizMock = vi.fn().mockResolvedValue(undefined);
    const deleteContext: QuizCRUDContextType = {
      ...mockContextValue,
      deleteQuiz: deleteQuizMock,
    };

    (useContext as Mock).mockReturnValue(deleteContext);

    const { result } = renderHook(() => useQuizCRUD());

    await result.current.deleteQuiz("course1", "folder1", "quiz1");
    expect(deleteQuizMock).toHaveBeenCalledTimes(1);
    expect(deleteQuizMock).toHaveBeenCalledWith("course1", "folder1", "quiz1");
  });

  it("should handle loading states", () => {
    const loadingContext: QuizCRUDContextType = {
      ...mockContextValue,
      isCreatingQuiz: true,
      isUpdatingQuiz: true,
      isDeletingQuiz: true,
    };

    (useContext as Mock).mockReturnValue(loadingContext);

    const { result } = renderHook(() => useQuizCRUD());

    expect(result.current.isCreatingQuiz).toBe(true);
    expect(result.current.isUpdatingQuiz).toBe(true);
    expect(result.current.isDeletingQuiz).toBe(true);
  });

  it("should handle error states", () => {
    const errorContext: QuizCRUDContextType = {
      ...mockContextValue,
      errorCreateQuiz: new Error("Create error"),
      errorUpdateQuiz: new Error("Update error"),
      errorDeleteQuiz: new Error("Delete error"),
    };

    (useContext as Mock).mockReturnValue(errorContext);

    const { result } = renderHook(() => useQuizCRUD());

    expect(result.current.errorCreateQuiz).toBeInstanceOf(Error);
    expect(result.current.errorUpdateQuiz).toBeInstanceOf(Error);
    expect(result.current.errorDeleteQuiz).toBeInstanceOf(Error);
  });
});
