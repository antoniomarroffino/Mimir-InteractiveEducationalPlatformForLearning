export const SkeletonLoader = ({ className }: { className?: string }) => {
    return (
        <div className={`animate-pulse bg-base-300 ${className}`}>
            <div className="invisible">Loading...</div>
        </div>
    );
};