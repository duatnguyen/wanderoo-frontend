import React from "react";

interface ProgressStepProps {
  step: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  isLast?: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  step,
  title,
  isCompleted,
  isActive,
  isLast = false,
}) => {
  return (
    <div className="flex items-center">
      {/* Step Circle */}
      <div className="flex items-center">
        <div
          className={`
          relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
          ${
            isCompleted
              ? "bg-green-500 border-green-500 text-white"
              : isActive
                ? "bg-[#e04d30] border-[#e04d30] text-white"
                : "bg-white border-gray-300 text-gray-400"
          }
        `}
        >
          {isCompleted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <span className="text-[12px] font-bold">{step}</span>
          )}
        </div>

        {/* Step Title */}
        <span
          className={`
          ml-3 text-[13px] font-medium transition-colors duration-200
          ${isCompleted || isActive ? "text-[#272424]" : "text-gray-400"}
        `}
        >
          {title}
        </span>
      </div>

      {/* Connector Line */}
      {!isLast && (
        <div
          className={`
          ml-4 w-12 h-0.5 transition-colors duration-300
          ${isCompleted ? "bg-green-500" : "bg-gray-200"}
        `}
        />
      )}
    </div>
  );
};

interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  steps,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        {steps.map((stepTitle, index) => (
          <ProgressStep
            key={index}
            step={index + 1}
            title={stepTitle}
            isCompleted={index < currentStep}
            isActive={index === currentStep}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
