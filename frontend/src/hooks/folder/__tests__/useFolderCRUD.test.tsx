import { describe, expect, it, vi, afterAll } from "vitest";
import { renderHook } from "@testing-library/react";
import { useContext } from "react";
import { useFolderCRUD } from "../useFolderCRUD";
import {
  FolderCRUDContext,
  FolderCRUDContextType,
} from "../../../contexts/folder/FolderCRUDContext";
import { FolderDTO } from "@dti-isin/backend-api-client";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("react", () => ({
  ...vi.importActual("react"),
  useContext: vi.fn(),
  createContext: vi.fn(),
}));

describe("useFolderCRUD", () => {
  const mockFolder: FolderDTO = {
    id: "1",
    name: "Test Folder",
  };

  const mockContextValue: FolderCRUDContextType = {
    createFolder: vi.fn().mockResolvedValue(mockFolder),
    updateFolder: vi.fn().mockResolvedValue(mockFolder),
    deleteFolder: vi.fn().mockResolvedValue(undefined),
    isCreatingFolder: false,
    isUpdatingFolder: false,
    isDeletingFolder: false,
    errorCreateFolder: null,
    errorUpdateFolder: null,
    errorDeleteFolder: null,
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should throw error when context is undefined", () => {
    (useContext as any).mockReturnValue(undefined);

    expect(() => renderHook(() => useFolderCRUD())).toThrowError(
      "useFolderCRUD must be used within a FolderCRUDProvider"
    );
  });

  it("should return context when available", () => {
    (useContext as any).mockReturnValue(mockContextValue);

    const { result } = renderHook(() => useFolderCRUD());

    expect(result.current).toMatchObject(mockContextValue);
    expect(useContext).toHaveBeenCalledWith(FolderCRUDContext);
  });

  it("should maintain referential equality between renders", () => {
    (useContext as any).mockReturnValue(mockContextValue);

    const { result, rerender } = renderHook(() => useFolderCRUD());
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });

  it("should handle context with error states", () => {
    const errorContextValue: FolderCRUDContextType = {
      ...mockContextValue,
      errorCreateFolder: new Error("Create error"),
      errorUpdateFolder: new Error("Update error"),
      errorDeleteFolder: new Error("Delete error"),
    };

    (useContext as any).mockReturnValue(errorContextValue);

    const { result } = renderHook(() => useFolderCRUD());

    expect(result.current.errorCreateFolder).toBeInstanceOf(Error);
    expect(result.current.errorUpdateFolder).toBeInstanceOf(Error);
    expect(result.current.errorDeleteFolder).toBeInstanceOf(Error);
  });

  it("should handle context with loading states", () => {
    const loadingContextValue: FolderCRUDContextType = {
      ...mockContextValue,
      isCreatingFolder: true,
      isUpdatingFolder: true,
      isDeletingFolder: true,
    };

    (useContext as any).mockReturnValue(loadingContextValue);

    const { result } = renderHook(() => useFolderCRUD());

    expect(result.current.isCreatingFolder).toBe(true);
    expect(result.current.isUpdatingFolder).toBe(true);
    expect(result.current.isDeletingFolder).toBe(true);
  });
});
