import React, {useState} from 'react';
import {useFolderCRUD} from "../../hooks/folder/useFolderCRUD.ts";
import {FiAlertCircle, FiCalendar, FiFolder, FiFolderPlus, FiPlus} from "react-icons/fi";
import {addWeeks, endOfWeek, format, startOfWeek} from 'date-fns';

interface CreateFolderFormProps {
    courseId: string;
}

export const CreateFolderForm: React.FC<CreateFolderFormProps> = ({courseId}) => {
    const [name, setName] = useState('');
    const [mode, setMode] = useState<'manual' | 'weekly'>('manual');
    const [weeksNumber, setWeeksNumber] = useState(1);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return format(startOfWeek(today, {weekStartsOn: 1}), 'yyyy-MM-dd');
    });

    const {createFolder, isCreatingFolder, errorCreateFolder} = useFolderCRUD();

    const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setWeeksNumber(0);
        } else {
            const numericValue = parseInt(value, 10);
            if (!isNaN(numericValue)) {
                const clampedValue = Math.min(12, Math.max(1, numericValue));
                setWeeksNumber(clampedValue);
            } else {
                setWeeksNumber(0);
            }
        }
    };

    const generateWeekRanges = () => {
        const dates = [];
        let currentDate = new Date(startDate);

        for (let i = 0; i < weeksNumber; i++) {
            const weekStart = startOfWeek(currentDate, {weekStartsOn: 1});
            const weekEnd = endOfWeek(currentDate, {weekStartsOn: 1});

            dates.push({
                start: weekStart,
                end: weekEnd
            });

            currentDate = addWeeks(currentDate, 1);
        }

        return dates;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (mode === 'manual') {
                if (!name.trim()) return;
                await createFolder(courseId, {name: name.trim()});
                setName('');
            } else {
                const weeks = generateWeekRanges();
                for (const week of weeks) {
                    const weekName = `${format(week.start, 'd MMMM')} - ${format(week.end, 'd MMMM')}`;
                    await createFolder(courseId, {name: weekName});
                }
                setStartDate(format(startOfWeek(new Date(), {weekStartsOn: 1}), 'yyyy-MM-dd'));
                setWeeksNumber(1);
            }
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    };

    return (
        <div className="mb-8 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-2xl border border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <FiFolder className="text-2xl text-primary shrink-0"/>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                New Folder
                            </h3>
                        </div>

                        <div className="join">
                            <button
                                type="button"
                                className={`join-item btn btn-sm ${mode === 'manual' ? 'btn-active' : ''}`}
                                onClick={() => setMode('manual')}
                            >
                                Manual
                            </button>
                            <button
                                type="button"
                                className={`join-item btn btn-sm ${mode === 'weekly' ? 'btn-active' : ''}`}
                                onClick={() => setMode('weekly')}
                            >
                                Weekly
                            </button>
                        </div>
                    </div>

                    {mode === 'manual' ? (
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Folder name"
                                className="input input-bordered w-full pl-11 pr-20 focus:ring-2 focus:ring-primary/50" // Aumentato padding-right a pr-20
                                disabled={isCreatingFolder}
                                maxLength={50}
                            />
                            <FiFolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"/>

                            {/* Aggiunto counter a destra */}
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-base-content/40">
            {name.length}/50
        </span>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={weeksNumber || ''}
                                    onChange={handleWeeksChange}
                                    className="input input-bordered w-full pl-11 pr-4"
                                    disabled={isCreatingFolder}
                                    required
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">#</span>
                            </div>

                            <div className="relative flex-1">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="input input-bordered w-full pl-11 pr-4"
                                    disabled={isCreatingFolder}
                                />
                                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"/>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-full gap-2 transition-transform hover:scale-[0.98]"
                        disabled={
                            isCreatingFolder ||
                            (mode === 'manual' && !name.trim()) ||
                            (mode === 'weekly' && (weeksNumber < 1 || isNaN(weeksNumber)))
                        }
                    >
                        {isCreatingFolder ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FiPlus className="text-lg"/>
                                {mode === 'manual' ? 'Create Folder' : `Create ${weeksNumber} Week${weeksNumber > 1 ? 's' : ''}`}
                            </>
                        )}
                    </button>
                </div>

                <div className="flex justify-between items-center px-1">
                    {errorCreateFolder && (
                        <div className="text-error text-sm flex items-center gap-2">
                            <FiAlertCircle/>
                            {errorCreateFolder.message}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};