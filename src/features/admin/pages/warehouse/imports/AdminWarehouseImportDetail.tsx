import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import { FormInput } from "@/components/ui/form-input";
import { DatePicker } from "@/components/ui/date-picker";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";

type ImportDetail = {
  id: string;
  importCode: string;
  createdDate: string;
  supplier: string;
  createdBy: string;
  status: "processing" | "completed";
  importStatus: "not_imported" | "imported";
  paymentStatus: "paid" | "unpaid";
  paymentMethod: "cash" | "transfer";
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totals: { items: number; value: number };
};

const mockImportDetailProcessing: ImportDetail = {
  id: "1",
  importCode: "REI0002",
  createdDate: "2025-07-19T15:33:00",
  supplier: "Kho Nhật Quang",
  createdBy: "Admin ThanhNguyen",
  status: "processing",
  importStatus: "not_imported",
  paymentStatus: "unpaid",
  paymentMethod: "cash",
  items: [
    {
      id: "p1",
      name: "Bình nước giữ nhiệt 200ml Hydro Flask Micro Hy...",
      quantity: 156,
      price: 100000,
      total: 15600000,
    },
    {
      id: "p2",
      name: "Bộ gây leo núi Coleman Treking Pole 2 PC 20000...",
      quantity: 400,
      price: 200000,
      total: 80000000,
    },
    {
      id: "p3",
      name: "Áo khoác gió 2 lớp nam Gothiar Popular",
      quantity: 400,
      price: 300000,
      total: 120000000,
    },
  ],
  totals: { items: 956, value: 215600000 },
};

const mockImportDetailCompleted: ImportDetail = {
  id: "1",
  importCode: "REI0002",
  createdDate: "2025-07-19T15:33:00",
  supplier: "Kho Nhật Quang",
  createdBy: "Admin ThanhNguyen",
  status: "completed",
  importStatus: "imported",
  paymentStatus: "paid",
  paymentMethod: "cash",
  items: [
    {
      id: "p1",
      name: "Bình nước giữ nhiệt 200ml Hydro Flask Micro Hy...",
      quantity: 156,
      price: 100000,
      total: 15600000,
    },
    {
      id: "p2",
      name: "Bộ gây leo núi Coleman Treking Pole 2 PC 20000...",
      quantity: 400,
      price: 200000,
      total: 80000000,
    },
    {
      id: "p3",
      name: "Áo khoác gió 2 lớp nam Gothiar Popular",
      quantity: 400,
      price: 300000,
      total: 120000000,
    },
  ],
  totals: { items: 956, value: 215600000 },
};

