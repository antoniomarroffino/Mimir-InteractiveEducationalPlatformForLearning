import { describe, expect, it } from 'vitest';
import { formatQuestionTime } from "../timeUtils.ts";

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