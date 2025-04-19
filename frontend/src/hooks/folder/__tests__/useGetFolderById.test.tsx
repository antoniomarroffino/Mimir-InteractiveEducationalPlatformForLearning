import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetFolderById } from "../useGetFolderById";
import { folderApi } from "../../../../config/config";
import { FolderDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock the folderApi
vi.mock("../../../../config/config", () => ({
  folderApi: {
    apiCoursesCourseIdFoldersFolderIdGet: vi.fn(),
  },
}));

describe("useGetFolderById", () => {
  const mockFolder: FolderDTO = {
    id: "1",
    name: "Test Folder",
  };

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  // Clean up console.error mock after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should fetch folder data successfully", async () => {
    (
      folderApi.apiCoursesCourseIdFoldersFolderIdGet as Mock
    ).mockResolvedValueOnce({ data: mockFolder });

    const { result } = renderHook(() => useGetFolderById("course1", "1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockFolder);
    expect(folderApi.apiCoursesCourseIdFoldersFolderIdGet).toHaveBeenCalledWith(
      {
        courseId: "course1",
        folderId: "1",
      }
    );
  });

  it("should handle error when fetching folder data", async () => {
    const error = new Error("Failed to fetch folder");
    (
      folderApi.apiCoursesCourseIdFoldersFolderIdGet as Mock
    ).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useGetFolderById("course1", "1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
