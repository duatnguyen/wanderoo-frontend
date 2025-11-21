import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import { FormInput } from "@/components/ui/form-input";
import { DatePicker } from "@/components/ui/date-picker";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";
import {
  TabMenuWithBadge,
  PageContainer,
  ContentCard,
  type TabItemWithBadge,
} from "@/components/common";
interface ReturnImportDetail {
  id: string;
  returnCode: string;
  importCode: string;
  createdDate: string;
  supplier: string;
  createdBy: string;
  status: "processing" | "completed";
  returnStatus: "returned" | "pending_return";
  refundStatus: "refunded" | "pending_refund";
  paymentMethod: "cash" | "transfer";
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totals: { items: number; value: number };
  returnReason: string;
}

const mockReturnDetailProcessing: ReturnImportDetail = {
  id: "2",
  returnCode: "SRT002",
  importCode: "REI002",
  createdDate: "2025-09-12T15:30:00",
  supplier: "Công ty ABC",
  createdBy: "Admin NguyenVanA",
  status: "processing",
  returnStatus: "pending_return",
  refundStatus: "pending_refund",
  paymentMethod: "transfer",
  returnReason: "Sản phẩm bị lỗi, không đạt chất lượng yêu cầu",
  items: [
    {
      id: "p1",
      name: "Áo thun thoáng khí Rockbros LKW008",
      quantity: 100,
      price: 120000,
      total: 12000000,
    },
    {
      id: "p2",
      name: "Áo thun dài tay Northshengwolf",
      quantity: 50,
      price: 150000,
      total: 7500000,
    },
  ],
  totals: { items: 150, value: 19500000 },
};

const mockReturnDetailCompleted: ReturnImportDetail = {
  id: "1",
  returnCode: "SRT001",
  importCode: "REI001",
  createdDate: "2025-09-13T21:05:00",
  supplier: "Kho Nhật Quang",
  createdBy: "Admin ThanhNguyen",
  status: "completed",
  returnStatus: "returned",
  refundStatus: "refunded",
  paymentMethod: "cash",
  returnReason: "Sản phẩm bị lỗi, không đạt chất lượng yêu cầu",
  items: [
    {
      id: "p1",
      name: "Áo thun thoáng khí Rockbros LKW008",
      quantity: 100,
      price: 120000,
      total: 12000000,
    },
    {
      id: "p2",
      name: "Áo thun dài tay Northshengwolf",
      quantity: 50,
      price: 150000,
      total: 7500000,
    },
  ],
  totals: { items: 150, value: 19500000 },
};

