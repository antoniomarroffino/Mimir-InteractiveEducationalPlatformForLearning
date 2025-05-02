import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, beforeEach } from "vitest";
import { QuizPublicationProviders } from "../QuizPublicationProviders";
import { QuizPublicationCRUDContext } from "../../../contexts/quizPublication/QuizPublicationCRUDContext";
import React from "react";

let queryClient: QueryClient;

// Inizializza un QueryClient fresco ad ogni test
beforeEach(() => {
    queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
});

// Componente di test che usa il context
const TestComponent = () => {
    const publicationContext = React.useContext(QuizPublicationCRUDContext);

    return (
        <div>
            <div data-testid="publication-context">
                {publicationContext ? "Publication Context Available" : "Publication Context Missing"}
            </div>
        </div>
    );
};

// Wrapper con QueryClientProvider
const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

describe("QuizPublicationProviders", () => {
    it("should provide QuizPublication CRUD context", () => {
        render(
            <Wrapper>
                <QuizPublicationProviders>
                    <TestComponent />
                </QuizPublicationProviders>
            </Wrapper>
        );

        expect(screen.getByTestId("publication-context")).toHaveTextContent("Publication Context Available");
    });

    it("should render children correctly", () => {
        render(
            <Wrapper>
                <QuizPublicationProviders>
                    <div>Test Child</div>
                </QuizPublicationProviders>
            </Wrapper>
        );

        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });
});
