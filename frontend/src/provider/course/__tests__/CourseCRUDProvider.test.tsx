import { renderHook, act } from "@testing-library/react";
import { vi, describe, expect, it, Mock, afterAll } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";
import type { CourseDTO } from "@dti-isin/backend-api-client";
import { useContext } from "react";
import { CourseCRUDProvider } from "../CourseCRUDProvider";
import { CourseCRUDContext } from "../../../contexts/course/CourseCRUDContext";
import { courseApi } from "../../../../config/config";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config.ts", () => ({
  courseApi: {
    apiCoursesPost: vi.fn(),
    apiCoursesIdPut: vi.fn(),
    apiCoursesAssignIdPut: vi.fn(),
    apiCoursesLeftIdPut: vi.fn(),
    apiCoursesIdDelete: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CourseCRUDProvider>{children}</CourseCRUDProvider>
    </QueryClientProvider>
  );
};

const useTestHook = () => useContext(CourseCRUDContext);

describe("CourseCRUDProvider", () => {
  const mockCourse: CourseDTO = {
    id: "course-123",
    name: "Test Course",
    description: "Test Description",
  };

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("Create Course", () => {
    it("should handle successful creation", async () => {
      (courseApi.apiCoursesPost as Mock).mockResolvedValue({
        data: mockCourse,
      });
      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current!.createCourse(mockCourse);
      });

      expect(courseApi.apiCoursesPost).toHaveBeenCalledWith({
        courseDTO: mockCourse,
      });
      expect(result.current!.isCreatingCourse).toBe(false);
    });

    it("should handle creation error", async () => {
      const error = new Error("Creation failed");
      (courseApi.apiCoursesPost as Mock).mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error");

      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await expect(result.current!.createCourse(mockCourse)).rejects.toThrow(
          error
        );
      });

      expect(consoleSpy).toHaveBeenCalledWith("Course creation error:", error);
      expect(consoleSpy).toHaveBeenCalledWith("Course creation failed:", error);
      expect(result.current!.errorCreateCourse).toEqual(error);
    });
  });

  describe("Update Course", () => {
    it("should handle successful update", async () => {
      (courseApi.apiCoursesIdPut as Mock).mockResolvedValue({
        data: mockCourse,
      });
      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current!.updateCourse("course-123", mockCourse);
      });

      expect(courseApi.apiCoursesIdPut).toHaveBeenCalledWith({
        id: "course-123",
        courseDTO: mockCourse,
      });
      expect(result.current!.isUpdatingCourse).toBe(false);
    });

    it("should update cache and invalidate queries on successful update", async () => {
      const updatedCourse = { ...mockCourse, name: "Updated Name" };
      const queryClient = new QueryClient();

      // Imposta dati iniziali nella cache
      queryClient.setQueryData<CourseDTO[]>(["courses"], [mockCourse]);
      queryClient.setQueryData(["course", mockCourse.id], mockCourse);

      (courseApi.apiCoursesIdPut as Mock).mockResolvedValue({
        data: updatedCourse,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <CourseCRUDProvider>{children}</CourseCRUDProvider>
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useTestHook(), { wrapper });

      await act(async () => {
        await result.current!.updateCourse(mockCourse.id, updatedCourse);
      });

      // Verifica l'aggiornamento della cache
      const coursesCache = queryClient.getQueryData<CourseDTO[]>(["courses"]);
      const singleCourseCache = queryClient.getQueryData([
        "course",
        mockCourse.id,
      ]);

      expect(coursesCache).toEqual([updatedCourse]);
      expect(singleCourseCache).toEqual(updatedCourse);
    });
  });

  describe("Assign Course", () => {
    it("should handle successful assignment", async () => {
      (courseApi.apiCoursesAssignIdPut as Mock).mockResolvedValue({});
      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current!.assignCourse("course-123");
      });

      expect(courseApi.apiCoursesAssignIdPut).toHaveBeenCalledWith({
        id: "course-123",
      });
      expect(result.current!.isAssigningCourse).toBe(false);
    });
  });

  describe("Delete Course", () => {
    it("should handle successful deletion", async () => {
      (courseApi.apiCoursesIdDelete as Mock).mockResolvedValue({});
      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current!.deleteCourse("course-123");
      });

      expect(courseApi.apiCoursesIdDelete).toHaveBeenCalledWith({
        id: "course-123",
      });
      expect(result.current!.isDeletingCourse).toBe(false);
    });
  });

  it("should reflect correct loading states", async () => {
    const apiMocks = {
      create: courseApi.apiCoursesPost as Mock,
      update: courseApi.apiCoursesIdPut as Mock,
      assign: courseApi.apiCoursesAssignIdPut as Mock,
      delete: courseApi.apiCoursesIdDelete as Mock,
    };

    Object.values(apiMocks).forEach((mock) =>
      mock.mockImplementation(() => new Promise(() => {}))
    );

    const { result } = renderHook(() => useTestHook(), {
      wrapper: createWrapper(),
    });

    // 2. Esecuzione mutazioni con gestione asincroa
    await act(async () => {
      result.current!.createCourse(mockCourse);
      result.current!.updateCourse("course-123", mockCourse);
      result.current!.assignCourse("course-123");
      result.current!.deleteCourse("course-123");

      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current).toMatchObject({
      isCreatingCourse: true,
      isUpdatingCourse: true,
      isAssigningCourse: true,
      isDeletingCourse: true,
    });
  });

  it("should update query cache after creation", async () => {
    (courseApi.apiCoursesPost as Mock).mockResolvedValue({ data: mockCourse });
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <CourseCRUDProvider>{children}</CourseCRUDProvider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useTestHook(), { wrapper });

    await act(async () => {
      await result.current!.createCourse(mockCourse);
    });

    expect(queryClient.getQueryData<CourseDTO[]>(["courses"])).toContainEqual(
      mockCourse
    );
  });

  describe("Left Course", () => {
    it("should handle successful course leave", async () => {
      (courseApi.apiCoursesLeftIdPut as Mock).mockResolvedValue({});
      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current!.leftCourse("course-123");
      });

      expect(courseApi.apiCoursesLeftIdPut).toHaveBeenCalledWith({
        id: "course-123",
      });
      expect(result.current!.isLeftCourse).toBe(false);
    });

    it("should handle left course error", async () => {
      const error = new Error("Leave failed");
      (courseApi.apiCoursesLeftIdPut as Mock).mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error");

      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await expect(result.current!.leftCourse("course-123")).rejects.toThrow(
          error
        );
      });

      expect(consoleSpy).toHaveBeenCalledWith("Course left error:", error);
      expect(consoleSpy).toHaveBeenCalledWith("Course left failed:", error);
      expect(result.current!.errorLeftCourse).toEqual(error);
    });
  });

  describe("Error States", () => {
    it("should handle update course error", async () => {
      const error = new Error("Update failed");
      (courseApi.apiCoursesIdPut as Mock).mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error");

      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await expect(
          result.current!.updateCourse("course-123", mockCourse)
        ).rejects.toThrow(error);
      });

      expect(consoleSpy).toHaveBeenCalledWith("Course update error:", error);
      expect(consoleSpy).toHaveBeenCalledWith("Course update failed:", error);
      expect(result.current!.errorUpdateCourse).toEqual(error);
    });

    it("should handle assign course error", async () => {
      const error = new Error("Assign failed");
      (courseApi.apiCoursesAssignIdPut as Mock).mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error");

      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await expect(
          result.current!.assignCourse("course-123")
        ).rejects.toThrow(error);
      });

      expect(consoleSpy).toHaveBeenCalledWith("Course assign error:", error);
      expect(consoleSpy).toHaveBeenCalledWith("Course assign failed:", error);
      expect(result.current!.errorAssignCourse).toEqual(error);
    });

    it("should handle delete course error", async () => {
      const error = new Error("Delete failed");
      (courseApi.apiCoursesIdDelete as Mock).mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error");

      const { result } = renderHook(() => useTestHook(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await expect(
          result.current!.deleteCourse("course-123")
        ).rejects.toThrow(error);
      });

      expect(consoleSpy).toHaveBeenCalledWith("Course delete error:", error);
      expect(consoleSpy).toHaveBeenCalledWith("Course deletion failed:", error);
      expect(result.current!.errorDeleteCourse).toEqual(error);
    });
  });
});
