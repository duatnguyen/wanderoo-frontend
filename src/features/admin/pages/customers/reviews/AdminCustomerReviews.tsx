import { useState } from "react";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { SearchBar } from "@/components/ui/search-bar";
import type { Dayjs } from "dayjs";
import { DatePicker as AntdDatePicker } from "antd";
import { Button } from "@/components/ui/button";
import ReviewResponseModal from "@/components/ui/review-response-modal";

interface Review {
  id: string;
  customerName: string;
  orderId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  reviewImages: string[];
  shopReply?: string;
}

const AdminCustomerReviews = () => {
  document.title = "Đánh giá sản phẩm | Wanderoo";

  const [selectedRatings, setSelectedRatings] = useState<string[]>(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const [reviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "Thanh",
      orderId: "250905P0AYWQGB",
      productName: "Tất leo núi cao cổ Gothiar Performa Crew Socks",
      productImage: "/placeholder-product.jpg",
      rating: 5,
      comment: "OK hang dep lam",
      reviewImages: [
        "/placeholder-review1.jpg",
        "/placeholder-review2.jpg",
        "/placeholder-review3.jpg",
      ],
    },
    {
      id: "2",
      customerName: "Hanh",
      orderId: "250926F1S59D8H",
      productName: "Bếp ga gấp gọn Snowline Plate Stove II SN75UGG006",
      productImage: "/placeholder-product.jpg",
      rating: 5,
      comment: "Hàng ổn trong tầm giá, sẽ ủng hộ trong lần tiếp theo!",
      reviewImages: [
        "/placeholder-review1.jpg",
        "/placeholder-review2.jpg",
        "/placeholder-review3.jpg",
      ],
      shopReply:
        "Shop cảm ơn bạn đã yêu thích sản phẩm của shop và đánh giá 5 sao cho shop. Đây là động lực giúp shop tiếp tục cô găng và phục vụ khách hàng, đem đến những sản phẩm tôt nhất. Rất mong sẽ được tiếp tục phục vụ bạn ở những đơn hàng tiếp theo!",
    },
    {
      id: "3",
      customerName: "Minh",
      orderId: "250927A2B3C4D5",
      productName: "Áo khoác nam",
      productImage: "/placeholder-product.jpg",
      rating: 4,
      comment: "Chất lượng tốt, giá hợp lý",
      reviewImages: ["/placeholder-review1.jpg"],
    },
    {
      id: "4",
      customerName: "Linh",
      orderId: "250928E6F7G8H9",
      productName: "Giày thể thao",
      productImage: "/placeholder-product.jpg",
      rating: 3,
      comment: "Sản phẩm bình thường",
      reviewImages: ["/placeholder-review1.jpg", "/placeholder-review2.jpg"],
    },
  ]);

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

  const ratingOptions = [
    { value: "all", label: "Tất cả", count: reviews.length },
    {
      value: "5",
      label: "5 sao",
      count: reviews.filter((r) => r.rating === 5).length,
    },
    {
      value: "4",
      label: "4 sao",
      count: reviews.filter((r) => r.rating === 4).length,
    },
    {
      value: "3",
      label: "3 sao",
      count: reviews.filter((r) => r.rating === 3).length,
    },
    {
      value: "2",
      label: "2 sao",
      count: reviews.filter((r) => r.rating === 2).length,
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    if (!selectedRatings.includes("all") && selectedRatings.length > 0) {
      if (!selectedRatings.includes(review.rating.toString())) {
        return false;
      }
    }
    if (
      searchTerm &&
      !review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !review.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleReplyClick = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleSubmitResponse = (response: string) => {
    // TODO: Implement API call to submit the response
    console.log("Submitting response:", response);
    console.log("For review:", selectedReview?.id);
    // Update the review with the response
  };

  return (
    <div className="flex flex-col gap-0 items-start relative w-full -mt-[15px] overflow-x-auto overflow-y-auto table-scroll-container">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-0 py-[8px] min-w-[968px]">
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
          Danh sách đánh giá shop
        </h2>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-[#e7e7e7] flex flex-col items-start relative rounded-[24px] w-full flex-shrink-0 min-w-[968px]">
        {/* Filter Section */}
        <div className="flex flex-col gap-[15px] items-center px-[20px] py-[16px] relative rounded-[24px] w-full flex-shrink-0">
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
                            setSelectedRatings(["all"]);
                          } else {
                            setSelectedRatings([]);
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
                          setSelectedRatings(next);
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        {/* Table Section */}
        <div className="flex flex-col items-start overflow-clip px-[15px] gap-4 relative rounded-[24px] w-full flex-shrink-0">
          {/* Table Header */}
          <div className="bg-[#e7e7e7] flex font-semibold items-center justify-between leading-[1.4] px-[20px] py-[8px] relative rounded-[10px] text-[#272424] text-[14px] w-full whitespace-pre font-['Montserrat'] flex-shrink-0">
            <p className="relative">Thông tin sản phẩm</p>
            <p className="relative">Đánh giá người mua</p>
            <p className="relative">Thao tác</p>
          </div>

          {/* Review Items */}
          <div className="flex flex-col items-start overflow-clip gap-4 relative w-full flex-shrink-0">
            {filteredReviews.map((review) => (
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
                      <span className="text-[#272424]">ID đơn hàng:</span>{" "}
                      <span className="text-[#1a71f6]">{review.orderId}</span>
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="border-[0px_1px_1px] border-[#e7e7e7] flex flex-col relative rounded-bl-[10px] rounded-br-[10px] w-full">
                  {/* Main Content Row */}
                  <div className="flex flex-row items-start w-full">
                    {/* Product Info */}
                    <div className="flex flex-col gap-[8px] items-start p-[16px] relative w-[300px] min-w-[300px]">
                      <div className="flex gap-[12px] items-start w-full">
                        <div className="border border-[#d1d1d1] relative w-[60px] h-[60px] bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 text-xs">IMG</span>
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
                      <div className="flex gap-[8px] items-center relative">
                        {review.reviewImages.map((_, index) => (
                          <div
                            key={index}
                            className="border border-[#d1d1d1] relative w-[60px] h-[60px] bg-gray-200 flex items-center justify-center"
                          >
                            <span className="text-gray-500 text-xs">IMG</span>
                          </div>
                        ))}
                      </div>

                      {/* Shop Reply below images, right section */}
                      {review.shopReply && (
                        <div className="mt-2 border border-[#e7e7e7] bg-[#fff5f1] rounded-[8px] p-[10px] w-full">
                          <div className="flex gap-[8px] items-start">
                            <div className="w-[8px] h-[8px] bg-[#e04d30] rounded-full flex-shrink-0 mt-[6px]"></div>
                            <div className="flex flex-col gap-[2px] items-start flex-1 flex-shrink-0 min-w-0">
                              <span className="font-semibold text-[14px] text-[#e04d30]">
                                Phản hồi từ shop
                              </span>
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

                    {/* Action Button */}
                    <div className="flex items-center justify-center p-[16px] relative w-[160px] min-w-[160px]">
                      <Button
                        className={`w-auto px-[12px] h-[32px] text-[14px] font-bold rounded-[10px] ${
                          review.shopReply
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleReplyClick(review)}
                        disabled={!!review.shopReply}
                      >
                        {review.shopReply ? "Đã phản hồi" : "Trả lời"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Response Modal */}
      <ReviewResponseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmitResponse}
        customerName={selectedReview?.customerName || ""}
        initialResponse={selectedReview?.shopReply || ""}
      />
    </div>
  );
};

export default AdminCustomerReviews;
