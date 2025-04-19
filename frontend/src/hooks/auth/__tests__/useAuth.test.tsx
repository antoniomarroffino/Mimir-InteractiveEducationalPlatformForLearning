import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useAuth } from "../useAuth";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";
import { Role, UserWithoutCoursesDTO } from "@dti-isin/backend-api-client";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useAuth", () => {
  const mockUser: UserWithoutCoursesDTO = {
    email: "test@example.com",
    role: Role.Admin,
    name: "Test User",
  };

  const mockContextValue: AuthContextType = {
    user: mockUser,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    hasRole: vi.fn().mockImplementation((role: Role) => mockUser.role === role),
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should throw error when context is undefined", () => {
    (useContext as Mock).mockReturnValue(undefined);

    expect(() => renderHook(() => useAuth())).toThrowError(
      "useAuth must be used within AuthProvider"
    );
  });

  it("should return context when available", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useAuth());

    expect(result.current).toMatchObject(mockContextValue);
    expect(useContext).toHaveBeenCalledWith(AuthContext);
  });

  it("should maintain referential equality between renders", () => {
    (useContext as Mock).mockReturnValue(mockContextValue);

    const { result, rerender } = renderHook(() => useAuth());
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should handle loading state", () => {
    const loadingContext: AuthContextType = {
      ...mockContextValue,
      isLoading: true,
    };

    (useContext as Mock).mockReturnValue(loadingContext);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
  });

  it("should handle role checking for different roles", () => {
    const studentUser: UserWithoutCoursesDTO = {
      ...mockUser,
      role: Role.Student,
    };

    const studentContext: AuthContextType = {
      ...mockContextValue,
      user: studentUser,
      hasRole: vi
        .fn()
        .mockImplementation((role: Role) => studentUser.role === role),
    };

    (useContext as Mock).mockReturnValue(studentContext);

    const { result } = renderHook(() => useAuth());

    expect(result.current.hasRole(Role.Student)).toBe(true);
    expect(result.current.hasRole(Role.Admin)).toBe(false);
  });

  it("should handle login function", () => {
    const loginMock = vi.fn();
    const loginContext: AuthContextType = {
      ...mockContextValue,
      login: loginMock,
    };

    (useContext as Mock).mockReturnValue(loginContext);

    const { result } = renderHook(() => useAuth());

    result.current.login();
    expect(loginMock).toHaveBeenCalledTimes(1);
  });

  it("should handle logout function", () => {
    const logoutMock = vi.fn();
    const logoutContext: AuthContextType = {
      ...mockContextValue,
      logout: logoutMock,
    };

    (useContext as Mock).mockReturnValue(logoutContext);

    const { result } = renderHook(() => useAuth());

    result.current.logout();
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it("should handle error in role checking", () => {
    const errorContext: AuthContextType = {
      ...mockContextValue,
      hasRole: vi.fn().mockImplementation(() => {
        throw new Error("Role check error");
      }),
    };

    (useContext as Mock).mockReturnValue(errorContext);

    const { result } = renderHook(() => useAuth());

    expect(() => result.current.hasRole(Role.Admin)).toThrow(
      "Role check error"
    );
  });
});
