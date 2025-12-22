// src/pages/admin/AdminDiscounts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TableFilters } from "@/components/admin/table/TableFilters";
import { DiscountTable } from "@/components/admin/table/DiscountTable";
import { VoucherCreationSection } from "@/components/admin/voucher/VoucherCreationSection";
import {
  CreditCardPercentIcon,
  ReceiptDiscountIcon,
  TicketDiscountIcon,
} from "@/components/icons/discount";

import {
  PageContainer,
  ContentCard,
  PageHeader,
  TabMenuWithBadge,
  type TabItemWithBadge,
} from "@/components/common";

import type {
  Voucher,
  VoucherOrder,
  VoucherOrderSummary,
  VoucherEditData,
} from "@/types/voucher";
import VoucherOrdersModal from "@/components/admin/voucher/VoucherOrdersModal";
import { getDiscounts, getDiscountDetail, toggleDiscountStatus } from "@/api/endpoints/discountApi";
import type {
  AdminDiscountResponse,
  DiscountStateValue,
  AdminDiscountPageResponse,
} from "@/types/discount";

const formatDisplayDate = (iso: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const day = date.toLocaleDateString("vi-VN");
  return `${time} ${day}`;
};

const defaultSummary: VoucherOrderSummary = {
  totalOrders: 0,
  totalDiscountAmount: 0,
  totalRevenue: 0,
};

const createSummary = (orders: VoucherOrder[]): VoucherOrderSummary => {
  return orders.reduce(
    (acc, order) => {
      acc.totalOrders += 1;
      acc.totalDiscountAmount += order.discountAmount;
      acc.totalRevenue += order.totalAmount;
      return acc;
    },
    { ...defaultSummary }
  );
};

const voucherOrdersData: Record<
  string,
  { orders: VoucherOrder[]; summary: VoucherOrderSummary }
> = {
  "SHOP-001": (() => {
    const orders: VoucherOrder[] = [
      {
        id: "order-1",
        code: "250826TT6YWKXG",
        items: [
          {
            id: "item-1",
            name: "Áo khoác leo núi cao cấp",
            image: "https://via.placeholder.com/80x80.png?text=SP1",
            quantity: 1,
          },
        ],
        discountAmount: 34500,
        totalAmount: 300000,
        orderDate: "26/08/2025",
        status: "Đang xử lý",
      },
      {
        id: "order-2",
        code: "250901B563VJWU",
        items: [
          {
            id: "item-2",
            name: "Đầm dạ hội hè",
            image: "https://via.placeholder.com/80x80.png?text=SP2",
            quantity: 1,
          },
        ],
        discountAmount: 53300,
        totalAmount: 0,
        orderDate: "01/09/2025",
        status: "Đã hủy",
      },
      {
        id: "order-3",
        code: "250904K83X45ER",
        items: [
          {
            id: "item-3",
            name: "Đầm công sở kẻ caro",
            image: "https://via.placeholder.com/80x80.png?text=SP3",
            quantity: 1,
          },
        ],
        discountAmount: 42800,
        totalAmount: 320000,
        orderDate: "04/09/2025",
        status: "Đang giao",
      },
      {
        id: "order-4",
        code: "250905P0AYWQGB",
        items: [
          {
            id: "item-4",
            name: "Set trang phục vũ công",
            image: "https://via.placeholder.com/80x80.png?text=SP4",
            quantity: 1,
          },
        ],
        discountAmount: 36500,
        totalAmount: 320000,
        orderDate: "05/09/2025",
        status: "Đã giao",
      },
      {
        id: "order-5",
        code: "250906RA1V74TR",
        items: [
          {
            id: "item-5",
            name: "Mô hình anime Hatsune",
            image: "https://via.placeholder.com/80x80.png?text=SP5",
            quantity: 1,
          },
        ],
        discountAmount: 55000,
        totalAmount: 320000,
        orderDate: "06/09/2025",
        status: "Đã hoàn thành",
      },
      {
        id: "order-6",
        code: "250907TVAVAFN0",
        items: [
          {
            id: "item-6",
            name: "Tượng mô hình nghệ thuật",
            image: "https://via.placeholder.com/80x80.png?text=SP6",
            quantity: 1,
          },
        ],
        discountAmount: 134000,
        totalAmount: 650000,
        orderDate: "07/09/2025",
        status: "Đang giao",
      },
    ];
    return {
      orders,
      summary: createSummary(orders),
    };
  })(),
  "NEW-001": (() => {
    const orders: VoucherOrder[] = [
      {
        id: "order-7",
        code: "2508209CRMBY9R",
        items: [
          {
            id: "item-7",
            name: "Quần jean trơn xanh đậm",
            image: "https://via.placeholder.com/80x80.png?text=SP7",
            quantity: 1,
          },
        ],
        discountAmount: 53750,
        totalAmount: 330000,
        orderDate: "20/08/2025",
        status: "Đã hoàn thành",
      },
      {
        id: "order-8",
        code: "250820BPT70UB9",
        items: [
          {
            id: "item-8",
            name: "Váy dự tiệc công chúa",
            image: "https://via.placeholder.com/80x80.png?text=SP8",
            quantity: 1,
          },
        ],
        discountAmount: 32500,
        totalAmount: 0,
        orderDate: "20/08/2025",
        status: "Đã hủy",
      },
      {
        id: "order-9",
        code: "250821BVDVQTVP",
        items: [
          {
            id: "item-9",
            name: "Trang phục múa truyền thống",
            image: "https://via.placeholder.com/80x80.png?text=SP9",
            quantity: 1,
          },
        ],
        discountAmount: 62756,
        totalAmount: 0,
        orderDate: "21/08/2025",
        status: "Đang xử lý",
      },
      {
        id: "order-10",
        code: "250825R79R66SX",
        items: [
          {
            id: "item-10",
            name: "Mô hình robot sưu tầm",
            image: "https://via.placeholder.com/80x80.png?text=SP10",
            quantity: 1,
          },
        ],
        discountAmount: 46300,
        totalAmount: 0,
        orderDate: "25/08/2025",
        status: "Đang giao",
      },
    ];
    return {
      orders,
      summary: createSummary(orders),
    };
  })(),
};
// Tab data
const discountTabs: TabItemWithBadge[] = [
  { id: "all", label: "Tất cả" },
  { id: "ongoing", label: "Đang diễn ra" },
  { id: "upcoming", label: "Sắp diễn ra" },
  { id: "ended", label: "Đã kết thúc" },
];

