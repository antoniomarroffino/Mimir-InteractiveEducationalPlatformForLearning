export const LoadingSpinner = ({fullScreen}: { fullScreen?: boolean }) => (
    <div className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
)