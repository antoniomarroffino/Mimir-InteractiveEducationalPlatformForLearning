import { describe, it, expect } from 'vitest';
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import {clampWeekNumber, generateWeekRanges} from '../folderUtils';

describe('generateWeekRanges utility', () => {
    it('should generate correct number of week ranges', () => {
        const startDate = '2024-01-01';
        const weeks = 3;

        const ranges = generateWeekRanges(startDate, weeks);

        expect(ranges.length).toBe(3);

        for (let i = 0; i < weeks; i++) {
            const expectedStart = startOfWeek(addWeeks(new Date(startDate), i), { weekStartsOn: 1 });
            const expectedEnd = endOfWeek(addWeeks(new Date(startDate), i), { weekStartsOn: 1 });

            expect(ranges[i].start).toEqual(expectedStart);
            expect(ranges[i].end).toEqual(expectedEnd);
        }
    });

    it('should handle 0 weeks returning empty array', () => {
        const ranges = generateWeekRanges('2024-01-01', 0);
        expect(ranges).toEqual([]);
    });

    it('should handle negative weeks returning empty array', () => {
        const ranges = generateWeekRanges('2024-01-01', -5);
        expect(ranges).toEqual([]);
    });
});

describe('clampWeekNumber utility', () => {
    it('should clamp values below 1 to 1', () => {
        expect(clampWeekNumber('-5')).toBe(1);
        expect(clampWeekNumber('0')).toBe(1);
    });

    it('should clamp values above 12 to 12', () => {
        expect(clampWeekNumber('15')).toBe(12);
        expect(clampWeekNumber('100')).toBe(12);
    });

    it('should allow values between 1 and 12 inclusive', () => {
        expect(clampWeekNumber('1')).toBe(1);
        expect(clampWeekNumber('6')).toBe(6);
        expect(clampWeekNumber('12')).toBe(12);
    });

    it('should return 0 for non-numeric input', () => {
        expect(clampWeekNumber('abc')).toBe(0);
        expect(clampWeekNumber('')).toBe(0);
        expect(clampWeekNumber(' ')).toBe(0);
    });
});