// Voucher types configuration
const voucherTypes = {
  conversion: [
    {
      icon: <CreditCardPercentIcon size={24} color="#292D32" />,
      title: "Voucher toàn shop",
      description: "Voucher áp dụng cho tất cả sản phẩm toàn shop của bạn",
    },
    {
      icon: <ReceiptDiscountIcon size={24} color="#292D32" />,
      title: "Voucher sản phẩm",
      description: "Voucher áp dụng cho những sản phẩm áp dụng tại shop",
    },
  ],
  targetCustomer: [
    {
      icon: <TicketDiscountIcon size={24} color="#292D32" />,
      title: "Voucher khách hàng mới",
      description:
        "Voucher nhằm áp dụng cho khách hàng mới và khách hàng tiềm năng",
    },
  ],
};

const voucherRouteMap: Record<string, string> = {
  "Voucher toàn shop": "/admin/discounts/new/shop-wide",
  "Voucher sản phẩm": "/admin/discounts/new/product",
  "Voucher khách hàng mới": "/admin/discounts/new/new-customer",
};

const tabToStateMap: Record<string, DiscountStateValue | undefined> = {
  all: undefined,
  ongoing: "ONGOING",
  upcoming: "UPCOMING",
  ended: "ENDED",
};

const applyOnLabelMap: Record<string, string> = {
  WEBSITE: "Website",
  POS: "POS",
  BOTH: "POS + Website",
};

const displaySettingMap: Record<string, "pos" | "website" | "pos-website"> = {
  WEBSITE: "website",
  POS: "pos",
  BOTH: "pos-website",
};

const formatCurrency = (value?: number | null) => {
  if (value == null) return "-";
  return `${value.toLocaleString("vi-VN")}đ`;
};

const mapDiscountTypeLabel = (discount: AdminDiscountResponse) => {
  if (discount.applyTo === "PRODUCT") return "Voucher sản phẩm";
  if (discount.contextAllowed === "SIGNUP") return "Voucher khách hàng mới";
  return "Voucher toàn shop";
};

const getVoucherStatus = (discount: AdminDiscountResponse): Voucher["status"] => {
  if (discount.status === "DISABLE") {
    return "Đã kết thúc";
  }
  const now = new Date();
  const start = discount.startDate ? new Date(discount.startDate) : null;
  const end = discount.endDate ? new Date(discount.endDate) : null;

  if (start && start > now) return "Sắp diễn ra";
  if (end && end < now) return "Đã kết thúc";
  return "Đang diễn ra";
};

