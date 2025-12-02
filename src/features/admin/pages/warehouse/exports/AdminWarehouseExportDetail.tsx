import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import { getInvoiceDetail, confirmInvoiceProductStatus, confirmInvoicePayment } from "@/api/endpoints/warehouseApi";
import type { InvoiceDetailResponse, PaymentRequest, PaymentMethod } from "@/types/warehouse";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import { FormInput } from "@/components/ui/form-input";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";

const AdminWarehouseExportDetail: React.FC = () => {
  const navigate = useNavigate();
  const { exportId } = useParams<{ exportId: string }>();
  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Chọn hình thức thanh toán");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Form validation errors
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const [paymentAmountError, setPaymentAmountError] = useState("");
  const [referenceCodeError, setReferenceCodeError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Fetch invoice detail from API
  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      if (!exportId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const invoiceId = parseInt(exportId, 10);
        if (isNaN(invoiceId)) {
          setError("Mã đơn hàng không hợp lệ");
          setLoading(false);
          return;
        }

        const data = await getInvoiceDetail(invoiceId);
        setInvoiceDetail(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching invoice detail:", err);
        setError(err?.response?.data?.message || "Không thể tải thông tin đơn hàng");
        toast.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetail();
  }, [exportId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    })
      .format(amount)
      .replace("VND", "đ")
      .replace(/\s/g, "");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  // Calculate totals from cartItem
  const calculateTotals = () => {
    if (!invoiceDetail || !invoiceDetail.cartItem) {
      return { items: 0, value: 0 };
    }
    const totalItems = invoiceDetail.cartItem.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalValue = invoiceDetail.cartItem.reduce((sum, item) => sum + (item.amount || 0), 0);
    return { items: totalItems, value: totalValue };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !invoiceDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500 text-lg">{error || "Không tìm thấy thông tin đơn hàng"}</p>
        <Button onClick={() => navigate("/admin/warehouse/exports")} variant="secondary">
          Quay lại
        </Button>
      </div>
    );
  }

  const totals = calculateTotals();
  
  // Map status: "Hoàn thành" -> completed, others -> processing
  const invoiceStatus = invoiceDetail.status || "";
  const isCompleted = invoiceStatus === "Hoàn thành" || invoiceStatus === "DONE";
  
  // Map productStatus: Use the exact text from API
  // API returns: "Đã xuất kho" or "Chưa xuất kho" (or similar Vietnamese text)
  const productStatus = invoiceDetail.productStatus || "";
  const isExported = productStatus === "Đã xuất kho" || productStatus === "DONE";
  
  // Map paymentStatus: Use the exact text from API
  // API returns: "Đã thanh toán" or "Chưa thanh toán" (or similar Vietnamese text)
  const paymentStatus = invoiceDetail.paymentStatus || "";
  const isPaid = paymentStatus === "Đã thanh toán" || paymentStatus === "DONE";

  // Map status to chip status
  const getStatusChip = () => {
    if (isCompleted) {
      return <ChipStatus status="completed" />;
    }
    return <ChipStatus status="processing" />;
  };

  // Get product status text and icon - use exact text from API
  const getProductStatusDisplay = () => {
    // If API returns "Đã xuất kho", show with checkmark
    if (isExported) {
      return {
        text: productStatus || "Đã xuất kho",
        icon: <CheckCircle2 className="w-10 h-10 text-[#04910C]" />
      };
    }
    // Otherwise show "Chưa xuất kho" with square
    return {
      text: productStatus || "Chưa xuất kho",
      icon: <Square className="w-10 h-10 text-[#D1D1D1]" />
    };
  };

  // Get payment status text and icon - use exact text from API
  const getPaymentStatusDisplay = () => {
    // If API returns "Đã thanh toán", show with checkmark
    if (isPaid) {
      return {
        text: paymentStatus || "Đã thanh toán",
        icon: <CheckCircle2 className="w-10 h-10 text-[#04910C]" />
      };
    }
    // Otherwise show "Chưa thanh toán" with square
    return {
      text: paymentStatus || "Chưa thanh toán",
      icon: <Square className="w-10 h-10 text-[#D1D1D1]" />
    };
  };

  // Handle confirm export
  const handleConfirmExport = async () => {
    if (!invoiceDetail) return;

    try {
      setIsConfirming(true);
      const updatedInvoice = await confirmInvoiceProductStatus(invoiceDetail.id);
      setInvoiceDetail(updatedInvoice);
      toast.success("Xác nhận xuất kho thành công");
    } catch (err: any) {
      console.error("Error confirming export:", err);
      console.error("Error response:", err?.response);
      console.error("Error response data:", err?.response?.data);
      
      // Extract error message from various possible response structures
      let errorMessage = "Không thể xác nhận xuất kho";
      
      // Backend trả về ApiResponse với structure: { status, message, data }
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } 
      // Nếu backend trả về error object khác
      else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      // Nếu backend trả về message trực tiếp trong data
      else if (err?.response?.data && typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      }
      // Nếu có message trong response
      else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  // Handle payment modal
  const handlePaymentModalCancel = () => {
    setIsPaymentModalOpen(false);
    setPaymentMethod("Chọn hình thức thanh toán");
    setPaymentAmount("");
    setReferenceCode("");
    // Clear all errors
    setPaymentMethodError("");
    setPaymentAmountError("");
    setReferenceCodeError("");
    setGeneralError("");
  };

  const handlePaymentModalConfirm = async () => {
    if (!invoiceDetail) return;

    // Clear previous errors
    setPaymentMethodError("");
    setPaymentAmountError("");
    setReferenceCodeError("");
    setGeneralError("");

    // Validate form
    let hasError = false;

    if (paymentMethod === "Chọn hình thức thanh toán") {
      setPaymentMethodError("Vui lòng chọn hình thức thanh toán");
      hasError = true;
    }

    if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      setPaymentAmountError("Vui lòng nhập số tiền hợp lệ");
      hasError = true;
    }

    // Chỉ yêu cầu mã tham chiếu khi chọn "Chuyển khoản"
    if (paymentMethod === "Chuyển khoản" && (!referenceCode || referenceCode.trim() === "")) {
      setReferenceCodeError("Vui lòng nhập mã tham chiếu");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsConfirming(true);
      
      // Map payment method
      const method: PaymentMethod = paymentMethod === "Tiền mặt" ? "CASH" : 
                                    paymentMethod === "Chuyển khoản" ? "BANKING" : 
                                    "UNDEFINED";

      const paymentRequest: PaymentRequest = {
        invoiceId: invoiceDetail.id,
        method: method,
        paidAmount: Number(paymentAmount),
        referenceCode: paymentMethod === "Chuyển khoản" ? referenceCode.trim() : undefined,
      };

      const updatedInvoice = await confirmInvoicePayment(paymentRequest);
      setInvoiceDetail(updatedInvoice);
      toast.success("Xác nhận thanh toán thành công");
      handlePaymentModalCancel();
    } catch (err: any) {
      console.error("Error confirming payment:", err);
      console.error("Error response:", err?.response);
      console.error("Error response data:", err?.response?.data);
      
      // Extract error message from various possible response structures
      let errorMessage = "Không thể xác nhận thanh toán";
      
      // Backend trả về ApiResponse với structure: { status, message, data }
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } 
      // Nếu backend trả về error object khác
      else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      // Nếu backend trả về message trực tiếp trong data
      else if (err?.response?.data && typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      }
      // Nếu có message trong response
      else if (err?.message) {
        errorMessage = err.message;
      }
      
      // Check if error is related to payment amount
      if (errorMessage.toLowerCase().includes("số tiền") || errorMessage.toLowerCase().includes("tiền thanh toán")) {
        setPaymentAmountError(errorMessage);
      } 
      // Check if error is related to reference code
      else if (errorMessage.toLowerCase().includes("mã tham chiếu") || errorMessage.toLowerCase().includes("reference")) {
        setReferenceCodeError(errorMessage);
      }
      // Check if error is related to payment method
      else if (errorMessage.toLowerCase().includes("hình thức") || errorMessage.toLowerCase().includes("method")) {
        setPaymentMethodError(errorMessage);
      }
      // General error
      else {
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header matching Figma design */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 w-6 h-6 cursor-pointer"
          onClick={() => navigate("/admin/warehouse/exports")}
        >
          <ArrowLeft className="h-4 w-4 text-[#454545]" />
        </Button>
        <div className="text-[#272424] text-[24px] font-[700] font-montserrat">
          {invoiceDetail.code}
        </div>
        <div className="text-[#272424] text-[12px] font-[400] font-montserrat leading-[18px]">
          {formatDate(invoiceDetail.updatedAt)}
        </div>
        {getStatusChip()}
      </div>

      {/* Table section matching Figma design */}
      <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
        {/* Header with status icon and title */}
        <div className="px-[14px] py-[14px] border-b border-[#D1D1D1] flex items-center gap-5">
          {getProductStatusDisplay().icon}
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            {getProductStatusDisplay().text}
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] h-[50px] bg-[#F6F6F6] items-center border-b border-[#D1D1D1]">
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
            Sản phẩm
          </div>
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-center">
            Số lượng
          </div>
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-center">
            Đơn giá trả
          </div>
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-right">
            Thành tiền
          </div>
        </div>

        {/* Table rows */}
        {invoiceDetail.cartItem && invoiceDetail.cartItem.length > 0 ? (
          invoiceDetail.cartItem.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center ${
                index === invoiceDetail.cartItem.length - 1
                  ? "border-b-0"
                  : "border-b border-[#D1D1D1]"
              }`}
            >
              <div className="px-[14px] py-3 flex items-center gap-3">
                <div className="w-[60px] h-[60px] rounded bg-gray-200 flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-gray-400">Image</span>
                </div>
                <div className="text-black text-[14px] font-[500] font-montserrat leading-[14px]">
                  {item.productName || "N/A"}
                </div>
              </div>
              <div className="px-[14px] py-3 text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px] text-center">
                {item.quantity || 0}
              </div>
              <div className="px-[14px] py-3 text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px] text-center">
                {formatCurrency(item.productPrice || 0)}
              </div>
              <div className="px-[14px] py-3 text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px] text-right">
                {formatCurrency(item.amount || 0)}
              </div>
            </div>
          ))
        ) : (
          <div className="px-[14px] py-8 text-center text-gray-500">
            Không có sản phẩm nào
          </div>
        )}

        {/* Confirm export button - only show when not exported */}
        {!isExported && (
          <div className="px-[14px] py-3 flex justify-end border-t border-[#D1D1D1]">
            <Button 
              onClick={handleConfirmExport}
              disabled={isConfirming}
              className="bg-[#e04d30] hover:bg-[#c93e26] text-white disabled:opacity-50"
            >
              {isConfirming ? "Đang xử lý..." : "Xuất kho"}
            </Button>
          </div>
        )}
      </div>

      {/* Payment summary section matching Figma design */}
      <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
        {/* Header with payment status */}
        <div className="px-[14px] py-[14px] border-b border-[#D1D1D1] flex items-center gap-5">
          {getPaymentStatusDisplay().icon}
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            {getPaymentStatusDisplay().text}
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-[1fr_1fr_1fr] h-[50px] bg-[#F6F6F6] border-b border-[#D1D1D1] items-center">
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
            Tổng tiền
          </div>
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-center">
            {totals.items} sản phẩm
          </div>
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-right">
            {formatCurrency(totals.value)}
          </div>
        </div>

        {/* Payment details */}
        <div className="grid grid-cols-[1fr_1fr] border-b border-[#D1D1D1] items-center">
          <div className="px-[14px] py-3 text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px]">
            Tổng tiền phải thu
          </div>
          <div className="px-[14px] py-3 text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px] text-right">
            {formatCurrency(totals.value)}
          </div>
        </div>

        {/* Confirm payment button - only show when not paid */}
        {!isPaid && (
          <div className="px-[14px] py-3 flex justify-end border-t border-[#D1D1D1]">
            <Button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-[#e04d30] hover:bg-[#c93e26] text-white"
            >
              Xác nhận thanh toán
            </Button>
          </div>
        )}
      </div>

      {/* Note section */}
      {invoiceDetail.note && (
        <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
          <div className="px-[14px] py-[14px] border-b border-[#D1D1D1]">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              Ghi chú
            </div>
          </div>
          <div className="px-[14px] py-4">
            <div className="text-[#272424] text-[14px] font-[400] font-montserrat leading-[20px] whitespace-pre-wrap">
              {invoiceDetail.note}
            </div>
          </div>
        </div>
      )}

      {/* Supplier and Staff section matching Figma design */}
      <div className="grid grid-cols-2 gap-3">
        {/* Supplier card */}
        <div className="p-6 bg-white border border-[#D1D1D1] rounded-[24px]">
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px] mb-3">
            Nhà cung cấp
          </div>
          <div className="flex items-center gap-6">
            <div className="w-[85px] h-[85px] rounded-[12px] bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] text-gray-400">Logo</span>
            </div>
            <div className="text-black text-[14px] font-[400] font-montserrat leading-[18px]">
              {invoiceDetail.providerName || "N/A"}
            </div>
          </div>
        </div>

        {/* Staff card */}
        <div className="p-6 bg-white border border-[#D1D1D1] rounded-[24px]">
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px] mb-3">
            Nhân viên phụ trách
          </div>
          <div className="flex items-center gap-6">
            {invoiceDetail.picImage ? (
              <img
                className="w-[85px] h-[85px] rounded-[12px] object-cover flex-shrink-0"
                src={invoiceDetail.picImage}
                alt={invoiceDetail.picName || "Avatar"}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const placeholder = document.createElement("div");
                  placeholder.className = "w-[85px] h-[85px] rounded-[12px] border-2 border-dashed border-[#D1D1D1] flex items-center justify-center bg-gray-50";
                  placeholder.innerHTML = '<div class="text-[#D1D1D1] text-[12px] font-[400] font-montserrat leading-[18px]">Avatar</div>';
                  target.parentNode?.appendChild(placeholder);
                }}
              />
            ) : (
              <div className="w-[85px] h-[85px] rounded-[12px] border-2 border-dashed border-[#D1D1D1] flex items-center justify-center bg-gray-50">
                <div className="text-[#D1D1D1] text-[12px] font-[400] font-montserrat leading-[18px]">
                  Avatar
                </div>
              </div>
            )}
            <div className="text-[#272424] text-[14px] font-[400] font-montserrat leading-[18px]">
              {invoiceDetail.picName || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {isPaymentModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={handlePaymentModalCancel}
        >
          <div
            className="bg-white w-[600px] max-w-[90vw] max-h-[90vh] flex flex-col rounded-[24px] shadow-2xl animate-scaleIn p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <h2 className="text-[24px] font-bold text-[#272424] font-montserrat mb-6">
              Xác nhận thanh toán
            </h2>

            {/* General Error Message */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-[14px] font-medium">{generalError}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Payment Method Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[14px] text-[#272424]">
                  Chọn hình thức thanh toán
                </label>
                <SimpleDropdown
                  value={paymentMethod}
                  options={["Tiền mặt", "Chuyển khoản"]}
                  onValueChange={(value) => {
                    setPaymentMethod(value);
                    setPaymentMethodError(""); // Clear error when user changes value
                  }}
                  placeholder="Chọn hình thức thanh toán"
                />
                {paymentMethodError && (
                  <p className="text-red-600 text-[12px] mt-1">{paymentMethodError}</p>
                )}
              </div>

              {/* Payment Amount */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[14px] text-[#272424]">
                  Số tiền thanh toán
                </label>
                <FormInput
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(e.target.value);
                    setPaymentAmountError(""); // Clear error when user changes value
                  }}
                  placeholder="Nhập số tiền thanh toán"
                  className={paymentAmountError ? "border-red-500" : ""}
                />
                {paymentAmountError && (
                  <p className="text-red-600 text-[12px] mt-1">{paymentAmountError}</p>
                )}
              </div>

              {/* Reference Code */}
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-semibold text-[14px] text-[#272424]">
                  Mã tham chiếu {paymentMethod === "Chuyển khoản" && <span className="text-[#e04d30]">*</span>}
                </label>
                <FormInput
                  type="text"
                  value={referenceCode}
                  onChange={(e) => {
                    setReferenceCode(e.target.value);
                    setReferenceCodeError(""); // Clear error when user changes value
                  }}
                  placeholder="Nhập mã tham chiếu"
                  required={paymentMethod === "Chuyển khoản"}
                  disabled={paymentMethod === "Tiền mặt"}
                  className={referenceCodeError ? "border-red-500" : ""}
                />
                {paymentMethod === "Tiền mặt" && (
                  <p className="text-gray-500 text-[12px] mt-1">Không bắt buộc khi thanh toán bằng tiền mặt</p>
                )}
                {referenceCodeError && (
                  <p className="text-red-600 text-[12px] mt-1">{referenceCodeError}</p>
                )}
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#D1D1D1]">
              <Button variant="secondary" onClick={handlePaymentModalCancel} disabled={isConfirming}>
                Huỷ
              </Button>
              <Button
                variant="default"
                onClick={handlePaymentModalConfirm}
                disabled={isConfirming || (paymentMethod === "Chuyển khoản" && !referenceCode)}
                className="bg-[#e04d30] hover:bg-[#c93e26] text-white disabled:opacity-50"
              >
                {isConfirming ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouseExportDetail;

