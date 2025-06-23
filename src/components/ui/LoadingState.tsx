interface LoadingStateProps {
    isLoading: boolean;
    message?: string;
    overlay?: boolean;
}

export const LoadingState = ({ isLoading, message = "Loading...", overlay = false }: LoadingStateProps) => {
    if (!isLoading) return null;

    const content = (
        <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-default-600 font-medium animate-fade-in">
                {message}
            </p>
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white rounded-lg shadow-xl">
                    {content}
                </div>
            </div>
        );
    }

    return content;
};

export const ButtonLoadingState = ({ isLoading, children, ...props }: any) => {
    return (
        <button
            {...props}
            disabled={isLoading ?? props.disabled}
            className={`${props.className} ${isLoading ? 'cursor-not-allowed opacity-75' : ''} transition-all duration-200`}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};
