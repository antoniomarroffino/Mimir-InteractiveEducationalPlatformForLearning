import { describe, it, expect } from "vitest";
import { groupBadges, formatBadgeDate } from "../badgeUtils";
import { BadgeDTO, BadgeType, UserWithoutCoursesDTO, Role } from "@dti-isin/backend-api-client";


const mockUser: UserWithoutCoursesDTO = {
    azureOid: "user-123",
    name: "Test User",
    email: "testuser@example.com",
    role: "Student" as Role,
};

describe("groupBadges utility", () => {
    it("should group BestAttempt badges correctly", () => {
        const badges: BadgeDTO[] = [
            { type: BadgeType.BestAttempt, assignedAt: "2024-04-20T10:00:00Z", assignedBy: mockUser },
            { type: BadgeType.BestAttempt, assignedAt: "2024-04-21T12:00:00Z", assignedBy: mockUser },
        ];

        const grouped = groupBadges(badges);

        expect(grouped.length).toBe(1);
        expect(grouped[0].type).toBe(BadgeType.BestAttempt);
        expect(grouped[0].count).toBe(2);
        expect(grouped[0].badges.length).toBe(2);
        expect(grouped[0].latestDate).toBe("2024-04-21T12:00:00Z");
    });

    it("should handle BestAttempt badge without assignedAt by setting current date", () => {
        const badges: BadgeDTO[] = [
            { type: BadgeType.BestAttempt, assignedBy: mockUser },
        ];

        const grouped = groupBadges(badges);

        expect(grouped.length).toBe(1);
        expect(grouped[0].badges.length).toBe(1);
        expect(grouped[0].type).toBe(BadgeType.BestAttempt);
        expect(grouped[0].latestDate).toBeDefined();
    });

    it("should return empty array when no badges are provided", () => {
        const grouped = groupBadges([]);
        expect(grouped).toEqual([]);
    });
});

describe("formatBadgeDate utility", () => {
    it("should format a valid date string", () => {
        const date = "2024-04-25T10:30:00Z";
        const formatted = formatBadgeDate(date);
        expect(typeof formatted).toBe("string");
        expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should return 'N/A' when date is undefined", () => {
        expect(formatBadgeDate(undefined)).toBe("N/A");
    });

    it("should handle invalid dates gracefully", () => {
        const formatted = formatBadgeDate("invalid-date-string");
        expect(typeof formatted).toBe("string");
        expect(formatted).toBe("Invalid Date");
    });
});
