import React from "react";
import { useNavigate } from "react-router-dom";

export type CategoryCardProps = {
  id: string | number;
  name: string;
  imageUrl?: string | null;
  parentId: string | number;
  onClick?: () => void;
  className?: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  imageUrl,
  parentId,
  onClick,
  className = "",
}) => {
  const navigate = useNavigate();

  const FALLBACK_IMAGE = "https://via.placeholder.com/300x200?text=Category";
  const displayImage = imageUrl && imageUrl.trim().length > 0 ? imageUrl : FALLBACK_IMAGE;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to category detail page
      navigate(`/shop/category/${parentId}/${id}`);
    }
  };

  return (
    <div
      className={`cursor-pointer border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${className}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="relative">
        <div className="w-full h-[200px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      </div>
      <div className="px-4 py-4 bg-white">
        <h3 className="text-base font-semibold text-[#0f1f3d] text-center line-clamp-2 min-h-[48px] flex items-center justify-center">
          {name}
        </h3>
        <div className="mt-3 flex items-center justify-center">
          <span className="text-sm text-[#1c3b6c] font-medium hover:text-[#f97316] transition-colors">
            Xem sản phẩm →
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;