const AdminWarehouseDetailReturnImport: React.FC = () => {
  document.title = "Chi tiết đơn trả hàng nhập | Wanderoo";

  const navigate = useNavigate();
  const { returnId } = useParams<{ returnId: string }>();

  // Refund modal state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundMethod, setRefundMethod] = useState("Chọn hình thức hoàn tiền");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundDate, setRefundDate] = useState("");
  const [referenceCode, setReferenceCode] = useState("");

  // For testing: use processing for ID 2, completed for ID 1
  const isProcessingId = returnId === "2";
  const mockDetail = isProcessingId
    ? mockReturnDetailProcessing
    : mockReturnDetailCompleted;

  const detail: ReturnImportDetail = {
    ...mockDetail,
    id: returnId ?? mockDetail.id,
    returnCode: mockDetail.returnCode,
  };

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

  const handleConfirmReturn = () => {
    console.log("Confirm return");
    // TODO: Handle return confirmation
  };

  const handleConfirmRefund = () => {
    setIsRefundModalOpen(true);
  };

  const handleRefundModalCancel = () => {
    setIsRefundModalOpen(false);
    setRefundMethod("Chọn hình thức hoàn tiền");
    setRefundAmount("");
    setRefundDate("");
    setReferenceCode("");
  };

  const handleRefundModalConfirm = () => {
    console.log("Refund details:", {
      refundMethod,
      refundAmount,
      refundDate,
      referenceCode,
    });
    // TODO: Handle refund confirmation
    setIsRefundModalOpen(false);
  };

  const isCompleted = detail.status === "completed";
  const isReturned = detail.returnStatus === "returned";
  const isRefunded = detail.refundStatus === "refunded";

  return (
    <PageContainer>
      {/* Header matching Figma design */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 w-6 h-6 cursor-pointer"
          onClick={() => navigate("/admin/warehouse/returnsimport")}
        >
          <ArrowLeft className="h-4 w-4 text-[#454545]" />
        </Button>
        <div className="text-[#272424] text-[24px] font-[700] font-montserrat">
          {detail.returnCode}
        </div>
        <div className="text-[#272424] text-[12px] font-[400] font-montserrat leading-[18px]">
          {new Date(detail.createdDate).toLocaleDateString("vi-VN")}{" "}
          {new Date(detail.createdDate).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <ChipStatus status={detail.status} />
      </div>
      <ContentCard>
        {/* Return Status Section */}
        <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
          {/* Header with status icon and title */}
          <div className="px-[14px] py-[14px] border-b border-[#D1D1D1] flex items-center gap-5">
            {isReturned ? (
              <CheckCircle2 className="w-10 h-10 text-[#04910C]" />
            ) : (
              <Square className="w-10 h-10 text-[#D1D1D1]" />
            )}
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              {isReturned ? "Đã hoàn trả" : "Chưa hoàn trả"}
            </div>
          </div>

          {/* Fixed Table Header */}
          <div className="bg-[#F6F6F6] sticky top-0 z-10 border-b border-[#D1D1D1]">
            {/* Desktop Header */}
            <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr] h-[50px] items-center">
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

            {/* Mobile Header */}
            <div className="lg:hidden px-[14px] py-3">
              <div className="text-[#272424] text-[16px] font-[600] font-montserrat">
                Danh sách sản phẩm trả ({detail.items.length})
              </div>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-y-auto">
            {detail.items.map((item, index) => (
              <div
                key={item.id}
                className={`border-b border-[#D1D1D1] ${index === detail.items.length - 1 ? "border-b-0" : ""}`}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr] items-center">
                  <div className="px-[14px] py-3 flex items-center gap-3">
                    <img
                      className="w-[60px] h-[60px] rounded object-cover flex-shrink-0"
                      src="https://placehold.co/60x60"
                      alt={item.name}
                    />
                    <div
                      className="text-black text-[14px] font-[500] font-montserrat leading-[14px] truncate"
                      title={item.name}
                    >
                      {item.name}
                    </div>
                  </div>
                  <div className="px-[14px] py-3 text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px] text-center">
                    {item.quantity}
                  </div>
                  <div className="px-[14px] py-3 text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px] text-center">
                    {formatCurrency(item.price)}
                  </div>
                  <div className="px-[14px] py-3 text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px] text-right">
                    {formatCurrency(item.total)}
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden px-[14px] py-4">
                  <div className="flex gap-3">
                    <img
                      className="w-[60px] h-[60px] rounded object-cover flex-shrink-0"
                      src="https://placehold.co/60x60"
                      alt={item.name}
                    />
                    <div className="flex-1 space-y-2">
                      <div
                        className="text-black text-[14px] font-[500] font-montserrat leading-[16px]"
                        title={item.name}
                      >
                        {item.name}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số lượng:</span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Đơn giá:</span>
                          <span className="font-medium">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                        <span className="text-[13px] font-[600] text-gray-700">
                          Thành tiền:
                        </span>
                        <span className="text-[14px] font-[600] text-[#272424]">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Return confirmation button for processing status */}
          {!isReturned && !isCompleted && (
            <div className="px-[14px] py-3 flex justify-end border-t border-[#D1D1D1]">
              <Button onClick={handleConfirmReturn} variant="secondary">
                Xác nhận hoàn trả
              </Button>
            </div>
          )}
        </div>

        {/* Refund Summary Section */}
        <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
          {/* Header with refund status */}
          <div className="px-[14px] py-[14px] border-b border-[#D1D1D1] flex items-center gap-5">
            {isRefunded ? (
              <CheckCircle2 className="w-10 h-10 text-[#04910C]" />
            ) : (
              <Square className="w-10 h-10 text-[#D1D1D1]" />
            )}
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              {isRefunded ? "Đã nhận hoàn tiền" : "Chưa nhận hoàn tiền"}
            </div>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-[1fr_1fr_1fr] h-[50px] bg-[#F6F6F6] border-b border-[#D1D1D1] items-center">
            <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Giá trị hàng trả
            </div>
            <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-center">
              {detail.totals.items} sản phẩm
            </div>
            <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-right">
              {formatCurrency(detail.totals.value)}
            </div>
          </div>

          {/* Refund details */}
          <div className="grid grid-cols-[1fr_1fr] border-b border-[#D1D1D1] items-center">
            <div className="px-[14px] py-3 text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px]">
              Giá trị hoàn trả
            </div>
            <div className="px-[14px] py-3 text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px] text-right">
              {formatCurrency(detail.totals.value)}
            </div>
          </div>

          {/* Refund confirmation button for processing status */}
          {!isRefunded && !isCompleted && (
            <div className="px-[14px] py-3 flex justify-end border-t border-[#D1D1D1]">
              <Button onClick={handleConfirmRefund} variant="secondary">
                Xác nhận hoàn tiền
              </Button>
            </div>
          )}
        </div>

        {/* Return Reason Section */}
        <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
          <div className="px-[14px] py-[14px] border-b border-[#D1D1D1]">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              Lý do trả hàng
            </div>
          </div>
          <div className="px-[14px] py-[14px]">
            <div className="text-[#272424] text-[14px] font-[400] font-montserrat leading-[19.60px]">
              {detail.returnReason}
            </div>
          </div>
        </div>

        {/* Supplier and Staff section */}
        <div className="grid grid-cols-2 gap-3">
          {/* Supplier card */}
          <div className="p-6 bg-white border border-[#D1D1D1] rounded-[24px]">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px] mb-3">
              Nhà cung cấp
            </div>
            <div className="flex items-center gap-6">
              <img
                className="w-[85px] h-[85px] rounded-[12px] object-cover"
                src="https://placehold.co/85x85"
                alt="Supplier"
              />
              <div className="text-black text-[14px] font-[400] font-montserrat leading-[18px]">
                {detail.supplier}
              </div>
            </div>
          </div>

          {/* Staff card */}
          <div className="p-6 bg-white border border-[#D1D1D1] rounded-[24px]">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px] mb-3">
              Nhân viên phụ trách
            </div>
            <div className="flex items-center gap-6">
              <div className="w-[85px] h-[85px] rounded-[12px] border-2 border-dashed border-[#D1D1D1] flex items-center justify-center bg-gray-50">
                <div className="text-[#D1D1D1] text-[12px] font-[400] font-montserrat leading-[18px]">
                  Avatar
                </div>
              </div>
              <div className="text-[#272424] text-[14px] font-[400] font-montserrat leading-[18px]">
                {detail.createdBy}
              </div>
            </div>
          </div>
        </div>

        {/* Refund Confirmation Modal */}
        {isRefundModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={handleRefundModalCancel}
          >
            <div
              className="bg-white w-[600px] max-w-[90vw] max-h-[90vh] flex flex-col rounded-[24px] shadow-2xl animate-scaleIn p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Title */}
              <h2 className="text-[24px] font-bold text-[#272424] font-montserrat mb-6">
                Xác nhận hoàn tiền
              </h2>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Refund Method Dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[14px] text-[#272424]">
                    Chọn hình thức hoàn tiền
                  </label>
                  <SimpleDropdown
                    value={refundMethod}
                    options={["Tiền mặt", "Chuyển khoản"]}
                    onValueChange={setRefundMethod}
                    placeholder="Chọn hình thức hoàn tiền"
                  />
                </div>

                {/* Refund Amount */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[14px] text-[#272424]">
                    Số tiền hoàn trả
                  </label>
                  <FormInput
                    type="text"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Nhập số tiền hoàn trả"
                  />
                </div>

                {/* Refund Date */}
                <DatePicker
                  type="date"
                  value={refundDate}
                  onChange={(e) => setRefundDate(e.target.value)}
                  placeholder="//"
                  label="Ngày ghi nhận"
                  containerClassName="gap-2"
                />

                {/* Reference Code */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-[14px] text-[#272424]">
                    Mã tham chiếu <span className="text-[#e04d30]">*</span>
                  </label>
                  <FormInput
                    type="text"
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    placeholder="Nhập mã tham chiếu"
                    required
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#D1D1D1]">
                <Button variant="secondary" onClick={handleRefundModalCancel}>
                  Huỷ
                </Button>
                <Button
                  variant="default"
                  onClick={handleRefundModalConfirm}
                  disabled={!referenceCode}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )}
      </ContentCard>
    </PageContainer>
  );
};

export default AdminWarehouseDetailReturnImport;
