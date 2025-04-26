import {useEffect, useRef} from "react";
import {QuestionResponseDTO} from "@dti-isin/backend-api-client";

export function useTrackTimeSpent(
    currentIndex: number,
    setResponses: React.Dispatch<React.SetStateAction<QuestionResponseDTO[]>>
) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setResponses(prev => {
                const updated = [...prev];
                if (updated[currentIndex]) {
                    updated[currentIndex] = {
                        ...updated[currentIndex],
                        timeSpent: (updated[currentIndex]?.timeSpent || 0) + 1
                    };
                }
                return updated;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [currentIndex, setResponses]);
}
