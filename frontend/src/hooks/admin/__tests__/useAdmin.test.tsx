import { describe, expect, it, vi, afterAll } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useAdmin } from "../useAdmin";
import { AdminContext, AdminContextType } from "../../../contexts/AdminContext";
import { Role, UserWithoutCoursesDTO } from "@dti-isin/backend-api-client";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useAdmin", () => {
  const mockTeachers: UserWithoutCoursesDTO[] = [
    {
      email: "teacher1@example.com",
      role: Role.Teacher,
      name: "Teacher One",
    },
    {
      email: "teacher2@example.com",
      role: Role.Teacher,
      name: "Teacher Two",
    },
  ];

  const mockContextValue: AdminContextType = {
    isLoading: false,
    promoteUser: vi.fn(),
    error: null,
    teachers: mockTeachers,
    isLoadingTeachers: false,
    errorTeachers: null,
    fetchAllTeachers: vi.fn().mockResolvedValue(undefined),
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should throw error when context is undefined", () => {
    (useContext as any).mockReturnValue(undefined);

    expect(() => renderHook(() => useAdmin())).toThrowError(
      "useAdmin must be used within AdminProvider"
    );
  });

  it("should return context when available", () => {
    (useContext as any).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useAdmin());

    expect(result.current).toMatchObject(mockContextValue);
    expect(useContext).toHaveBeenCalledWith(AdminContext);
  });

  it("should maintain referential equality between renders", () => {
    (useContext as any).mockReturnValue(mockContextValue);

    const { result, rerender } = renderHook(() => useAdmin());
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should handle loading state", () => {
    const loadingContext: AdminContextType = {
      ...mockContextValue,
      isLoading: true,
    };

    (useContext as any).mockReturnValue(loadingContext);

    const { result } = renderHook(() => useAdmin());

    expect(result.current.isLoading).toBe(true);
  });

  it("should handle error state", () => {
    const errorContext: AdminContextType = {
      ...mockContextValue,
      error: new Error("Test error"),
    };

    (useContext as any).mockReturnValue(errorContext);

    const { result } = renderHook(() => useAdmin());

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Test error");
  });

  it("should handle teachers loading state", () => {
    const loadingTeachersContext: AdminContextType = {
      ...mockContextValue,
      isLoadingTeachers: true,
    };

    (useContext as any).mockReturnValue(loadingTeachersContext);

    const { result } = renderHook(() => useAdmin());

    expect(result.current.isLoadingTeachers).toBe(true);
  });

  it("should handle teachers error state", () => {
    const errorTeachersContext: AdminContextType = {
      ...mockContextValue,
      errorTeachers: new Error("Teachers error"),
    };

    (useContext as any).mockReturnValue(errorTeachersContext);

    const { result } = renderHook(() => useAdmin());

    expect(result.current.errorTeachers).toBeInstanceOf(Error);
    expect(result.current.errorTeachers?.message).toBe("Teachers error");
  });

  it("should handle promoteUser function", () => {
    const promoteUserMock = vi.fn();
    const promoteUserContext: AdminContextType = {
      ...mockContextValue,
      promoteUser: promoteUserMock,
    };

    (useContext as any).mockReturnValue(promoteUserContext);

    const { result } = renderHook(() => useAdmin());

    result.current.promoteUser("test@example.com", Role.Teacher);
    expect(promoteUserMock).toHaveBeenCalledTimes(1);
    expect(promoteUserMock).toHaveBeenCalledWith(
      "test@example.com",
      Role.Teacher
    );
  });

  it("should handle fetchAllTeachers function", async () => {
    const fetchAllTeachersMock = vi.fn().mockResolvedValue(undefined);
    const fetchTeachersContext: AdminContextType = {
      ...mockContextValue,
      fetchAllTeachers: fetchAllTeachersMock,
    };

    (useContext as any).mockReturnValue(fetchTeachersContext);

    const { result } = renderHook(() => useAdmin());

    await result.current.fetchAllTeachers();
    expect(fetchAllTeachersMock).toHaveBeenCalledTimes(1);
  });
});
