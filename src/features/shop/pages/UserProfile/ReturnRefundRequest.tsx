import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../components/shop/Button";
import { Textarea, Input } from "../../../../components/shop/Input";
import DropdownList from "../../../../components/shop/DropdownList";
import MediaUpload from "../../../../components/shop/MediaUpload";

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

interface ProductType {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
}

interface OrderData {
  id: string;
  orderDate: string;
  product: ProductType;
}

const ReturnRefundRequest: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order, product, and option data from route state
  const { order, product, option } =
    (location.state as {
      order?: OrderData;
      product?: ProductType;
      option?: "received-with-issue" | "not-received";
    }) || {};

  const requestType = option || "received-with-issue"; // Default to received-with-issue for backward compatibility
  const isNotReceived = requestType === "not-received";

  // Default data if not passed via state (for development/testing)
  const defaultOrder: OrderData = {
    id: "WB0303168522",
    orderDate: "25/08/2025",
    product: {
      id: "1",
      imageUrl: "/api/placeholder/100/100",
      name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
      price: 199000,
      originalPrice: 230000,
      variant: "Đen",
      quantity: 1,
    },
  };

  const orderData = order || defaultOrder;
  const productData = product || orderData.product;

  // Form state
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [bankInfo, setBankInfo] = useState("");
  const [email, setEmail] = useState("");

  const maxImages = 6;
  const maxVideos = 1;

  const handleSubmit = () => {
    // Validate required fields
    if (!reason || !description.trim() || !bankInfo.trim() || !email.trim()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Submit the return/refund request
    console.log("Return/refund request submitted:", {
      orderId: orderData.id,
      productId: productData.id,
      requestType: requestType,
      reason,
      description,
      images: isNotReceived ? [] : images,
      videos: isNotReceived ? [] : videos,
      bankInfo,
      email,
      refundAmount: productData.price,
    });

    // Navigate back or show success message
    // navigate("/user/profile/orders");
  };

  const refundAmount = productData.price;

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isNotReceived
              ? "Tôi chưa nhận hàng/thùng hàng rỗng"
              : "Yêu cầu Trả hàng/Hoàn tiền"}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Situation Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Tình huống bạn đang gặp?
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              {isNotReceived
                ? "Tôi chưa nhận hàng/thùng hàng rỗng"
                : "Tôi đã nhận hàng nhưng hàng có vấn đề (bể vỡ, sai mẫu, hàng lỗi, khác mô tả...) - Miễn ship hoàn về"}
            </p>
          </div>

          {/* Selected Product Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Sản phẩm đã chọn
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span>Đơn hàng: #{orderData.id}</span>
                <span>|</span>
                <span>Ngày đặt hàng: {orderData.orderDate}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <img
                  src={productData.imageUrl}
                  alt={productData.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/100";
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                    {productData.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-base sm:text-lg font-semibold text-red-600">
                      {formatCurrencyVND(productData.price)}
                    </span>
                    {productData.variant && (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {productData.variant}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    Số lượng: {productData.quantity}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return/Refund Form Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              Chọn sản phẩm cần Trả hàng và Hoàn tiền
            </h2>

            <div className="space-y-6">
              {/* Reason Dropdown */}
              <DropdownList
                label="Lý do"
                value={reason}
                onChange={(value) => setReason(value)}
                required
                options={[
                  { value: "", label: "Chọn lý do" },
                  { value: "empty-package", label: "Thùng hàng rỗng" },
                  { value: "not-received", label: "Chưa nhận được hàng" },
                  { value: "broken", label: "Bể vỡ" },
                  { value: "wrong-model", label: "Sai mẫu" },
                  { value: "defective", label: "Hàng lỗi" },
                  { value: "different-description", label: "Khác mô tả" },
                  { value: "other", label: "Lý do khác" },
                ]}
              />

              {/* Description Textarea */}
              <Textarea
                label="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Chi tiết vấn đề bạn gặp phải"
                rows={4}
                required
              />

              {/* File Upload Section - Show for received-with-issue or empty package */}
              {(!isNotReceived || reason === "empty-package") && (
                <div className="space-y-3 flex flex-row gap-4">
                  <MediaUpload
                    accept="image"
                    maxFiles={maxImages}
                    files={images}
                    onChange={setImages}
                    variant="dashed"
                    previewGridCols={4}
                  />
                  <MediaUpload
                    accept="video"
                    maxFiles={maxVideos}
                    files={videos}
                    onChange={setVideos}
                    variant="dashed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Solution Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Phương án:{" "}
              {reason === "empty-package"
                ? "Hoàn Tiền Ngay"
                : "Trả hàng và Hoàn tiền"}
            </h2>
            <p className="text-sm text-gray-600">
              {reason === "empty-package"
                ? "Hoàn Tiền Ngay (không trả hàng)"
                : "Trả hàng và Hoàn tiền"}
            </p>
          </div>

          {/* Refund Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              Thông tin hoàn tiền
            </h2>
            <div className="space-y-4">
              {/* Refund Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền hoàn lại
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-base sm:text-lg font-semibold text-gray-900">
                  {formatCurrencyVND(refundAmount)}
                </div>
              </div>

              {/* Bank Account */}
              <Input
                label="Hoàn tiền vào"
                type="text"
                value={bankInfo}
                onChange={(e) => setBankInfo(e.target.value)}
                placeholder="Nhập Ngân Hàng + Số tài khoản ngân hàng + Tên người thụ hưởng"
                required
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base text-gray-600">
                  Số tiền hoàn nhận được:
                </span>
                <span className="text-lg sm:text-xl font-bold text-red-600">
                  {formatCurrencyVND(refundAmount)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto border-orange-400 text-orange-600 hover:bg-orange-50"
                >
                  Trở Lại
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                >
                  Hoàn thành
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundRequest;
