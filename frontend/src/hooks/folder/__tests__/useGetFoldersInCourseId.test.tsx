import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetFoldersInCourseId } from "../useGetFoldersInCourseId";
import { folderApi } from "../../../../config/config";
import { FolderDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock the folderApi
vi.mock("../../../../config/config", () => ({
  folderApi: {
    apiCoursesCourseIdFoldersGet: vi.fn(),
  },
}));

describe("useGetFoldersInCourseId", () => {
  const mockFolders: FolderDTO[] = [
    {
      id: "1",
      name: "Test Folder 1",
    },
    {
      id: "2",
      name: "Test Folder 2",
    },
  ];

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

  it("should fetch folders data successfully", async () => {
    (folderApi.apiCoursesCourseIdFoldersGet as Mock).mockResolvedValueOnce({
      data: mockFolders,
    });

    const { result } = renderHook(() => useGetFoldersInCourseId("course1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockFolders);
    expect(folderApi.apiCoursesCourseIdFoldersGet).toHaveBeenCalledWith({
      courseId: "course1",
    });
  });

  it("should return empty array when courseId is not provided", async () => {
    const { result } = renderHook(() => useGetFoldersInCourseId(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(folderApi.apiCoursesCourseIdFoldersGet).not.toHaveBeenCalled();
  });

  it("should handle error when fetching folders data", async () => {
    const error = new Error("Failed to fetch folders");
    (folderApi.apiCoursesCourseIdFoldersGet as Mock).mockRejectedValueOnce(
      error
    );

    const { result } = renderHook(() => useGetFoldersInCourseId("course1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
