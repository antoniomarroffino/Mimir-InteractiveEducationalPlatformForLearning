import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useQuizPublicationCRUD } from "../useQuizPublicationCRUD";
import { QuizPublicationCRUDContext } from "../../../contexts/quizPublication/QuizPublicationCRUDContext";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

describe("useQuizPublicationCRUD", () => {
  const mockContextValue = {
    createPublication: vi.fn().mockResolvedValue({} as QuizPublicationDTO),
    deletePublication: vi.fn().mockResolvedValue(undefined),
    deactivatePublication: vi.fn().mockResolvedValue({} as QuizPublicationDTO),
    isCreatingPublication: false,
    isDeletingPublication: false,
    isDeactivatingPublication: false,
    errorCreatePublication: null,
    errorDeletePublication: null,
    errorDeactivatePublication: null,
  };

  const createWrapper = (contextValue = mockContextValue) => {
    return ({ children }: { children: React.ReactNode }) => (
      <QuizPublicationCRUDContext.Provider value={contextValue}>
        {children}
      </QuizPublicationCRUDContext.Provider>
    );
  };

  it("should return the context value when used within provider", () => {
    const { result } = renderHook(() => useQuizPublicationCRUD(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toEqual(mockContextValue);
  });

  it("should throw an error when used outside of provider", () => {
    expect(() => {
      renderHook(() => useQuizPublicationCRUD());
    }).toThrow(
      "useQuizPublicationCRUD must be used within a QuizPublicationCRUDProvider"
    );
  });
});
