import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CourseListProvider } from "../CourseListProvider";
import { CourseListContext } from "../../../contexts/course/CourseListContext";
import { courseApi } from "../../../../config/config";
import { CourseDTO } from "@dti-isin/backend-api-client";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the courseApi
vi.mock("../../../../config/config", () => ({
  courseApi: {
    apiCoursesTeacherGet: vi.fn(),
    apiCoursesGet: vi.fn(),
  },
}));

describe("CourseListProvider", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const mockCourses: CourseDTO[] = [
    { id: "1", name: "Course 1", description: "Description 1" },
    { id: "2", name: "Course 2", description: "Description 2" },
  ];

  const TestComponent = () => {
    const context = React.useContext(CourseListContext);
    if (!context) return null;

    return (
      <div>
        <div data-testid="teacher-courses">
          {context.teacherCourses.map((course) => course.name).join(", ")}
        </div>
        <div data-testid="all-courses">
          {context.allCourses.map((course) => course.name).join(", ")}
        </div>
        <div data-testid="loading-teacher">
          {context.isLoadingTeacherCourses ? "Loading" : "Not Loading"}
        </div>
        <div data-testid="loading-all">
          {context.isLoadingAllCourses ? "Loading" : "Not Loading"}
        </div>
      </div>
    );
  };

  it("should provide teacher courses data", async () => {
    (courseApi.apiCoursesTeacherGet as any).mockResolvedValueOnce({
      data: mockCourses,
    });
    (courseApi.apiCoursesGet as any).mockResolvedValueOnce({ data: [] });

    render(
      <QueryClientProvider client={queryClient}>
        <CourseListProvider>
          <TestComponent />
        </CourseListProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("teacher-courses")).toHaveTextContent(
        "Course 1, Course 2"
      );
    });
  });

  it("should provide all courses data", async () => {
    (courseApi.apiCoursesTeacherGet as any).mockResolvedValueOnce({
      data: [],
    });
    (courseApi.apiCoursesGet as any).mockResolvedValueOnce({
      data: mockCourses,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CourseListProvider>
          <TestComponent />
        </CourseListProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("all-courses")).toHaveTextContent(
        "Course 1, Course 2"
      );
    });
  });

  it("should show loading state", () => {
    (courseApi.apiCoursesTeacherGet as any).mockImplementation(
      () => new Promise(() => {})
    );
    (courseApi.apiCoursesGet as any).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <QueryClientProvider client={queryClient}>
        <CourseListProvider>
          <TestComponent />
        </CourseListProvider>
      </QueryClientProvider>
    );

    expect(screen.getByTestId("loading-teacher")).toHaveTextContent("Loading");
    expect(screen.getByTestId("loading-all")).toHaveTextContent("Loading");
  });

  it("should handle errors gracefully", async () => {
    const teacherError = new Error("Teacher error");
    const allError = new Error("All error");

    (courseApi.apiCoursesTeacherGet as any).mockRejectedValue(teacherError);
    (courseApi.apiCoursesGet as any).mockRejectedValue(allError);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <CourseListProvider>
          <TestComponent />
        </CourseListProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(teacherError);
      expect(consoleSpy).toHaveBeenCalledWith(allError);
    });

    consoleSpy.mockRestore();
  });

  it("should handle separate loading states", async () => {
    (courseApi.apiCoursesTeacherGet as any).mockResolvedValue({ data: [] });
    (courseApi.apiCoursesGet as any).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <QueryClientProvider client={queryClient}>
        <CourseListProvider>
          <TestComponent />
        </CourseListProvider>
      </QueryClientProvider>
    );

    expect(screen.getByTestId("loading-teacher")).toHaveTextContent("Loading");
    expect(screen.getByTestId("loading-all")).toHaveTextContent("Loading");
  });

  it("should refetch teacher courses", async () => {
    const mock = (courseApi.apiCoursesTeacherGet as any).mockResolvedValue({
      data: mockCourses,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CourseListProvider>
          <TestComponent />
        </CourseListProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(mock).toHaveBeenCalledTimes(1));

    await act(async () => {
      await queryClient.refetchQueries(["teacherCourses"]);
    });

    expect(mock).toHaveBeenCalledTimes(2);
  });

  it("should refetch all courses", async () => {
    const mock = (courseApi.apiCoursesGet as any).mockResolvedValue({
      data: mockCourses,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CourseListProvider>
          <TestComponent />
        </CourseListProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(mock).toHaveBeenCalledTimes(1));

    await act(async () => {
      await queryClient.refetchQueries(["allCourses"]);
    });

    expect(mock).toHaveBeenCalledTimes(2);
  });
});
