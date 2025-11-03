import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ReturnImportDetail = {
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
  items: Array<{ id: string; name: string; quantity: number; price: number; total: number }>;
  totals: { items: number; value: number };
};

const mockReturnDetail: ReturnImportDetail = {
  id: "1",
  returnCode: "SRT001",
  importCode: "NK001",
  createdDate: "2024-01-15",
  supplier: "Công ty TNHH ABC",
  createdBy: "Nguyễn Văn A",
  status: "processing",
  returnStatus: "returned",
  refundStatus: "pending_refund",
  paymentMethod: "cash",
  items: [
    { id: "p1", name: "Áo thun thoáng khí Rockbros LKW008", quantity: 100, price: 120000, total: 12000000 },
    { id: "p2", name: "Áo thun dài tay Northshengwolf", quantity: 50, price: 150000, total: 7500000 },
  ],
  totals: { items: 150, value: 19500000 },
};

const AdminWarehouseDetailReturnImport: React.FC = () => {
  document.title = "Chi tiết đơn trả hàng nhập | Wanderoo";
  
  const navigate = useNavigate();
  const { returnId } = useParams<{ returnId: string }>();
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [recordDate, setRecordDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  // Load status from localStorage if available, otherwise use mock data
  const returnIdToCheck = returnId ?? mockReturnDetail.id;
  const storedStatus = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("returnImportStatuses") || "{}")[returnIdToCheck] : null;
  const [refundStatus, setRefundStatus] = useState<"refunded" | "pending_refund">(
    storedStatus?.refundStatus ?? mockReturnDetail.refundStatus
  );
  const [status, setStatus] = useState<"processing" | "completed">(
    storedStatus?.status ?? mockReturnDetail.status
  );

  const detail: ReturnImportDetail = {
    ...mockReturnDetail,
    id: returnId ?? mockReturnDetail.id,
    returnCode: mockReturnDetail.returnCode,
    status: status,
    refundStatus: refundStatus,
  };

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace(/\s/g, '').replace(/₫/g, 'đ');
    return formatted;
  };

  const handleConfirmRefund = () => {
    // Handle confirm refund logic here
    console.log("Confirm refund", {
      paymentMethod,
      recordDate,
      paymentAmount,
      referenceCode,
    });
    // Update status to completed and refundStatus to refunded
    setRefundStatus("refunded");
    setStatus("completed");
    // Save to localStorage so the list page can also reflect the change
    const returnIdToUpdate = returnId ?? mockReturnDetail.id;
    const storedStatus = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("returnImportStatuses") || "{}") : {};
    storedStatus[returnIdToUpdate] = { status: "completed", returnStatus: "returned", refundStatus: "refunded" };
    if (typeof window !== "undefined") {
      localStorage.setItem("returnImportStatuses", JSON.stringify(storedStatus));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("returnImportStatusUpdated"));
    }
    setIsRefundModalOpen(false);
    // Reset form
    setPaymentMethod("");
    setRecordDate("");
    setPaymentAmount("");
    setReferenceCode("");
  };

  return (
    <div className="flex flex-col gap-[16px] p-3 w-full max-w-[1200px] mx-auto overflow-x-auto overflow-y-auto table-scroll-container">
      {/* Header matching Figma design */}
      <div className="w-full h-full justify-start items-center gap-2 inline-flex min-w-[1150px] flex-shrink-0">
        <div className="w-6 h-6 relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 w-6 h-6" 
            onClick={() => navigate("/admin/warehouse/returnsimport")}
          > 
            <ArrowLeft className="h-4 w-4 text-[#454545]" />
          </Button>
        </div>
        <div className="self-stretch flex-col justify-center items-center gap-2.5 inline-flex">
          <div className="justify-center flex flex-col text-[#272424] text-[24px] font-[700] font-montserrat">
            {detail.returnCode}
          </div>
        </div>
        <div className="self-stretch flex-col justify-center items-center gap-2.5 inline-flex">
          <div className="justify-center flex flex-col text-[#272424] text-[12px] font-[400] font-montserrat leading-[18px]">
            {new Date(detail.createdDate).toLocaleDateString("vi-VN")} {new Date(detail.createdDate).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
          <ChipStatus status={detail.status} />
      </div>

      {/* Table section matching Figma design */}
      <div className="w-full h-full bg-white border border-[#D1D1D1] rounded-lg flex-col justify-start items-start inline-flex flex-shrink-0 min-w-[1150px]">
        {/* Header with status icon and title */}
        <div className="self-stretch px-[14px] py-[14px] rounded-t-lg border-b border-[#D1D1D1] justify-start items-center gap-5 inline-flex flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-[#04910C] flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            Đã hoàn trả
          </div>
        </div>

        {/* Table header */}
        <div className="self-stretch h-[50px] bg-[#F6F6F6] justify-start items-start inline-flex flex-shrink-0">
          <div className="w-[400px] self-stretch px-[14px] overflow-hidden border-l border-[#D1D1D1] justify-start items-center flex">
            <div className="w-[22px] h-0 transform rotate-[-90deg] origin-top-left">
                {/* icon place here */}
            </div>
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Sản phẩm
            </div>
          </div>
          <div className="flex-1 self-stretch px-[14px] relative justify-center items-center gap-1 flex">
            <div className="w-[22px] h-0 left-0 top-[36px] absolute transform rotate-[-90deg] origin-top-left"></div>
            <div className="w-16 text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Số lượng
            </div>
          </div>
          <div className="flex-1 self-stretch px-[14px] relative justify-center items-center gap-1 flex">
            <div className="w-[22px] h-0 left-0 top-[36px] absolute transform rotate-[-90deg] origin-top-left"></div>
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Đơn giá trả
            </div>
          </div>
          <div className="flex-1 self-stretch px-[14px] border-r border-[#D1D1D1] justify-end items-center gap-1 flex">
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Thành tiền
            </div>
          </div>
        </div>

        {/* Table rows */}
        {detail.items.map((item, index) => (
          <div 
            key={item.id} 
            className={`self-stretch border border-[#D1D1D1] justify-start items-start inline-flex flex-shrink-0 ${
              index === detail.items.length - 1 ? 'rounded-b-lg' : ''
            }`}
          >
            <div className="w-[400px] self-stretch px-3 py-3 justify-start items-center gap-3 flex">
              <img 
                className="w-[60px] h-[60px]" 
                src="https://placehold.co/60x60" 
                alt={item.name}
              />
              <div className="self-stretch justify-start items-start gap-2.5 flex">
                <div className="text-black text-[14px] font-[500] font-montserrat leading-[14px]">
                  {item.name}
                </div>
              </div>
            </div>
            <div className="flex-1 self-stretch px-[14px] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px]">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 self-stretch px-[14px] flex-col justify-center items-center gap-2 inline-flex">
              <div className="text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px]">
                {formatCurrency(item.price)}
              </div>
            </div>
            <div className="flex-1 self-stretch px-[14px] flex-col justify-center items-end gap-2 inline-flex">
              <div className="text-[#272424] text-[14px] font-[500] font-montserrat leading-[14px]">
                {formatCurrency(item.total)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment summary section matching Figma design */}
      <div className="w-full h-full bg-white border border-[#D1D1D1] rounded-lg flex-col justify-start items-start inline-flex flex-shrink-0 min-w-[1150px]">
        {/* Header with payment status */}
        <div className="self-stretch px-[14px] py-[14px] rounded-t-lg border-b border-[#D1D1D1] justify-start items-center gap-5 inline-flex flex-shrink-0">
          {detail.refundStatus === "refunded" ? (
            <div className="w-6 h-6 rounded-full bg-[#04910C] flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#D1D1D1] flex items-center justify-center">
              {/* Empty circle for pending status */}
            </div>
          )}
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            {detail.refundStatus === "refunded" ? "Đã thanh toán" : "Thanh toán"}
          </div>
        </div>

        {/* Row 1: Tổng tiền */}
        <div className="self-stretch h-[50px] bg-[#F6F6F6] border-b border-[#D1D1D1] justify-start items-start inline-flex flex-shrink-0">
          <div className="flex-1 self-stretch px-[14px] overflow-hidden border-l border-[#D1D1D1] justify-start items-center flex">
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Tổng tiền
            </div>
          </div>
          <div className="flex-1 self-stretch px-[14px] justify-center items-center flex">
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              {detail.totals.items} sản phẩm
            </div>
          </div>
          <div className="flex-1 self-stretch px-[14px] border-r border-[#D1D1D1] justify-end items-center gap-1 flex">
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              {formatCurrency(detail.totals.value)}
            </div>
          </div>
        </div>

        {/* Row 2: Tiền cần trả nhà cung cấp */}
        <div className="self-stretch h-[50px] bg-[#F6F6F6] border-b border-[#D1D1D1] justify-between items-center inline-flex flex-shrink-0">
          <div className="flex-1 self-stretch px-[14px] justify-start items-center flex">
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[14px]">
              Tiền cần trả nhà cung cấp
            </div>
          </div>
          <div className="flex-1 self-stretch px-[14px] justify-end items-center flex">
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[14px]">
              {formatCurrency(detail.totals.value)}
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="self-stretch px-[14px] py-[14px] rounded-b-lg justify-end items-center inline-flex flex-shrink-0">
          <Button
            variant="secondary"
            onClick={() => setIsRefundModalOpen(true)}
            className="bg-white text-[#e04d30] border border-[#e04d30] hover:bg-white hover:text-[#e04d30] h-[36px] px-[20px] text-[14px] font-normal"
          >
            Xác nhận hoàn tiền
          </Button>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      {isRefundModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsRefundModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-[85vw] max-w-[600px] bg-white flex flex-col rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-[#e7e7e7] flex items-center justify-between px-[20px] pt-[16px] pb-[8px] shrink-0 bg-white rounded-t-lg">
              <h2 className="font-['Montserrat'] font-bold text-[18px] text-[#272424]">
                Xác nhận hoàn tiền
              </h2>
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="text-[#737373] hover:text-[#4a4a4a] text-[20px] leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto bg-white px-[20px] pt-[20px] pb-[12px]">
              <div className="grid grid-cols-2 gap-[16px]">
                {/* Left Column */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-['Montserrat'] font-medium text-[13px] text-[#272424]">
                    Chọn hình thức thanh toán <span className="text-[#eb2b0b]">*</span>
                  </label>
                  <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full border-2 border-[#e04d30] rounded-[10px] px-[10px] py-[6px] flex items-center justify-between bg-white text-left">
                        <span className={`font-['Montserrat'] text-[13px] ${paymentMethod ? 'text-[#272424]' : 'text-[#737373]'}`}>
                          {paymentMethod || "Chọn hình thức thanh toán"}
                        </span>
                        {isDropdownOpen ? (
                          <ChevronDown className="w-4 h-4 text-[#737373]" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-[#737373]" />
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(85vw-40px)] max-w-[calc(600px-40px)]">
                      <DropdownMenuItem onClick={() => setPaymentMethod("Tiền mặt")}>
                        Tiền mặt
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPaymentMethod("Chuyển khoản")}>
                        Chuyển khoản
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <label className="font-['Montserrat'] font-medium text-[13px] text-[#272424] mt-[12px]">
                    Ngày ghi nhận <span className="text-[#eb2b0b]">*</span>
                  </label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full border-2 border-[#e04d30] rounded-[10px] px-[10px] py-[6px] font-['Montserrat'] text-[13px] text-[#272424] bg-white"
                  />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-[6px]">
                  <label className="font-['Montserrat'] font-medium text-[13px] text-[#272424]">
                    Số tiền thanh toán <span className="text-[#eb2b0b]">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Nhập số tiền thanh toán"
                    className="w-full border-2 border-[#e04d30] rounded-[10px] px-[10px] py-[6px] font-['Montserrat'] text-[13px] text-[#272424] bg-white placeholder:text-[#737373]"
                  />

                  <label className="font-['Montserrat'] font-medium text-[13px] text-[#272424] mt-[12px]">
                    Mã tham chiếu <span className="text-[#eb2b0b]">*</span>
                  </label>
                  <input
                    type="text"
                    value={referenceCode}
                    onChange={(e) => setReferenceCode(e.target.value)}
                    placeholder="Nhập mã tham chiếu"
                    className="w-full border-2 border-[#e04d30] rounded-[10px] px-[10px] py-[6px] font-['Montserrat'] text-[13px] text-[#272424] bg-white placeholder:text-[#737373]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#e7e7e7] flex items-center justify-end gap-[8px] px-[20px] py-[12px] shrink-0 bg-white rounded-b-lg">
              <Button
                variant="secondary"
                onClick={() => setIsRefundModalOpen(false)}
                className="bg-white text-[#e04d30] border border-[#e04d30] hover:bg-white hover:text-[#e04d30] h-[36px] px-[16px] text-[13px]"
              >
                Huỷ
              </Button>
              <Button
                variant="default"
                onClick={handleConfirmRefund}
                className="bg-[#e04d30] text-white hover:bg-[#e04d30] h-[36px] px-[16px] text-[13px]"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Supplier and Staff section matching Figma design */}
      <div className="w-full h-full justify-start items-start gap-3 inline-flex flex-shrink-0 min-w-[1150px]">
        {/* Supplier card */}
        <div className="flex-1 px-6 py-3 bg-white border border-[#D1D1D1] rounded-lg flex-col justify-start items-start inline-flex flex-shrink-0">
          <div className="self-stretch pt-1.5 pb-1.5 rounded-[12px] justify-start items-center gap-2.5 inline-flex">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              Nhà cung cấp
            </div>
          </div>
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            <img 
              className="w-[60px] h-[60px] rounded-[12px]" 
              src="https://placehold.co/60x60" 
              alt="Supplier"
            />
            <div className="self-stretch justify-start items-start gap-2.5 flex">
              <div className="text-black text-[14px] font-[400] font-montserrat leading-[14px]">
                {detail.supplier}
              </div>
            </div>
          </div>
        </div>

        {/* Staff card */}
        <div className="flex-1 px-6 py-3 bg-white border border-[#D1D1D1] rounded-lg flex-col justify-start items-start inline-flex flex-shrink-0">
          <div className="self-stretch pt-1.5 pb-1.5 rounded-[12px] justify-start items-center gap-2.5 inline-flex">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              Nhân viên phụ trách
            </div>
          </div>
          <div className="self-stretch justify-start items-center gap-2 inline-flex">
            <div className="w-[60px] h-[60px] rounded-[12px] border-2 border-dashed border-[#D1D1D1] flex items-center justify-center">
              <div className="text-[#D1D1D1] text-[12px] font-[400] font-montserrat leading-[18px]">
                Avatar
              </div>
            </div>
            <div className="self-stretch justify-start items-start gap-2.5 flex">
              <div className="text-[#272424] text-[14px] font-[400] font-montserrat leading-[14px]">
                {detail.createdBy}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminWarehouseDetailReturnImport;
