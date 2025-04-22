import React, { useState } from 'react';
import { useFolderCRUD } from '../../hooks/folder/useFolderCRUD';
import { FiAlertCircle, FiCalendar, FiFolder, FiFolderPlus, FiPlus } from 'react-icons/fi';
import { format, startOfWeek } from 'date-fns';
import { clampWeekNumber, generateWeekRanges } from '../../utils/folderUtils';

interface CreateFolderFormProps {
    courseId: string;
}

export const CreateFolderForm: React.FC<CreateFolderFormProps> = ({ courseId }) => {
    const [name, setName] = useState('');
    const [mode, setMode] = useState<'manual' | 'weekly'>('manual');
    const [weeksNumber, setWeeksNumber] = useState(1);
    const [startDate, setStartDate] = useState(() =>
        format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    );

    const { createFolder, isCreatingFolder, errorCreateFolder } = useFolderCRUD();

    const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWeeksNumber(clampWeekNumber(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (mode === 'manual') {
                if (!name.trim()) return;
                await createFolder(courseId, { name: name.trim() });
                setName('');
            } else {
                const weeks = generateWeekRanges(startDate, weeksNumber);
                for (const { start, end } of weeks) {
                    const weekName = `${format(start, 'd MMMM')} - ${format(end, 'd MMMM')}`;
                    await createFolder(courseId, { name: weekName });
                }
                setStartDate(format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'));
                setWeeksNumber(1);
            }
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <FiFolder className="text-2xl text-primary" />
                        <h3 className="text-xl font-bold text-primary">New Folder</h3>
                    </div>
                    <div role="group" className="join">
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
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Folder name"
                            className="input input-bordered w-full pl-11 pr-20"
                            disabled={isCreatingFolder}
                            maxLength={50}
                        />
                        <FiFolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-base-content/40">
                            {name.length}/50
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-4 items-start">
                        <div className="relative w-full max-w-[120px]">
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={weeksNumber || ''}
                                onChange={handleWeeksChange}
                                className="input input-bordered w-full py-2 text-sm"
                                disabled={isCreatingFolder}
                            />
                        </div>

                        <div className="relative w-full">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input input-bordered w-full pl-11 pr-4 py-2 text-sm"
                                disabled={isCreatingFolder}
                            />
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
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
                        <span className="loading loading-spinner" />
                    ) : (
                        <>
                            <FiPlus className="text-lg" />
                            {mode === 'manual'
                                ? 'Create Folder'
                                : `Create ${weeksNumber} Week${weeksNumber > 1 ? 's' : ''}`}
                        </>
                    )}
                </button>

                {errorCreateFolder && (
                    <div className="text-error text-sm flex items-center gap-2">
                        <FiAlertCircle />
                        {errorCreateFolder.message}
                    </div>
                )}
            </form>
        </div>
    );
};
