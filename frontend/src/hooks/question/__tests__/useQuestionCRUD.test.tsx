import { afterAll, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuestionCRUD } from "../useQuestionCRUD";
import { QuestionCRUDContext } from "../../../contexts/question/QuestionCRUDContext";
import { QuestionDTO } from "@dti-isin/backend-api-client";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("useQuestionCRUD", () => {
  const mockContextValue = {
    createQuestion: vi.fn().mockResolvedValue({} as QuestionDTO),
    updateQuestion: vi.fn().mockResolvedValue({} as QuestionDTO),
    deleteQuestion: vi.fn().mockResolvedValue(undefined),
    createQuestionTemplate: vi.fn().mockResolvedValue({} as QuestionDTO),
    isCreatingQuestion: false,
    isUpdatingQuestion: false,
    isDeletingQuestion: false,
    isCreatingQuestionTemplate: false,
    errorCreateQuestion: null,
    errorUpdateQuestion: null,
    errorDeleteQuestion: null,
    errorCreateQuestionTemplate: null,
  };

  const createWrapper = (contextValue = mockContextValue) => {
    return ({ children }: { children: React.ReactNode }) => (
      <QuestionCRUDContext.Provider value={contextValue}>
        {children}
      </QuestionCRUDContext.Provider>
    );
  };

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return the context value when used within provider", () => {
    const { result } = renderHook(() => useQuestionCRUD(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toEqual(mockContextValue);
  });

  it("should throw an error when used outside of provider", () => {
    expect(() => {
      renderHook(() => useQuestionCRUD());
    }).toThrow("useQuestionCRUD must be used within a QuestionCRUDProvider");
  });
});
