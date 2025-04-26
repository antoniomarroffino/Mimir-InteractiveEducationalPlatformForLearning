import { describe, it, expect, vi } from 'vitest';
import { createVerticalGradient, formatSeconds, formatTicks } from '../chartUtils';

describe('formatSeconds utility', () => {
    it('should format less than a minute correctly', () => {
        expect(formatSeconds(45)).toBe('45 seconds');
    });

    it('should format more than a minute correctly', () => {
        expect(formatSeconds(125)).toBe('2m 5s');
    });

    it('should handle exact minute correctly', () => {
        expect(formatSeconds(120)).toBe('2m 0s');
    });

    it('should round seconds correctly', () => {
        expect(formatSeconds(61)).toBe('1m 1s');
    });
});

describe('formatTicks utility', () => {
    it('should format less than a minute correctly', () => {
        expect(formatTicks(45)).toBe('45');
    });

    it('should format minutes and seconds correctly', () => {
        expect(formatTicks(125)).toBe('2:05');
    });

    it('should format exact minutes correctly', () => {
        expect(formatTicks(120)).toBe('2:00');
    });

    it('should pad single digit seconds with zero', () => {
        expect(formatTicks(61)).toBe('1:01');
    });
});

describe('createVerticalGradient utility', () => {
    interface MockCanvasGradient {
        addColorStop: (offset: number, color: string) => void;
    }

    interface MockCanvasContext {
        createLinearGradient: (x0: number, y0: number, x1: number, y1: number) => MockCanvasGradient;
    }

    it('should create a vertical gradient with default colors', () => {
        const mockGradient: MockCanvasGradient = {
            addColorStop: vi.fn()
        };

        const mockCtx: MockCanvasContext = {
            createLinearGradient: vi.fn(() => mockGradient)
        };

        const area = { top: 0, bottom: 100 };

        const gradient = createVerticalGradient(mockCtx as unknown as CanvasRenderingContext2D, area);

        expect(mockCtx.createLinearGradient).toHaveBeenCalledWith(0, area.bottom, 0, area.top);
        expect(gradient).toBeDefined();
    });

    it('should create a vertical gradient with custom colors', () => {
        const addColorStop = vi.fn();
        const mockGradient: MockCanvasGradient = { addColorStop };

        const mockCtx: MockCanvasContext = {
            createLinearGradient: vi.fn(() => mockGradient)
        };

        const area = { top: 0, bottom: 100 };
        const fromColor = 'red';
        const toColor = 'blue';

        const gradient = createVerticalGradient(mockCtx as unknown as CanvasRenderingContext2D, area, fromColor, toColor);

        expect(mockCtx.createLinearGradient).toHaveBeenCalledWith(0, area.bottom, 0, area.top);
        expect(addColorStop).toHaveBeenCalledWith(0, fromColor);
        expect(addColorStop).toHaveBeenCalledWith(1, toColor);
        expect(gradient).toBeDefined();
    });
});
