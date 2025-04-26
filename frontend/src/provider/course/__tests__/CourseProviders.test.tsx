import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CourseProviders } from "../CourseProviders";
import { CourseListContext } from "../../../contexts/course/CourseListContext";
import { CourseCRUDContext } from "../../../contexts/course/CourseCRUDContext";
import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from "vitest";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

// Mock delle API esterne
vi.mock("../../../../config/config.ts", () => ({
  courseApi: {
    apiCoursesTeacherGet: vi.fn().mockResolvedValue({ data: [] }),
    apiCoursesAllGet: vi.fn().mockResolvedValue({ data: [] }),
    apiCoursesPost: vi.fn(),
    apiCoursesIdPut: vi.fn(),
    apiCoursesAssignIdPut: vi.fn(),
    apiCoursesLeftIdPut: vi.fn(),
    apiCoursesIdDelete: vi.fn(),
  },
}));

describe("CourseProviders", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  const TestComponent = () => {
    const listContext = React.useContext(CourseListContext);
    const crudContext = React.useContext(CourseCRUDContext);

    return (
      <div>
        <div data-testid="list-context">
          {listContext
            ? "List Context Available"
            : "List Context Not Available"}
        </div>
        <div data-testid="crud-context">
          {crudContext
            ? "CRUD Context Available"
            : "CRUD Context Not Available"}
        </div>
      </div>
    );
  };

  it("should provide both CourseList and CourseCRUD contexts", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseProviders>
          <TestComponent />
        </CourseProviders>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("list-context")).toHaveTextContent(
        "List Context Available"
      );
      expect(screen.getByTestId("crud-context")).toHaveTextContent(
        "CRUD Context Available"
      );
    });
  });

  it("should render children correctly", async () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <CourseProviders>
          <div>Test Child</div>
        </CourseProviders>
      </QueryClientProvider>
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(getByText("Test Child")).toBeInTheDocument();
  });
});
