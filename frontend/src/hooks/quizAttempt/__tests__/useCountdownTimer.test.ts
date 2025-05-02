import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useCountdownTimer } from "../useCountdownTimer";

describe("useCountdownTimer", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2025, 0, 1, 0, 0, 0)); // Imposta una data fissa
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should start countdown from given duration", () => {
        const { result } = renderHook(() => useCountdownTimer({ durationSeconds: 120 }));

        expect(result.current).toBe(120);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(119);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(118);
    });

    it("should call onMinuteLeft when reaching 59 seconds", () => {
        const onMinuteLeft = vi.fn();
        const { result } = renderHook(() =>
            useCountdownTimer({ durationSeconds: 61, onMinuteLeft })
        );

        expect(result.current).toBe(61);

        act(() => {
            vi.advanceTimersByTime(2000); // Avanza di 2 secondi: 61 -> 59
        });

        expect(onMinuteLeft).toHaveBeenCalledTimes(1);
        expect(result.current).toBe(59);
    });

    it("should call onExpire when reaching 0", () => {
        const onExpire = vi.fn();
        const { result } = renderHook(() =>
            useCountdownTimer({ durationSeconds: 2, onExpire })
        );

        expect(result.current).toBe(2);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(1);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(0);
        expect(onExpire).toHaveBeenCalledTimes(1);
    });

    it("should handle null duration gracefully", () => {
        const { result } = renderHook(() => useCountdownTimer({ durationSeconds: null }));

        expect(result.current).toBeNull();
    });
});
