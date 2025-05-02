import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { FolderProviders } from "../FolderProviders";
import { FolderCRUDContext } from "../../../contexts/folder/FolderCRUDContext";
import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from "vitest";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

describe("FolderProviders", () => {
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
        const crudContext = React.useContext(FolderCRUDContext);

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

    it("should provide FolderCRUDContext", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <FolderProviders>
                    <TestComponent />
                </FolderProviders>
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
                <FolderProviders>
                    <div>Test Child</div>
                </FolderProviders>
            </QueryClientProvider>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        expect(getByText("Test Child")).toBeInTheDocument();
    });
});
