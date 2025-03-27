type ProgressProps = {
    value: number;
    className?: string;
};

export const Progress = ({value, className}: ProgressProps) => {
    return (
        <div className={`w-full bg-base-200 rounded-full h-2 ${className}`}>
            <div
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{width: `${value}%`}}
            />
        </div>
    );
};