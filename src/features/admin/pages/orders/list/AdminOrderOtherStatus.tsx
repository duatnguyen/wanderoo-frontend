
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  TableFilters,
  TabMenu,
  TabMenuWithBadge,
  type TabItem,
  type TabItemWithBadge,
} from "@/components/common";
import { Pagination } from "@/components/ui/pagination";

type ReturnOrderCategory = "RETURN" | "CANCEL" | "FAILED";
type ReturnOrderStatus = "UNDER_REVIEW" | "RETURNING" | "COMPLETED" | "INVALID";
type RefundStatus = "WAITING" | "PARTIAL" | "DONE";

const defaultReturnShippingChipClass =
  "inline-flex items-center rounded-full px-3 py-1 font-semibold text-[12px] shadow-[0_2px_6px_rgba(107,114,128,0.15)]";

const getReturnShippingChipProps = (status?: string) => {
  switch (status) {
    case "Chờ lấy hàng":
      return {
        label: "Chờ lấy hàng",
        className: `${defaultReturnShippingChipClass} bg-[#ebebeb] text-[#6f6f6f]`,
      };
    case "Đang giao":
      return {
        label: "Đang giao",
        className: `${defaultReturnShippingChipClass} bg-[#e3edff] text-[#1a71f6] border border-[#c4d8ff]`,
      };
    case "Đã hoàn thành":
      return {
        label: "Đã hoàn thành",
        className: `${defaultReturnShippingChipClass} bg-[#b7f5b0] text-[#0d8f1a] shadow-[0_2px_6px_rgba(16,185,129,0.25)]`,
      };
    case "Giao hàng không thành công":
      return {
        label: "Giao hàng\nkhông thành công",
        className: `${defaultReturnShippingChipClass} bg-red-50 text-red-600 border-red-200`,
      };
    default:
      return {
        label: status || "Đã hoàn thành",
        className: `${defaultReturnShippingChipClass} bg-[#ebebeb] text-[#6f6f6f]`,
      };
  }
};

interface ReturnOrder {
  id: string;
  orderCode: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerUsername: string;
  productName: string;
  productVariant?: string;
  productImage?: string;
  totalAmount: number;
  paymentMethod: string;
  reason: string;
  buyerOptions: string[];
  statusLabel: string;
  statusKey: ReturnOrderStatus;
  resolutionNote: string;
  forwardShippingStatus: string;
  returnShippingStatus: string;
  refundStatus: RefundStatus;
  refundStatusLabel: string;
  source: "Website" | "POS";
  category: ReturnOrderCategory;
  sourceNote?: string;
}

