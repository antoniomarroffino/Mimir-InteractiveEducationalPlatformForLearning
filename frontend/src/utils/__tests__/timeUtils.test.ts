import { describe, expect, it } from 'vitest';
import {
    formatQuestionTime,
    calculateDurationInSeconds,
    formatDuration,
    formatMinutesDuration,
    formatDateTime
} from "../timeUtils.ts";

describe('formatQuestionTime utility', () => {
    it('should handle undefined input', () => {
        expect(formatQuestionTime(undefined)).toBe('0:00');
    });

    it('should return 0:00 for 0 seconds', () => {
        expect(formatQuestionTime(0)).toBe('0:00');
    });

    it('should format seconds under a minute correctly', () => {
        expect(formatQuestionTime(45)).toBe('0:45');
    });

    it('should format exactly one minute as 1:00', () => {
        expect(formatQuestionTime(60)).toBe('1:00');
    });

    it('should handle multiple minutes with leading zero in seconds', () => {
        expect(formatQuestionTime(125)).toBe('2:05');
    });

    it('should display full minutes without remainder seconds', () => {
        expect(formatQuestionTime(120)).toBe('2:00');
    });

    it('should show leading zero for single digit seconds', () => {
        expect(formatQuestionTime(61)).toBe('1:01');
    });

    it('should handle large time values correctly', () => {
        expect(formatQuestionTime(3599)).toBe('59:59');
    });
});

describe('calculateDurationInSeconds utility', () => {
    it('should return 0 if start or end is undefined', () => {
        expect(calculateDurationInSeconds(undefined, new Date())).toBe(0);
        expect(calculateDurationInSeconds(new Date(), undefined)).toBe(0);
        expect(calculateDurationInSeconds(undefined, undefined)).toBe(0);
    });

    it('should correctly calculate positive duration in seconds', () => {
        const start = new Date('2024-01-01T10:00:00Z');
        const end = new Date('2024-01-01T10:01:40Z');
        expect(calculateDurationInSeconds(start, end)).toBe(100);
    });

    it('should return 0 if end is before start', () => {
        const start = new Date('2024-01-01T10:01:00Z');
        const end = new Date('2024-01-01T10:00:00Z');
        expect(calculateDurationInSeconds(start, end)).toBe(0);
    });
});

describe('formatDuration utility', () => {
    it('should format seconds less than a minute', () => {
        expect(formatDuration(45)).toBe('45s');
    });

    it('should format minutes and seconds correctly', () => {
        expect(formatDuration(125)).toBe('2m 5s');
    });

    it('should format exact minutes correctly', () => {
        expect(formatDuration(120)).toBe('2m 0s');
    });
});

describe('formatMinutesDuration utility', () => {
    it('should return null for undefined or null', () => {
        expect(formatMinutesDuration(undefined)).toBeNull();
        expect(formatMinutesDuration(null)).toBeNull();
    });

    it('should format singular minute correctly', () => {
        expect(formatMinutesDuration(1)).toBe('1 minute');
    });

    it('should format plural minutes correctly', () => {
        expect(formatMinutesDuration(45)).toBe('45 minutes');
    });

    it('should format full hours correctly', () => {
        expect(formatMinutesDuration(120)).toBe('2h');
    });

    it('should format hours and minutes correctly', () => {
        expect(formatMinutesDuration(135)).toBe('2h 15m');
    });
});

describe('formatDateTime utility', () => {
    it('should return N/A for undefined', () => {
        expect(formatDateTime(undefined)).toBe('N/A');
    });

    it('should format a valid date string', () => {
        const date = '2024-04-25T10:30:00Z';
        const formatted = formatDateTime(date);
        expect(typeof formatted).toBe('string');
        expect(formatted).toMatch(/\d{2} \w{3} \d{4}, \d{2}:\d{2}/);
    });

    it('should format a Date object', () => {
        const date = new Date('2024-04-25T10:30:00Z');
        const formatted = formatDateTime(date);
        expect(typeof formatted).toBe('string');
        expect(formatted).toMatch(/\d{2} \w{3} \d{4}, \d{2}:\d{2}/);
    });
});

