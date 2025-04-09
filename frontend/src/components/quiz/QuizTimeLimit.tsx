import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface QuizTimeLimitProps {
    timeLimit: number | undefined | null;  // Accetta sia undefined che null
    onTimeChange: (minutes: number | undefined) => void;  // Usiamo null per il backend
    disabled?: boolean;
}

export const QuizTimeLimit: React.FC<QuizTimeLimitProps> = ({
                                                                timeLimit,
                                                                onTimeChange,
                                                                disabled = false
                                                            }) => {
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onTimeChange(30); // Quando attivo, imposta 30 minuti di default
        } else {
            onTimeChange(undefined); // Quando disattivo, imposta null per il backend
        }
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            onTimeChange(value);
        }
    };

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
                        checked={timeLimit != null}  // Controlla sia null che undefined
                        onChange={handleToggleChange}
                        disabled={disabled}
                    />
                    <span className="text-sm font-medium">
                        Time limit
                    </span>
                </label>
                {timeLimit != null && (  // Controlla sia null che undefined
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
};