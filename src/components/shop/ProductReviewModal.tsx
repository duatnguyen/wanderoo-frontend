import React, { useState } from "react";
import StarRating from "./StarRating";
import Button from "./Button";
import { Textarea } from "./Input";
import MediaUpload from "./MediaUpload";

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
            <div className="w-20 h-20 rounded-lg border border-gray-300 bg-transparent" />
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
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé"
            rows={6}
            fullWidth
          />
        </div>

        {/* Media Upload Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="space-y-3">
            <MediaUpload
              accept="image"
              maxFiles={10}
              files={selectedImages}
              onChange={setSelectedImages}
              variant="solid"
              previewGridCols={4}
              className="mb-3"
            />
            <MediaUpload
              accept="video"
              maxFiles={5}
              files={selectedVideos}
              onChange={setSelectedVideos}
              variant="solid"
              previewGridCols={4}
            />
          </div>
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
