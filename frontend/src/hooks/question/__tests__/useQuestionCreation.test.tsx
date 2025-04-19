import { afterAll, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuestionCreation } from "../useQuestionCreation";
import {
  QuestionDTO,
  QuestionType,
  TrueFalseQuestionDTO,
} from "@dti-isin/backend-api-client";
import { QuestionContext } from "../../../contexts/QuestionContext";
import { QuestionCRUDContext } from "../../../contexts/question/QuestionCRUDContext";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("useQuestionCreation", () => {
  const mockQuestion: QuestionDTO = {
    id: "test-question-id",
    questionText: "Test question",
    type: QuestionType.TrueFalse,
    points: 1,
  };

  const mockTrueFalseQuestion: TrueFalseQuestionDTO = {
    ...mockQuestion,
    correctAnswer: true,
  };

  const mockQuestionContextValue = {
    questions: [],
    isLoadingQuestions: false,
    errorQuestions: null,
    selectedQuestionId: null,
    setSelectedQuestionId: vi.fn(),
    createQuestionTemplate: vi.fn().mockResolvedValue(mockTrueFalseQuestion),
    addQuestionToQuiz: vi.fn().mockResolvedValue(mockQuestion),
    fetchQuestions: vi.fn().mockResolvedValue(undefined),
    isCreatingQuestion: false,
    errorCreateQuestion: null,
  };

  const mockQuestionCRUDContextValue = {
    createQuestion: vi.fn().mockResolvedValue(mockQuestion),
    updateQuestion: vi.fn().mockResolvedValue(mockQuestion),
    deleteQuestion: vi.fn().mockResolvedValue(undefined),
    createQuestionTemplate: vi.fn().mockResolvedValue(mockTrueFalseQuestion),
    isCreatingQuestion: false,
    isUpdatingQuestion: false,
    isDeletingQuestion: false,
    isCreatingQuestionTemplate: false,
    errorCreateQuestion: null,
    errorUpdateQuestion: null,
    errorDeleteQuestion: null,
    errorCreateQuestionTemplate: null,
  };

  const createWrapper = (
    questionContextValue = mockQuestionContextValue,
    questionCRUDContextValue = mockQuestionCRUDContextValue
  ) => {
    return ({ children }: { children: React.ReactNode }) => (
      <QuestionCRUDContext.Provider value={questionCRUDContextValue}>
        <QuestionContext.Provider value={questionContextValue}>
          {children}
        </QuestionContext.Provider>
      </QuestionCRUDContext.Provider>
    );
  };

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isCreatingQuestion).toBe(false);
    expect(result.current.selectedQuestionType).toBeNull();
    expect(result.current.questionTemplate).toBeNull();
    expect(result.current.draftQuestion).toEqual({});
    expect(result.current.error).toBeNull();
    expect(result.current.isEditingExistingQuestion).toBe(false);
  });

  it("should start question creation with default values", () => {
    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.startQuestionCreation();
    });

    expect(result.current.isCreatingQuestion).toBe(true);
    expect(result.current.isEditingExistingQuestion).toBe(false);
    expect(result.current.draftQuestion).toEqual({ questionText: "" });
    expect(result.current.selectedQuestionType).toBeNull();
    expect(result.current.questionTemplate).toBeNull();
  });

  it("should start question editing with existing question data", () => {
    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.startQuestionEditing(mockTrueFalseQuestion);
    });

    expect(result.current.isCreatingQuestion).toBe(true);
    expect(result.current.isEditingExistingQuestion).toBe(true);
    expect(result.current.selectedQuestionType).toBe(QuestionType.TrueFalse);
    expect(result.current.questionTemplate).toEqual(mockTrueFalseQuestion);
    expect(result.current.draftQuestion).toEqual({
      id: mockTrueFalseQuestion.id,
      questionText: mockTrueFalseQuestion.questionText,
      type: mockTrueFalseQuestion.type,
    });
  });

  it("should handle type selection and create template", async () => {
    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleTypeSelection(QuestionType.TrueFalse);
    });

    expect(result.current.selectedQuestionType).toBe(QuestionType.TrueFalse);
    expect(result.current.questionTemplate).toEqual(mockTrueFalseQuestion);
    expect(result.current.draftQuestion).toEqual({
      type: QuestionType.TrueFalse,
    });
    expect(
      mockQuestionCRUDContextValue.createQuestionTemplate
    ).toHaveBeenCalledWith(QuestionType.TrueFalse);
  });

  it("should handle type selection error with Error instance", async () => {
    const error = new Error("Failed to create template");
    const contextWithError = {
      ...mockQuestionCRUDContextValue,
      createQuestionTemplate: vi.fn().mockRejectedValue(error),
    };

    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(undefined, contextWithError),
    });

    await act(async () => {
      await result.current.handleTypeSelection(QuestionType.TrueFalse);
    });

    expect(result.current.error).toBe(error.message);
  });

  it("should handle type selection error with non-Error instance", async () => {
    const contextWithError = {
      ...mockQuestionCRUDContextValue,
      createQuestionTemplate: vi
        .fn()
        .mockRejectedValue("Failed to create template"),
    };

    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(undefined, contextWithError),
    });

    await act(async () => {
      await result.current.handleTypeSelection(QuestionType.TrueFalse);
    });

    expect(result.current.error).toBe("Failed to create question template");
  });

  it("should handle saving a new question", async () => {
    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleSaveQuestion(mockQuestion);
    });

    expect(mockQuestionCRUDContextValue.createQuestion).toHaveBeenCalledWith(
      mockQuestion
    );
    expect(result.current.isCreatingQuestion).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle updating an existing question", async () => {
    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.startQuestionEditing(mockQuestion);
    });

    await act(async () => {
      await result.current.handleSaveQuestion(mockQuestion);
    });

    expect(mockQuestionCRUDContextValue.updateQuestion).toHaveBeenCalledWith(
      mockQuestion.id,
      mockQuestion
    );
    expect(result.current.isCreatingQuestion).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle save error with Error instance", async () => {
    const error = new Error("Failed to save question");
    const contextWithError = {
      ...mockQuestionCRUDContextValue,
      createQuestion: vi.fn().mockRejectedValue(error),
    };

    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(undefined, contextWithError),
    });

    await act(async () => {
      await result.current.handleSaveQuestion(mockQuestion);
    });

    expect(result.current.error).toBe(error.message);
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });

  it("should handle save error with non-Error instance", async () => {
    const contextWithError = {
      ...mockQuestionCRUDContextValue,
      createQuestion: vi.fn().mockRejectedValue("Failed to save question"),
    };

    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(undefined, contextWithError),
    });

    await act(async () => {
      await result.current.handleSaveQuestion(mockQuestion);
    });

    expect(result.current.error).toBe("Failed to save question");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to save question");
  });

  it("should reset question creation state", () => {
    const { result } = renderHook(() => useQuestionCreation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.startQuestionCreation();
      result.current.resetQuestionCreation();
    });

    expect(result.current.isCreatingQuestion).toBe(false);
    expect(result.current.isEditingExistingQuestion).toBe(false);
    expect(result.current.selectedQuestionType).toBeNull();
    expect(result.current.questionTemplate).toBeNull();
    expect(result.current.draftQuestion).toEqual({});
  });
});
