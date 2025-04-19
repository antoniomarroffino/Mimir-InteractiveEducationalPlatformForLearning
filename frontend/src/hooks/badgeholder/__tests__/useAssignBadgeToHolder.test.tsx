import { QueryClient, QueryClientProvider } from "react-query";
import { describe, it, beforeEach, expect, vi, Mock, afterAll } from "vitest";
import { BadgeType } from "@dti-isin/backend-api-client";
import { badgeHolderApi } from "../../../../config/config";
import { useAssignBadgeToHolder } from "../useAssignBadgeToHolder";
import { act, renderHook } from "@testing-library/react";

const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});


describe("useAssignBadgeToHolder", () => {
  let queryClient: QueryClient;
  let apiMock: Mock;

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.clear();

    apiMock = vi.fn();
    badgeHolderApi.apiBadgeHoldersAzureOIDBadgesPost = apiMock;
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should return mutate and mutateAsync functions", () => {
    const { result } = renderHook(() => useAssignBadgeToHolder(), { wrapper });
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutateAsync).toBe("function");
  });

  it("calls API with correct params and invalidates queries on success", async () => {
    const azureOID = "test-oid";
    const badgeType = BadgeType.BestAttempt;
    const assignedBy = "user-123";
    apiMock.mockResolvedValue({ success: true });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useAssignBadgeToHolder(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ azureOID, badgeType, assignedBy });
    });

    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(apiMock).toHaveBeenCalledWith({
      azureOID,
      badgeDTO: {
        type: badgeType,
        assignedBy: { azureOid: assignedBy },
        assignedAt: expect.any(String),
      },
    });

    expect(invalidateSpy).toHaveBeenCalledWith(["badgeHolders"]);
    expect(invalidateSpy).toHaveBeenCalledWith(["badgeHolders", azureOID]);
    expect(invalidateSpy).toHaveBeenCalledWith(["quizAttempts"]);
  });

  it("logs error and rethrows on API failure", async () => {
    const azureOID = "fail-oid";
    const badgeType = BadgeType.BestAttempt;
    const assignedBy = "user-456";
    const error = new Error("API failed");
    apiMock.mockRejectedValue(error);
    const { result } = renderHook(() => useAssignBadgeToHolder(), { wrapper });

    await expect(
      act(async () => {
        await result.current.mutateAsync({ azureOID, badgeType, assignedBy });
      })
    ).rejects.toThrow("API failed");
  });
});
