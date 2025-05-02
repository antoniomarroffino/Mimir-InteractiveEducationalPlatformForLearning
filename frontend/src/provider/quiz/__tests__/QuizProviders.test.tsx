import { render, screen, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from "vitest";
import { QuizProviders } from "../QuizProviders";
import { QuizCRUDContext } from "../../../contexts/quiz/QuizCRUDContext";
import React from "react";

vi.mock("../../../../config/config.ts", () => ({
    quizApi: {
        apiCoursesCourseIdFoldersFolderIdQuizzesPost: vi.fn(),
        apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdPut: vi.fn(),
        apiCoursesCourseIdFoldersFolderIdQuizzesQuizIdDelete: vi.fn(),
    },
}));

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("QuizProviders", () => {
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
        const crudContext = React.useContext(QuizCRUDContext);

        return (
            <div>
                <div data-testid="crud-context">
                    {crudContext ? "CRUD Context Available" : "CRUD Context Not Available"}
                </div>
            </div>
        );
    };

    it("should provide QuizCRUDContext", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuizProviders>
                    <TestComponent />
                </QuizProviders>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("crud-context")).toHaveTextContent(
                "CRUD Context Available"
            );
        });
    });

    it("should render children correctly", async () => {
        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <QuizProviders>
                    <div>Test Child</div>
                </QuizProviders>
            </QueryClientProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(getByText("Test Child")).toBeInTheDocument();
    });
});
