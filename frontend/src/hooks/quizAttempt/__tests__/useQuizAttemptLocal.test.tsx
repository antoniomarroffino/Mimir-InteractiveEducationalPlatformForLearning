import { renderHook } from "@testing-library/react";
import { describe, expect, vi, afterEach, Mock, afterAll, it } from "vitest";
import * as React from "react";
import { useQuizAttemptLocal } from "../useQuizAttemptLocal";
import {
  QuizAttemptLocalContext,
  QuizAttemptLocalContextType,
} from "../../../contexts/quizAttempt/QuizAttemptLocalContext";
import { QuizAttemptDTO } from "@dti-isin/backend-api-client";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useQuizAttemptLocal", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("throws error when used outside provider", () => {
    (React.useContext as Mock).mockReturnValue(undefined);

    expect(() => renderHook(() => useQuizAttemptLocal())).toThrow(
      "useQuizAttemptLocal must be used within a QuizAttemptLocalProvider"
    );
  });

  it("returns context when used within provider", () => {
    const mockContext: QuizAttemptLocalContextType = {
      currentAttempt: null,
      startQuizAttempt: vi.fn().mockResolvedValue(undefined),
      updateQuizAttemptResponses: vi.fn(),
      completeQuizAttempt: vi.fn().mockResolvedValue({} as QuizAttemptDTO),
      resetQuizAttempt: vi.fn(),
      prepareQuizResponses: vi.fn().mockReturnValue([]),
    };

    (React.useContext as Mock).mockImplementation((context) => {
      return context === QuizAttemptLocalContext ? mockContext : undefined;
    });

    const { result } = renderHook(() => useQuizAttemptLocal());

    expect(result.current).toEqual({
      currentAttempt: null,
      startQuizAttempt: expect.any(Function),
      updateQuizAttemptResponses: expect.any(Function),
      completeQuizAttempt: expect.any(Function),
      resetQuizAttempt: expect.any(Function),
      prepareQuizResponses: expect.any(Function),
    });
  });
});
