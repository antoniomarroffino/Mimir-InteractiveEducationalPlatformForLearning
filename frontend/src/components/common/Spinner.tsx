export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizes[size]}`} />
        </div>
    );
};