const mapDiscountToVoucher = (discount: AdminDiscountResponse): Voucher => {
  const status = getVoucherStatus(discount);
  const typeLabel = mapDiscountTypeLabel(discount);
  const discountValueText =
    discount.type === "PERCENT"
      ? `${discount.value ?? 0}%`
      : formatCurrency(discount.value);

  const applyOnLabel = applyOnLabelMap[discount.applyOn] || discount.applyOn || "-";

  const editData: VoucherEditData = {
    voucherName: discount.name ?? "",
    voucherCode: discount.code ?? "",
    description: discount.description ?? "",
    startDate: discount.startDate ? new Date(discount.startDate).toISOString() : "",
    endDate: discount.endDate ? new Date(discount.endDate).toISOString() : "",
    discountType: discount.type === "PERCENT" ? "percentage" : "fixed",
    discountValue: discount.value != null ? discount.value.toString() : "",
    maxDiscountLimit: discount.maxOrderValue ? "limited" : "unlimited",
    maxDiscountValue: discount.maxOrderValue != null ? discount.maxOrderValue.toString() : "",
    minOrderAmount: discount.minOrderValue != null ? discount.minOrderValue.toString() : "",
    maxUsage: discount.discountUsage != null ? discount.discountUsage.toString() : "",
    maxUsagePerCustomer: "",
    displaySetting: displaySettingMap[discount.applyOn] ?? "website",
    totalSpendingAmount: "",
    spendingDays: "",
  };

  const voucherId = discount.id != null ? String(discount.id) : discount.code ?? "";

  return {
    id: voucherId,
    code: discount.code ?? "",
    name: discount.name ?? "",
    type: typeLabel,
    voucherCategory: discount.category ?? "",
    products: discount.applyTo === "PRODUCT" ? "Sản phẩm được chọn" : "Tất cả sản phẩm",
    discount: discountValueText,
    maxUsage: discount.discountUsage ?? discount.quantity ?? 0,
    used: 0,
    savedCount: undefined,
    display: applyOnLabel,
    startDate: formatDisplayDate(discount.startDate?.toString() ?? ""),
    endDate: formatDisplayDate(discount.endDate?.toString() ?? ""),
    status,
    editData,
  };
};

