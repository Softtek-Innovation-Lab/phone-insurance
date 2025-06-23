interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepLabels: string[];
}

export const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) => {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-4">
                {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={label} className="flex flex-col items-center flex-1">
                            <div className="flex items-center w-full">
                                <div
                                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                    ${isCompleted ? 'bg-green-500 text-white scale-105' :
                                            isCurrent ? 'bg-blue-500 text-white scale-110' :
                                                'bg-gray-200 text-gray-500'}
                  `}
                                >
                                    {isCompleted ? '✓' : stepNumber}
                                </div>

                                {index < stepLabels.length - 1 && (
                                    <div className="flex-1 h-1 mx-2">
                                        <div className="w-full h-full bg-gray-200 rounded">
                                            <div
                                                className={`h-full bg-blue-500 rounded transition-all duration-300 ${isCompleted ? 'w-full' : 'w-0'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span
                                className={`mt-2 text-xs font-medium transition-colors duration-200 ${isCurrent ? 'text-blue-600' :
                                    isCompleted ? 'text-green-600' :
                                        'text-gray-500'
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% Complete</span>
            </div>
        </div>
    );
};
