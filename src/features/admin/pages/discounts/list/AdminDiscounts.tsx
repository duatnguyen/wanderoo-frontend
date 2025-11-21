// src/pages/admin/AdminDiscounts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import TabMenuAccount from "@/components/ui/tab-menu-account";
import type { TabItem } from "@/components/ui/tab-menu-account";
import { PageHeader } from "@/components/admin/table/PageHeader";
import { PageContainer } from "@/components/admin/table/PageLayout";
import { TableFilters } from "@/components/admin/table/TableFilters";
import { TableActions } from "@/components/admin/table/TableActions";
import { DiscountTable } from "@/components/admin/table/DiscountTable";
import { VoucherCreationSection } from "@/components/admin/voucher/VoucherCreationSection";
import {
  CoinDiscountIcon,
  CreditCardPercentIcon,
  ReceiptDiscountIcon,
  TicketDiscountIcon,
} from "@/components/icons/discount";
import type {
  Voucher,
  VoucherOrder,
  VoucherOrderSummary,
} from "@/types/voucher";
import VoucherOrdersModal from "@/components/admin/voucher/VoucherOrdersModal";
import { getDiscounts } from "@/api/endpoints/discountApi";
import type {
  AdminDiscountResponse,
  DiscountStateValue,
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
const discountTabs: TabItem[] = [
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
    {
      icon: <CoinDiscountIcon size={24} color="#292D32" />,
      title: "Voucher khách hàng mua lại",
      description: "Voucher nhằm áp dụng cho khách hàng đã mua hàng tại shop",
    },
  ],
  privateChannel: {
    icon: <CreditCardPercentIcon size={24} color="#292D32" />,
    title: "Voucher riêng tư",
    description:
      "Voucher áp dụng cho nhóm khách hàng shop thông qua mã voucher",
  },
};

const voucherRouteMap: Record<string, string> = {
  "Voucher toàn shop": "/admin/discounts/new/shop-wide",
  "Voucher sản phẩm": "/admin/discounts/new/product",
  "Voucher khách hàng mới": "/admin/discounts/new/new-customer",
  "Voucher khách hàng mua lại": "/admin/discounts/new/returning-customer",
  "Voucher riêng tư": "/admin/discounts/new/private",
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
  if (discount.contextAllowed === "EVENT") return "Voucher khách hàng mua lại";
  if (discount.applyOn === "POS" && discount.contextAllowed === "OTHER") {
    return "Voucher riêng tư";
  }
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

  const editData = {
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

  return {
    id: discount.id ?? discount.code,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-discounts", activeTab, searchTerm],
    queryFn: () =>
      getDiscounts({
        keyword: searchTerm.trim() || undefined,
        state: tabToStateMap[activeTab],
        page: 1,
        size: 100,
      }),
    staleTime: 30_000,
    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message ?? "Không thể tải danh sách mã giảm giá.";
      toast.error(message);
    },
  });

  const vouchers = useMemo(() => {
    const discounts = data?.discounts ?? [];
    return discounts.map(mapDiscountToVoucher);
  }, [data]);

  const filteredVouchers = useMemo(() => {
    if (!searchTerm.trim()) return vouchers;
    const lower = searchTerm.trim().toLowerCase();
    return vouchers.filter(
      (voucher) =>
        voucher.name.toLowerCase().includes(lower) ||
        voucher.code.toLowerCase().includes(lower)
    );
  }, [vouchers, searchTerm]);

  useEffect(() => {
    setSelectedRows(new Set());
  }, [activeTab, searchTerm, vouchers]);

  // Selection handlers
  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredVouchers.map((v) => v.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

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

  const handleEnd = (voucher: Voucher) => {
    console.log("End voucher:", voucher);
    // End voucher logic
  };

  const handleBulkDelete = () => {
    console.log("Delete selected vouchers:", Array.from(selectedRows));
    // Bulk delete logic
    setSelectedRows(new Set());
  };

  const handleBulkEdit = () => {
    console.log("Edit selected vouchers:", Array.from(selectedRows));
    // Bulk edit logic
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
      <div className="w-full overflow-x-auto xl:overflow-x-visible mb-4">
        <TabMenuAccount
          tabs={discountTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="w-auto min-w-fit"
        />
      </div>

      {/* Search and Table Card */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] pt-[16px] px-[16px] pb-[16px] flex flex-col w-full">
        {/* Search and Actions */}
        <div className="mb-3">
          <TableFilters
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm kiếm mã giảm giá"
            searchClassName="flex-1 min-w-0 max-w-md"
            actions={selectedRows.size > 0 ? (
              <TableActions
                selectedCount={selectedRows.size}
                itemName="voucher"
                actions={[
                  {
                    label: "Chỉnh sửa",
                    onClick: handleBulkEdit,
                    variant: "secondary"
                  },
                  {
                    label: "Xóa",
                    onClick: handleBulkDelete,
                    variant: "danger"
                  }
                ]}
              />
            ) : undefined}
          />
        </div>

        {/* Voucher Table */}
        <DiscountTable
          vouchers={filteredVouchers}
          loading={isLoading}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onViewOrders={handleViewOrders}
          onEnd={handleEnd}
        />
      </div>
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
