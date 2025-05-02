import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {describe, it, expect, vi, beforeEach, afterEach, Mock} from "vitest";
import { useContext } from "react";
import { QuizPublicationCRUDProvider } from "../QuizPublicationCRUDProvider";
import { QuizPublicationCRUDContext } from "../../../contexts/quizPublication/QuizPublicationCRUDContext";
import { quizPublicationApi } from "../../../../config/config";
import { QuizPublicationDTO } from "@dti-isin/backend-api-client";

// Mock delle API
vi.mock("../../../../config/config.ts", () => ({
    quizPublicationApi: {
        apiPublicationsPost: vi.fn(),
        apiPublicationsIdDelete: vi.fn(),
        apiPublicationsDeactivatePublicationIdPut: vi.fn(),
    },
}));

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

afterEach(() => {
    vi.clearAllMocks();
});

// Hook per accedere al context
const useTestHook = () => useContext(QuizPublicationCRUDContext);

const createWrapper = () => ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <QuizPublicationCRUDProvider>{children}</QuizPublicationCRUDProvider>
    </QueryClientProvider>
);

describe("QuizPublicationCRUDProvider", () => {
    const mockPublication: QuizPublicationDTO = {
        id: "pub-1",
        courseId: "course-1",
        folderId: "folder-1",
        quizId: "quiz-1",
        published: true,
        createdAt: new Date().toISOString(),
    };

    it("should create a quiz publication successfully", async () => {
        (quizPublicationApi.apiPublicationsPost as Mock).mockResolvedValue({ data: mockPublication });

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            const created = await result.current!.createPublication({
                courseId: "course-1",
                folderId: "folder-1",
                quizId: "quiz-1",
                questions: [],
            });
            expect(created).toEqual(mockPublication);
        });

        expect(quizPublicationApi.apiPublicationsPost).toHaveBeenCalled();
    });

    it("should deactivate a publication successfully", async () => {
        (quizPublicationApi.apiPublicationsDeactivatePublicationIdPut as Mock).mockResolvedValue({ data: mockPublication });

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            const updated = await result.current!.deactivatePublication("pub-1");
            expect(updated).toEqual(mockPublication);
        });

        expect(quizPublicationApi.apiPublicationsDeactivatePublicationIdPut).toHaveBeenCalledWith({ publicationId: "pub-1" });
    });

    it("should delete a publication successfully", async () => {
        (quizPublicationApi.apiPublicationsIdDelete as Mock).mockResolvedValue({});

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current!.deletePublication("pub-1");
        });

        expect(quizPublicationApi.apiPublicationsIdDelete).toHaveBeenCalledWith({ id: "pub-1" });
    });

    it("should handle creation error correctly", async () => {
        const error = new Error("Failed to create publication");
        (quizPublicationApi.apiPublicationsPost as Mock).mockRejectedValue(error);

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await expect(
            act(async () => {
                await result.current!.createPublication({
                    courseId: "course-1",
                    folderId: "folder-1",
                    quizId: "quiz-1",
                    questions: [],
                });
            })
        ).rejects.toThrow(error);
    });

    it("should handle deactivation error correctly", async () => {
        const error = new Error("Failed to deactivate publication");
        (quizPublicationApi.apiPublicationsDeactivatePublicationIdPut as Mock).mockRejectedValue(error);

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await expect(
            act(async () => {
                await result.current!.deactivatePublication("pub-1");
            })
        ).rejects.toThrow(error);
    });

    it("should handle deletion error correctly", async () => {
        const error = new Error("Failed to delete publication");
        (quizPublicationApi.apiPublicationsIdDelete as Mock).mockRejectedValue(error);

        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        await expect(
            act(async () => {
                await result.current!.deletePublication("pub-1");
            })
        ).rejects.toThrow(error);
    });
});
