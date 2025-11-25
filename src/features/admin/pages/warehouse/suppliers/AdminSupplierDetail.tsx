import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import { Pagination } from "@/components/ui/pagination";
import EditSupplierModal from "@/components/admin/EditSupplierModal";
import {
  getProviderDetail,
  getProviderStats,
} from "@/api/endpoints/warehouseApi";
import type {
  ProviderDetailResponse,
  ProviderInvoiceHistoryItem,
  ProviderStatResponse,
} from "@/types";

const HISTORY_PAGE_SIZE = 10;

const formatDateTime = (value?: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const buildFallbackCode = (id?: number) =>
  id ? `NCC${String(id).padStart(4, "0")}` : "--";

const buildAddress = (detail?: ProviderDetailResponse) => {
  if (detail?.fullAddress) return detail.fullAddress;
  const segments = [
    detail?.street,
    detail?.wardName,
    detail?.districtName,
    detail?.provinceName,
  ]
    .filter((segment) => segment && segment.trim().length > 0)
    .join(", ");

  return segments || "Đang cập nhật";
};

const mapProductStatus = (
  item: ProviderInvoiceHistoryItem
): { status: "imported" | "not_imported" | "exported" | "not_exported"; label: string } => {
  const isImport = item.type === "IMPORT";
  if (isImport) {
    return item.productStatus === "DONE"
      ? { status: "imported", label: "Đã nhập kho" }
      : { status: "not_imported", label: "Chưa nhập" };
  }

  return item.productStatus === "DONE"
    ? { status: "exported", label: "Đã hoàn trả" }
    : { status: "not_exported", label: "Chưa hoàn trả" };
};

const mapPaymentStatus = (
  status: "PENDING" | "DONE"
): { status: "paid" | "unpaid"; label: string } =>
  status === "DONE"
    ? { status: "paid", label: "Đã thanh toán" }
    : { status: "unpaid", label: "Chưa thanh toán" };

const AdminSupplierDetail = () => {
  document.title = "Chi tiết nhà cung cấp | Wanderoo";
  const navigate = useNavigate();
  const { supplierId } = useParams<{ supplierId: string }>();
  const providerId = supplierId ? Number(supplierId) : undefined;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  const {
    data: providerDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery({
    queryKey: ["provider-detail", providerId],
    queryFn: () => getProviderDetail(providerId!),
    enabled: Boolean(providerId),
  });

  const {
    data: providerStats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery<ProviderStatResponse>({
    queryKey: ["provider-stats", providerId, currentPage, startDate, endDate],
    queryFn: () =>
      getProviderStats(
        providerId!,
        startDate || undefined,
        endDate || undefined,
        undefined,
        currentPage,
        HISTORY_PAGE_SIZE
      ),
    enabled: Boolean(providerId),
    placeholderData: keepPreviousData,
  });

  const supplierCode = useMemo(
    () => buildFallbackCode(providerDetail?.id),
    [providerDetail?.id]
  );

  const supplierName = providerDetail?.name ?? "Nhà cung cấp";
  const supplierPhone = providerDetail?.phone ?? "Đang cập nhật";
  const supplierEmail = providerDetail?.email ?? "Đang cập nhật";
  const supplierAddress = buildAddress(providerDetail);
  const supplierNote =
    providerDetail?.note && providerDetail.note.trim().length > 0
      ? providerDetail.note
      : "Chưa có ghi chú";

  const invoiceHistory = providerStats?.invoiceHistory ?? [];
  const summaryCards = [
    {
      label: "Đơn nhập\nđã tạo",
      value: providerStats?.invoiceImportCreated ?? 0,
    },
    {
      label: "Đơn nhập\nchưa thanh toán",
      value: providerStats?.invoiceImportUnpaid ?? 0,
    },
    {
      label: "Đơn trả\nđã tạo",
      value: providerStats?.invoiceExportCreated ?? 0,
    },
    {
      label: "Đơn trả\nchưa hoàn tiền",
      value: providerStats?.invoiceExportUnrefund ?? 0,
    },
  ];

  const handleBack = () => {
    navigate("/admin/warehouse/supplier");
  };

  const handleEdit = () => {
    if (!isDetailLoading && !isDetailError) {
      setIsEditModalOpen(true);
    }
  };

  const handleSaveSupplier = (updatedData: {
    supplierName: string;
    phone: string;
    email: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  }) => {
    // TODO: Implement API call to update supplier
    console.log("Updating supplier:", updatedData);
  };

  return (
    <div className="w-full overflow-x-auto min-h-screen">
      <div className="flex flex-col gap-[8px] items-start w-full">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between gap-[8px] pt-[10px] pb-0 w-full">
          <div className="flex items-center gap-[8px]">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-[32px] h-[32px] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-[20px] h-[20px] text-[#272424]" />
            </button>
            <h1 className="font-bold text-[#272424] text-[20px] leading-[1.4]">
              {isDetailLoading ? "Đang tải..." : supplierName}
            </h1>
          </div>
          <div className="flex gap-[12px] items-center">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="text-[14px]"
            >
              Huỷ
            </Button>
            <Button
              variant="default"
              onClick={() => console.log("Save clicked")}
              className="text-[14px]"
            >
              Lưu
            </Button>
          </div>
        </div>

        {/* Main Content Section - 2 columns */}
        <div className="flex gap-[15px] items-start w-full">
          {/* Left Column - 2 large cards */}
          <div className="flex flex-col gap-[8px] items-start flex-1">
            {/* Card 1 - Supplier Code and Statistics */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] w-full">
              {/* Header with Supplier Code and Date Filters */}
              <div className="border-b border-[#d1d1d1] flex items-center justify-between p-[16px]">
                <div className="flex items-center">
                  <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Mã NCC: {supplierCode}
                  </p>
                </div>
                <div className="flex gap-[16px] items-center">
                  {/* Date Range Input 1 */}
                  <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-[16px] py-[10px] flex items-center w-[160px]">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold w-full ${startDate ? "text-[#272424]" : "text-[#737373]"}`}
                      placeholder="/"
                    />
                  </div>

                  {/* Arrow */}
                  <div className="text-[#737373]">−</div>

                  {/* Date Range Input 2 */}
                  <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-[16px] py-[10px] flex items-center w-[160px]">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold w-full ${endDate ? "text-[#272424]" : "text-[#737373]"}`}
                      placeholder="/"
                    />
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="flex items-center justify-between px-[16px] py-[16px]">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className="flex flex-col gap-[8px] items-center text-center"
                  >
                    <p className="font-semibold text-[#272424] text-[14px] whitespace-pre-line leading-[1.4]">
                      {card.label}
                    </p>
                    <p className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                      {isStatsLoading ? "..." : `${card.value} đơn`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 - Order History Table */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] w-full">
              <div className="border-b border-[#d1d1d1] p-[16px]">
                <p className="font-semibold text-[#323130] text-[14px] leading-[1.4]">
                  Lịch sử nhập/Trả hàng
                </p>
              </div>

              {/* Table Body */}
              <div className="px-0 py-[8px]">
                {invoiceHistory.length === 0 && !isStatsLoading && (
                  <div className="px-[16px] py-[24px] text-center text-[#737373]">
                    Chưa có lịch sử giao dịch
                  </div>
                )}
                {invoiceHistory.map((order, index) => {
                  const productStatus = mapProductStatus(order);
                  const paymentStatus = mapPaymentStatus(order.paymentStatus);
                  return (
                    <div
                      key={`${order.code}-${index}`}
                      className={`border-b border-[#d1d1d1] px-[16px] py-[8px] ${
                        index === invoiceHistory.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex flex-col gap-[4px]">
                          <div className="flex items-center">
                            <p className="text-[14px] text-[#737373] leading-[1.5]">
                              <span>
                                {order.type === "IMPORT" ? "Đơn nhập" : "Đơn trả"}{" "}
                              </span>
                              <span className="font-semibold text-[#1a71f6] cursor-pointer hover:underline">
                                {order.code}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-[14px] text-[#737373] leading-[1.5]">
                              {formatDateTime(order.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-[15px] items-center justify-end w-[323px]">
                          <ChipStatus
                            status={productStatus.status}
                            labelOverride={productStatus.label}
                            className="font-bold text-[14px] leading-normal"
                          />
                          <ChipStatus
                            status={paymentStatus.status}
                            labelOverride={paymentStatus.label}
                            className="font-bold text-[14px] leading-normal"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isStatsLoading && (
                  <div className="px-[16px] py-[24px] text-center text-[#737373]">
                    Đang tải lịch sử...
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="px-[16px] py-[8px]">
                <Pagination
                  current={currentPage}
                  total={providerStats?.totalPages ?? 1}
                  onChange={setCurrentPage}
                />
              </div>
            </div>
          </div>

          {/* Right Column - 2 small cards */}
          <div className="flex flex-col gap-[8px] items-start w-[400px]">
            {/* Card 1 - Contact Information */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[16px] flex flex-col gap-[15px] w-full">
              {/* Contact Header */}
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#322f30] text-[14px] leading-[1.4]">
                  Liên hệ
                </p>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-[6px] px-[6px] hover:opacity-80 transition-opacity"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 14L10 6M10 6H4M10 6V12"
                      stroke="#1a71f6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4]">
                    Chỉnh sửa
                  </span>
                </button>
              </div>

              {/* Contact Details */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="font-medium text-[#322f30] text-[14px] leading-[1.4]">
                    Tên nhà cung cấp
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-[#1a1a1b] text-[14px] leading-[1.4]">
                    {isDetailLoading ? "..." : supplierName}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="font-medium text-[#322f30] text-[14px] leading-[1.4]">
                    Số điện thoại
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-[#1a1a1b] text-[14px] leading-[1.4]">
                    {isDetailLoading ? "..." : supplierPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-[8px]">
                <div className="flex-shrink-0">
                  <p className="font-medium text-[#322f30] text-[14px] leading-[1.4]">
                    Địa chỉ
                  </p>
                </div>
                <div className="flex-1 text-right break-words whitespace-normal">
                  <p className="font-semibold text-[#1a1a1b] text-[14px] leading-[1.4]">
                    {isDetailLoading ? "..." : supplierAddress.replace(/Hà Nội/g, "Hà\u00A0Nội")}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Notes Section */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[16px] flex flex-col gap-[6px] w-full">
              <div className="flex flex-col gap-[4px] items-start">
                <p className="font-semibold text-[#323130] text-[14px] leading-[1.4]">
                  Ghi chú
                </p>
              </div>
              <div className="border border-[#d1d1d1] rounded-[12px] p-[16px] h-[120px]">
                <p className="font-normal text-[14px] text-[#737373] leading-[1.5]">
                  {isDetailLoading ? "Đang tải..." : supplierNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Supplier Modal */}
        <EditSupplierModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          supplierData={{
            id: supplierCode,
            name: supplierName,
            phone: supplierPhone,
            email: supplierEmail,
            address: supplierAddress,
            note: supplierNote,
          }}
          onSave={handleSaveSupplier}
        />
      </div>
      <div className="h-[calc(100vh-100px)]"></div>
    </div>
  );
};

export default AdminSupplierDetail;
