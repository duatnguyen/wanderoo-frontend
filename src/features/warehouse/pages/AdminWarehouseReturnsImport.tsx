import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import CaretDown from "@/components/ui/caret-down";
import Icon from "@/components/icons/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WarehouseImport {
  id: string;
  importCode: string;
  createdDate: string;
  paymentMethod: "cash" | "transfer";
  status: "processing" | "completed";
  importStatus: "not_imported" | "imported";
  paymentStatus: "paid" | "unpaid";
  supplier: string;
  createdBy: string;
  totalItems: number;
  totalValue: number;
}

const mockImports: WarehouseImport[] = [
  {
    id: "1",
    importCode: "REI001",
    createdDate: "2025-09-13T21:05:00",
    paymentMethod: "cash",
    status: "processing",
    importStatus: "not_imported",
    paymentStatus: "unpaid",
    supplier: "NCC1",
    createdBy: "ThanhNguyen",
    totalItems: 150,
    totalValue: 1000000,
  },
  {
    id: "2",
    importCode: "REI002",
    createdDate: "2025-09-12T15:30:00",
    paymentMethod: "transfer",
    status: "processing",
    importStatus: "imported",
    paymentStatus: "paid",
    supplier: "Công ty XYZ",
    createdBy: "Trần Thị B",
    totalItems: 200,
    totalValue: 3500000,
  },
  {
    id: "3",
    importCode: "REI003",
    createdDate: "2025-09-10T08:20:00",
    paymentMethod: "transfer",
    status: "completed",
    importStatus: "imported",
    paymentStatus: "paid",
    supplier: "Nhà cung cấp DEF",
    createdBy: "Lê Văn C",
    totalItems: 75,
    totalValue: 1200000,
  },
];

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
    refundStatus: "pending_refund", // Default: Đã hoàn trả, Chưa thanh toán
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
    returnStatus: "returned",
    refundStatus: "pending_refund", // Default: Đã hoàn trả, Chưa thanh toán
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
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSearchTerm, setImportSearchTerm] = useState("");
  const [importCurrentPage, setImportCurrentPage] = useState(1);

  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for storage changes to update the list
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey((prev) => prev + 1);
    };
    const handleCustomUpdate = () => {
      setRefreshKey((prev) => prev + 1);
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("returnImportStatusUpdated", handleCustomUpdate);
    // Also check on focus to catch changes from same tab
    window.addEventListener("focus", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("returnImportStatusUpdated", handleCustomUpdate);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  // Load status updates from localStorage and merge with mock data
  const returns = useMemo(() => {
    const storedStatuses = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("returnImportStatuses") || "{}") : {};
    return mockReturns.map((item) => {
      const storedStatus = storedStatuses[item.id];
      if (storedStatus) {
        return {
          ...item,
          returnStatus: storedStatus.returnStatus || item.returnStatus,
          refundStatus: storedStatus.refundStatus || item.refundStatus,
        };
      }
      return item;
    });
  }, [refreshKey]); // Re-check when refreshKey changes

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

  // Filter imports for modal
  const filteredImports = useMemo(() => {
    return mockImports.filter((importItem) => {
      const matchesSearch =
        importSearchTerm === "" ||
        importItem.importCode
          .toLowerCase()
          .includes(importSearchTerm.toLowerCase()) ||
        importItem.supplier.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
        importItem.createdBy.toLowerCase().includes(importSearchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [importSearchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace(/\s/g, "")
      .replace(/₫/g, "đ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleSelectImport = (importId: string) => {
    navigate(`/admin/warehouse/returns/create?importId=${importId}`);
  };

  const importItemsPerPage = 10;
  const importTotalPages = Math.ceil(filteredImports.length / importItemsPerPage);
  const paginatedImports = useMemo(() => {
    const startIndex = (importCurrentPage - 1) * importItemsPerPage;
    return filteredImports.slice(startIndex, startIndex + importItemsPerPage);
  }, [filteredImports, importCurrentPage]);

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

  return (
    <div className="flex flex-col h-screen max-h-screen w-full gap-0">
      {/* Header */}
      <div className="flex items-center justify-between py-[4px] px-0 h-[32px] w-full mb-[6px] flex-nowrap gap-2">
        <h1 className="font-bold text-[24px] text-[#272424] font-['Montserrat'] whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
          Danh sách đơn trả hàng nhập
        </h1>
        <Button
          variant={"default"}
          className="h-[36px] flex-shrink-0"
          onClick={() => setIsImportModalOpen(true)}
        >
          <Icon name="plus" size={16} color="#ffffff" strokeWidth={3} />
          <span className="whitespace-nowrap">Tạo đơn trả hàng nhập</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-[#e7e7e7] flex flex-col items-start relative rounded-[20px] w-full max-w-full flex-1 overflow-hidden">
        {/* Search and Filter Section */}
        <div className="flex flex-col gap-[8px] items-center px-[15px] py-[8px] relative rounded-[20px] w-full">
          <div className="flex gap-[8px] items-center justify-left relative w-full">
            <div className="flex flex-row items-center self-stretch">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm"
                className="flex-1 w-[clamp(180px,40vw,400px)]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-white border-2 border-[#e04d30] flex gap-[6px] items-center justify-center px-[20px] py-[8px] rounded-[10px] cursor-pointer">
                  <span className="text-[#e04d30] text-[11px] font-semibold leading-[1.4]">
                    {selectedStatus}
                  </span>
                  <CaretDown className="text-[#e04d30]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus("Tất cả trạng thái")}>
                  Tất cả trạng thái
</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Đã hoàn trả")}>
                  Đã hoàn trả
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Chưa hoàn trả")}>
                  Chưa hoàn trả
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex flex-col items-start px-[15px] py-0 relative rounded-[16px] w-full">
          {/* Table Container with Scroll */}
          <div className="w-full overflow-x-auto">
            <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full min-w-[1330px]">
              {/* Table Header */}
              <div className="bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Mã đơn trả
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Mã đơn nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Ngày tạo
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Phương thức<br />thanh toán
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái<br />hoàn hàng
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái<br />hoàn tiền
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
<span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Nhà cung cấp
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Người tạo
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      SL trả
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Giá trị đơn
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              {paginatedReturns.map((returnItem, index) => (
                <div
                  key={returnItem.id}
                  className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[12px] py-0 w-full ${
                    index === paginatedReturns.length - 1
                      ? "border-transparent"
                      : "border-[#e7e7e7]"
                  }`}
                >
                  <div className="flex items-center w-full">
                    <div className="flex flex-row items-center w-full">
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        <span 
                          className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] text-center cursor-pointer hover:underline"
                          onClick={() => navigate(`/admin/warehouse/returns/${returnItem.id}`)}
                        >
                          {returnItem.returnCode}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        <span 
                          className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] text-center cursor-pointer hover:underline"
                          onClick={() => navigate(`/admin/warehouse/imports/${returnItem.importCode}`)}
                        >
                          {returnItem.importCode}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {formatDate(returnItem.createdDate)}
                        </span>
                      </div>
<div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        {getPaymentMethodChip(returnItem.paymentMethod)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        {getReturnStatusChip(returnItem.returnStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        {getRefundStatusChip(returnItem.refundStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {returnItem.supplier}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {returnItem.createdBy}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {returnItem.returnQuantity}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] flex-1 min-w-0">
                        <span className="font-medium text-[#1a71f6] text-[13px] leading-[1.4] text-center">
                          {formatCurrency(returnItem.totalValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-[15px] py-[8px] w-full flex-shrink-0">
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Import Selection Modal */}
      {isImportModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsImportModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-[85vw] max-w-[1000px] max-h-[85vh] bg-white flex flex-col rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white flex flex-col rounded-lg overflow-hidden">
              {/* Modal Header */}
              <div className="border-b border-[#e7e7e7] flex items-center justify-between px-[24px] py-[4px] shrink-0 bg-white">
                <h2 className="font-['Montserrat'] font-bold text-[20px] text-[#272424]">
                  Chọn đơn nhập hàng
                </h2>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-[#737373] hover:text-[#4a4a4a] text-[24px] leading-none"
                >
                  ×
                </button>
              </div>

              {/* Search Bar */}
              <div className="border-b border-[#e7e7e7] px-[24px] py-[16px] shrink-0 bg-white">
                <SearchBar
                  value={importSearchTerm}
                  onChange={(e) => {
                    setImportSearchTerm(e.target.value);
                    setImportCurrentPage(1);
                  }}
                  placeholder="Tìm kiếm theo mã đơn, nhà cung cấp..."
                  className="w-full"
                />
              </div>

              {/* Table Container */}
              <div className="flex-1 overflow-x-auto overflow-y-auto bg-white px-[20px] pt-[16px] pb-0">
                <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full min-w-[900px] mb-0">
                  {/* Table Header */}
                  <div className="bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full">
                    <div className="flex flex-row items-center w-full">
                      <div className="flex h-full items-center justify-center px-[6px] py-[10px] shrink-0 flex-[1.5] min-w-0">
                        <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                          Mã đơn nhập
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[10px] shrink-0 flex-1 min-w-0">
                        <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                          Ngày tạo
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[10px] shrink-0 flex-1 min-w-0">
                        <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                          Nhân viên
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[10px] shrink-0 flex-1 min-w-0">
                        <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                          Nhà cung cấp
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-end xl:justify-center px-[12px] py-[10px] shrink-0 flex-1 min-w-0">
                        <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                          Giá trị đơn nhập hàng
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[10px] shrink-0 flex-1 min-w-0">
                        <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                          Thao tác
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  {paginatedImports.map((importItem, index) => (
                    <div
                      key={importItem.id}
                      className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[12px] py-0 w-full ${
                        index === paginatedImports.length - 1
                          ? "border-transparent rounded-bl-[16px] rounded-br-[16px]"
                          : "border-[#e7e7e7]"
                      }`}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex flex-row items-center w-full">
                          <div className="flex h-full items-center justify-center px-[6px] py-[10px] shrink-0 flex-[1.5] min-w-0">
                            <span className="font-semibold text-[12px] text-[#272424] leading-[1.4] text-center whitespace-nowrap">
                              {importItem.importCode}
                            </span>
                          </div>
                          <div className="flex h-full items-center justify-center px-[6px] py-[10px] shrink-0 flex-1 min-w-0">
                            <span className="font-medium text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                              {formatDate(importItem.createdDate)}
                            </span>
                          </div>
                          <div className="flex h-full items-center justify-center px-[4px] py-[10px] shrink-0 flex-1 min-w-0">
                            <span className="font-medium text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                              {importItem.createdBy}
                            </span>
                          </div>
                          <div className="flex h-full items-center justify-center px-[4px] py-[10px] shrink-0 flex-1 min-w-0">
                            <span className="font-medium text-[#272424] text-[12px] leading-[1.4] text-center whitespace-nowrap">
                              {importItem.supplier}
                            </span>
                          </div>
                          <div className="flex h-full items-center justify-end xl:justify-center pr-[12px] pl-[6px] py-[10px] shrink-0 flex-1 min-w-0">
                            <span className="font-medium text-[#272424] text-[12px] leading-[1.4] text-right xl:text-center whitespace-nowrap">
                              {formatCurrency(importItem.totalValue)}
                            </span>
                          </div>
                          <div className="flex h-full items-center justify-center px-[4px] py-[10px] shrink-0 flex-1 min-w-0">
                            <span
                              className="font-medium text-[12px] text-[#1a71f6] leading-[1.4] text-center whitespace-nowrap hover:underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectImport(importItem.id);
                              }}
                            >
                              Trả hàng
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer with Pagination */}
              <div className="border-t border-[#e7e7e7] px-[24px] py-[16px] flex items-center justify-center shrink-0 bg-white rounded-b-lg">
                <Pagination
                  current={importCurrentPage}
                  total={importTotalPages}
                  onChange={setImportCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouseReturnsImport;
