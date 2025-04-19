import {useEffect, useRef, useState } from "react";

interface UseQuizCountdownOptions {
    initialSeconds: number;
    onMinuteLeft?: () => void;
    onExpire?: () => void;
}

export function useQuizCountdown({
                                     initialSeconds,
                                     onMinuteLeft,
                                     onExpire
                                 }: UseQuizCountdownOptions) {
    const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
    const minuteWarningTriggered = useRef(false);

    const onExpireRef = useRef(onExpire);
    const onMinuteLeftRef = useRef(onMinuteLeft);

    useEffect(() => {
        onExpireRef.current = onExpire;
        onMinuteLeftRef.current = onMinuteLeft;
    }, [onExpire, onMinuteLeft]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onExpireRef.current?.();
                    return 0;
                }

                if (prev === 61 && !minuteWarningTriggered.current) {
                    onMinuteLeftRef.current?.();
                    minuteWarningTriggered.current = true;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return timeRemaining;
}
