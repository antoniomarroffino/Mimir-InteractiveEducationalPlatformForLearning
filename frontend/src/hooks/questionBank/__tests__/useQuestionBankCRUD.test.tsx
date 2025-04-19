import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useQuestionBankCRUD } from "../useQuestionBankCRUD";
import {
  QuestionBankCRUDContext,
  QuestionBankCRUDContextType,
} from "../../../contexts/questionBank/QuestionBankCRUDContext";
import { QuestionBankDTO } from "@dti-isin/backend-api-client";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useQuestionBankCRUD", () => {
  const mockQuestionBank: QuestionBankDTO = {
    id: "1",
    name: "Test Question Bank",
  };

  const mockContextValue: QuestionBankCRUDContextType = {
    createQuestionBank: vi.fn().mockResolvedValue(mockQuestionBank),
    updateQuestionBank: vi.fn().mockResolvedValue(mockQuestionBank),
    deleteQuestionBank: vi.fn().mockResolvedValue(undefined),
    isCreatingQuestionBank: false,
    isUpdatingQuestionBank: false,
    isDeletingQuestionBank: false,
    errorCreateQuestionBank: null,
    errorUpdateQuestionBank: null,
    errorDeleteQuestionBank: null,
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should throw error when context is undefined", () => {
    (useContext as Mock).mockReturnValue(undefined);

    expect(() => renderHook(() => useQuestionBankCRUD())).toThrowError(
      "useQuestionBankCRUD must be used within a QuestionBankCRUDProvider"
    );
  });

  it("should return context when available", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useQuestionBankCRUD());

    expect(result.current).toMatchObject(mockContextValue);
    expect(useContext).toHaveBeenCalledWith(QuestionBankCRUDContext);
  });

  it("should maintain referential equality between renders", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result, rerender } = renderHook(() => useQuestionBankCRUD());
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should handle context with error states", () => {
    const errorContextValue: QuestionBankCRUDContextType = {
      ...mockContextValue,
      errorCreateQuestionBank: new Error("Create error"),
      errorUpdateQuestionBank: new Error("Update error"),
      errorDeleteQuestionBank: new Error("Delete error"),
    };

    (useContext as Mock).mockReturnValue(errorContextValue);

    const { result } = renderHook(() => useQuestionBankCRUD());

    expect(result.current.errorCreateQuestionBank).toBeInstanceOf(Error);
    expect(result.current.errorUpdateQuestionBank).toBeInstanceOf(Error);
    expect(result.current.errorDeleteQuestionBank).toBeInstanceOf(Error);
  });

  it("should handle context with loading states", () => {
    const loadingContextValue: QuestionBankCRUDContextType = {
      ...mockContextValue,
      isCreatingQuestionBank: true,
      isUpdatingQuestionBank: true,
      isDeletingQuestionBank: true,
    };

    (useContext as Mock).mockReturnValue(loadingContextValue);

    const { result } = renderHook(() => useQuestionBankCRUD());

    expect(result.current.isCreatingQuestionBank).toBe(true);
    expect(result.current.isUpdatingQuestionBank).toBe(true);
    expect(result.current.isDeletingQuestionBank).toBe(true);
  });
});
