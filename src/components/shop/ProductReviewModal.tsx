import React, { useState } from "react";
import StarRating from "./StarRating";
import Button from "./Button";
import { Textarea } from "./Input";
import { toast } from "sonner";
import { X } from "lucide-react";
import { formatCurrencyVND } from "../../features/shop/pages/Checkout/utils/formatCurrency";
import { getImageUrl } from "../../utils/imageUtils";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  classification?: string;
  originalPrice?: number;
  finalPrice?: number;
  discountAmount?: number;
  quantity?: number;
}

interface ProductReview {
  productId: string;
  rating: number;
  comment: string;
  images?: File[];
  videos?: File[];
  existingImages?: string[];
}

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSubmit: (reviews: ProductReview[]) => void | Promise<void>;
  initialReviews?: Map<string, { rating: number; comment: string; images?: string[] }>;
  isSubmitting?: boolean;
}

const MAX_COMMENT_LENGTH = 200;

const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  isOpen,
  onClose,
  products,
  onSubmit,
  initialReviews,
  isSubmitting = false,
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
        existingImages: string[];
      }
    >
  >(new Map());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [previewAlt, setPreviewAlt] = useState<string>("");
  const [previewRevokeUrl, setPreviewRevokeUrl] = useState<string | null>(null);
  const [previewVideoSrc, setPreviewVideoSrc] = useState<string | null>(null);
  const [previewVideoRevokeUrl, setPreviewVideoRevokeUrl] = useState<string | null>(null);

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
          existingImages: existingReview?.images || [],
        });
      });
      setReviews(newReviews);
    }
  }, [isOpen, products, initialReviews]);

  const updateReview = (
    productId: string,
    field: "rating" | "comment" | "images" | "videos" | "existingImages",
    value: any
  ) => {
    setReviews((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(productId) || {
        rating: 0,
        comment: "",
        images: [],
        videos: [],
        existingImages: [],
      };
      newMap.set(productId, { ...current, [field]: value });
      return newMap;
    });

    // Nếu người dùng vừa chọn sao sau khi bị lỗi, xoá thông báo lỗi chung
    if (field === "rating" && value > 0 && submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    const reviewsArray: ProductReview[] = [];
    let hasError = false;
    let hasCommentTooLong = false;

    // Reset lỗi cũ trước khi validate
    setSubmitError(null);

    products.forEach((product) => {
      const review = reviews.get(product.id);
      if (!review || review.rating === 0) {
        hasError = true;
        return;
      }

       // Validate độ dài comment
       if (review.comment && review.comment.length > MAX_COMMENT_LENGTH) {
         hasCommentTooLong = true;
       }
      reviewsArray.push({
        productId: product.id,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        videos: review.videos,
        existingImages: review.existingImages,
      });
    });

    if (hasError) {
      setSubmitError("Vui lòng chọn chất lượng sản phẩm cho tất cả sản phẩm.");
      return;
    }

    if (hasCommentTooLong) {
      setSubmitError("Nhập đánh giá không quá 200 ký tự.");
      return;
    }

    await onSubmit(reviewsArray);
  };

  const openImagePreviewFromUrl = (url: string, alt: string) => {
    const fullUrl = getImageUrl(url) || url;
    setPreviewImageSrc(fullUrl);
    setPreviewAlt(alt);
    // URL này do backend cung cấp nên không cần revoke
    setPreviewRevokeUrl(null);
  };

  const openImagePreviewFromFile = (file: File, alt: string) => {
    const url = URL.createObjectURL(file);
    setPreviewImageSrc(url);
    setPreviewAlt(alt);
    setPreviewRevokeUrl(url);
  };

  const closeImagePreview = () => {
    if (previewRevokeUrl) {
      URL.revokeObjectURL(previewRevokeUrl);
    }
    setPreviewImageSrc(null);
    setPreviewAlt("");
    setPreviewRevokeUrl(null);
  };

  const openVideoPreviewFromUrl = (url: string) => {
    const fullUrl = getImageUrl(url) || url;
    setPreviewVideoSrc(fullUrl);
    setPreviewVideoRevokeUrl(null);
  };

  const openVideoPreviewFromFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewVideoSrc(url);
    setPreviewVideoRevokeUrl(url);
  };

  const closeVideoPreview = () => {
    if (previewVideoRevokeUrl) {
      URL.revokeObjectURL(previewVideoRevokeUrl);
    }
    setPreviewVideoSrc(null);
    setPreviewVideoRevokeUrl(null);
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
        <div className="px-6 py-3 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center justify-between">
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

        {submitError && (
          <div className="px-6 pt-3 text-[13px] text-red-600 font-medium">
            {submitError}
          </div>
        )}

        {/* Products List */}
        <div>
          {products.map((product, index) => {
            const review = reviews.get(product.id) || {
              rating: 0,
              comment: "",
              images: [],
              videos: [],
              existingImages: [],
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
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        // Show placeholder text instead
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".image-placeholder")) {
                          const placeholder = document.createElement("div");
                          placeholder.className = "image-placeholder w-[60px] h-[60px] rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-400";
                          placeholder.textContent = "IMG";
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-[14px] font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      {product.classification && (
                        <p className="text-[12px] text-gray-600 mb-1">
                          Phân loại hàng: {product.classification}
                        </p>
                      )}
                      {product.quantity && (
                        <p className="text-[12px] text-gray-600 mb-1">
                          Số lượng: {product.quantity}
                        </p>
                      )}
                      {/* Price Information */}
                      <div className="flex items-center gap-2">
                        {product.finalPrice && (
                          <span className="text-[14px] font-semibold text-blue-600">
                            {formatCurrencyVND(product.finalPrice)}
                          </span>
                        )}
                        {product.discountAmount && product.discountAmount > 0 && (
                          <span className="text-[12px] text-gray-500 line-through">
                            {formatCurrencyVND(product.originalPrice || 0)}
                          </span>
                        )}
                      </div>
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
                    className={`focus:!ring-[#E04D30] ${
                      review.comment &&
                      review.comment.length > MAX_COMMENT_LENGTH
                        ? "!border-red-500 focus:!border-red-500"
                        : "!border-[#E04D30] focus:!border-[#E04D30]"
                    }`}
                  />
                  {review.comment &&
                    review.comment.length > MAX_COMMENT_LENGTH && (
                      <p className="mt-1 text-[12px] text-red-600">
                        Nhập đánh giá không quá 200 ký tự
                      </p>
                    )}
                </div>

                {/* Media Upload Section */}
                <div className="py-1 pb-4">
                  <div className="flex gap-3 mb-3">
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
                          if (files.length > 0) {
                            toast.success(`Đã thêm ${files.length} ảnh`);
                          }
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
                          if (files.length > 0) {
                            toast.success(`Đã thêm ${files.length} video`);
                          }
                        };
                        input.click();
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Thêm video
                    </button>
                  </div>

                  {/* Media Previews */}
                  <div className="flex flex-wrap gap-2">
                    {/* Existing Images / Videos từ backend */}
                    {review.existingImages.map((url, imgIndex) => {
                      const fullUrl = getImageUrl(url) || url;
                      const isVideo =
                        typeof url === "string" &&
                        /\.(mp4|webm|ogg|mov|avi)$/i.test(url);

                      const handleClick = () => {
                        if (isVideo) {
                          openVideoPreviewFromUrl(url);
                        } else {
                          openImagePreviewFromUrl(url, `Review ${imgIndex + 1}`);
                        }
                      };

                      return (
                        <div
                          key={`existing-${imgIndex}`}
                          className="relative w-20 h-20 group cursor-pointer"
                          onClick={handleClick}
                        >
                          {isVideo ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                              <video
                                src={fullUrl}
                                className="w-full h-full object-cover opacity-80 pointer-events-none"
                              />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-1"></div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={fullUrl}
                              alt={`Review ${imgIndex}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).parentElement!.innerHTML =
                                  '<span class="text-gray-500 text-xs">IMG</span>';
                              }}
                            />
                          )}

                          {/* Cho phép xoá media cũ khi chỉnh sửa */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = [...review.existingImages];
                              next.splice(imgIndex, 1);
                              updateReview(product.id, "existingImages", next);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}

                    {/* New Images */}
                    {review.images.map((file, fileIndex) => (
                      <div
                        key={`new-img-${fileIndex}`}
                        className="relative w-20 h-20 group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${fileIndex}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openImagePreviewFromFile(file, `New ${fileIndex + 1}`);
                          }}
                          onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newImages = [...review.images];
                            newImages.splice(fileIndex, 1);
                            updateReview(product.id, "images", newImages);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {/* New Videos */}
                    {review.videos.map((file, fileIndex) => (
                      <div
                        key={`new-vid-${fileIndex}`}
                        className="relative w-20 h-20 group bg-black rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openVideoPreviewFromFile(file)}
                      >
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover opacity-80 pointer-events-none"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-1"></div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newVideos = [...review.videos];
                            newVideos.splice(fileIndex, 1);
                            updateReview(product.id, "videos", newVideos);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      {/* Image Preview Modal */}
      {previewImageSrc && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={closeImagePreview}
          />
          <div className="relative z-10 max-w-3xl max-h-[90vh] mx-4 bg-black/80 rounded-lg overflow-hidden flex flex-col">
            <div className="flex justify-end p-2">
              <button
                onClick={closeImagePreview}
                className="text-white hover:text-gray-200"
                aria-label="Đóng ảnh xem trước"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-4 pb-4 flex-1 flex items-center justify-center">
              <img
                src={previewImageSrc}
                alt={previewAlt}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideoSrc && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={closeVideoPreview}
          />
          <div className="relative z-10 max-w-3xl max-h-[90vh] mx-4 bg-black rounded-lg overflow-hidden flex flex-col">
            <div className="flex justify-end p-2">
              <button
                onClick={closeVideoPreview}
                className="text-white hover:text-gray-200"
                aria-label="Đóng video xem trước"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-4 pb-4 flex-1 flex items-center justify-center">
              <video
                src={previewVideoSrc}
                className="max-h-[80vh] w-auto"
                controls
                autoPlay
              />
            </div>
          </div>
        </div>
      )}

        {/* Footer Buttons */}
        <div className="px-6 py-3 flex justify-end gap-2 sticky bottom-0 bg-white border-t border-gray-100">
          <Button
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
            className="!bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-[#E04D30] hover:!text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trở lại
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="!bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang gửi..." : "Hoàn thành"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewModal;
