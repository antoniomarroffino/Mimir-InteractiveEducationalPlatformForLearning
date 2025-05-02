import { describe, expect, it, vi, afterAll, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { badgeHolderApi } from "../../../../config/config";
import {
  BadgeHolderDTO,
  Role,
  UserWithoutCoursesDTO,
} from "@dti-isin/backend-api-client";
import { QueryClient, QueryClientProvider } from "react-query";
import { useGetBadgeHolderByAzureOid } from "../useGetBadgeHolderByAzureOid";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

vi.mock("../../../../config/config", () => ({
  badgeHolderApi: {
    apiBadgeHoldersAzureOIDGet: vi.fn(),
  },
}));

describe("useGetBadgeHolderByAzureOid", () => {
  const mockUser: UserWithoutCoursesDTO = {
    azureOid: "user1",
    name: "John Doe",
    email: "user1@example.com",
    role: Role.Student,
  };

  const mockBadgeHolder: BadgeHolderDTO = {
    id: "test-badge-holder-id",
    user: mockUser,
    badges: [],
  };

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should fetch badge holder data successfully", async () => {
    (badgeHolderApi.apiBadgeHoldersAzureOIDGet as Mock).mockResolvedValueOnce({
      data: mockBadgeHolder,
    });

    const { result } = renderHook(() => useGetBadgeHolderByAzureOid("user1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockBadgeHolder);
    expect(badgeHolderApi.apiBadgeHoldersAzureOIDGet).toHaveBeenCalledWith({
      azureOID: "user1",
    });
  });

  it("should handle error when fetching badge holder data", async () => {
    const error = new Error("Failed to fetch badge holder");
    (badgeHolderApi.apiBadgeHoldersAzureOIDGet as Mock).mockRejectedValueOnce(
      error
    );

    const { result } = renderHook(() => useGetBadgeHolderByAzureOid("user1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(error);
  });
});
