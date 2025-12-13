import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../components/shop/Button";
import { Textarea, Input } from "../../../../components/shop/Input";
import { Select } from "antd";
import MediaUpload from "../../../../components/shop/MediaUpload";
import { customerReturnOrderApi } from "../../../../api/customerReturnOrderApi";
import { toast } from "sonner";

function formatCurrencyVND(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

interface ProductType {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
  orderDetailId?: number; // Order detail ID for return order
  productDetailId?: number; // Product detail ID for return order
}

// OrderData interface is no longer needed, using order object with id and orderDate

const ReturnRefundRequest: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order, product/products, and option data from route state
  const { order, product, products, option } =
    (location.state as {
      order?: { id: string; orderDate: string };
      product?: ProductType;
      products?: ProductType[]; // For multiple products from selection page
      option?: "received-with-issue" | "not-received";
    }) || {};

  const requestType = option || "received-with-issue"; // Default to received-with-issue for backward compatibility
  const isNotReceived = requestType === "not-received";

  // Default data if not passed via state (for development/testing)
  const defaultOrder = {
    id: "WB0303168522",
    orderDate: "25/08/2025",
  };

  const orderData = order || defaultOrder;

  // Handle multiple products or single product
  const selectedProducts = products || (product ? [product] : []);

  // For backward compatibility, use first product as productData
  const productData = product ||
    selectedProducts[0] || {
      id: "1",
      imageUrl: "",
      name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
      price: 199000,
      originalPrice: 230000,
      variant: "Đen",
      quantity: 1,
    };

  // Form state
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [bankInfo, setBankInfo] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxImages = 6;
  const maxVideos = 1;

  // Map reason to returnType
  const getReturnType = (reason: string): string => {
    const reasonMap: Record<string, string> = {
      "empty-package": "EMPTY_PACKAGE",
      "not-received": "NOT_RECEIVED",
      "broken": "BROKEN",
      "wrong-model": "WRONG_MODEL",
      "defective": "DEFECTIVE",
      "different-description": "DIFFERENT_DESCRIPTION",
      "other": "OTHER",
    };
    return reasonMap[reason] || "OTHER";
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!reason || !description.trim() || !bankInfo.trim() || !email.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate that all products have orderDetailId and productDetailId
    const invalidProducts = selectedProducts.filter(
      (p) => !p.orderDetailId || !p.productDetailId
    );
    if (invalidProducts.length > 0) {
      toast.error("Thông tin sản phẩm không đầy đủ. Vui lòng thử lại.");
      return;
    }

    // Validate orderId
    const orderId = parseInt(orderData.id);
    if (isNaN(orderId)) {
      toast.error("Mã đơn hàng không hợp lệ");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare return order details
      const returnOrderDetails = selectedProducts.map((product) => ({
        orderDetailId: product.orderDetailId!,
        productDetailId: product.productDetailId!,
        returnQuantity: product.quantity || 1,
        notes: description, // Use description as notes for each detail
      }));

      // Create return order request
      const request = {
        orderId,
        returnType: getReturnType(reason),
        reason: reason,
        notes: `${description}\n\nThông tin hoàn tiền:\n- Ngân hàng: ${bankInfo}\n- Email: ${email}`,
        returnOrderDetails,
      };

      // Call API to create return order
      const response = await customerReturnOrderApi.createReturnOrder(request);

      toast.success("Tạo yêu cầu hoàn trả hàng thành công!", {
        description: `Mã yêu cầu: ${response.orderCode || response.id}`,
        duration: 5000,
      });

      // Navigate to orders page or return order detail page
      navigate("/user/profile/orders", {
        state: { 
          message: "Yêu cầu hoàn trả hàng đã được tạo thành công",
          returnOrderId: response.id 
        },
      });
    } catch (error: any) {
      console.error("Error creating return order:", error);
      toast.error("Không thể tạo yêu cầu hoàn trả hàng", {
        description: error.message || "Vui lòng thử lại sau",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total refund amount from all selected products
  const refundAmount = selectedProducts.reduce(
    (sum, p) => sum + p.price * (p.quantity || 1),
    0
  );

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

          {/* Selected Products Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Sản phẩm đã chọn
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span>Đơn hàng: #{orderData.code}</span>
                <span>|</span>
                <span>Ngày đặt hàng: {orderData.orderDate}</span>
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-300 bg-transparent flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg font-semibold text-red-600">
                          {formatCurrencyVND(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[12px] text-gray-500 line-through">
                            {formatCurrencyVND(product.originalPrice)}
                          </span>
                        )}
                        {product.variant && (
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                            {product.variant}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        Số lượng: {product.quantity || 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Return/Refund Form Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
              Thông tin yêu cầu trả hàng/hoàn tiền
            </h2>

            <div className="space-y-6">
              {/* Reason Dropdown */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do <span className="text-red-500">*</span>
                </label>
                <Select
                  value={reason}
                  onChange={(value) => setReason(value)}
                  placeholder="Chọn lý do"
                  className="w-full"
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
              </div>

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
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang xử lý..." : "Hoàn thành"}
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
