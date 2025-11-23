import React, { useState } from "react";
import { Select } from "antd";

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

const CustomerReviews: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasComment, setHasComment] = useState(false);
  const [hasMedia, setHasMedia] = useState(false);

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
                <div className="text-[14px] font-bold text-gray-900">4.8</div>
                <div className="text-[14px] text-gray-500">428 Lượt đánh giá</div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                    activeFilter === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  5 sao (25)
                </button>
                <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  4 sao (3)
                </button>
                <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  3 sao (2)
                </button>
                <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  2 sao (0)
                </button>
                <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  1 sao (0)
                </button>
                <button
                  onClick={() => setHasComment(!hasComment)}
                  className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                    hasComment
                      ? "bg-[#e9502c] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Có bình luận
                </button>
                <button
                  onClick={() => setHasMedia(!hasMedia)}
                  className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                    hasMedia
                      ? "bg-[#e9502c] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Có hình ảnh/ Video
                </button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {/* Review 1 */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-gray-300 bg-transparent" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] font-bold text-gray-900">Linh</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} filled={true} />
                      ))}
                    </div>
                  </div>
                  <div className="text-[14px] text-gray-500 mb-2">
                    11/08/2025 | Phân loại hàng: Size 37
                  </div>
                  <p className="text-[14px] text-gray-700 mb-3">
                    Sản phẩm tốt. Chuẩn chính hãng. Giao hàng nhanh. Sẽ ủng hộ
                    thêm nếu có cơ hội
                  </p>
                  <div className="flex gap-2">
                    <div className="w-20 h-20 rounded-lg border border-gray-300 bg-transparent" />
                    <div className="w-20 h-20 rounded-lg border border-gray-300 bg-transparent" />
                    <div className="w-20 h-20 rounded-lg border border-gray-300 bg-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-gray-300 bg-transparent" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] font-bold text-gray-900">Nguyễn Du</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} filled={true} />
                      ))}
                    </div>
                  </div>
                  <div className="text-[14px] text-gray-500 mb-2">
                    11/08/2025 | Phân loại hàng: Size 37
                  </div>
                  <p className="text-[14px] text-gray-700">
                    Ok đẹp lắm nha nma mình thấy màu đen với cái để nâu hơi đấm
                    nhau xíu còn lại rất ok, vẫn là cho shop 5 sao nha
                  </p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-gray-300 bg-transparent" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] font-bold text-gray-900">Thanh</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} filled={true} />
                      ))}
                    </div>
                  </div>
                  <div className="text-[14px] text-gray-500 mb-2">
                    11/08/2025 | Phân loại hàng: Size 37
                  </div>
                  <p className="text-[14px] text-gray-700">
                    Sản phẩm tốt. Chuẩn chính hãng. Giao hàng nhanh. Sẽ ủng hộ
                    thêm nếu có cơ hội
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-[14px] text-gray-700">Trang hiện tại</span>
            <Select
              value="1"
              onChange={() => {}}
              className="w-auto min-w-[80px]"
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
            />
            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
              disabled
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;

