import {BadgeDTO, BadgeType} from '@dti-isin/backend-api-client';

export interface GroupedBadge {
    type: BadgeType | undefined;
    count: number;
    badges: BadgeDTO[];
    latestDate: string | undefined;
}

export function groupBadges(badges: BadgeDTO[]): GroupedBadge[] {
    const grouped = badges.reduce((acc, badge) => {
        const key = badge.type;
        const assignedAt = badge.assignedAt || new Date().toISOString();

        if (key && !acc[key]) {
            acc[key] = {
                type: key,
                count: 0,
                badges: [],
                latestDate: assignedAt,
            };
        }

        if (key) {
            acc[key].count++;
            acc[key].badges.push(badge);
            const current = new Date(assignedAt);
            const existing = new Date(acc[key].latestDate!);
            acc[key].latestDate = current > existing ? assignedAt : acc[key].latestDate;
        }

        return acc;
    }, {} as Record<string, GroupedBadge>);

    return Object.values(grouped);
}

export function formatBadgeDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString("it-CH") : 'N/A';
}
