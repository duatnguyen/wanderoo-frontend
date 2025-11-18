import { useState, useMemo, useEffect } from "react";
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
import { getImportInvoicesPending } from "@/api/endpoints/warehouseApi";
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

const AdminWarehouseImportsPending = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(""); // Giá trị đang nhập
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị đã submit (khi nhấn Enter)
  const [currentPage, setCurrentPage] = useState(1);
  const [importsData, setImportsData] = useState<WarehouseImport[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Set document title
  useEffect(() => {
    document.title = "Nhập hàng - Đang giao dịch | Wanderoo";
  }, []);

  // Map InvoiceResponse to WarehouseImport
  const mapInvoiceToWarehouseImport = (invoice: InvoiceResponse): WarehouseImport => {
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
    let createdDate: string;
    if (invoice.createdAt) {
      try {
        let date: Date;
        if (typeof invoice.createdAt === 'string') {
          if (invoice.createdAt.includes(' ') && !invoice.createdAt.includes('T')) {
            date = new Date(invoice.createdAt.replace(' ', 'T'));
          } else {
            date = new Date(invoice.createdAt);
          }
        } else {
          date = new Date(invoice.createdAt);
        }
        
        if (!isNaN(date.getTime())) {
          createdDate = date.toISOString();
        } else {
          createdDate = new Date().toISOString();
        }
      } catch (error) {
        console.error("Error parsing date:", invoice.createdAt, error);
        createdDate = new Date().toISOString();
      }
    } else {
      createdDate = new Date().toISOString();
    }

    // Use providerName and picName directly from API response
    const supplier = invoice.providerName || "";
    const createdBy = invoice.picName || "";

    // Ensure totalPrice is a valid number
    const totalValue = invoice.totalPrice != null && 
                       !isNaN(Number(invoice.totalPrice)) && 
                       isFinite(Number(invoice.totalPrice))
                      ? Number(invoice.totalPrice) 
                      : 0;

    // Ensure totalQuantity is a valid number
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
  };

  // Fetch data from API
  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const page = currentPage - 1; // API uses 0-based pagination
        const keyword = searchTerm && searchTerm.trim() !== "" ? searchTerm.trim() : undefined;
        const size = 10;

        console.log("Fetching data with:", { keyword, page, size });

        const response = await getImportInvoicesPending(keyword, undefined, page, size);

        // Chỉ update state nếu component vẫn còn mounted và không bị abort
        if (!isMounted || abortController.signal.aborted) {
          return;
        }

        if (!response || !response.invoices) {
          console.error("Invalid response structure:", response);
          setImportsData([]);
          setTotalPages(0);
          setTotalElements(0);
          return;
        }

        const mappedImports = response.invoices.map(mapInvoiceToWarehouseImport);
        console.log("Fetched data:", { count: mappedImports.length, keyword });
        
        if (isMounted && !abortController.signal.aborted) {
          setImportsData(mappedImports);
          setTotalPages(response.totalPages || 1);
          setTotalElements(response.totalElements || 0);
        }
      } catch (error) {
        if (isMounted && !abortController.signal.aborted) {
          console.error("Error fetching pending import invoices:", error);
          setImportsData([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function: cancel request nếu component unmount hoặc dependencies thay đổi
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [currentPage, searchTerm]);

  // Data is already filtered and paginated by the API
  const paginatedImports = importsData;

  const getStatusChip = (status: "processing" | "completed") => {
    if (status === "processing" || status === "completed") {
      return <ChipStatus status={status as ChipStatusKey} size="small" />;
    }
    return null;
  };

  const getImportStatusChip = (status: WarehouseImport["importStatus"]) => {
    if (status === "not_imported" || status === "imported") {
      return <ChipStatus status={status as ChipStatusKey} size="small" />;
    }
    return null;
  };

  const getPaymentStatusChip = (status: WarehouseImport["paymentStatus"]) => {
    if (status === "paid" || status === "unpaid") {
      return <ChipStatus status={status as ChipStatusKey} size="small" />;
    }
    return null;
  };

  // Format price: hiển thị số + "vnđ"
  const formatPrice = (amount: number) => {
    if (amount == null || isNaN(amount) || !isFinite(amount)) {
      return "0 vnđ";
    }
    return `${Number(amount).toLocaleString('vi-VN')} vnđ`;
  };

  // Format date: parse "2025-11-13 05:31:21" → "13/11/2025"
  const formatDate = (dateString: string) => {
    try {
      let date: Date;
      if (dateString.includes(' ') && !dateString.includes('T')) {
        date = new Date(dateString.replace(' ', 'T'));
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString;
    }
  };

  // Calculate pagination display text (size = 10)
  const paginationText = useMemo(() => {
    if (totalElements === 0) {
      return "Không có dữ liệu";
    }
    const start = (currentPage - 1) * 10 + 1;
    const end = Math.min(currentPage * 10, totalElements);
    return `Đang hiển thị ${start} - ${end} trong tổng ${totalElements} trang`;
  }, [currentPage, totalElements]);

  // Handle search on Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Reset page to 1 and update searchTerm to trigger fetch
      setCurrentPage(1);
      setSearchTerm(searchInput.trim());
    }
  };


  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader 
        title="Nhập hàng - Đang giao dịch"
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
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSearchKeyDown={handleSearchKeyDown}
          searchPlaceholder="Tìm kiếm theo mã phiếu, nhà cung cấp..."
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
                  onClick={() => setSelectedStatus("Tất cả trạng thái")}
                >
                  Tất cả trạng thái
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Đang giao dịch")}
                >
                  Đang giao dịch
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Đã hoàn thành")}
                >
                  Đã hoàn thành
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Chưa nhập")}
                >
                  Chưa nhập
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Đã nhập")}>
                  Đã nhập
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Chưa thanh toán")}
                >
                  Chưa thanh toán
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Đã thanh toán")}
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
            <div className="grid grid-cols-12 gap-2 px-4 py-3">
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
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Thao tác
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
                <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-4 items-center">
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
                  <div className="col-span-1 text-center">
                    <span
                      className="font-medium text-[12px] text-[#1a71f6] cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(
                          `/admin/warehouse/returns/create?importId=${importItem.id}`
                        )
                      }
                    >
                      Trả hàng
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
                    <span
                      className="font-medium text-[12px] text-[#1a71f6] cursor-pointer hover:underline bg-blue-50 px-3 py-1 rounded-lg"
                      onClick={() =>
                        navigate(
                          `/admin/warehouse/returns/create?importId=${importItem.id}`
                        )
                      }
                    >
                      Trả hàng
                    </span>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="py-[8px] w-full flex-shrink-0 flex justify-between items-center">
          <div className="text-[#272424] text-[12px]">
            {paginationText}
          </div>
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

export default AdminWarehouseImportsPending;

