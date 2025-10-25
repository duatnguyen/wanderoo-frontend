import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import CaretDown from "@/components/ui/caret-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReturnImport {
  id: string;
  returnCode: string;
  importCode: string;
  createdDate: string;
  paymentMethod: "cash" | "transfer";
  returnStatus: "returned" | "pending_return";
  refundStatus: "refunded" | "pending_refund";
  supplier: string;
  createdBy: string;
  returnQuantity: number;
  totalValue: number;
}

const mockReturns: ReturnImport[] = [
  {
    id: "1",
    returnCode: "SRT001",
    importCode: "REI001",
    createdDate: "2025-09-13T21:05:00",
    paymentMethod: "cash",
    returnStatus: "returned",
    refundStatus: "refunded",
    supplier: "Kho Nhật Quang",
    createdBy: "Admin ThanhNguyen",
    returnQuantity: 10000,
    totalValue: 1000000,
  },
  {
    id: "2",
    returnCode: "SRT002",
    importCode: "REI002",
    createdDate: "2025-09-12T15:30:00",
    paymentMethod: "transfer",
    returnStatus: "pending_return",
    refundStatus: "pending_refund",
    supplier: "Công ty ABC",
    createdBy: "Admin NguyenVanA",
    returnQuantity: 5000,
    totalValue: 750000,
  },
];

const AdminWarehouseReturnsImport = () => {
  document.title = "Trả hàng nhập | Wanderoo";

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [returns] = useState<ReturnImport[]>(mockReturns);

  const filteredReturns = useMemo(() => {
    return returns.filter((returnItem) => {
      const matchesSearch =
        searchTerm === "" ||
        returnItem.returnCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        returnItem.importCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        returnItem.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [returns, searchTerm]);

  const paginatedReturns = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredReturns.slice(startIndex, startIndex + 10);
  }, [filteredReturns, currentPage]);

  const totalPages = Math.ceil(filteredReturns.length / 10);

  const getPaymentMethodChip = (method: ReturnImport["paymentMethod"]) => {
    if (method === "cash" || method === "transfer") {
      return <ChipStatus status={method as ChipStatusKey} />;
    }
    return null;
  };

  const getReturnStatusChip = (status: ReturnImport["returnStatus"]) => {
    if (status === "returned") {
      return <ChipStatus status="completed" />;
    } else if (status === "pending_return") {
      return <ChipStatus status="processing" />;
    }
    return null;
  };

  const getRefundStatusChip = (status: ReturnImport["refundStatus"]) => {
    if (status === "refunded") {
      return <ChipStatus status="paid" />;
    } else if (status === "pending_refund") {
      return <ChipStatus status="unpaid" />;
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
    <div className="box-border flex flex-col gap-[10px] items-start px-[20px] py-[32px] relative w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="box-border flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] relative shrink-0 w-full">
        <div className="flex items-center justify-between relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center relative shrink-0">
            <div className="flex gap-[4px] items-center justify-center relative shrink-0">
              <div className="flex flex-row items-center self-stretch">
                <div className="flex gap-[10px] h-full items-end justify-center relative shrink-0">
                  <h1 className="font-['Montserrat'] font-bold text-[24px] text-[#272424] leading-normal">
                    Danh sách đơn trả hàng nhập
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-[10px] items-center relative shrink-0">
            <Button
              onClick={() => navigate("/admin/warehouse/returns/create")}
              variant="default"
            >
              Tạo đơn trả hàng nhập
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[15px] items-start px-[24px] py-[16px] relative rounded-[25px] shrink-0 w-full">
        {/* Search and Filter Section */}
        <div className="flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <div className="flex gap-[38px] items-start relative shrink-0">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm"
              className="w-[500px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-white border-2 border-[#e04d30] box-border flex gap-[6px] items-center justify-center px-[24px] py-[12px] rounded-[12px] cursor-pointer">
                  <span className="font-['Montserrat'] font-semibold text-[#e04d30] text-[12px] leading-[1.4]">
                    Trạng thái hoàn hàng
                  </span>
                  <CaretDown className="text-[#e04d30]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {}}>
                  Tất cả trạng thái
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  Đã hoàn trả
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  Chưa hoàn trả
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Section with Horizontal Scroll */}
        <div className="bg-white border border-[#e7e7e7] box-border flex flex-col items-start relative rounded-[16px] shrink-0 w-full">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[1400px]">
              {/* Table Header */}
              <div className="flex flex-col gap-[10px] items-start relative rounded-[24px] shrink-0 w-full">
                <div className="flex items-center relative shrink-0 w-full">
                  <div className="flex flex-row items-center self-stretch">
                    <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] h-full items-center justify-center pb-[17px] pt-[16px] px-[16px] relative rounded-tl-[12px] shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Mã đơn trả
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center self-stretch">
                    <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] h-full items-center justify-center pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Mã đơn nhập
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                    <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Ngày tạo
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                    <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                      Phương thức thanh toán
                    </p>
                  </div>
                  <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                    <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Trạng thái hoàn hàng
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                    <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Trạng thái hoàn tiền
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                    <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Nhà cung cấp
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                    <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Người tạo
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                    <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Số lượng trả
                      </p>
                    </div>
                  </div>
                  <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                    <div className="basis-0 bg-[#f6f6f6] border-b border-[#e7e7e7] box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px pb-[17px] pt-[16px] px-[16px] relative rounded-tr-[12px] shrink-0">
                      <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[#272424] text-[12px] text-center">
                        Giá trị đơn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                {paginatedReturns.map((returnItem) => (
                  <div
                    key={returnItem.id}
                    className="flex items-center relative shrink-0 w-full hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/warehouse/returns/${returnItem.id}`)
                    }
                  >
                    <div className="flex flex-row items-center self-stretch">
                      <div className="box-border flex gap-[10px] h-full items-center justify-center p-[16px] relative shrink-0 w-[99px]">
                        <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[12px] text-[#1a71f6] text-center">
                          {returnItem.returnCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center self-stretch">
                      <div className="box-border flex gap-[10px] h-full items-center justify-center p-[16px] relative shrink-0 w-[114px]">
                        <p className="font-['Montserrat'] font-semibold leading-[1.4] text-[12px] text-[#1a71f6] text-center">
                          {returnItem.importCode}
                        </p>
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        <p className="font-['Montserrat'] font-normal leading-[1.5] text-[#272424] text-[12px] text-center">
                          {formatDate(returnItem.createdDate)}
                        </p>
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        {getPaymentMethodChip(returnItem.paymentMethod)}
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        {getReturnStatusChip(returnItem.returnStatus)}
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        {getRefundStatusChip(returnItem.refundStatus)}
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        <p className="font-['Montserrat'] font-normal leading-[1.5] text-[#272424] text-[12px] text-center">
                          {returnItem.supplier}
                        </p>
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        <p className="font-['Montserrat'] font-normal leading-[1.5] text-[#272424] text-[12px] text-center">
                          {returnItem.createdBy}
                        </p>
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        <p className="font-['Montserrat'] font-normal leading-[1.5] text-[#272424] text-[12px] text-center">
                          {returnItem.returnQuantity}
                        </p>
                      </div>
                    </div>
                    <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                      <div className="basis-0 box-border flex gap-[10px] grow h-full items-center justify-center min-h-px min-w-px p-[16px] relative shrink-0">
                        <p className="font-['Montserrat'] font-normal leading-[1.5] text-[#272424] text-[12px] text-center">
                          {formatCurrency(returnItem.totalValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminWarehouseReturnsImport;
