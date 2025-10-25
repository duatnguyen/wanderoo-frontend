import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";

interface ReturnImportDetail {
  id: string;
  returnCode: string;
  importCode: string;
  createdDate: string;
  supplier: string;
  createdBy: string;
  returnStatus: "returned" | "pending_return";
  refundStatus: "refunded" | "pending_refund";
  paymentMethod: "cash" | "transfer";
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    image?: string;
  }>;
  totals: { items: number; value: number };
  returnReason: string;
}

const mockReturnDetail: ReturnImportDetail = {
  id: "1",
  returnCode: "SRT001",
  importCode: "NK001",
  createdDate: "2024-01-15",
  supplier: "Công ty TNHH ABC",
  createdBy: "Nguyễn Văn A",
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
      image: "https://placehold.co/60x60",
    },
    {
      id: "p2",
      name: "Áo thun dài tay Northshengwolf",
      quantity: 50,
      price: 150000,
      total: 7500000,
      image: "https://placehold.co/60x60",
    },
  ],
  totals: { items: 150, value: 19500000 },
};

const AdminWarehouseDetailReturnImport = () => {
  document.title = "Chi tiết đơn trả hàng nhập | Wanderoo";

  const navigate = useNavigate();
  const { returnId } = useParams<{ returnId: string }>();

  const detail: ReturnImportDetail = {
    ...mockReturnDetail,
    id: returnId ?? mockReturnDetail.id,
    returnCode: mockReturnDetail.returnCode,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 p-3">
      {/* Header */}
      <div className="w-full h-full justify-start items-center gap-2 inline-flex">
        <div className="w-6 h-6 relative">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 w-6 h-6"
            onClick={() => navigate("/admin/warehouse/returns")}
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
            {formatDate(detail.createdDate)}
          </div>
        </div>
        <ChipStatus
          status={
            detail.returnStatus === "returned" ? "completed" : "processing"
          }
        />
      </div>

      {/* Return Status Section */}
      <div className="w-full h-full bg-white border border-[#D1D1D1] rounded-[24px] flex-col justify-start items-start inline-flex">
        {/* Header with status icon and title */}
        <div className="self-stretch px-[14px] py-[14px] rounded-t-[24px] border-b border-[#D1D1D1] justify-start items-center gap-5 inline-flex">
          <div className="w-10 h-10 relative overflow-hidden">
            <div className="w-[37.45px] h-[35px] left-[2.50px] top-[2.50px] absolute bg-[#04910C]"></div>
          </div>
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            Đã hoàn trả
          </div>
        </div>

        {/* Table header */}
        <div className="self-stretch h-[50px] bg-[#F6F6F6] justify-start items-start inline-flex">
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
            className={`self-stretch border border-[#D1D1D1] justify-start items-start inline-flex ${
              index === detail.items.length - 1 ? "rounded-b-[24px]" : ""
            }`}
          >
            <div className="w-[400px] self-stretch px-3 py-3 justify-start items-center gap-3 flex">
              <img
                className="w-[60px] h-[60px]"
                src={item.image || "https://placehold.co/60x60"}
                alt={item.name}
              />
              <div className="self-stretch justify-start items-start gap-2.5 flex">
                <div className="text-black text-[10px] font-[500] font-montserrat leading-[14px]">
                  {item.name}
                </div>
              </div>
            </div>
            <div className="flex-1 self-stretch px-[14px] flex-col justify-center items-center gap-2.5 inline-flex">
              <div className="text-[#272424] text-[10px] font-[500] font-montserrat leading-[14px]">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 self-stretch px-[14px] flex-col justify-center items-center gap-2 inline-flex">
              <div className="text-[#272424] text-[10px] font-[500] font-montserrat leading-[14px]">
                {formatCurrency(item.price)}
              </div>
            </div>
            <div className="flex-1 self-stretch px-[14px] flex-col justify-center items-end gap-2 inline-flex">
              <div className="text-[#272424] text-[10px] font-[500] font-montserrat leading-[14px]">
                {formatCurrency(item.total)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refund Summary Section */}
      <div className="w-full h-full bg-white border border-[#D1D1D1] rounded-[24px] flex-col justify-start items-start inline-flex">
        {/* Header with refund status */}
        <div className="self-stretch px-[14px] py-[14px] rounded-t-[24px] border-b border-[#D1D1D1] justify-start items-center gap-5 inline-flex">
          <div className="w-10 h-10 relative overflow-hidden">
            <div className="w-[37.45px] h-[35px] left-[2.50px] top-[2.50px] absolute bg-[#04910C]">
              {/* icon place here */}
            </div>
          </div>
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            Đã nhận hoàn tiền
          </div>
        </div>

        {/* Summary row */}
        <div className="self-stretch h-[50px] bg-[#F6F6F6] border-b border-[#D1D1D1] justify-start items-start inline-flex">
          <div className="flex-1 self-stretch px-[14px] overflow-hidden border-l border-[#D1D1D1] justify-start items-center flex">
            <div className="w-[22px] h-0 transform rotate-[-90deg] origin-top-left"></div>
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Giá trị hàng trả
            </div>
          </div>
          <div className="flex-1 self-stretch relative">
            <div className="left-[101px] top-[15px] absolute text-center text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              {detail.totals.items} sản phẩm
            </div>
          </div>
          <div className="flex-1 self-stretch px-[14px] border-r border-[#D1D1D1] justify-end items-center gap-1 flex">
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              {formatCurrency(detail.totals.value)}
            </div>
          </div>
        </div>

        {/* Refund details */}
        <div className="self-stretch pt-1.5 pb-1.5 rounded-b-[24px] border border-[#D1D1D1] justify-between items-start inline-flex">
          <div className="flex-1 self-stretch px-3 flex-col justify-center items-start gap-2.5 inline-flex">
            <div className="justify-start items-start gap-2.5 inline-flex">
              <div className="text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px]">
                Giá trị hoàn trả
              </div>
            </div>
          </div>
          <div className="flex-1 self-stretch px-3 flex-col justify-center items-end gap-2 inline-flex">
            <div className="text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px]">
              {formatCurrency(detail.totals.value)}
            </div>
          </div>
        </div>
      </div>

      {/* Return Reason Section */}
      <div className="w-full h-full bg-white border border-[#D1D1D1] rounded-[24px] flex-col justify-start items-start inline-flex">
        <div className="self-stretch px-[14px] py-[14px] rounded-t-[24px] border-b border-[#D1D1D1] justify-start items-center gap-5 inline-flex">
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            Lý do trả hàng
          </div>
        </div>
        <div className="self-stretch px-[14px] py-[14px] rounded-b-[24px] justify-start items-start inline-flex">
          <div className="text-[#272424] text-[14px] font-[400] font-montserrat leading-[19.60px]">
            {detail.returnReason}
          </div>
        </div>
      </div>

      {/* Supplier and Staff section */}
      <div className="w-full h-full justify-start items-start gap-3 inline-flex">
        {/* Supplier card */}
        <div className="flex-1 px-6 py-3 bg-white border border-[#D1D1D1] rounded-[24px] flex-col justify-start items-start inline-flex">
          <div className="self-stretch pt-1.5 pb-1.5 rounded-[12px] justify-start items-center gap-2.5 inline-flex">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              Nhà cung cấp
            </div>
          </div>
          <div className="self-stretch justify-start items-center gap-[26px] inline-flex">
            <img
              className="w-[85px] h-[85px] rounded-[12px]"
              src="https://placehold.co/85x85"
              alt="Supplier"
            />
            <div className="self-stretch justify-start items-start gap-2.5 flex">
              <div className="text-black text-[12px] font-[400] font-montserrat leading-[18px]">
                {detail.supplier}
              </div>
            </div>
          </div>
        </div>

        {/* Staff card */}
        <div className="flex-1 px-6 py-3 bg-white border border-[#D1D1D1] rounded-[24px] flex-col justify-start items-start inline-flex">
          <div className="self-stretch pt-1.5 pb-1.5 rounded-[12px] justify-start items-center gap-2.5 inline-flex">
            <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
              Nhân viên phụ trách
            </div>
          </div>
          <div className="self-stretch justify-start items-center gap-[26px] inline-flex">
            <div className="w-[85px] h-[85px] rounded-[12px] border-2 border-dashed border-[#D1D1D1] flex items-center justify-center">
              <div className="text-[#D1D1D1] text-[12px] font-[400] font-montserrat leading-[18px]">
                Avatar
              </div>
            </div>
            <div className="self-stretch justify-start items-start gap-2.5 flex">
              <div className="text-[#272424] text-[12px] font-[400] font-montserrat leading-[18px]">
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
