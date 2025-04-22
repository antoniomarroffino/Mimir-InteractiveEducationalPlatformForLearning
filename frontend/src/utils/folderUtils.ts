import { addWeeks, startOfWeek, endOfWeek } from 'date-fns';

export const generateWeekRanges = (startDate: string, weeks: number) => {
    const ranges = [];
    let current = new Date(startDate);

    for (let i = 0; i < weeks; i++) {
        ranges.push({
            start: startOfWeek(current, { weekStartsOn: 1 }),
            end: endOfWeek(current, { weekStartsOn: 1 }),
        });
        current = addWeeks(current, 1);
    }

    return ranges;
};

export const clampWeekNumber = (input: string) => {
    const value = parseInt(input, 10);
    if (isNaN(value)) return 0;
    return Math.min(12, Math.max(1, value));
};
