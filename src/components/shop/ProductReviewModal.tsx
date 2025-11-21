import React, { useState } from "react";
import StarRating from "./StarRating";
import Button from "./Button";
import { Textarea } from "./Input";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  classification?: string;
}

interface ProductReview {
  productId: string;
  rating: number;
  comment: string;
  images?: File[];
  videos?: File[];
}

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSubmit: (reviews: ProductReview[]) => void;
  initialReviews?: Map<string, { rating: number; comment: string }>;
}

const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  isOpen,
  onClose,
  products,
  onSubmit,
  initialReviews,
}) => {
  // State for each product's review
  const [reviews, setReviews] = useState<
    Map<
      string,
      {
        rating: number;
        comment: string;
        images: File[];
        videos: File[];
      }
    >
  >(new Map());

  // Load existing review data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const newReviews = new Map();
      products.forEach((product) => {
        const existingReview = initialReviews?.get(product.id);
        newReviews.set(product.id, {
          rating: existingReview?.rating || 0,
          comment: existingReview?.comment || "",
          images: [],
          videos: [],
        });
      });
      setReviews(newReviews);
    }
  }, [isOpen, products, initialReviews]);

  const updateReview = (
    productId: string,
    field: "rating" | "comment" | "images" | "videos",
    value: any
  ) => {
    setReviews((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(productId) || {
        rating: 0,
        comment: "",
        images: [],
        videos: [],
      };
      newMap.set(productId, { ...current, [field]: value });
      return newMap;
    });
  };

  const handleSubmit = () => {
    const reviewsArray: ProductReview[] = [];
    let hasError = false;

    products.forEach((product) => {
      const review = reviews.get(product.id);
      if (!review || review.rating === 0) {
        hasError = true;
        return;
      }
      reviewsArray.push({
        productId: product.id,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        videos: review.videos,
      });
    });

    if (hasError) {
      alert("Vui lòng đánh giá tất cả sản phẩm");
      return;
    }

    onSubmit(reviewsArray);
  };

  const handleClose = () => {
    setReviews(new Map());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="px-6 py-3 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-gray-900">
            Đánh giá sản phẩm
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Products List */}
        <div>
          {products.map((product, index) => {
            const review = reviews.get(product.id) || {
              rating: 0,
              comment: "",
              images: [],
              videos: [],
            };

            return (
              <div
                key={product.id}
                className={`px-6 ${index > 0 ? "border-t border-gray-100" : ""}`}
              >
                {/* Product Info */}
                <div className="py-2">
                  <div className="flex items-start gap-2">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-[60px] h-[60px] rounded-lg border border-gray-300 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/60";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-[14px] font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      {product.classification && (
                        <p className="text-[14px] text-gray-600">
                          Phân loại hàng: {product.classification}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="py-2">
                  <div className="flex items-center justify-start gap-5">
                    <label className="text-[14px] font-medium text-gray-900">
                      Chất lượng sản phẩm
                    </label>
                    <StarRating
                      value={review.rating}
                      onChange={(value) =>
                        updateReview(product.id, "rating", value)
                      }
                      size="md"
                    />
                  </div>
                </div>

                {/* Review Text Area */}
                <div className="py-1.5">
                  <Textarea
                    value={review.comment}
                    onChange={(e) =>
                      updateReview(product.id, "comment", e.target.value)
                    }
                    placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé!!!"
                    rows={6}
                    fullWidth
                    className="!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30]"
                  />
                </div>

                {/* Media Upload Section */}
                <div className="py-1 pb-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.multiple = true;
                        input.onchange = (e) => {
                          const files = Array.from(
                            (e.target as HTMLInputElement).files || []
                          );
                          const currentImages = review.images || [];
                          updateReview(product.id, "images", [
                            ...currentImages,
                            ...files,
                          ]);
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Thêm hình ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "video/*";
                        input.multiple = true;
                        input.onchange = (e) => {
                          const files = Array.from(
                            (e.target as HTMLInputElement).files || []
                          );
                          const currentVideos = review.videos || [];
                          updateReview(product.id, "videos", [
                            ...currentVideos,
                            ...files,
                          ]);
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Thêm video
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-3 flex justify-end gap-2 sticky bottom-0 bg-white">
          <Button
            variant="outline"
            size="md"
            onClick={handleClose}
            className="!bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-[#E04D30] hover:!text-white"
          >
            Trở lại
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            className="!bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24]"
          >
            Hoàn thành
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewModal;
