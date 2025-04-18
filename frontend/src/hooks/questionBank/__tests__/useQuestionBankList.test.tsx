import { describe, expect, it, vi, afterAll } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useQuestionBankList } from "../useQuestionBankList";
import {
  QuestionBankListContext,
  QuestionBankListContextType,
} from "../../../contexts/questionBank/QuestionBankListContext";
import { QuestionBankDTO } from "@dti-isin/backend-api-client";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useQuestionBankList", () => {
  const mockQuestionBanks: QuestionBankDTO[] = [
    {
      id: "1",
      name: "Test Question Bank 1",
    },
    {
      id: "2",
      name: "Test Question Bank 2",
    },
  ];

  const mockContextValue: QuestionBankListContextType = {
    questionBanks: mockQuestionBanks,
    isLoadingQuestionBanks: false,
    errorQuestionBanks: null,
    fetchQuestionBanks: vi.fn().mockResolvedValue(undefined),
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should throw error when context is undefined", () => {
    (useContext as any).mockReturnValue(undefined);

    expect(() => renderHook(() => useQuestionBankList())).toThrowError(
      "useQuestionBankList must be used within a QuestionBankListProvider"
    );
  });

  it("should return context when available", () => {
    (useContext as any).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useQuestionBankList());

    expect(result.current).toMatchObject(mockContextValue);
    expect(useContext).toHaveBeenCalledWith(QuestionBankListContext);
  });

  it("should maintain referential equality between renders", () => {
    (useContext as any).mockReturnValue(mockContextValue);

    const { result, rerender } = renderHook(() => useQuestionBankList());
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should handle context with error state", () => {
    const errorContextValue: QuestionBankListContextType = {
      ...mockContextValue,
      errorQuestionBanks: new Error("Failed to fetch question banks"),
    };

    (useContext as any).mockReturnValue(errorContextValue);

    const { result } = renderHook(() => useQuestionBankList());

    expect(result.current.errorQuestionBanks).toBeInstanceOf(Error);
  });

  it("should handle context with loading state", () => {
    const loadingContextValue: QuestionBankListContextType = {
      ...mockContextValue,
      isLoadingQuestionBanks: true,
    };

    (useContext as any).mockReturnValue(loadingContextValue);

    const { result } = renderHook(() => useQuestionBankList());

    expect(result.current.isLoadingQuestionBanks).toBe(true);
  });
});
