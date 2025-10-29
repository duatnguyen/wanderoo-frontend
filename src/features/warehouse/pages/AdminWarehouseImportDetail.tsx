import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";

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
  items: Array<{ id: string; name: string; quantity: number; price: number; total: number }>;
  totals: { items: number; value: number };
};

const mockImportDetail: ImportDetail = {
  id: "1",
  importCode: "NK001",
  createdDate: "2024-01-15",
  supplier: "Công ty TNHH ABC",
  createdBy: "Nguyễn Văn A",
  status: "processing",
  importStatus: "not_imported",
  paymentStatus: "unpaid",
  paymentMethod: "cash",
  items: [
    { id: "p1", name: "Áo thun thoáng khí Rockbros LKW008", quantity: 100, price: 120000, total: 12000000 },
    { id: "p2", name: "Áo thun dài tay Northshengwolf", quantity: 50, price: 150000, total: 7500000 },
  ],
  totals: { items: 150, value: 19500000 },
};

const AdminWarehouseImportDetail: React.FC = () => {
  const navigate = useNavigate();
  const { importId } = useParams<{ importId: string }>();

  const detail: ImportDetail = {
    ...mockImportDetail,
    id: importId ?? mockImportDetail.id,
    importCode: mockImportDetail.importCode,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div className="space-y-4 p-3">
      {/* Header matching Figma design */}
      <div className="w-full h-full justify-start items-center gap-2 inline-flex">
        <div className="w-6 h-6 relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 w-6 h-6" 
            onClick={() => navigate("/admin/warehouse/imports")}
          > 
            <ArrowLeft className="h-4 w-4 text-[#454545]" />
          </Button>
        </div>
        <div className="self-stretch flex-col justify-center items-center gap-2.5 inline-flex">
          <div className="justify-center flex flex-col text-[#272424] text-[24px] font-[700] font-montserrat">
            {detail.importCode}
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
      <div className="w-full h-full bg-white border border-[#D1D1D1] rounded-[24px] flex-col justify-start items-start inline-flex">
        {/* Header with status icon and title */}
        <div className="self-stretch px-[14px] py-[14px] rounded-t-[24px] border-b border-[#D1D1D1] justify-start items-center gap-5 inline-flex">
          <div className="w-10 h-10 relative overflow-hidden">
            <div className="w-[37.45px] h-[35px] left-[2.50px] top-[2.50px] absolute bg-[#04910C]"></div>
          </div>
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            Đã nhập kho
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
              index === detail.items.length - 1 ? 'rounded-b-[24px]' : ''
            }`}
          >
            <div className="w-[400px] self-stretch px-3 py-3 justify-start items-center gap-3 flex">
              <img 
                className="w-[60px] h-[60px]" 
                src="https://placehold.co/60x60" 
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

      {/* Payment summary section matching Figma design */}
      <div className="w-full h-full bg-white border border-[#D1D1D1] rounded-[24px] flex-col justify-start items-start inline-flex">
        {/* Header with payment status */}
        <div className="self-stretch px-[14px] py-[14px] rounded-t-[24px] border-b border-[#D1D1D1] justify-start items-center gap-5 inline-flex">
          <div className="w-10 h-10 relative overflow-hidden">
            <div className="w-[37.45px] h-[35px] left-[2.50px] top-[2.50px] absolute bg-[#04910C]">
                {/* icon place here */}
            </div>
          </div>
          <div className="text-[#272424] text-[20px] font-[600] font-montserrat leading-[28px]">
            Đã thanh toán
          </div>
        </div>

        {/* Summary row */}
        <div className="self-stretch h-[50px] bg-[#F6F6F6] border-b border-[#D1D1D1] justify-start items-start inline-flex">
          <div className="flex-1 self-stretch px-[14px] overflow-hidden border-l border-[#D1D1D1] justify-start items-center flex">
            <div className="w-[22px] h-0 transform rotate-[-90deg] origin-top-left"></div>
            <div className="text-[#272424] text-[14px] font-[600] font-montserrat leading-[19.60px]">
              Tổng tiền
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

        {/* Payment details */}
        <div className="self-stretch pt-1.5 pb-1.5 rounded-b-[24px] border border-[#D1D1D1] justify-between items-start inline-flex">
          <div className="flex-1 self-stretch px-3 flex-col justify-center items-start gap-2.5 inline-flex">
            <div className="justify-start items-start gap-2.5 inline-flex">
              <div className="text-[#272424] text-[16px] font-[600] font-montserrat leading-[22.40px]">
                Tiền cần trả nhà cung cấp
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

      {/* Supplier and Staff section matching Figma design */}
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

export default AdminWarehouseImportDetail;


