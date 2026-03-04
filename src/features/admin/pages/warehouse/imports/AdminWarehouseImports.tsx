import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretDown } from "@/components/ui/caret-down";
import Icon from "@/components/icons/Icon";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  TableFilters,
} from "@/components/common";
import {
  getImportInvoices,
  getImportInvoicesPending,
  getImportInvoicesDone,
  getImportInvoicesProductPending,
  getImportInvoicesProductDone,
  getImportInvoicesPaymentPending,
  getImportInvoicesPaymentDone,
} from "@/api/endpoints/warehouseApi";
import type { InvoiceResponse } from "@/types/warehouse";

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

const AdminWarehouseImports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [importsData, setImportsData] = useState<WarehouseImport[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Set document title
  useEffect(() => {
    document.title = "Nhập hàng | Wanderoo";
  }, []);

  // Map InvoiceResponse to WarehouseImport - memoized để tránh re-create mỗi lần render
  const mapInvoiceToWarehouseImport = useCallback((invoice: InvoiceResponse): WarehouseImport => {
    
    // Map status: DONE -> completed, PENDING -> processing
    const status = invoice.status === "DONE" ? "completed" : "processing";
    
    // Map productStatus: DONE -> imported, PENDING -> not_imported
    const importStatus = invoice.productStatus === "DONE" ? "imported" : "not_imported";
    
    // Map paymentStatus: DONE -> paid, PENDING -> unpaid
    const paymentStatus = invoice.paymentStatus === "DONE" ? "paid" : "unpaid";
    
    // Map method: CASH -> cash, BANKING -> transfer, UNDEFINED -> cash (default)
    const paymentMethod = invoice.method === "CASH" ? "cash" : 
                         invoice.method === "BANKING" ? "transfer" : "cash";

    // Hiển thị code trực tiếp từ backend (không convert) - hiển thị đúng string backend trả về
    const importCode = invoice.code || "";

    // Format date: parse and format createdAt properly
    // Backend returns date as string like "2025-11-13 05:31:21" or ISO string
    let createdDate: string;
    if (invoice.createdAt) {
      try {
        // Optimize date parsing - try direct parse first
        const dateStr = typeof invoice.createdAt === 'string' 
          ? invoice.createdAt.replace(' ', 'T') 
          : invoice.createdAt;
        const date = new Date(dateStr);
        
        if (!isNaN(date.getTime())) {
          createdDate = date.toISOString();
        } else {
          createdDate = new Date().toISOString();
        }
      } catch (error) {
        // Silent fail - use current date as fallback
        createdDate = new Date().toISOString();
      }
    } else {
      createdDate = new Date().toISOString();
    }

    // Use providerName and picName directly from API response (hiển thị giá trị thực từ DB)
    const supplier = invoice.providerName || "";
    const createdBy = invoice.picName || "";

    // Ensure totalPrice is a valid number (Float from backend)
    const totalValue = invoice.totalPrice != null && 
                       !isNaN(Number(invoice.totalPrice)) && 
                       isFinite(Number(invoice.totalPrice))
                      ? Number(invoice.totalPrice) 
                      : 0;

    // Ensure totalQuantity is a valid number (int from backend)
    const totalItems = invoice.totalQuantity != null && 
                       !isNaN(Number(invoice.totalQuantity)) && 
                       isFinite(Number(invoice.totalQuantity))
                      ? Number(invoice.totalQuantity) 
                      : 0;

    return {
      id: invoice.id ? invoice.id.toString() : "",
      importCode,
      createdDate,
      paymentMethod,
      status,
      importStatus,
      paymentStatus,
      supplier,
      createdBy,
      totalItems,
      totalValue,
    };
  }, []);

  // Fetch data from API
  useEffect(() => {
    let isMounted = true; // Flag to prevent state update if component unmounts
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const page = currentPage - 1; // API uses 0-based pagination
        let response;

        // Truyền keyword và size=10 cho backend
        const keyword = searchTerm && searchTerm.trim() !== "" ? searchTerm.trim() : undefined;
        const size = 10;

        // Map selectedStatus to API call - sử dụng server-side filtering thay vì client-side
        if (selectedStatus === "Đang giao dịch") {
          response = await getImportInvoicesPending(keyword, undefined, page, size);
        } else if (selectedStatus === "Đã hoàn thành") {
          response = await getImportInvoicesDone(keyword, undefined, page, size);
        } else if (selectedStatus === "Chưa nhập") {
          response = await getImportInvoicesProductPending(keyword, page, size);
        } else if (selectedStatus === "Đã nhập") {
          response = await getImportInvoicesProductDone(keyword, page, size);
        } else if (selectedStatus === "Chưa thanh toán") {
          response = await getImportInvoicesPaymentPending(keyword, page, size);
        } else if (selectedStatus === "Đã thanh toán") {
          response = await getImportInvoicesPaymentDone(keyword, page, size);
        } else {
          // "Tất cả trạng thái" - use all invoices
          response = await getImportInvoices(keyword, undefined, page, size);
        }

        if (!response || !response.invoices) {
          console.error("Invalid response structure:", response);
          if (isMounted) {
            setImportsData([]);
            setTotalPages(0);
            setTotalElements(0);
          }
          return;
        }

        const mappedImports = response.invoices.map(mapInvoiceToWarehouseImport);
        
        if (isMounted) {
          setImportsData(mappedImports);
          setTotalPages(response.totalPages || 1);
          setTotalElements(response.totalElements || 0);
        }
      } catch (error) {
        console.error("Error fetching import invoices:", error);
        if (isMounted) {
          setImportsData([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false; // Cleanup: prevent state update after unmount
    };
  }, [selectedStatus, currentPage, searchTerm]);

  // Data is already filtered and paginated by the API
  const paginatedImports = importsData;

  // Memoize helper functions để tránh re-create mỗi lần render
  const getStatusChip = useCallback((status: WarehouseImport["status"]) => {
    if (status === "processing" || status === "completed") {
      return <ChipStatus status={status as ChipStatusKey} size="small" />;
    }
    return null;
  }, []);

  const getImportStatusChip = useCallback((status: WarehouseImport["importStatus"]) => {
    if (status === "not_imported" || status === "imported") {
      return <ChipStatus status={status as ChipStatusKey} size="small" />;
    }
    return null;
  }, []);

  const getPaymentStatusChip = useCallback((status: WarehouseImport["paymentStatus"]) => {
    if (status === "paid" || status === "unpaid") {
      return <ChipStatus status={status as ChipStatusKey} size="small" />;
    }
    return null;
  }, []);

  // Format price: hiển thị số + "đ" (ví dụ: 960000đ) - memoized
  const formatPrice = useCallback((amount: number) => {
    if (amount == null || isNaN(amount) || !isFinite(amount)) {
      return "0đ";
    }
    // Format số với dấu phẩy ngăn cách hàng nghìn
    return `${Number(amount).toLocaleString('vi-VN')}đ`;
  }, []);

  // Format date: parse "2025-11-13 05:31:21" → "13/11/2025" - memoized
  const formatDate = useCallback((dateString: string) => {
    try {
      let date: Date;
      if (dateString.includes(' ') && !dateString.includes('T')) {
        // Format: "2025-11-13 05:31:21"
        date = new Date(dateString.replace(' ', 'T'));
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return dateString; // Return original if can't parse
      }
      
      // Format as DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString;
    }
  }, []);

  // Calculate pagination display text (size = 10)
  const paginationText = useMemo(() => {
    if (totalElements === 0) {
      return "Không có dữ liệu";
    }
    const start = (currentPage - 1) * 10 + 1;
    const end = Math.min(currentPage * 10, totalElements);
    return `Đang hiển thị ${start} - ${end} trong tổng ${totalElements} trang`;
  }, [currentPage, totalElements]);

  // Reset to page 1 when searchTerm changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Nhập hàng"
        actions={
          <Button
            variant={"default"}
            className="h-[36px]"
            onClick={() => navigate("/admin/warehouse/imports/create")}
          >
            <Icon name="plus" size={16} color="#ffffff" strokeWidth={3} />
            <span>Tạo đơn nhập hàng</span>
          </Button>
        }
      />

      <ContentCard>
        {/* Filters Section */}
        <TableFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Tìm kiếm theo mã phiếu..."
          actions={
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
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("Tất cả trạng thái");
                    setCurrentPage(1);
                  }}
                >
                  Tất cả trạng thái
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("Đang giao dịch");
                    setCurrentPage(1);
                  }}
                >
                  Đang giao dịch
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("Đã hoàn thành");
                    setCurrentPage(1);
                  }}
                >
                  Đã hoàn thành
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("Chưa nhập");
                    setCurrentPage(1);
                  }}
                >
                  Chưa nhập
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSelectedStatus("Đã nhập");
                    setCurrentPage(1);
                  }}
                >
                  Đã nhập
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("Chưa thanh toán");
                    setCurrentPage(1);
                  }}
                >
                  Chưa thanh toán
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("Đã thanh toán");
                    setCurrentPage(1);
                  }}
                >
                  Đã thanh toán
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />

        {/* Table Section */}
        <div className="border-[0.5px] border-[#d1d1d1] rounded-[16px] w-full">
          {/* Fixed Table Header - Desktop */}
          <div className="bg-[#f6f6f6] rounded-tl-[16px] rounded-tr-[16px] sticky top-0 z-10 hidden lg:block">
            <div className="grid grid-cols-11 gap-2 px-4 py-3">
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Mã đơn
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Ngày tạo
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Trạng thái
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  TT Nhập
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  TT Thanh toán
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Nhà cung cấp
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Người tạo
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  SL
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Giá trị
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-[#272424] text-[14px]">Đang tải...</span>
              </div>
            ) : paginatedImports.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-[#272424] text-[14px]">Không có dữ liệu</span>
              </div>
            ) : (
              paginatedImports.map((importItem, index) => (
              <div
                key={importItem.id}
                className={`border-b border-[#e7e7e7] hover:bg-gray-50 ${index === paginatedImports.length - 1 ? "border-b-0 rounded-bl-[16px] rounded-br-[16px]" : ""}`}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-11 gap-2 px-4 py-4 items-center">
                  <div className="col-span-1 text-center">
                    <span
                      className="font-semibold text-[12px] text-[#1a71f6] cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/admin/warehouse/imports/${importItem.id}`)
                      }
                    >
                      {importItem.importCode}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium text-[#272424] text-[12px]">
                      {formatDate(importItem.createdDate)}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getStatusChip(importItem.status)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getImportStatusChip(importItem.importStatus)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getPaymentStatusChip(importItem.paymentStatus)}
                  </div>
                  <div className="col-span-2 text-center">
                    <span
                      className="font-medium text-[#272424] text-[12px] truncate block"
                      title={importItem.supplier}
                    >
                      {importItem.supplier}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span
                      className="font-medium text-[#272424] text-[12px] truncate block"
                      title={importItem.createdBy}
                    >
                      {importItem.createdBy}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium text-[#272424] text-[12px]">
                      {importItem.totalItems}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium text-[#272424] text-[12px]">
                      {formatPrice(importItem.totalValue)}
                    </span>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden px-4 py-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className="font-semibold text-[14px] text-[#1a71f6] cursor-pointer hover:underline"
                        onClick={() =>
                          navigate(`/admin/warehouse/imports/${importItem.id}`)
                        }
                      >
                        {importItem.importCode}
                      </span>
                      <div className="text-[12px] text-gray-500 mt-1">
                        {formatDate(importItem.createdDate)}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {getStatusChip(importItem.status)}
                      {getImportStatusChip(importItem.importStatus)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-gray-600">Nhà cung cấp:</span>
                      <span
                        className="font-medium text-right max-w-[60%] truncate"
                        title={importItem.supplier}
                      >
                        {importItem.supplier}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-gray-600">Người tạo:</span>
                      <span className="font-medium">
                        {importItem.createdBy}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-600">SL / Giá trị:</span>
                      <span className="font-medium">
                        {importItem.totalItems} / {formatPrice(importItem.totalValue)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      {getPaymentStatusChip(importItem.paymentStatus)}
                    </div>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="py-[8px] w-full flex-shrink-0 flex justify-end items-center">
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default AdminWarehouseImports;
