import { renderHook, act } from "@testing-library/react";
import { vi, describe, expect, it, Mock, afterAll } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";
import { FolderDTO } from "@dti-isin/backend-api-client";
import React, { useContext } from "react";
import { FolderCRUDProvider } from "../FolderCRUDProvider";
import { FolderCRUDContext } from "../../../contexts/folder/FolderCRUDContext";
import { folderApi } from "../../../../config/config";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config.ts", () => ({
    folderApi: {
        apiCoursesCourseIdFoldersPost: vi.fn(),
        apiCoursesCourseIdFoldersFolderIdPut: vi.fn(),
        apiCoursesCourseIdFoldersFolderIdDelete: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <FolderCRUDProvider>{children}</FolderCRUDProvider>
        </QueryClientProvider>
    );
};

const useTestHook = () => useContext(FolderCRUDContext);

describe("FolderCRUDProvider", () => {
    const mockFolder: FolderDTO = {
        id: "folder-123",
        name: "Test Folder",
    };

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("Create Folder", () => {
        it("should handle successful creation", async () => {
            (folderApi.apiCoursesCourseIdFoldersPost as Mock).mockResolvedValue({
                data: mockFolder,
            });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.createFolder("course-123", mockFolder);
            });

            expect(folderApi.apiCoursesCourseIdFoldersPost).toHaveBeenCalledWith({
                courseId: "course-123",
                folderDTO: mockFolder,
            });
            expect(result.current!.isCreatingFolder).toBe(false);
        });

        it("should handle creation error", async () => {
            const error = new Error("Creation failed");
            (folderApi.apiCoursesCourseIdFoldersPost as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(result.current!.createFolder("course-123", mockFolder)).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Folder creation error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Folder creation failed:", error);
            expect(result.current!.errorCreateFolder).toEqual(error);
        });
    });

    describe("Update Folder", () => {
        it("should handle successful update", async () => {
            (folderApi.apiCoursesCourseIdFoldersFolderIdPut as Mock).mockResolvedValue({
                data: mockFolder,
            });

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.updateFolder("course-123", "folder-123", mockFolder);
            });

            expect(folderApi.apiCoursesCourseIdFoldersFolderIdPut).toHaveBeenCalledWith({
                courseId: "course-123",
                folderId: "folder-123",
                folderDTO: mockFolder,
            });
            expect(result.current!.isUpdatingFolder).toBe(false);
        });

        it("should handle update error", async () => {
            const error = new Error("Update failed");
            (folderApi.apiCoursesCourseIdFoldersFolderIdPut as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(
                    result.current!.updateFolder("course-123", "folder-123", mockFolder)
                ).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Folder update error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Folder update failed:", error);
            expect(result.current!.errorUpdateFolder).toEqual(error);
        });
    });

    describe("Delete Folder", () => {
        it("should handle successful deletion", async () => {
            (folderApi.apiCoursesCourseIdFoldersFolderIdDelete as Mock).mockResolvedValue({});

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await result.current!.deleteFolder("course-123", "folder-123");
            });

            expect(folderApi.apiCoursesCourseIdFoldersFolderIdDelete).toHaveBeenCalledWith({
                courseId: "course-123",
                folderId: "folder-123",
            });
            expect(result.current!.isDeletingFolder).toBe(false);
        });

        it("should handle delete error", async () => {
            const error = new Error("Delete failed");
            (folderApi.apiCoursesCourseIdFoldersFolderIdDelete as Mock).mockRejectedValue(error);

            const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

            await act(async () => {
                await expect(
                    result.current!.deleteFolder("course-123", "folder-123")
                ).rejects.toThrow(error);
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Folder delete error:", error);
            expect(consoleErrorSpy).toHaveBeenCalledWith("Folder deletion failed:", error);
            expect(result.current!.errorDeleteFolder).toEqual(error);
        });
    });

    it("should reflect correct loading states", async () => {
        const { result } = renderHook(() => useTestHook(), { wrapper: createWrapper() });

        (folderApi.apiCoursesCourseIdFoldersPost as Mock).mockImplementation(
            () => new Promise(() => {})
        );
        (folderApi.apiCoursesCourseIdFoldersFolderIdPut as Mock).mockImplementation(
            () => new Promise(() => {})
        );
        (folderApi.apiCoursesCourseIdFoldersFolderIdDelete as Mock).mockImplementation(
            () => new Promise(() => {})
        );

        await act(async () => {
            result.current!.createFolder("course-123", mockFolder);
            result.current!.updateFolder("course-123", "folder-123", mockFolder);
            result.current!.deleteFolder("course-123", "folder-123");

            await new Promise((resolve) => setTimeout(resolve, 10));
        });

        expect(result.current!.isCreatingFolder).toBe(true);
        expect(result.current!.isUpdatingFolder).toBe(true);
        expect(result.current!.isDeletingFolder).toBe(true);
    });

    it("should set cache correctly when updating folder without existing folders", async () => {
        const updatedFolder: FolderDTO = {
            id: "folder-123",
            name: "Updated Folder",
        };

        (folderApi.apiCoursesCourseIdFoldersFolderIdPut as Mock).mockResolvedValue({
            data: updatedFolder,
        });

        const queryClient = new QueryClient();
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <FolderCRUDProvider>{children}</FolderCRUDProvider>
            </QueryClientProvider>
        );

        const { result } = renderHook(() => useTestHook(), { wrapper });

        await act(async () => {
            await result.current!.updateFolder("course-123", "folder-123", updatedFolder);
        });
        const foldersCache = queryClient.getQueryData<FolderDTO[]>(["folders", "course-123"]);
        expect(foldersCache).toEqual([updatedFolder]);
    });

    it("should update folder correctly when folders exist", async () => {
        const initialFolder: FolderDTO = {
            id: "folder-123",
            name: "Initial Folder",
        };

        const updatedFolder: FolderDTO = {
            id: "folder-123",
            name: "Updated Folder",
        };

        const queryClient = new QueryClient();
        queryClient.setQueryData<FolderDTO[]>(["folders", "course-123"], [initialFolder]);

        (folderApi.apiCoursesCourseIdFoldersFolderIdPut as Mock).mockResolvedValue({
            data: updatedFolder,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <FolderCRUDProvider>{children}</FolderCRUDProvider>
            </QueryClientProvider>
        );

        const { result } = renderHook(() => useTestHook(), { wrapper });

        await act(async () => {
            await result.current!.updateFolder("course-123", "folder-123", updatedFolder);
        });

        const foldersCache = queryClient.getQueryData<FolderDTO[]>(["folders", "course-123"]);
        expect(foldersCache).toEqual([updatedFolder]);
    });

    it("should set folder correctly when no folders exist", async () => {
        const updatedFolder: FolderDTO = {
            id: "folder-123",
            name: "Updated Folder",
        };

        const queryClient = new QueryClient();

        (folderApi.apiCoursesCourseIdFoldersFolderIdPut as Mock).mockResolvedValue({
            data: updatedFolder,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <FolderCRUDProvider>{children}</FolderCRUDProvider>
            </QueryClientProvider>
        );

        const { result } = renderHook(() => useTestHook(), { wrapper });

        await act(async () => {
            await result.current!.updateFolder("course-123", "folder-123", updatedFolder);
        });

        const foldersCache = queryClient.getQueryData<FolderDTO[]>(["folders", "course-123"]);
        expect(foldersCache).toEqual([updatedFolder]);
    });


});
