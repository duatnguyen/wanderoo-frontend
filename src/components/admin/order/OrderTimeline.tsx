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
    const status = orderStatus.toUpperCase();
    switch (status) {
      case "CANCELED":
      case "CANCELLED":
        return {
          completedBg: "bg-red-600",
          completedBorder: "border-red-600",
          completedText: "text-red-600",
          line: "bg-red-300"
        };
      case "SHIPPING_FAILED":
      case "REJECTED":
        return {
          completedBg: "bg-orange-600",
          completedBorder: "border-orange-600",
          completedText: "text-orange-600",
          line: "bg-orange-300"
        };
      case "RETURNED":
      case "REFUND":
      case "REFUNDED":
      case "COMPLETED":
        return {
          completedBg: "bg-green-600",
          completedBorder: "border-green-600",
          completedText: "text-green-600",
          line: "bg-green-300"
        };
      case "RECEIVING":
      case "RETURNING":
        return {
          completedBg: "bg-blue-600",
          completedBorder: "border-blue-600",
          completedText: "text-blue-600",
          line: "bg-blue-300"
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
      className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full ${className}`}
    >
      <div className="relative">
        {/* Continuous horizontal line connecting all steps - positioned at icon center */}
        {/* Icon is w-8 h-8 (32px), so center is at 16px from top. With mb-1 (4px), line should be at top-4 (16px) */}
        <div className={`hidden sm:block absolute top-4 left-4 right-4 h-0.5 ${colorScheme.line} z-0`} />

        <div className="flex flex-col sm:flex-row items-start sm:items-start gap-6 sm:gap-1">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 sm:flex-1 relative w-full sm:w-auto min-h-[90px] sm:min-h-[100px]"
            >
              {/* Icon - positioned above the connecting line, centered on the line */}
              <div className="relative z-10 flex-shrink-0 mb-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${step.completed
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

              {/* Text Content - with proper wrapping and alignment */}
              <div className="flex flex-col items-center text-center w-full px-1 sm:px-2 flex-1 justify-start">
                <div
                  className={`text-xs sm:text-sm font-medium leading-snug break-words max-w-full ${step.completed ? colorScheme.completedText : "text-gray-500"
                    }`}
                  style={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  {step.label}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1.5 min-h-[18px] flex items-center justify-center">
                  {step.completed && step.date ? step.date : "\u00A0"}
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
