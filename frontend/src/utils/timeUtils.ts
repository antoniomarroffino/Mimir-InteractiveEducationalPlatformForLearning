export const formatQuestionTime = (seconds: number | undefined): string => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateDurationInSeconds = (
    start?: string | Date,
    end?: string | Date
): number => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 1000));
};

export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return minutes > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${remainingSeconds}s`;
};

export const formatMinutesDuration = (minutes?: number | null): string | null => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return `${hours}h${remaining ? ` ${remaining}m` : ''}`;
};

export const formatDateTime = (date?: string | Date): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('it-CH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
