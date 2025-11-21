import React from "react";

export type TimelineStep = {
  label: string;
  completed: boolean;
  date?: string;
};

export type OrderTimelineProps = {
  steps: TimelineStep[];
  className?: string;
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  steps,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}
    >
      <div className="relative">
        {/* Continuous horizontal gray line connecting all steps */}
        <div className="hidden sm:block absolute top-4 left-8 right-8 h-0.5 bg-gray-300" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-0">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 sm:flex-1 relative"
            >
              {/* Icon - positioned above the connecting line */}
              <div className="relative z-10">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    step.completed
                      ? "bg-blue-600 text-white"
                      : "bg-white border-2 border-gray-300"
                  }`}
                >
                  {step.completed && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-center text-center mt-2">
                <div
                  className={`text-sm font-medium ${
                    step.completed ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </div>
                {step.date && step.completed && (
                  <div className="text-xs text-gray-500 mt-1">{step.date}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
