import React from "react";

export type TimelineStep = {
  label: string;
  completed: boolean;
  date?: string;
};

export type OrderTimelineProps = {
  steps: TimelineStep[];
  className?: string;
  orderStatus?: string; // Add order status for conditional styling
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({
  steps,
  className = "",
  orderStatus = "",
}) => {
  // Determine color scheme based on order status
  const getTimelineColorScheme = () => {
    switch (orderStatus.toUpperCase()) {
      case "CANCELED":
        return {
          completedBg: "bg-red-600",
          completedBorder: "border-red-600", 
          completedText: "text-red-600",
          line: "bg-red-300"
        };
      case "SHIPPING_FAILED":
        return {
          completedBg: "bg-orange-600",
          completedBorder: "border-orange-600",
          completedText: "text-orange-600", 
          line: "bg-orange-300"
        };
      case "RETURNED":
      case "REFUND":
        return {
          completedBg: "bg-yellow-600",
          completedBorder: "border-yellow-600",
          completedText: "text-yellow-600",
          line: "bg-yellow-300"
        };
      default:
        return {
          completedBg: "bg-blue-600",
          completedBorder: "border-blue-600",
          completedText: "text-blue-600",
          line: "bg-gray-300"
        };
    }
  };

  const colorScheme = getTimelineColorScheme();
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${className}`}
    >
      <div className="relative">
        {/* Continuous horizontal line connecting all steps */}
        <div className={`hidden sm:block absolute top-4 left-8 right-8 h-0.5 ${colorScheme.line}`} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-0">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 sm:flex-1 relative"
            >
              {/* Icon - positioned above the connecting line */}
              <div className="relative z-10">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${
                    step.completed
                      ? `${colorScheme.completedBg} text-white ${colorScheme.completedBorder}`
                      : "bg-white border-gray-300"
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
                    step.completed ? colorScheme.completedText : "text-gray-500"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-xs text-gray-500 mt-1 h-5">
                  {step.completed && step.date ? step.date : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