const mockReturnOrders: ReturnOrder[] = [
  {
    id: "RET-202411-001",
    orderCode: "WEB-0001",
    createdAt: "25/11/2025 13:01",
    customerId: "KH-002845",
    customerName: "Nguyễn Thảo",
    customerUsername: "nguyenthao",
    productName: "Áo khoác trekking nữ Wander Shield",
    productVariant: "Màu xanh ngọc · Size M",
    totalAmount: 1890000,
    paymentMethod: "Tiền mặt",
    reason: "Lý do trả hàng: Màu sắc thực tế không đúng như mô tả",
    buyerOptions: [
      "Trả hàng & hoàn tiền",
      "Hoàn tiền ngay khi xác nhận",
    ],
    statusLabel: "Đang chờ xét duyệt",
    statusKey: "UNDER_REVIEW",
    resolutionNote: "Đã hoàn tiền tạm giữ cho người mua",
    forwardShippingStatus: "Đã hoàn thành",
    returnShippingStatus: "Chờ lấy hàng",
    refundStatus: "WAITING",
    refundStatusLabel: "Chưa hoàn tiền",
    source: "Website",
    category: "RETURN",
    sourceNote: "Tạo từ Website · Ưu tiên đồng bộ kho",
  },
  {
    id: "RET-202411-002",
    orderCode: "POS-1205",
    createdAt: "24/11/2025 18:30",
    customerId: "KH-001523",
    customerName: "Trần Đăng",
    customerUsername: "trandangk",
    productName: "Giày leo núi Nam Summit Pro",
    productVariant: "Màu đen · Size 41",
    totalAmount: 2350000,
    paymentMethod: "Tiền mặt",
    reason: "Lý do trả hàng: Bị rộng, khách muốn đổi size khác",
    buyerOptions: [
      "Trả hàng & hoàn tiền",
    ],
    statusLabel: "Đang trả hàng",
    statusKey: "RETURNING",
    resolutionNote: "Có 1 phương án do người mua chọn: Trả hàng & hoàn tiền",
    forwardShippingStatus: "Với ở POS sẽ luôn đã hoàn thành",
    returnShippingStatus: "Đang giao",
    refundStatus: "PARTIAL",
    refundStatusLabel: "Đã hoàn tiền 1 phần",
    source: "POS",
    category: "RETURN",
    sourceNote: "Tạo từ POS · Giao cùng ngày",
  },
  {
    id: "RET-202411-003",
    orderCode: "WEB-0042",
    createdAt: "22/11/2025 09:12",
    customerId: "KH-007814",
    customerName: "Phạm Mỹ Linh",
    customerUsername: "linhpham",
    productName: "Balo phượt 40L TrailMate",
    productVariant: "Màu đỏ cam",
    totalAmount: 1250000,
    paymentMethod: "Chuyển khoản",
    reason: "Yêu cầu huỷ đơn: Đặt nhầm sản phẩm",
    buyerOptions: [
      "Hoàn tiền ngay",
    ],
    statusLabel: "Đã hoàn tiền cho người mua",
    statusKey: "COMPLETED",
    resolutionNote: "Đơn huỷ, không phát sinh trả hàng",
    forwardShippingStatus: "Chưa giao · Đã khóa trên hệ thống",
    returnShippingStatus: "Đã hoàn thành",
    refundStatus: "DONE",
    refundStatusLabel: "Đã hoàn tiền đủ",
    source: "Website",
    category: "RETURN",
    sourceNote: "Đã gửi thông báo qua email",
  },
  {
    id: "RET-202411-004",
    orderCode: "WEB-0099",
    createdAt: "20/11/2025 16:48",
    customerId: "KH-004403",
    customerName: "Vũ Minh Quân",
    customerUsername: "minhquanvu",
    productName: "Bộ quần áo chạy bộ Windflow",
    productVariant: "Size L · Combo 2 sản phẩm",
    totalAmount: 980000,
    paymentMethod: "Chuyển khoản",
    reason: "Yêu cầu bị huỷ: Không cung cấp đủ hình ảnh lỗi sản phẩm",
    buyerOptions: [
      "Trả hàng & hoàn tiền",
      "Hoàn tiền ngay",
    ],
    statusLabel: "Yêu cầu không hợp lệ",
    statusKey: "INVALID",
    resolutionNote: "Đang chờ khách bổ sung thông tin trong 24h",
    forwardShippingStatus: "Đang giao lần 2 · Chờ xác nhận khách nhận",
    returnShippingStatus: "Giao hàng không thành công",
    refundStatus: "WAITING",
    refundStatusLabel: "Chưa hoàn tiền",
    source: "Website",
    category: "RETURN",
    sourceNote: "Tạo từ Website · Chưa có vận đơn chiều về",
  },
  {
    id: "RET-202411-005",
    orderCode: "WEB-0156",
    createdAt: "21/11/2025 14:25",
    customerId: "KH-005892",
    customerName: "Lê Văn An",
    customerUsername: "levanan",
    productName: "Túi ngủ du lịch Compact",
    productVariant: "Màu xám · Size M",
    totalAmount: 850000,
    paymentMethod: "Chuyển khoản",
    reason: "Yêu cầu huỷ đơn: Thay đổi ý định mua hàng",
    buyerOptions: [
      "Hoàn tiền ngay",
    ],
    statusLabel: "Đã hoàn tiền cho người mua",
    statusKey: "COMPLETED",
    resolutionNote: "Đơn huỷ, không phát sinh trả hàng",
    forwardShippingStatus: "Chưa giao · Đã khóa trên hệ thống",
    returnShippingStatus: "Không áp dụng",
    refundStatus: "DONE",
    refundStatusLabel: "Đã hoàn tiền đủ",
    source: "Website",
    category: "CANCEL",
    sourceNote: "Đã gửi thông báo qua email",
  },
  {
    id: "RET-202411-005B",
    orderCode: "WEB-0160",
    createdAt: "21/11/2025 15:05",
    customerId: "KH-005999",
    customerName: "Phạm Tuấn Khang",
    customerUsername: "tuankhang",
    productName: "Áo khoác giữ nhiệt Alpine",
    productVariant: "Màu xám · Size L",
    totalAmount: 1500000,
    paymentMethod: "Tiền mặt",
    reason: "Yêu cầu huỷ đơn: Thay đổi kế hoạch du lịch",
    buyerOptions: ["Hoàn tiền ngay"],
    statusLabel: "Đã hoàn tiền cho người mua",
    statusKey: "COMPLETED",
    resolutionNote: "Đơn huỷ, không phát sinh trả hàng",
    forwardShippingStatus: "Chưa giao · Đã khóa trên hệ thống",
    returnShippingStatus: "Không áp dụng",
    refundStatus: "DONE",
    refundStatusLabel: "Đã hoàn tiền đủ",
    source: "Website",
    category: "CANCEL",
    sourceNote: "Đã hoàn tiền tiền mặt tại cửa hàng",
  },
  {
    id: "RET-202411-006",
    orderCode: "WEB-0201",
    createdAt: "23/11/2025 11:42",
    customerId: "KH-009532",
    customerName: "Đặng Minh Tâm",
    customerUsername: "dangtam",
    productName: "Áo khoác chống nước StormRider",
    productVariant: "Màu đen · Size L",
    totalAmount: 1750000,
    paymentMethod: "Chuyển khoản",
    reason: "Đơn giao thất bại: Khách không nhận hàng",
    buyerOptions: ["Trả hàng & hoàn tiền"],
    statusLabel: "Đang trả hàng cho người bán",
    statusKey: "RETURNING",
    resolutionNote: "Đơn đang chờ bưu tá hoàn trả lại kho",
    forwardShippingStatus: "Đang giao lần 2 · Chờ xác nhận khách nhận",
    returnShippingStatus: "Đang trả hàng cho người bán · Chờ bưu tá lấy",
    refundStatus: "WAITING",
    refundStatusLabel: "Chưa hoàn tiền",
    source: "Website",
    category: "FAILED",
    sourceNote: "Giao bởi Wanderoo Express · Đang hoàn hàng",
  },
  {
    id: "RET-202411-007",
    orderCode: "POS-2210",
    createdAt: "21/11/2025 17:05",
    customerId: "KH-004278",
    customerName: "Phan Quỳnh Anh",
    customerUsername: "quynhanh",
    productName: "Giày trail UltraRun Pro",
    productVariant: "Màu xanh navy · Size 38",
    totalAmount: 2150000,
    paymentMethod: "Tiền mặt",
    reason: "Đơn giao thất bại: Người nhận vắng nhà",
    buyerOptions: ["Trả hàng & hoàn tiền"],
    statusLabel: "Đang trả hàng cho người bán",
    statusKey: "RETURNING",
    resolutionNote: "Đang liên hệ khách để đặt lại lịch nhận hàng hoàn",
    forwardShippingStatus: "Đã hoàn thành",
    returnShippingStatus: "Giao hàng không thành công · Đang lên lịch giao lại",
    refundStatus: "WAITING",
    refundStatusLabel: "Chưa hoàn tiền",
    source: "POS",
    category: "FAILED",
    sourceNote: "Tạo từ POS · Đang xử lý hoàn kho",
  },
  {
    id: "RET-202411-008",
    orderCode: "WEB-0320",
    createdAt: "19/11/2025 10:18",
    customerId: "KH-003410",
    customerName: "Trịnh Hữu Long",
    customerUsername: "huulong",
    productName: "Bộ nồi camping 6 món TrekCook",
    productVariant: "Phiên bản tiêu chuẩn",
    totalAmount: 950000,
    paymentMethod: "Chuyển khoản",
    reason: "Đơn giao thất bại: Người nhận yêu cầu trả lại",
    buyerOptions: ["Trả hàng & hoàn tiền"],
    statusLabel: "Đã trả hàng cho người bán",
    statusKey: "COMPLETED",
    resolutionNote: "Kho đã nhận hàng hoàn ngày 24/11",
    forwardShippingStatus: "Đã hoàn thành",
    returnShippingStatus: "Đã trả hàng cho người bán · Đang hoàn tiền",
    refundStatus: "PARTIAL",
    refundStatusLabel: "Đã hoàn tiền 1 phần",
    source: "Website",
    category: "FAILED",
    sourceNote: "Wanderoo Express · Đã chốt biên bản hoàn hàng",
  },
];

