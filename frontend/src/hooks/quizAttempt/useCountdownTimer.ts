import { useState, useEffect, useRef } from 'react';

interface UseCountdownTimerOptions {
    durationSeconds?: number | null;
    onMinuteLeft?: () => void;
    onExpire?: () => void;
}

export function useCountdownTimer({
                                      durationSeconds,
                                      onMinuteLeft,
                                      onExpire
                                  }: UseCountdownTimerOptions): number | null {
    const [remaining, setRemaining] = useState<number | null>(
        durationSeconds != null ? durationSeconds : null
    );

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const endTimeRef = useRef<number | null>(
        durationSeconds != null ? Date.now() + durationSeconds * 1000 : null
    );
    const minuteWarnedRef = useRef<boolean>(false);
    const expiredRef = useRef<boolean>(false);

    useEffect(() => {
        if (endTimeRef.current == null) return;

        const tick = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((endTimeRef.current! - now) / 1000));
            setRemaining(diff);

            if (diff <= 0 && intervalRef.current && !expiredRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                expiredRef.current = true;
                onExpire?.();
            }

            if (diff === 59 && !minuteWarnedRef.current && durationSeconds! > 59) {
                minuteWarnedRef.current = true;
                onMinuteLeft?.();
            }
        };

        tick();
        intervalRef.current = setInterval(tick, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [durationSeconds, onExpire, onMinuteLeft]);

    return remaining;
}
