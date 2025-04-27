import { render, screen, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from "vitest";
import { QuestionBankProviders } from "../QuestionBankProviders";
import { QuestionBankListContext } from "../../../contexts/questionBank/QuestionBankListContext";
import { QuestionBankCRUDContext } from "../../../contexts/questionBank/QuestionBankCRUDContext";
import React from "react";

// Mock API
vi.mock("../../../../config/config.ts", () => ({
    questionBankApi: {
        apiQuestionBanksGet: vi.fn().mockResolvedValue({ data: [] }),
        apiQuestionBanksPost: vi.fn(),
        apiQuestionBanksIdPut: vi.fn(),
        apiQuestionBanksIdDelete: vi.fn(),
        apiQuestionBanksIdReorderPatch: vi.fn(),
    },
}));

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("QuestionBankProviders", () => {
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
        const listContext = React.useContext(QuestionBankListContext);
        const crudContext = React.useContext(QuestionBankCRUDContext);

        return (
            <div>
                <div data-testid="list-context">
                    {listContext ? "List Context Available" : "List Context Not Available"}
                </div>
                <div data-testid="crud-context">
                    {crudContext ? "CRUD Context Available" : "CRUD Context Not Available"}
                </div>
            </div>
        );
    };

    it("should provide both QuestionBankList and QuestionBankCRUD contexts", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <QuestionBankProviders>
                    <TestComponent />
                </QuestionBankProviders>
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
                <QuestionBankProviders>
                    <div>Test Child</div>
                </QuestionBankProviders>
            </QueryClientProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(getByText("Test Child")).toBeInTheDocument();
    });
});
