import React, { useState } from "react";
import StarRating from "./StarRating";
import Button from "./Button";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  classification?: string;
}

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSubmit: (review: {
    rating: number;
    comment: string;
    images?: File[];
    videos?: File[];
  }) => void;
  isEditMode?: boolean;
  onDelete?: () => void;
  initialRating?: number;
  initialComment?: string;
}

const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmit,
  isEditMode = false,
  onDelete,
  initialRating = 0,
  initialComment = "",
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

  // Load existing review data when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setRating(initialRating);
        setComment(initialComment);
      } else {
        setRating(0);
        setComment("");
      }
      setSelectedImages([]);
      setSelectedVideos([]);
    }
  }, [isOpen, isEditMode, initialRating, initialComment]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedVideos((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Vui lòng đánh giá sản phẩm");
      return;
    }
    onSubmit({
      rating,
      comment,
      images: selectedImages,
      videos: selectedVideos,
    });
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setSelectedImages([]);
    setSelectedVideos([]);
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
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Đánh giá sản phẩm
          </h2>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/80";
              }}
            />
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {product.name}
              </h3>
              {product.classification && (
                <p className="text-sm text-gray-600">
                  Phân loại hàng: {product.classification}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-start gap-5">
            <label className="text-base font-medium text-gray-900">
              Chất lượng sản phẩm
            </label>
            <StarRating value={rating} onChange={setRating} size="md" />
          </div>
        </div>

        {/* Review Text Area */}
        <div className="px-6 py-4 border-b border-gray-200">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none text-sm sm:text-base"
          />
        </div>

        {/* Media Upload Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            {/* Add Image Button */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Thêm hình ảnh
              </button>
            </label>

            {/* Add Video Button */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="hidden"
              />
              <button
                type="button"
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Thêm video
              </button>
            </label>
          </div>

          {/* Display Selected Images */}
          {selectedImages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Display Selected Videos */}
          {selectedVideos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedVideos.map((video, index) => (
                <div key={index} className="relative">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-gray-400"
                    >
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate max-w-[80px]">
                    {video.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          {isEditMode && onDelete && (
            <Button
              variant="outline"
              size="md"
              onClick={onDelete}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Xóa
            </Button>
          )}
          <Button
            variant="outline"
            size="md"
            onClick={handleClose}
            className="border-[#ea5b0c] text-[#ea5b0c] hover:bg-[#ea5b0c]"
          >
            Trở lại
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            className="px-6"
          >
            {isEditMode ? "Ok" : "Hoàn thành"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewModal;
