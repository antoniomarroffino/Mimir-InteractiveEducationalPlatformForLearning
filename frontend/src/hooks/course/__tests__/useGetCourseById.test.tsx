import { describe, expect, it, vi, afterAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetCourseById } from "../useGetCourseById";
import { courseApi } from "../../../../config/config";
import { CourseDTO } from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";

// Mock console.error to prevent error messages from appearing in the console
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock the courseApi
vi.mock("../../../../config/config", () => ({
  courseApi: {
    apiCoursesIdGet: vi.fn(),
  },
}));

describe("useGetCourseById", () => {
  const mockCourse: CourseDTO = {
    id: "1",
    name: "Test Course",
    description: "Test Description",
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

  it("should fetch course data successfully", async () => {
    (courseApi.apiCoursesIdGet as any).mockResolvedValueOnce({
      data: mockCourse,
    });

    const { result } = renderHook(() => useGetCourseById("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCourse);
    expect(courseApi.apiCoursesIdGet).toHaveBeenCalledWith({ id: "1" });
  });

  it("should handle error when fetching course data", async () => {
    const error = new Error("Failed to fetch course");
    (courseApi.apiCoursesIdGet as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useGetCourseById("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
