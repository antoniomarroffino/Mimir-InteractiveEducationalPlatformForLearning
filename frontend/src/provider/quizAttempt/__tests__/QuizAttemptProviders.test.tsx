import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, beforeEach } from "vitest";
import { QuizAttemptProviders } from "../QuizAttemptProviders";
import { QuizAttemptCRUDContext } from "../../../contexts/quizAttempt/QuizAttemptCRUDContext";
import { QuizAttemptLocalContext } from "../../../contexts/quizAttempt/QuizAttemptLocalContext";
import React from "react";

let queryClient: QueryClient;

beforeEach(() => {
    queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
});

// Test component che accede ai context
const TestComponent = () => {
    const crudContext = React.useContext(QuizAttemptCRUDContext);
    const localContext = React.useContext(QuizAttemptLocalContext);

    return (
        <div>
            <div data-testid="crud-context">
                {crudContext ? "CRUD Context Available" : "CRUD Context Missing"}
            </div>
            <div data-testid="local-context">
                {localContext ? "Local Context Available" : "Local Context Missing"}
            </div>
        </div>
    );
};

describe("QuizAttemptProviders", () => {
    it("should provide both QuizAttempt CRUD and Local contexts", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuizAttemptProviders>
                    <TestComponent />
                </QuizAttemptProviders>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("crud-context")).toHaveTextContent("CRUD Context Available");
        expect(screen.getByTestId("local-context")).toHaveTextContent("Local Context Available");
    });

    it("should render children correctly", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuizAttemptProviders>
                    <div>Test Child</div>
                </QuizAttemptProviders>
            </QueryClientProvider>
        );

        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });
});