const AdminDiscounts: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const { data, isLoading, error } = useQuery<AdminDiscountPageResponse, Error>({
    queryKey: ["admin-discounts", activeTab, searchTerm],
    queryFn: async (): Promise<AdminDiscountPageResponse> => {
      // Nếu tab là "all", gọi API với tất cả các state và merge kết quả
      if (activeTab === "all") {
        const [ongoingData, upcomingData, endedData] = await Promise.all([
          getDiscounts({
            keyword: searchTerm.trim() || undefined,
            state: "ONGOING",
            page: 1,
            size: 100,
          }),
          getDiscounts({
            keyword: searchTerm.trim() || undefined,
            state: "UPCOMING",
            page: 1,
            size: 100,
          }),
          getDiscounts({
            keyword: searchTerm.trim() || undefined,
            state: "ENDED",
            page: 1,
            size: 100,
          }),
        ]);

        // Merge tất cả discounts và loại bỏ duplicate dựa trên ID
        const allDiscounts = [
          ...(ongoingData.discounts ?? []),
          ...(upcomingData.discounts ?? []),
          ...(endedData.discounts ?? []),
        ];

        // Loại bỏ duplicate dựa trên ID
        const uniqueDiscounts = Array.from(
          new Map(allDiscounts.map((discount) => [discount.id, discount])).values()
        );

        return {
          pageNumber: 1,
          pageSize: uniqueDiscounts.length,
          totalElements: uniqueDiscounts.length,
          totalPages: 1,
          discounts: uniqueDiscounts,
        };
      }

      // Các tab khác giữ nguyên logic cũ
      return getDiscounts({
        keyword: searchTerm.trim() || undefined,
        state: tabToStateMap[activeTab],
        page: 1,
        size: 100,
      });
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!error) return;
    const message =
      (error as any)?.response?.data?.message ?? "Không thể tải danh sách mã giảm giá.";
    toast.error(message);
  }, [error]);

  const vouchers: Voucher[] = useMemo(() => {
    const discounts = data?.discounts ?? [];
    return discounts.map(mapDiscountToVoucher);
  }, [data]);

  const filteredVouchers: Voucher[] = useMemo(() => {
    if (!searchTerm.trim()) return vouchers;
    const lower = searchTerm.trim().toLowerCase();
    return vouchers.filter(
      (voucher) =>
        voucher.name.toLowerCase().includes(lower) ||
        voucher.code.toLowerCase().includes(lower)
    );
  }, [vouchers, searchTerm]);

  // Action handlers
  const handleEdit = (voucher: Voucher) => {
    const route = voucherRouteMap[voucher.type] || "/admin/discounts/new";
    const querySuffix = voucher.id ? `?id=${voucher.id}` : "";
    navigate(`${route}${querySuffix}`, { state: { mode: "edit", voucher } });
  };

  const handleViewOrders = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsOrdersModalOpen(true);
  };

  // Mutation để toggle status voucher (ENABLE/DISABLE)
  const toggleVoucherStatusMutation = useMutation({
    mutationFn: async ({ discountId, newStatus }: { discountId: number; newStatus: "ENABLE" | "DISABLE" }) => {
      return toggleDiscountStatus(discountId, newStatus);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      const statusText = variables.newStatus === "ENABLE" ? "kích hoạt" : "vô hiệu hóa";
      toast.success(`Đã ${statusText} voucher thành công`);
    },
    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message ?? "Không thể cập nhật trạng thái voucher. Vui lòng thử lại.";
      toast.error(message);
    },
  });

  const endVoucherMutation = useMutation({
    mutationFn: async (discountId: number) => {
      // Gọi API deleteDiscount: backend sẽ set endDate = now nếu còn tương lai và đổi status sang DISABLE
      const { deleteDiscount } = await import("@/api/endpoints/discountApi");
      return deleteDiscount(discountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      toast.success("Đã kết thúc voucher và cập nhật ngày kết thúc là thời gian hiện tại");
    },
    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message ?? "Không thể kết thúc voucher. Vui lòng thử lại.";
      toast.error(message);
    },
  });

  const handleEnd = async (voucher: Voucher) => {
    // Lấy discount ID từ voucher
    const discountId = typeof voucher.id === "string" ? Number(voucher.id) : voucher.id;
    if (!discountId || Number.isNaN(discountId)) {
      toast.error("Không xác định được ID của voucher.");
      return;
    }

    // Khi kết thúc voucher: set ngày kết thúc = thời gian hiện tại và DISABLE (dùng deleteDiscount)
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn kết thúc voucher "${voucher.name}" (${voucher.code}) ngay bây giờ?`
      )
    ) {
      return;
    }

    try {
      await endVoucherMutation.mutateAsync(discountId);
    } catch {
      // lỗi đã được xử lý trong mutation onError
    }
  };

  const handleCreateVoucher = (type: string) => {
    console.log("Creating voucher of type:", type);
    const route = voucherRouteMap[type] || "/admin/discounts/new";
    navigate(route);
  };

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Danh sách mã giảm giá"
        className="flex items-center justify-between w-full mb-2 flex-nowrap gap-2"
      />

      {/* Create Voucher Section */}
      <VoucherCreationSection
        voucherTypes={voucherTypes}
        onCreateVoucher={handleCreateVoucher}
      />

      {/* Tab Menu */}
      <div className="w-full overflow-x-auto xl:overflow-x-visible mt-4">
        <TabMenuWithBadge
          tabs={discountTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="w-auto min-w-fit"
        />
      </div>

      {/* Search and Table Card */}
      <ContentCard>
        {/* Search and Actions */}
        <TableFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Tìm kiếm mã giảm giá"
          searchClassName="flex-1 min-w-0 max-w-md"
        />

        {/* Voucher Table */}
        <DiscountTable
          vouchers={filteredVouchers}
          loading={isLoading}
          onEdit={handleEdit}
          onViewOrders={handleViewOrders}
          onEnd={handleEnd}
        />
      </ContentCard>
      <VoucherOrdersModal
        isOpen={isOrdersModalOpen}
        voucher={selectedVoucher}
        orders={selectedVoucher ? voucherOrdersData[selectedVoucher.id]?.orders ?? [] : []}
        summary={
          selectedVoucher
            ? voucherOrdersData[selectedVoucher.id]?.summary ?? defaultSummary
            : defaultSummary
        }
        onClose={() => {
          setIsOrdersModalOpen(false);
          setSelectedVoucher(null);
        }}
      />
    </PageContainer>
  );
};

export default AdminDiscounts;