const primaryTabs: TabItemWithBadge[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "RETURN", label: "Đơn Trả hàng Hoàn tiền" },
  { id: "CANCEL", label: "Đơn Hủy" },
  { id: "FAILED", label: "Đơn Giao hàng không thành công" },
];

const statusTabs: TabItem[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "UNDER_REVIEW", label: "Đang chờ xét duyệt" },
  { id: "RETURNING", label: "Đang trả hàng" },
  { id: "COMPLETED", label: "Đã hoàn tiền cho người mua" },
  { id: "INVALID", label: "Yêu cầu bị huỷ/không hợp lệ" },
];

const cancelSubTabs: TabItem[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "PROCESSING", label: "Đang xử lý" },
  { id: "PROCESSED", label: "Đã xử lý" },
];

const failedSubTabs: TabItem[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "RETURNING_TO_SELLER", label: "Đang trả hàng cho người bán" },
  { id: "RETURNED_TO_SELLER", label: "Đã trả hàng cho người bán" },
  { id: "FAILED_RETURN", label: "Trả hàng không thành công" },
];

const statusBadgeClasses: Record<ReturnOrderStatus, string> = {
  UNDER_REVIEW: "bg-yellow-50 text-yellow-800 border-yellow-200",
  RETURNING: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED:
    "bg-[#b7f5b0] text-[#0d8f1a] border border-transparent shadow-[0_2px_6px_rgba(16,185,129,0.25)]",
  INVALID: "bg-red-50 text-red-600 border-red-200",
};

