import { describe, expect, it, Mock, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useQuizAttemptCRUD } from "../useQuizAttemptCRUD";
import { QuizAttemptCRUDContext } from "../../../contexts/quizAttempt/QuizAttemptCRUDContext";
import { BadgeType, QuizAttemptDTO, Role } from "@dti-isin/backend-api-client";

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useQuizAttemptCRUD", () => {
  const mockQuizAttempt: QuizAttemptDTO = {
    id: "1",
    quizPublicationId: "pub1",
    user: {
      azureOid: "user1",
      name: "John Doe",
      email: "user1@example.com",
      role: Role.Student,
    },
    startedAt: "2024-04-15T10:00:00Z",
    completedAt: "2024-04-15T10:30:00Z",
    responses: [],
    badges: [],
  };

  const mockContextValue = {
    createQuizAttempt: vi.fn(),
    assignBadge: vi.fn(),
    isAssigningBadge: false,
    errorAssignBadge: null,
    isCreatingQuizAttempt: false,
    errorCreateQuizAttempt: null,
  };

  it("should throw error when context is undefined", () => {
    (useContext as Mock).mockReturnValue(undefined);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => renderHook(() => useQuizAttemptCRUD())).toThrowError(
      "useQuizAttemptCRUD must be used within a QuizAttemptCRUDProvider"
    );

    consoleError.mockRestore();
  });

  it("should return context when available", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useQuizAttemptCRUD());

    expect(result.current).toMatchObject(mockContextValue);
    expect(useContext).toHaveBeenCalledWith(QuizAttemptCRUDContext);
  });

  it("should maintain referential equality between renders", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result, rerender } = renderHook(() => useQuizAttemptCRUD());
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should call createQuizAttempt with correct parameters", async () => {
    (useContext as Mock).mockReturnValue(mockContextValue);
    mockContextValue.createQuizAttempt.mockResolvedValueOnce(mockQuizAttempt);

    const { result } = renderHook(() => useQuizAttemptCRUD());

    await result.current.createQuizAttempt(mockQuizAttempt);

    expect(mockContextValue.createQuizAttempt).toHaveBeenCalledWith(
      mockQuizAttempt
    );
  });

  it("should call assignBadge with correct parameters", async () => {
    (useContext as Mock).mockReturnValue(mockContextValue);
    const attemptId = "1";
    const badgeType = BadgeType.BestAttempt;

    const { result } = renderHook(() => useQuizAttemptCRUD());

    await result.current.assignBadge(attemptId, badgeType);

    expect(mockContextValue.assignBadge).toHaveBeenCalledWith(
      attemptId,
      badgeType
    );
  });
});
