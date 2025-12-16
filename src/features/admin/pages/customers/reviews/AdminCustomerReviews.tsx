import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { SearchBar } from "@/components/ui/search-bar";
import type { Dayjs } from "dayjs";
import { DatePicker as AntdDatePicker } from "antd";
import { Button } from "@/components/ui/button";
import ReviewResponseModal from "@/components/ui/review-response-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  PageContainer,
  ContentCard,
  PageHeader,
} from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
import { getReviews, updateReview, deleteReview } from "@/api/endpoints/reviewApi";
import { toast } from "sonner";
import type { ReviewResponse, ReviewUpdateRequest } from "@/types/api";

// Helper function to get full image URL (same as ProductImages and CustomerReviews)
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined;
  
  // If already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative path starting with /, add base URL
  if (imageUrl.startsWith('/')) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${baseUrl}${imageUrl}`;
  }
  
  // If relative path not starting with /, assume it's from uploads
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${baseUrl}/static/${imageUrl}`;
};
interface Review {
  id: string;
  customerName: string;
  orderId: string;
  orderCode?: string; // Order code
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  reviewImages: string[];
  shopReply?: string;
  createdAt?: string;
  updatedAt?: string; // Time when shop replied (if shopReply exists)
}

const AdminCustomerReviews = () => {
  document.title = "Đánh giá sản phẩm | Wanderoo";

  const queryClient = useQueryClient();
  const [selectedRatings, setSelectedRatings] = useState<string[]>(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch reviews from API
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["admin-reviews", currentPage, selectedRatings, searchTerm, dateRange],
    queryFn: () => {
      const params: {
        page?: number;
        size?: number;
      } = {
        page: currentPage, // Backend uses 1-based pagination (Math.max(page, 1))
        size: itemsPerPage,
      };

      // Note: Rating, date range, and search filters are handled on frontend
      // as backend API does not support these filters

      return getReviews(params);
    },
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="w-5 h-5">
        <svg
          viewBox="0 0 24 24"
          fill={i < rating ? "#FFD700" : "#E5E5E5"}
          className="w-full h-full"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    ));
  };

  // Map API ReviewResponse to component Review interface
  const reviews = useMemo(() => {
    if (!reviewsData?.reviews) return [];
    
    return reviewsData.reviews.map((review: ReviewResponse) => ({
      id: review.id.toString(),
      customerName: review.userName || `User ${review.userId}`, // Use userName from API, fallback to User ID
      orderId: review.orderHistoryId?.toString() || `Order-${review.id}`, // Keep orderHistoryId for reference
      orderCode: review.orderCode || review.orderHistoryId?.toString() || `Order-${review.id}`, // Use orderCode from API, fallback to orderHistoryId
      productName: review.productName || `Product ${review.productDetailId}`, // Use productName from API, fallback to Product Detail ID
      productImage: review.images?.[0] || "/placeholder-product.jpg",
      rating: review.rating,
      comment: review.judging || "",
      reviewImages: review.images || [],
      shopReply: review.response || undefined,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt, // Time when shop replied (if shopReply exists)
    }));
  }, [reviewsData]);

  // Calculate rating counts
  const ratingOptions = useMemo(() => {
    const allReviews = reviews || [];
    return [
      { value: "all", label: "Tất cả", count: allReviews.length },
      {
        value: "5",
        label: "5 sao",
        count: allReviews.filter((r) => r.rating === 5).length,
      },
      {
        value: "4",
        label: "4 sao",
        count: allReviews.filter((r) => r.rating === 4).length,
      },
      {
        value: "3",
        label: "3 sao",
        count: allReviews.filter((r) => r.rating === 3).length,
      },
      {
        value: "2",
        label: "2 sao",
        count: allReviews.filter((r) => r.rating === 2).length,
      },
    ];
  }, [reviews]);

  // Filter reviews (client-side filtering for search and multiple ratings)
  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    
    return reviews.filter((review) => {
      // Rating filter (if multiple selected, filter on frontend)
      if (!selectedRatings.includes("all") && selectedRatings.length > 0) {
        if (!selectedRatings.includes(review.rating.toString())) {
          return false;
        }
      }
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !review.customerName.toLowerCase().includes(searchLower) &&
          !review.productName.toLowerCase().includes(searchLower) &&
          !review.comment.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      
      // Date range filter (if implemented)
      // TODO: Add date range filtering when dateRange is set
      
      return true;
    });
  }, [reviews, selectedRatings, searchTerm, dateRange]);

  // Pagination logic
  // If filtering on frontend (search or date range), use frontend pagination
  // Otherwise, use backend pagination
  const hasFrontendFilters = searchTerm || dateRange || (selectedRatings.length > 1 && !selectedRatings.includes("all"));
  
  const totalPages = hasFrontendFilters
    ? Math.ceil(filteredReviews.length / itemsPerPage)
    : (reviewsData?.totalPages || 1);
  
  const paginatedReviews = hasFrontendFilters
    ? filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredReviews;

  const handleReplyClick = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  // Update review mutation (for reply only)
  const updateReviewMutation = useMutation({
    mutationFn: (data: { reviewId: number; response: string; originalReview: ReviewResponse }) => {
      const updateData: ReviewUpdateRequest = {
        userId: data.originalReview.userId,
        productDetailId: data.originalReview.productDetailId,
        orderHistoryId: data.originalReview.orderHistoryId,
        images: data.originalReview.images,
        rating: data.originalReview.rating,
        judging: data.originalReview.judging,
        response: data.response,
      };
      return updateReview(data.reviewId, updateData);
    },
    onSuccess: () => {
      toast.success("Phản hồi đánh giá thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setIsModalOpen(false);
      setSelectedReview(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể phản hồi đánh giá";
      toast.error(errorMessage);
    },
  });

  // Update review mutation (for edit)
  const editReviewMutation = useMutation({
    mutationFn: (data: { reviewId: number; updateData: ReviewUpdateRequest }) => {
      return updateReview(data.reviewId, data.updateData);
    },
    onSuccess: () => {
      toast.success("Chỉnh sửa đánh giá thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setIsEditModalOpen(false);
      setSelectedReview(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể chỉnh sửa đánh giá";
      toast.error(errorMessage);
    },
  });

  const handleSubmitResponse = (response: string) => {
    if (!selectedReview) return;
    
    // Find original review data
    const originalReview = reviewsData?.reviews?.find(
      (r: ReviewResponse) => r.id.toString() === selectedReview.id
    );
    
    if (!originalReview) {
      toast.error("Không tìm thấy đánh giá");
      return;
    }
    
    updateReviewMutation.mutate({
      reviewId: parseInt(selectedReview.id),
      response: response.trim(),
      originalReview,
    });
  };

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      toast.success("Xóa đánh giá thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setIsDeleteConfirmOpen(false);
      setSelectedReview(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể xóa đánh giá";
      toast.error(errorMessage);
    },
  });

  const handleDeleteClick = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedReview) return;
    deleteReviewMutation.mutate(parseInt(selectedReview.id));
  };

  const handleEditClick = (review: Review) => {
    setSelectedReview(review);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedData: { rating: number; judging: string; response?: string }) => {
    if (!selectedReview) return;
    
    const originalReview = reviewsData?.reviews?.find(
      (r: ReviewResponse) => r.id.toString() === selectedReview.id
    );
    
    if (!originalReview) {
      toast.error("Không tìm thấy đánh giá");
      return;
    }
    
    const updateData: ReviewUpdateRequest = {
      userId: originalReview.userId,
      productDetailId: originalReview.productDetailId,
      orderHistoryId: originalReview.orderHistoryId,
      images: originalReview.images,
      rating: updatedData.rating,
      judging: updatedData.judging,
      response: updatedData.response || originalReview.response,
    };
    
    editReviewMutation.mutate({
      reviewId: parseInt(selectedReview.id),
      updateData,
    });
  };

  // Reset pagination when filters change
  const handleRatingChange = (ratings: string[]) => {
    setSelectedRatings(ratings);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <PageContainer>
      <PageHeader title="Danh sách đánh giá shop" />

      <ContentCard>
        {/* Star Rating Filter */}
        <div className="flex gap-[30px] items-center relative w-full flex-shrink-0">
          <p className="font-semibold leading-[1.4] relative text-[#272424] text-[14px] whitespace-pre font-['Montserrat']">
            Số sao đánh giá
          </p>
          <div className="flex gap-[20px] items-center relative">
            {ratingOptions.map((option) => {
              if (option.value === "all") {
                return (
                  <div
                    key="all"
                    className="flex gap-[8px] items-center relative"
                  >
                    <CustomCheckbox
                      checked={selectedRatings.includes("all")}
                      onChange={(checked) => {
                        if (checked) {
                          handleRatingChange(["all"]);
                        } else {
                          handleRatingChange([]);
                        }
                      }}
                      className="w-[20px] h-[20px]"
                    />
                    <p className="font-medium leading-[1.4] relative text-[#272424] text-[14px] whitespace-pre font-['Montserrat']">
                      {option.label}({option.count})
                    </p>
                  </div>
                );
              } else {
                return (
                  <div
                    key={option.value}
                    className="flex gap-[8px] items-center relative"
                  >
                    <CustomCheckbox
                      checked={selectedRatings.includes(option.value)}
                      onChange={(checked) => {
                        let next;
                        if (checked) {
                          next = [
                            ...selectedRatings.filter((r) => r !== "all"),
                            option.value,
                          ];
                        } else {
                          next = selectedRatings.filter(
                            (r) => r !== option.value
                          );
                        }
                        if (next.length === 0) next = ["all"];
                        handleRatingChange(next);
                      }}
                      className="w-[20px] h-[20px]"
                    />
                    <p className="font-medium leading-[1.4] relative text-[#272424] text-[14px] whitespace-pre font-['Montserrat']">
                      {option.label}({option.count})
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Search and Date Filter */}
        <div className="flex gap-[6px] items-center relative w-full flex-shrink-0">
          <div className="flex flex-row items-center self-stretch">
            <SearchBar
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Tìm kiếm"
              className="w-[360px] h-[38px] px-[16px] py-0 rounded-[12px]"
            />
          </div>
          <div className="flex gap-[6px] items-center">
            <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-[12px] h-[38px] flex items-center w-[500px]">
              <span className="text-[14px] text-[#272424] mr-[8px] whitespace-nowrap">
                Thời gian đánh giá
              </span>
              <AntdDatePicker.RangePicker
                value={dateRange ?? null}
                onChange={(values) => {
                  setDateRange(values ?? null);
                }}
                allowClear
                placeholder={["Chọn thời gian từ", "Chọn thời gian đến"]}
                bordered={false}
                style={{ height: 38, flex: 1 }}
              />
            </div>
            {/* Removed explicit clear button; use RangePicker's allowClear */}
          </div>
        </div>

        {/* Table Section */}
        {/* Table Header */}
        <div className="bg-[#e7e7e7] flex font-semibold items-center leading-[1.4] px-[20px] py-[8px] relative rounded-[10px] text-[#272424] text-[14px] w-full whitespace-pre font-['Montserrat'] flex-shrink-0">
          <p className="relative w-[300px]">Thông tin sản phẩm</p>
          <p className="relative flex-1 pl-[16px]">Đánh giá người mua</p>
          <p className="relative w-[140px] text-center">Thao tác</p>
        </div>

        {/* Review Items */}
        <div className="flex flex-col items-start overflow-clip gap-4 relative w-full flex-shrink-0">
          {isLoadingReviews ? (
            <div className="w-full px-[20px] py-[40px] text-center text-[#737373] text-[14px]">
              Đang tải đánh giá...
            </div>
          ) : paginatedReviews.length === 0 ? (
            <div className="w-full px-[20px] py-[40px] text-center text-[#737373] text-[14px]">
              Không có đánh giá nào
            </div>
          ) : (
            paginatedReviews.map((review) => (
            <div key={review.id} className="w-full">
              {/* Customer Header */}
              <div className="bg-[#f6f6f6] flex items-center overflow-clip px-[12px] py-0 relative rounded-tl-[10px] rounded-tr-[10px] w-full">
                <div className="flex gap-[8px] items-center px-[12px] py-[4px] relative">
                  <div className="relative rounded-full w-[28px] h-[28px] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {review.customerName.charAt(0)}
                    </span>
                  </div>
                  <p className="font-semibold leading-[1.4] opacity-60 relative text-[#272424] text-[14px] whitespace-pre font-['Montserrat']">
                    {review.customerName}
                  </p>
                  <span className="text-[#e04d30] opacity-70 mx-[8px] select-none">
                    |
                  </span>
                </div>

                <div className="flex gap-[8px] grow items-center overflow-clip px-[4px] py-[2px] relative">
                  <p className="font-medium leading-[1.4] relative text-[14px] whitespace-pre font-['Montserrat']">
                    <span className="text-[#272424]">Mã đơn hàng:</span>{" "}
                    <span className="text-[#1a71f6]">{review.orderCode || review.orderId}</span>
                  </p>
                  {review.createdAt && (
                    <>
                      <span className="text-[#e04d30] opacity-70 mx-[8px] select-none">
                        |
                      </span>
                      <p className="font-medium leading-[1.4] relative text-[14px] whitespace-pre font-['Montserrat'] text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Review Content */}
              <div className="border-[0px_1px_1px] border-[#e7e7e7] flex flex-col relative rounded-bl-[10px] rounded-br-[10px] w-full">
                {/* Main Content Row */}
                <div className="flex flex-row items-start w-full">
                  {/* Product Info */}
                  <div className="flex flex-col gap-[8px] items-start p-[16px] relative w-[300px] min-w-[300px]">
                    <div className="flex gap-[12px] items-start w-full">
                      <div className="border border-[#d1d1d1] relative w-[60px] h-[60px] bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden rounded">
                        {review.productImage && review.productImage !== "/placeholder-product.jpg" ? (
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-gray-500 text-xs">IMG</span>';
                            }}
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">IMG</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-[8px] items-start relative flex-1 flex-shrink-0 min-w-0">
                        <div className="font-medium leading-[1.4] relative text-[14px] text-black font-['Montserrat'] w-full">
                          <p className="mb-0 text-left">
                            {review.productName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="w-px bg-[#e7e7e7] self-stretch" />

                  {/* Review Details */}
                  <div className="flex flex-col gap-[12px] items-start p-[16px] relative flex-1 flex-shrink-0 min-w-0">
                    {/* Star Rating */}
                    <div className="flex gap-[2px] items-center relative">
                      {renderStars(review.rating)}
                    </div>
                    {/* Comment */}
                    <p className="font-medium leading-[1.4] relative text-[14px] text-[#272424] font-['Montserrat'] w-full">
                      {review.comment}
                    </p>

                    {/* Review Images */}
                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <div className="flex gap-[8px] items-center relative">
                        {review.reviewImages.map((image, index) => {
                          const imageUrl = getImageUrl(image);
                          return (
                            <div
                              key={index}
                              className="border border-[#d1d1d1] relative w-[60px] h-[60px] bg-gray-200 flex items-center justify-center overflow-hidden rounded cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                if (imageUrl) {
                                  window.open(imageUrl, '_blank');
                                }
                              }}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-gray-500 text-xs">IMG</span>';
                                  }}
                                />
                              ) : (
                                <span className="text-gray-500 text-xs">IMG</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Shop Reply below images, right section */}
                    {review.shopReply && (
                      <div className="mt-2 border border-[#e7e7e7] bg-[#fff5f1] rounded-[8px] p-[10px] w-full">
                        <div className="flex gap-[8px] items-start">
                          <div className="w-[8px] h-[8px] bg-[#e04d30] rounded-full flex-shrink-0 mt-[6px]"></div>
                          <div className="flex flex-col gap-[2px] items-start flex-1 flex-shrink-0 min-w-0">
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-semibold text-[14px] text-[#e04d30]">
                                Phản hồi từ shop
                              </span>
                              {review.updatedAt && (
                                <span className="text-[12px] text-gray-500">
                                  {new Date(review.updatedAt).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </div>
                            <span className="font-medium text-[14px] text-[#272424]">
                              {review.shopReply}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Divider */}
                  <div className="w-px bg-[#e7e7e7] self-stretch" />

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 items-center justify-center p-[16px] relative w-[160px] min-w-[160px]">
                    <Button
                      className={`w-full px-[12px] h-[32px] text-[14px] font-bold rounded-[10px] ${
                        review.shopReply || updateReviewMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleReplyClick(review)}
                      disabled={!!review.shopReply || updateReviewMutation.isPending}
                    >
                      {updateReviewMutation.isPending && selectedReview?.id === review.id
                        ? "Đang lưu..."
                        : review.shopReply
                        ? "Đã phản hồi"
                        : "Trả lời"}
                    </Button>
                    <Button
                      className="w-full px-[12px] h-[32px] text-[14px] font-bold rounded-[10px] bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleEditClick(review)}
                      disabled={updateReviewMutation.isPending || deleteReviewMutation.isPending || editReviewMutation.isPending}
                    >
                      {editReviewMutation.isPending && selectedReview?.id === review.id
                        ? "Đang lưu..."
                        : "Chỉnh sửa"}
                    </Button>
                    <Button
                      className="w-full px-[12px] h-[32px] text-[14px] font-bold rounded-[10px] bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDeleteClick(review)}
                      disabled={updateReviewMutation.isPending || deleteReviewMutation.isPending || editReviewMutation.isPending}
                    >
                      {deleteReviewMutation.isPending && selectedReview?.id === review.id
                        ? "Đang xóa..."
                        : "Xóa"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </ContentCard>

      {/* Review Response Modal */}
      <ReviewResponseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmitResponse}
        customerName={selectedReview?.customerName || ""}
        initialResponse={selectedReview?.shopReply || ""}
      />

      {/* Edit Review Modal */}
      {isEditModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setIsEditModalOpen(false);
              setSelectedReview(null);
            }}
          />
          <div className="bg-white relative rounded-[12px] w-[95%] max-w-[650px] shadow-xl">
            <div className="px-[16px] py-[16px] border-b border-[#d1d1d1]">
              <h3 className="font-bold text-[#272424] text-[16px]">
                Chỉnh sửa đánh giá
              </h3>
            </div>
            <div className="px-[16px] pt-[16px] pb-[10px] space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Số sao đánh giá</label>
                <select
                  value={selectedReview.rating}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      rating: Number(e.target.value),
                    })
                  }
                  className="w-full border-2 border-gray-300 rounded-[12px] p-2"
                >
                  {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>
                      {star} sao
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nội dung đánh giá</label>
                <textarea
                  value={selectedReview.comment}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      comment: e.target.value,
                    })
                  }
                  className="w-full border-2 border-gray-300 rounded-[12px] p-2"
                  rows={4}
                />
              </div>
              {selectedReview.shopReply && (
                <div>
                  <label className="block text-sm font-medium mb-2">Phản hồi từ shop</label>
                  <textarea
                    value={selectedReview.shopReply}
                    onChange={(e) =>
                      setSelectedReview({
                        ...selectedReview,
                        shopReply: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-300 rounded-[12px] p-2"
                    rows={3}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-[10px] items-center justify-end px-[16px] pt-[8px] pb-[12px]">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedReview(null);
                }}
                className="text-[14px]"
              >
                Huỷ
              </Button>
              <Button
                onClick={() => {
                  handleEditSubmit({
                    rating: selectedReview.rating,
                    judging: selectedReview.comment,
                    response: selectedReview.shopReply,
                  });
                }}
                className="text-[14px]"
                disabled={editReviewMutation.isPending}
              >
                {editReviewMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setSelectedReview(null);
              }}
            >
              Huỷ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteReviewMutation.isPending}
            >
              {deleteReviewMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default AdminCustomerReviews;