const PAGE_SIZE = 5;
const summaryColumnTemplate =
  "2.3fr 0.8fr 1.1fr 1.3fr 1.1fr 0.9fr 0.9fr 0.9fr 0.9fr";
const summaryHeaders = [
  { key: "order", label: "Đơn hàng" },
  { key: "source", label: "Nguồn" },
  { key: "reasonSummary", label: "Lý do" },
  { key: "buyerOptions", label: "Phương án cho người mua" },
  { key: "returnStatus", label: "Trạng thái" },
  { key: "forwardShipping", label: "Vận chuyển chiều giao hàng" },
  { key: "returnShipping", label: "Vận chuyển hàng hoàn" },
  { key: "total", label: "Tổng tiền" },
  { key: "action", label: "Thao tác" },
];

const StatusBadge = ({
  label,
  status,
}: {
  label: string;
  status: ReturnOrderStatus;
}) => {
  let formattedLabel = label;

  if (label.includes("cho người mua")) {
    formattedLabel = formattedLabel.replace(" cho người mua", "\ncho người mua");
  }

  if (label.includes("không hợp lệ")) {
    formattedLabel = formattedLabel.replace("không hợp lệ", "\nkhông hợp lệ");
  }

  return (
    <span
      className={`inline-flex flex-col items-center justify-center px-3 py-1 rounded-full border text-[12px] font-semibold text-center leading-tight whitespace-pre-line ${statusBadgeClasses[status]}`}
    >
      {formattedLabel}
    </span>
  );
};

