import { render, screen, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from "vitest";
import { QuestionProviders } from "../QuestionProviders";
import { QuestionCRUDContext } from "../../../contexts/question/QuestionCRUDContext";
import React from "react";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("QuestionProviders", () => {
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
        const crudContext = React.useContext(QuestionCRUDContext);

        return (
            <div>
                <div data-testid="crud-context">
                    {crudContext
                        ? "CRUD Context Available"
                        : "CRUD Context Not Available"}
                </div>
            </div>
        );
    };

    it("should provide QuestionCRUDContext", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuestionProviders>
                    <TestComponent />
                </QuestionProviders>
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
                <QuestionProviders>
                    <div>Test Child</div>
                </QuestionProviders>
            </QueryClientProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(getByText("Test Child")).toBeInTheDocument();
    });
});
