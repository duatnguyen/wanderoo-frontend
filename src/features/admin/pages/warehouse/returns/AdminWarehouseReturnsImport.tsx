import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  TableFilters,
} from "@/components/common";
import { getReturnImportList, getImportInvoices } from "@/api/endpoints/warehouseApi";
import type { InvoiceResponse } from "@/types/warehouse";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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

const AdminWarehouseReturnsImport = () => {
  document.title = "Xuất hàng | Wanderoo";

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [returns, setReturns] = useState<ReturnImport[]>([]);
  const [returnStatus, setReturnStatus] = useState("Trạng thái hoàn hàng");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [importInvoices, setImportInvoices] = useState<InvoiceResponse[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Map InvoiceResponse to ReturnImport
  const mapInvoiceToReturnImport = useCallback((invoice: InvoiceResponse): ReturnImport => {
    return {
      id: String(invoice.id),
      returnCode: invoice.code,
      importCode: "", // Not available in InvoiceResponse
      createdDate: invoice.createdAt,
      paymentMethod: invoice.method === "CASH" ? "cash" : invoice.method === "BANKING" ? "transfer" : "cash",
      returnStatus: invoice.productStatus === "DONE" ? "returned" : "pending_return",
      refundStatus: invoice.paymentStatus === "DONE" ? "refunded" : "pending_refund",
      supplier: invoice.providerName,
      createdBy: invoice.picName,
      returnQuantity: invoice.totalQuantity,
      totalValue: invoice.totalPrice,
    };
  }, []);

  // Fetch return import list
  const fetchReturnImports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getReturnImportList(
        debouncedSearchTerm || undefined,
        undefined,
        currentPage - 1, // API uses 0-based page
        10
      );

      const mappedReturns = response.invoices.map(mapInvoiceToReturnImport);
      setReturns(mappedReturns);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error("Error fetching return imports:", err);
      setError("Không thể tải danh sách đơn xuất hàng. Vui lòng thử lại.");
      toast.error("Không thể tải danh sách đơn xuất hàng");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, mapInvoiceToReturnImport]);

  useEffect(() => {
    fetchReturnImports();
  }, [fetchReturnImports]);

  // Fetch import invoices for modal
  const fetchImportInvoices = useCallback(async () => {
    if (!isModalOpen) return;
    
    setModalLoading(true);
    try {
      const response = await getImportInvoices(
        modalSearchTerm || undefined,
        undefined,
        0,
        20
      );
      setImportInvoices(response.invoices);
    } catch (err) {
      console.error("Error fetching import invoices:", err);
      toast.error("Không thể tải danh sách đơn nhập hàng");
    } finally {
      setModalLoading(false);
    }
  }, [isModalOpen, modalSearchTerm]);

  useEffect(() => {
    fetchImportInvoices();
  }, [fetchImportInvoices]);

  const paginatedReturns = returns;

  const getPaymentMethodChip = (method: ReturnImport["paymentMethod"]) => {
    if (method === "cash" || method === "transfer") {
      return <ChipStatus status={method as ChipStatusKey} size="small" />;
    }
    return null;
  };

  const getReturnStatusChip = (status: ReturnImport["returnStatus"]) => {
    if (status === "returned") {
      return <ChipStatus status="completed" size="small" />;
    } else if (status === "pending_return") {
      return <ChipStatus status="processing" size="small" />;
    }
    return null;
  };

  const getRefundStatusChip = (status: ReturnImport["refundStatus"]) => {
    if (status === "refunded") {
      return <ChipStatus status="paid" size="small" />;
    } else if (status === "pending_refund") {
      return <ChipStatus status="unpaid" size="small" />;
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + "đ";
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
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Danh sách đơn xuất hàng"
        actions={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Tạo đơn xuất hàng
          </Button>
        }
      />

      {/* Main Content */}
      <ContentCard>
        {loading && returns.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchReturnImports}>Thử lại</Button>
          </div>
        ) : returns.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center w-full py-20">
            <div className="text-[#272424] text-[16px] font-medium text-center mb-6">
              Cửa hàng của bạn chưa có đơn xuất hàng nào
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#e04d30] hover:bg-[#c03d26] text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tạo đơn xuất hàng
            </Button>
          </div>
        ) : (
          <>
            {/* Filters Section */}
            <TableFilters
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Tìm kiếm theo mã đơn, nhà cung cấp..."
              actions={
                <SimpleDropdown
                  value={returnStatus}
                  options={[
                    "Trạng thái hoàn hàng",
                    "Tất cả trạng thái",
                    "Đã hoàn trả",
                    "Chưa hoàn trả",
                  ]}
                  onValueChange={setReturnStatus}
                  placeholder="Trạng thái hoàn hàng"
                  className="w-full sm:w-[200px]"
                />
              }
            />

            {/* Table Section */}
            <div className="rounded-[16px] w-full">
              <div className="border-[0.5px] border-[#d1d1d1] rounded-[16px] overflow-hidden w-full">
                {/* Fixed Table Header */}
                <div className="bg-[#f6f6f6] rounded-tl-[16px] rounded-tr-[16px] sticky top-0 z-10 border-b border-[#d1d1d1]">
                  {/* Desktop Header */}
                  <div className="hidden lg:grid grid-cols-[100px_120px_120px_120px_120px_150px_120px_80px_80px] gap-2 px-4 py-3 items-center min-w-[1100px]">
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Mã đơn xuất
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Ngày tạo
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        PT Thanh toán
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        TT Hoàn hàng
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        TT Hoàn tiền
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Nhà cung cấp
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Người tạo
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        SL xuất
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Giá trị
                      </span>
                    </div>
                  </div>

                  {/* Mobile Header */}
                  <div className="lg:hidden px-4 py-3">
                    <div className="text-[#272424] text-[16px] font-[600] font-montserrat">
                      Danh sách đơn trả hàng ({totalElements})
                    </div>
                  </div>
                </div>

                {/* Scrollable Table Body */}
                <div className="max-h-[600px] overflow-y-auto overflow-x-auto">
                  {paginatedReturns.map((returnItem, index) => (
                    <div
                      key={returnItem.id}
                      className={`border-b border-[#e7e7e7] hover:bg-gray-50 cursor-pointer ${index === paginatedReturns.length - 1 ? "border-b-0 rounded-bl-[16px] rounded-br-[16px]" : ""}`}
                      onClick={() =>
                        navigate(`/admin/warehouse/returns/${returnItem.id}`)
                      }
                    >
                      {/* Desktop Layout */}
                      <div className="hidden lg:grid grid-cols-[100px_120px_120px_120px_120px_150px_120px_80px_80px] gap-2 px-4 py-4 items-center min-w-[1100px]">
                        <div className="text-center">
                          <span className="font-semibold text-[12px] text-[#1a71f6] cursor-pointer hover:underline">
                            {returnItem.returnCode}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-[#272424] text-[12px]">
                            {formatDate(returnItem.createdDate)}
                          </span>
                        </div>
                        <div className="flex justify-center">
                          {getPaymentMethodChip(returnItem.paymentMethod)}
                        </div>
                        <div className="flex justify-center">
                          {getReturnStatusChip(returnItem.returnStatus)}
                        </div>
                        <div className="flex justify-center">
                          {getRefundStatusChip(returnItem.refundStatus)}
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-[#272424] text-[12px] truncate block" title={returnItem.supplier}>
                            {returnItem.supplier}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-[#272424] text-[12px] truncate block" title={returnItem.createdBy}>
                            {returnItem.createdBy}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-[#272424] text-[12px]">
                            {returnItem.returnQuantity}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-[#272424] text-[12px]" title={formatCurrency(returnItem.totalValue)}>
                            {(returnItem.totalValue / 1000000).toFixed(0)}M
                          </span>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="lg:hidden px-4 py-3 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-[14px] text-[#1a71f6] cursor-pointer hover:underline">
                              {returnItem.returnCode}
                            </span>
                            <div className="text-[12px] text-gray-500 mt-1">
                              {formatDate(returnItem.createdDate)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {getReturnStatusChip(returnItem.returnStatus)}
                            {getRefundStatusChip(returnItem.refundStatus)}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[12px]">
                            <span className="text-gray-600">Nhà cung cấp:</span>
                            <span className="font-medium text-right max-w-[60%] truncate" title={returnItem.supplier}>
                              {returnItem.supplier}
                            </span>
                          </div>
                          <div className="flex justify-between text-[12px]">
                            <span className="text-gray-600">Người tạo:</span>
                            <span className="font-medium">{returnItem.createdBy}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-600">SL / Giá trị:</span>
                            <span className="font-medium">
                              {returnItem.returnQuantity} / {(returnItem.totalValue / 1000000).toFixed(0)}M
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex gap-2">
                            {getPaymentMethodChip(returnItem.paymentMethod)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              current={currentPage}
              total={totalPages}
              onChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </>
        )}

        {/* Create Return Import Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white w-[1155px] max-w-[95vw] max-h-[90vh] flex flex-col rounded-[24px] shadow-2xl animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#D1D1D1]">
                <h2 className="text-[24px] font-bold text-[#272424] font-montserrat">
                  Tạo đơn xuất hàng
                </h2>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Search Bar */}
                <div className="mb-4">
                  <SearchBar
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm"
                    className="w-full"
                  />
                </div>

                {/* Table */}
                <div className="border border-[#D1D1D1] rounded-[16px] overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-[#f6f6f6] flex items-center px-6 py-3 border-b border-[#D1D1D1]">
                    <div className="flex flex-row items-center w-full text-[13px] font-semibold text-[#272424] gap-4">
                      <div className="w-[180px] text-center">Mã đơn nhập</div>
                      <div className="w-[180px] text-center">Ngày tạo</div>
                      <div className="w-[180px] text-center">Nhân viên</div>
                      <div className="w-[200px] text-center">Nhà cung cấp</div>
                      <div className="w-[220px] text-center">Giá trị đơn nhập hàng</div>
                      <div className="w-[120px] text-center">Thao tác</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  {modalLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <LoadingSpinner size="md" />
                    </div>
                  ) : importInvoices.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-500">
                      Không có đơn nhập hàng nào
                    </div>
                  ) : (
                    importInvoices.map((item) => (
                    <div
                      key={item.id}
                        className="flex items-center px-6 py-3 border-b border-[#e7e7e7] hover:bg-gray-50 text-[13px] text-[#272424] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                          navigate(`/admin/warehouse/returns/create?importId=${item.id}`);
                      }}
                    >
                        <div className="flex flex-row items-center w-full gap-4">
                          <div className="w-[180px] text-center font-semibold text-[#1a71f6]">
                            {item.code}
                        </div>
                          <div className="w-[180px] text-center">
                            {new Date(item.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                          <div className="w-[180px] text-center">{item.picName}</div>
                          <div className="w-[200px] text-center">{item.providerName}</div>
                          <div className="w-[220px] text-center">
                            {formatCurrency(item.totalPrice)}
                        </div>
                          <div className="w-[120px] text-center">
                          <span className="text-[#1a71f6] hover:underline cursor-pointer">
                            Xuất hàng
                          </span>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </ContentCard>
    </PageContainer>
  );
};

export default AdminWarehouseReturnsImport;