const paymentBadgeStyles: Record<string, { label: string; className: string }> = {
  "Tiền mặt": {
    label: "Tiền mặt",
    className: "bg-[#e7ddff] text-[#5b35c5]",
  },
  "Chuyển khoản": {
    label: "Chuyển khoản",
    className: "bg-[#fff0c7] text-[#c7780a]",
  },
};

const getPaymentBadge = (method: string) => {
  return (
    paymentBadgeStyles[method] || {
      label: method,
      className: "bg-[#f2f2f2] text-[#555555]",
    }
  );
};

const stripReasonPrefix = (reason: string) => {
  return reason.replace(
    /^(Lý do trả hàng:|Đơn giao thất bại:|Yêu cầu huỷ đơn:|Yêu cầu bị huỷ:)\s*/i,
    ""
  );
};

const AdminOrderOtherStatus = () => {
  document.title = "Trả hàng/Hoàn tiền/Huỷ | Wanderoo";

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activePrimaryTab, setActivePrimaryTab] = useState("ALL");
  const [activeStatusTab, setActiveStatusTab] = useState("ALL");
  const [activeCancelSubTab, setActiveCancelSubTab] = useState("ALL");
  const [activeFailedSubTab, setActiveFailedSubTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const tabCounts = useMemo(() => {
    return mockReturnOrders.reduce(
      (acc, order) => {
        acc.ALL += 1;
        acc[order.category] += 1;
        return acc;
      },
      {
        ALL: 0,
        RETURN: 0,
        CANCEL: 0,
        FAILED: 0,
      } as Record<"ALL" | ReturnOrderCategory, number>
    );
  }, []);

  const decoratedPrimaryTabs = useMemo(
    () =>
      primaryTabs.map((tab) => ({
        ...tab,
        count: tabCounts[tab.id as keyof typeof tabCounts],
      })),
    [tabCounts]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activePrimaryTab,
    activeStatusTab,
    activeCancelSubTab,
    activeFailedSubTab,
    searchTerm,
  ]);

  useEffect(() => {
    if (activePrimaryTab !== "CANCEL") {
      setActiveCancelSubTab("ALL");
    }
    if (activePrimaryTab !== "FAILED") {
      setActiveFailedSubTab("ALL");
    }
  }, [activePrimaryTab]);

  const filteredOrders = useMemo(() => {
    return mockReturnOrders.filter((order) => {
      const matchPrimary =
        activePrimaryTab === "ALL" || order.category === activePrimaryTab;
      
      let matchStatus = true;
      if (activePrimaryTab === "CANCEL") {
        const isCashCancel = order.paymentMethod === "Tiền mặt";
        // Xử lý tab con cho "Đơn Hủy"
        if (activeCancelSubTab === "PROCESSING") {
          matchStatus = !isCashCancel && order.statusKey !== "COMPLETED";
        } else if (activeCancelSubTab === "PROCESSED") {
          matchStatus = isCashCancel || order.statusKey === "COMPLETED";
        } else {
          matchStatus = true; // "ALL"
        }
      } else if (activePrimaryTab === "FAILED") {
        // Xử lý tab con cho "Đơn Giao hàng không thành công"
        if (activeFailedSubTab === "RETURNING_TO_SELLER") {
          matchStatus = order.returnShippingStatus.includes(
            "Đang trả hàng cho người bán"
          );
        } else if (activeFailedSubTab === "RETURNED_TO_SELLER") {
          matchStatus = order.returnShippingStatus.includes(
            "Đã trả hàng cho người bán"
          );
        } else if (activeFailedSubTab === "FAILED_RETURN") {
          matchStatus = order.returnShippingStatus.includes(
            "Trả hàng không thành công"
          );
        } else {
          matchStatus = true; // "ALL"
        }
      } else {
        matchStatus =
          activeStatusTab === "ALL" || order.statusKey === activeStatusTab;
      }
      
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchSearch =
        normalizedSearch.length === 0 ||
        order.orderCode.toLowerCase().includes(normalizedSearch) ||
        order.customerId.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.productName.toLowerCase().includes(normalizedSearch);

      return matchPrimary && matchStatus && matchSearch;
    });
  }, [
    activePrimaryTab,
    activeStatusTab,
    activeCancelSubTab,
    activeFailedSubTab,
    searchTerm,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleViewDetail = (order: ReturnOrder) => {
    navigate(`/admin/orders/${order.orderCode}`, {
      state: { status: order.statusLabel, source: order.source },
    });
  };

  return (
    <PageContainer className="flex flex-col gap-3 w-full max-w-full">
      <div className="flex flex-col gap-0 w-full">
        <PageHeader title="Trả hàng/Hoàn tiền/Huỷ" />

        <TabMenuWithBadge
          tabs={decoratedPrimaryTabs}
          activeTab={activePrimaryTab}
          onTabChange={setActivePrimaryTab}
          className="min-w-[700px]"
        />

        <ContentCard>
          <div className="flex flex-col gap-4 w-full">
            <TableFilters
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Tìm mã đơn, ID khách hoặc tên sản phẩm..."
              searchClassName="w-full md:max-w-[360px]"
            />

            {activePrimaryTab === "CANCEL" ? (
              <TabMenu
                tabs={cancelSubTabs}
                activeTab={activeCancelSubTab}
                onTabChange={setActiveCancelSubTab}
                variant="underline"
                className="overflow-x-auto"
              />
            ) : activePrimaryTab === "FAILED" ? (
              <TabMenu
                tabs={failedSubTabs}
                activeTab={activeFailedSubTab}
                onTabChange={setActiveFailedSubTab}
                variant="underline"
                className="overflow-x-auto"
              />
            ) : (
              <TabMenu
                tabs={statusTabs}
                activeTab={activeStatusTab}
                onTabChange={setActiveStatusTab}
                variant="underline"
                className="overflow-x-auto"
              />
            )}

            <div className="w-full overflow-x-auto">
              <div className="min-w-[1600px] space-y-4">
                <div
                  className="bg-[#f6f6f6] border border-[#ebebeb] rounded-[14px] px-5 py-3 grid gap-4"
                  style={{ gridTemplateColumns: summaryColumnTemplate }}
                >
                  {summaryHeaders.map((header) => (
                    <p
                      key={header.key}
                      className="text-[12px] font-semibold text-[#272424]"
                    >
                      {header.label}
                    </p>
                  ))}
                </div>

                {paginatedOrders.length === 0 && (
                  <div className="border border-dashed border-[#cfcfcf] rounded-[18px] px-6 py-10 text-center text-[#737373] text-[13px]">
                    Không tìm thấy đơn nào phù hợp bộ lọc hiện tại.
                  </div>
                )}

                {paginatedOrders.map((order) => {
                  const returnShippingChip = getReturnShippingChipProps(
                    order.returnShippingStatus
                  );
                  const isReturnShippingFailure = order.returnShippingStatus.includes(
                    "Giao hàng không thành công"
                  );
                  const displaySource =
                    order.category === "FAILED" || order.category === "CANCEL"
                      ? "Website"
                      : order.source;
                  const paymentBadge = getPaymentBadge(order.paymentMethod);

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#ebebeb] rounded-[20px] shadow-[0px_6px_24px_rgba(0,0,0,0.05)] px-5 py-5 flex flex-col gap-4"
                    >
                    <div
                      className="grid gap-4 items-center h-[50px]"
                      style={{ gridTemplateColumns: summaryColumnTemplate }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#2b73f0] to-[#1c57c0] text-white flex items-center justify-center font-semibold">
                          {order.customerName.charAt(0)}
                        </div>
                        <div className="flex flex-col text-[13px] text-[#272424]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{order.customerName}</span>
                            <span className="text-[#737373] text-xs">@{order.customerUsername}</span>
                          </div>
                          <p className="text-[#1a71f6] text-xs font-semibold">
                            Mã đơn: {order.orderCode}
                          </p>
                          <p className="text-[#737373] text-xs">
                            Đặt lúc: {order.createdAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="font-semibold text-[#272424] text-[13px]">
                          {displaySource}
                        </span>
                      </div>

                      <div className="text-[13px] text-[#545454] leading-relaxed">
                        {stripReasonPrefix(order.reason)}
                      </div>

                      <div className="flex items-center text-[13px] text-[#272424]">
                        <span>
                          {order.buyerOptions && order.buyerOptions.length > 0
                            ? order.buyerOptions[0]
                            : "Không có"}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {order.category === "FAILED" ? (
                          <span className="inline-flex items-center rounded-full bg-[#f4f4f4] text-[#575757] px-4 py-[6px] text-[12px] font-semibold border border-[#e0e0e0]">
                            Chờ hoàn tiền
                          </span>
                        ) : (
                          <StatusBadge label={order.statusLabel} status={order.statusKey} />
                        )}
                      </div>

                      <div className="flex items-center text-[12px] text-[#272424]">
                        {order.category === "FAILED" ? (
                          <span className="inline-flex flex-col items-center rounded-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 font-semibold text-[12px] leading-tight text-center">
                            <span>Giao hàng</span>
                            <span className="whitespace-nowrap">không thành công</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-[#b7f5b0] px-3 py-1 font-semibold text-[12px] text-[#0d8f1a] shadow-[0_2px_6px_rgba(16,185,129,0.25)] whitespace-nowrap">
                            Đã hoàn thành
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-[12px] text-[#272424]">
                        {isReturnShippingFailure ? (
                          <span className="inline-flex flex-col items-center rounded-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 font-semibold text-[12px] leading-tight text-center">
                            <span>Giao hàng</span>
                            <span className="whitespace-nowrap">không thành công</span>
                          </span>
                        ) : order.returnShippingStatus.trim().startsWith("Đang") ? (
                          <span className="inline-flex items-center rounded-full bg-[#e3edff] text-[#1a71f6] border border-[#c4d8ff] px-4 py-[6px] font-semibold whitespace-nowrap">
                            Đang chờ trả hàng
                          </span>
                        ) : order.returnShippingStatus.trim().startsWith("Đã") ? (
                          <span className="inline-flex items-center rounded-full bg-[#b7f5b0] text-[#0d8f1a] px-4 py-[6px] font-semibold shadow-[0_2px_6px_rgba(16,185,129,0.25)] whitespace-nowrap">
                            Đã hoàn thành
                          </span>
                        ) : (
                          <span className={returnShippingChip.className}>
                            {returnShippingChip.label}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-[#e04d30] no-underline">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                        </p>
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-3 py-[6px] text-[12px] font-semibold whitespace-nowrap ${paymentBadge.className} w-fit`}
                        >
                          {paymentBadge.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-center text-center">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="text-[#1a71f6] text-[13px] font-semibold hover:underline"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-[#f0f0f0] pt-4 flex flex-col gap-4 -mx-5 px-5">
                      <div className="flex items-start gap-4">
                        <div className="w-[46px] h-[46px] border border-[#d1d1d1] rounded-lg flex items-center justify-center bg-gray-50 text-[10px] text-[#737373] text-center px-1">
                          {order.productImage ? (
                            <img
                              src={order.productImage}
                              alt={order.productName}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <>Hình ảnh SP</>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 text-[13px] flex-1">
                          <p className="font-semibold text-[#272424]">
                            {order.productName}
                          </p>
                          {order.productVariant ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-[#1a71f6] text-[11px] font-semibold w-fit">
                              {order.productVariant}
                            </span>
                          ) : (
                            <span className="text-[#737373] text-[11px]">Phân loại hàng (nếu có)</span>
                          )}
                          <p className="text-[11px] text-[#737373]">
                            SKU: {order.orderCode}
                          </p>
                        </div>
                      </div>

                      {/* Chi tiết sản phẩm được lược bỏ theo thiết kế mới */}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            <Pagination
              current={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default AdminOrderOtherStatus;
