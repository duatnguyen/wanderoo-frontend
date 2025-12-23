import React, { useMemo, useState } from "react";
import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getPublicReviewsByProduct } from "../../../api/endpoints/reviewApi";
import type { ReviewResponse } from "../../../types";

// Helper function to get full media URL (same as ProductImages)
const getMediaUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;

  // If already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If relative path starting with /, add base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }

  // If relative path not starting with /, assume it's from uploads
  return `${baseUrl}/static/${url}`;
};

// Detect if a media url is video based on common extensions
const isVideoUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return [
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".flv",
    ".wmv",
    ".m4v",
    ".3gp",
  ].some((ext) => lower.includes(ext));
};

const Star: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    className={filled ? "text-yellow-400" : "text-gray-300"}
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

interface CustomerReviewsProps {
  productId?: number | null;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ productId }) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-reviews", productId, currentPage, pageSize],
    queryFn: () => {
      if (!productId) {
        throw new Error("Product ID is required");
      }
      return getPublicReviewsByProduct({
        productId,
        page: currentPage,
        size: pageSize,
      });
    },
    enabled: !!productId,
  });

  const allReviews: ReviewResponse[] = data?.reviews ?? [];

  const filteredReviews = useMemo(() => {
    if (activeFilter === "all") return allReviews;
    const rating = Number(activeFilter);
    return allReviews.filter((r) => r.rating === rating);
  }, [allReviews, activeFilter]);

  // Stats should be calculated from total reviews, not just current page
  // For now, we'll use the current page reviews, but ideally backend should return total stats
  const stats = useMemo(() => {
    if (!allReviews.length) {
      return {
        average: 0,
        total: data?.totalElements ?? 0, // Use totalElements from API if available
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
      };
    }
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of allReviews) {
      sum += r.rating;
      if (counts[r.rating as 1 | 2 | 3 | 4 | 5] !== undefined) {
        counts[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    }
    return {
      average: Math.round((sum / allReviews.length) * 10) / 10,
      total: data?.totalElements ?? allReviews.length, // Use totalElements from API
      counts, // Note: counts are only for current page, not all reviews
    };
  }, [allReviews, data?.totalElements]);

  const totalPages = data?.totalPages ?? 1;

  return (
    <section className="w-full bg-gray-50 py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-[20px] font-bold text-gray-900 mb-6">
            Đánh Giá Sản Phẩm
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Overall Rating */}
            <div className="flex items-center gap-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 20 20"
                className="text-yellow-400"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <div>
                <div className="text-[14px] font-bold text-gray-900">
                  {stats.average.toFixed(1)}
                </div>
                <div className="text-[14px] text-gray-500">
                  {stats.total} lượt đánh giá
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${activeFilter === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Tất cả ({stats.total})
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => setActiveFilter(star.toString() as any)}
                    className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${activeFilter === star.toString()
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {star} sao ({stats.counts[star]})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {isLoading && (
              <div className="text-center text-sm text-gray-500 py-8">
                Đang tải đánh giá...
              </div>
            )}
            {isError && !isLoading && (
              <div className="text-center text-sm text-red-500 py-8">
                Không thể tải đánh giá sản phẩm. Vui lòng thử lại sau.
              </div>
            )}
            {!isLoading && !isError && filteredReviews.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-8">
                Chưa có đánh giá nào cho sản phẩm này.
              </div>
            )}
            {!isLoading &&
              !isError &&
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {review.userName
                        ? review.userName.charAt(0).toUpperCase()
                        : `U${review.userId}`}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[14px] font-bold text-gray-900">
                          {review.userName || `Người dùng ${review.userId}`}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} filled={i < review.rating} />
                          ))}
                        </div>
                      </div>
                      <div className="text-[12px] text-gray-500 mb-2">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                      <p className="text-[14px] text-gray-700 mb-3">
                        {review.judging || review.comment || "Không có nội dung bình luận."}
                      </p>
                      {(() => {
                        // Gộp media: ảnh và video (video có thể nằm trong images hoặc videos)
                        const mediaItems = [
                          ...(review.images || []).map((m) => ({ url: m, isVideo: isVideoUrl(m) })),
                          ...(review.videos || []).map((v) => ({ url: v, isVideo: true })),
                        ];

                        if (mediaItems.length === 0) return null;

                        return (
                          <div className="flex gap-2 flex-wrap mb-3">
                            {mediaItems.map((item, idx) => {
                              const mediaUrl = getMediaUrl(item.url);
                              const hasMedia = Boolean(mediaUrl);
                              const isVideo = item.isVideo;

                              return (
                                <div
                                  key={idx}
                                  className={`w-16 h-16 rounded-lg border border-gray-300 overflow-hidden relative flex items-center justify-center transition-all ${isVideo
                                    ? hasMedia
                                      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 cursor-pointer hover:shadow-lg"
                                      : "bg-gray-100"
                                    : "bg-gray-100 cursor-pointer hover:opacity-80"
                                    }`}
                                  onClick={() => {
                                    if (hasMedia && mediaUrl) {
                                      window.open(mediaUrl, "_blank");
                                    }
                                  }}
                                >
                                  {isVideo ? (
                                    <div className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold">
                                      <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${hasMedia ? "bg-black/40 text-white" : "bg-gray-200 text-gray-500"
                                          }`}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          className="w-4 h-4"
                                        >
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                      <span className={hasMedia ? "text-gray-100" : "text-gray-500"}>VIDEO</span>
                                    </div>
                                  ) : (
                                    <>
                                      {hasMedia ? (
                                        <img
                                          src={mediaUrl}
                                          alt={`Hình ảnh đánh giá ${idx + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            const parent = target.parentElement;
                                            if (parent && !parent.querySelector(".image-placeholder")) {
                                              const placeholder = document.createElement("span");
                                              placeholder.className = "image-placeholder text-[10px] text-gray-400";
                                              placeholder.textContent = "IMG";
                                              parent.appendChild(placeholder);
                                            }
                                          }}
                                        />
                                      ) : (
                                        <span className="text-[10px] text-gray-400">IMG</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                      {/* Admin Response */}
                      {review.response && (
                        <div className="mt-3 border-l-4 border-[#e04d30] bg-[#fff5f1] rounded-r-lg p-3">
                          <div className="flex gap-2 items-start">
                            <div className="w-2 h-2 bg-[#e04d30] rounded-full flex-shrink-0 mt-1.5"></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
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
                              <span className="text-[14px] text-gray-700">
                                {review.response}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="text-[14px] text-gray-700">Trang hiện tại</span>
              <Select
                value={currentPage.toString()}
                onChange={(value) => setCurrentPage(Number(value))}
                className="w-auto min-w-[80px]"
                options={Array.from({ length: totalPages }).map((_, idx) => ({
                  value: (idx + 1).toString(),
                  label: (idx + 1).toString(),
                }))}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
