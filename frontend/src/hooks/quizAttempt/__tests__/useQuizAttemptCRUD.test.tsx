import { describe, expect, it, Mock, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useQuizAttemptCRUD } from "../useQuizAttemptCRUD";
import { QuizAttemptCRUDContext, QuizAttemptCRUDContextType } from "../../../contexts/quizAttempt/QuizAttemptCRUDContext";
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

  const mockContextValue: QuizAttemptCRUDContextType = {
    createInitialAttempt: vi.fn().mockResolvedValue(mockQuizAttempt),
    submitAttemptFinal: vi.fn().mockResolvedValue(mockQuizAttempt),
    updateAttemptPartial: vi.fn().mockResolvedValue(mockQuizAttempt),
    assignBadge: vi.fn().mockResolvedValue(undefined),
    isAssigningBadge: false,
    errorAssignBadge: null,
    isCreatingQuizAttempt: false,
    errorCreateQuizAttempt: null,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error when context is undefined", () => {
    (useContext as Mock).mockReturnValue(undefined);

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

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

  it("should call createInitialAttempt with correct parameters", async () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useQuizAttemptCRUD());

    await result.current.createInitialAttempt(mockQuizAttempt);

    expect(mockContextValue.createInitialAttempt).toHaveBeenCalledWith(mockQuizAttempt);
  });

  it("should call submitAttemptFinal with correct parameters", async () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useQuizAttemptCRUD());

    await result.current.submitAttemptFinal("1", mockQuizAttempt);

    expect(mockContextValue.submitAttemptFinal).toHaveBeenCalledWith("1", mockQuizAttempt);
  });

  it("should call updateAttemptPartial with correct parameters", async () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useQuizAttemptCRUD());

    await result.current.updateAttemptPartial("1", mockQuizAttempt);

    expect(mockContextValue.updateAttemptPartial).toHaveBeenCalledWith("1", mockQuizAttempt);
  });

  it("should call assignBadge with correct parameters", async () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const badgeType = BadgeType.BestAttempt;

    const { result } = renderHook(() => useQuizAttemptCRUD());

    await result.current.assignBadge("1", badgeType, "publicationId");

    expect(mockContextValue.assignBadge).toHaveBeenCalledWith("1", badgeType, "publicationId");
  });
});