const AdminWarehouseImportDetail: React.FC = () => {
  const navigate = useNavigate();
  const { importId } = useParams<{ importId: string }>();

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    "Chọn hình thức thanh toán"
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [referenceCode, setReferenceCode] = useState("");

  // For testing: use processing for IDs 1 and 4, completed for IDs 3 and 5
  const isProcessingId = importId ? ["1", "2", "4"].includes(importId) : true;
  const mockDetail = isProcessingId
    ? mockImportDetailProcessing
    : mockImportDetailCompleted;

  const detail: ImportDetail = {
    ...mockDetail,
    id: importId ?? mockDetail.id,
    importCode: mockDetail.importCode,
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

  const handleConfirmImport = () => {
    console.log("Confirm import to warehouse");
    // TODO: Handle import confirmation
  };

  const handleConfirmPayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalCancel = () => {
    setIsPaymentModalOpen(false);
    setPaymentMethod("Chọn hình thức thanh toán");
    setPaymentAmount("");
    setPaymentDate("");
    setReferenceCode("");
  };

  const handlePaymentModalConfirm = () => {
    console.log("Payment details:", {
      paymentMethod,
      paymentAmount,
      paymentDate,
      referenceCode,
    });
    // TODO: Handle payment confirmation
    setIsPaymentModalOpen(false);
  };

  const isCompleted = detail.status === "completed";
  const isImported = detail.importStatus === "imported";
  const isPaid = detail.paymentStatus === "paid";

  return (
    <div className="space-y-4">
      {/* Header matching Figma design */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 w-6 h-6 cursor-pointer"
          onClick={() => navigate("/admin/warehouse/imports")}
        >
          <ArrowLeft className="h-4 w-4 text-[#454545]" />
        </Button>
        <div className="text-[#272424] text-[24px] font-[700] font-montserrat">
          {detail.importCode}
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

      {/* Table section matching Figma design */}
      <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
        {/* Header with status icon and title */}
        <div className="px-[14px] py-[14px] border-b border-[#D1D1D1] flex items-center gap-5">
          {isImported ? (
            <CheckCircle2 className="w-10 h-10 text-[#04910C]" />
          ) : (
            <Square className="w-10 h-10 text-[#D1D1D1]" />
          )}
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            {isImported ? "Đã nhập kho" : "Chưa nhập kho"}
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
        {detail.items.map((item, index) => (
          <div
            key={item.id}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center ${
              index === detail.items.length - 1
                ? "border-b-0"
                : "border-b border-[#D1D1D1]"
            }`}
          >
            <div className="px-[14px] py-3 flex items-center gap-3">
              <img
                className="w-[60px] h-[60px] rounded object-cover flex-shrink-0"
                src="https://placehold.co/60x60"
                alt={item.name}
              />
              <div className="text-black text-[14px] font-[500] font-montserrat leading-[14px]">
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
        ))}

        {/* Import button for processing status */}
        {!isImported && !isCompleted && (
          <div className="px-[14px] py-3 flex justify-end border-t border-[#D1D1D1]">
            <Button onClick={handleConfirmImport} variant="secondary">
              Nhập kho
            </Button>
          </div>
        )}
      </div>

      {/* Payment summary section matching Figma design */}
      <div className="w-full bg-white border border-[#D1D1D1] rounded-[24px] overflow-hidden">
        {/* Header with payment status */}
        <div className="px-[14px] py-[14px] border-b border-[#D1D1D1] flex items-center gap-5">
          {isPaid ? (
            <CheckCircle2 className="w-10 h-10 text-[#04910C]" />
          ) : (
            <Square className="w-10 h-10 text-[#D1D1D1]" />
          )}
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-[1fr_1fr_1fr] h-[50px] bg-[#F6F6F6] border-b border-[#D1D1D1] items-center">
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
            Tổng tiền
          </div>
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-center">
            {detail.totals.items} sản phẩm
          </div>
          <div className="px-[14px] text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px] text-right">
            {formatCurrency(detail.totals.value)}
          </div>
        </div>

        {/* Payment details */}
        <div className="grid grid-cols-[1fr_1fr] border-b border-[#D1D1D1] items-center">
          <div className="px-[14px] py-3 text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px]">
            Tiền cần trả nhà cung cấp
          </div>
          <div className="px-[14px] py-3 text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px] text-right">
            {formatCurrency(detail.totals.value)}
          </div>
        </div>

        {/* Payment button for processing status */}
        {!isPaid && !isCompleted && (
          <div className="px-[14px] py-3 flex justify-end border-t border-[#D1D1D1]">
            <Button onClick={handleConfirmPayment} variant="secondary">
              Xác nhận thanh toán
            </Button>
          </div>
        )}
      </div>

      {/* Supplier and Staff section matching Figma design */}
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
                  onValueChange={setPaymentMethod}
                  placeholder="Chọn hình thức thanh toán"
                />
              </div>

              {/* Payment Amount */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[14px] text-[#272424]">
                  Số tiền thanh toán
                </label>
                <FormInput
                  type="text"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Nhập số tiền thanh toán"
                />
              </div>

              {/* Payment Date */}
              <DatePicker
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
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
              <Button variant="secondary" onClick={handlePaymentModalCancel}>
                Huỷ
              </Button>
              <Button
                variant="default"
                onClick={handlePaymentModalConfirm}
                disabled={!referenceCode}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouseImportDetail;
