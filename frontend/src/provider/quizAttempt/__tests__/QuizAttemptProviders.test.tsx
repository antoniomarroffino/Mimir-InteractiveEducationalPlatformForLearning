import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QuizAttemptProviders } from "../QuizAttemptProviders";
import { QuizAttemptCRUDContext } from "../../../contexts/quizAttempt/QuizAttemptCRUDContext";
import { QuizAttemptLocalContext } from "../../../contexts/quizAttempt/QuizAttemptLocalContext";
import React from "react";
import { AuthContext } from "../../../contexts/auth/AuthContext";
import { Role } from "@dti-isin/backend-api-client";
import { MemoryRouter } from "react-router-dom"; // 👈 Import MemoryRouter!

// Setup Query Client
let queryClient: QueryClient;

beforeEach(() => {
    queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
});

// Mock AuthContext user
const mockAuthValue = {
    user: {
        azureOid: "user-1",
        name: "Test User",
        email: "test@example.com",
        role: Role.Student,
    },
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    hasRole: vi.fn(),
};

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

// Wrapper con TUTTO: QueryClient, Auth, e Router!
const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuthValue}>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </AuthContext.Provider>
    </QueryClientProvider>
);

describe("QuizAttemptProviders", () => {
    it("should provide both QuizAttempt CRUD and Local contexts", () => {
        render(
            <Wrapper>
                <QuizAttemptProviders>
                    <TestComponent />
                </QuizAttemptProviders>
            </Wrapper>
        );

        expect(screen.getByTestId("crud-context")).toHaveTextContent("CRUD Context Available");
        expect(screen.getByTestId("local-context")).toHaveTextContent("Local Context Available");
    });

    it("should render children correctly", () => {
        render(
            <Wrapper>
                <QuizAttemptProviders>
                    <div>Test Child</div>
                </QuizAttemptProviders>
            </Wrapper>
        );

        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });
});
