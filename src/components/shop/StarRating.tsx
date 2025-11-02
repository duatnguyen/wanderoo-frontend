import React from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const starLabels: { [key: number]: string } = {
  1: "Tệ",
  2: "Không bình thường",
  3: "Bình thường",
  4: "Hài lòng",
  5: "Tuyệt vời",
};

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = "md",
  readonly = false,
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleStarClick = (starValue: number) => {
    if (!readonly) {
      onChange(starValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            disabled={readonly}
            className={`${sizeClasses[size]} transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={star <= value ? "#FFB800" : "none"}
              stroke={star <= value ? "#FFB800" : "#E5E7EB"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-sm sm:text-base font-medium text-gray-700">
          {starLabels[value]}
        </span>
      )}
    </div>
  );
};

export default StarRating;
