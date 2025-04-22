export const formatSeconds = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return minutes > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${remainingSeconds} seconds`;
};

export const formatTicks = (value: number): string => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return minutes > 0
        ? `${minutes}:${seconds.toString().padStart(2, '0')}`
        : `${seconds}`;
};

export const createVerticalGradient = (
    ctx: CanvasRenderingContext2D,
    area: { top: number, bottom: number },
    fromColor = 'rgba(147, 51, 234, 0.2)',
    toColor = 'rgba(59, 130, 246, 0.8)'
) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, fromColor);
    gradient.addColorStop(1, toColor);
    return gradient;
};
