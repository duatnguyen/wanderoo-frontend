import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";

function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")}đ`;
  }
}

const ReturnRefundPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");
  const situationId = searchParams.get("situation");

  // Mock data - In real app, fetch from API using orderId and productId
  const order = {
    id: orderId || "WB0303168522",
    orderDate: "25/08/2025",
  };

  const product = {
    id: productId || "1",
    name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
    imageUrl: "/api/placeholder/100/100",
    price: 199000,
    variant: "Đen",
    quantity: 1,
  };

  const situation =
    situationId === "received-problem"
      ? "Tôi đã nhận hàng nhưng hàng có vấn đề (bể vỡ, sai mẫu, hàng lỗi, khác mô tả...) - Miễn ship hoàn về"
      : "Tôi chưa nhận hàng/thùng hàng rỗng";

  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [bankInfo, setBankInfo] = useState("");
  const [email, setEmail] = useState("");

  const reasons = [
    "Hàng bị hỏng/hư",
    "Hàng không đúng với mô tả",
    "Thiếu hàng",
    "Gửi nhầm hàng",
    "Khác",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(
        0,
        6 - selectedImages.length
      );
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && selectedVideos.length === 0) {
      const file = e.target.files[0];
      setSelectedVideos([file]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = () => {
    setSelectedVideos([]);
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do trả hàng");
      return;
    }
    if (!bankInfo) {
      alert("Vui lòng nhập thông tin ngân hàng");
      return;
    }
    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }
    console.log("Return/Refund request submitted:", {
      orderId,
      productId,
      situation,
      reason: selectedReason,
      description,
      images: selectedImages,
      videos: selectedVideos,
      bankInfo,
      email,
    });
    // In real app, submit to API
    navigate("/user/profile/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Yêu cầu Trả hàng/Hoàn tiền
        </h1>

        {/* Situation Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tình huống bạn đang gặp?
          </h2>
          <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-900">{situation}</span>
          </div>
        </div>

        {/* Selected Product Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sản phẩm đã chọn
          </h2>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Đơn hàng: #{order.id} | Ngày đặt hàng: {order.orderDate}
            </div>
            <div className="flex gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/100";
                }}
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-red-600">
                    {formatCurrencyVND(product.price)}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {product.variant}
                  </span>
                  <span className="text-gray-600">
                    Số lượng: {product.quantity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return/Refund Details Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Chọn sản phẩm cần Trả hàng và Hoàn tiền
          </h2>
          <div className="space-y-4">
            {/* Reason Dropdown */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Lý do:
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base"
              >
                <option value="">Chọn lý do</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Mô tả:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Chi tiết vấn đề bạn gặp phải"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none text-sm sm:text-base"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Đăng tải hình ảnh hoặc video thấy rõ chi tiết vấn đề bạn gặp
                phải
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={selectedImages.length >= 6}
                  />
                  <button
                    type="button"
                    disabled={selectedImages.length >= 6}
                    className="px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Thêm hình ảnh ({selectedImages.length}/6)
                  </button>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    disabled={selectedVideos.length >= 1}
                  />
                  <button
                    type="button"
                    disabled={selectedVideos.length >= 1}
                    className="px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Thêm video ({selectedVideos.length}/1)
                  </button>
                </label>
              </div>

              {/* Display Selected Images */}
              {selectedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Evidence ${index + 1}`}
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

              {/* Display Selected Video */}
              {selectedVideos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedVideos.map((video, index) => (
                    <div key={index} className="relative">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Phương án:
          </h2>
          <span className="text-base text-gray-900">Trả hàng và Hoàn tiền</span>
        </div>

        {/* Refund Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin hoàn tiền
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-base font-medium text-gray-900">
                Số tiền hoàn lại:
              </span>
              <span className="text-lg font-bold text-red-600 ml-3">
                {formatCurrencyVND(product.price)}
              </span>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Hoàn tiền vào<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={bankInfo}
                onChange={(e) => setBankInfo(e.target.value)}
                placeholder="Nhập Ngân Hàng + Số tài khoản ngân hàng + Tên người thụ hưởng"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-sm text-gray-600">
              Số tiền hoàn nhận được
            </span>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrencyVND(product.price)}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate("/user/profile/orders")}
              className="border-[#ea5b0c] text-[#ea5b0c] hover:bg-[#ea5b0c] hover:text-white"
            >
              Trở Lại
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              className="px-6"
            >
              Hoàn thành
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPage;
