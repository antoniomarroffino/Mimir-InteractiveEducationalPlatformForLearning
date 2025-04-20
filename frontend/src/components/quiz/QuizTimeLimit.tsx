import React, { useCallback } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface QuizTimeLimitProps {
    timeLimit: number | undefined | null;
    onTimeChange: (minutes: number | undefined) => void;
    disabled?: boolean;
}

export const QuizTimeLimit: React.FC<QuizTimeLimitProps> = React.memo(({
                                                                           timeLimit,
                                                                           onTimeChange,
                                                                           disabled = false
                                                                       }) => {
    const handleToggleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onTimeChange(e.target.checked ? 30 : undefined);
    }, [onTimeChange]);

    const handleMinutesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            onTimeChange(value);
        }
    }, [onTimeChange]);

    console.log("Render QuizTimeLimit", {
        timeLimit,
        onTimeChange,
        disabled
    });

    return (
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <ClockIcon className="w-5 h-5 text-primary"/>
            </div>
            <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={timeLimit != null}
                        onChange={handleToggleChange}
                        disabled={disabled}
                    />
                    <span className="text-sm font-medium">
                        Time limit
                    </span>
                </label>
                {timeLimit != null && (
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="input input-bordered input-sm w-16 text-center"
                            value={timeLimit || ''}
                            onChange={handleMinutesChange}
                            min="1"
                            disabled={disabled}
                        />
                        <span className="text-sm">min</span>
                    </div>
                )}
            </div>
        </div>
    );
});
