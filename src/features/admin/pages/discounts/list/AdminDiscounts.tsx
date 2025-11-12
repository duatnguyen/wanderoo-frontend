// src/pages/admin/AdminDiscounts.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  VoucherProduct,
} from "@/types/voucher";
import VoucherOrdersModal from "@/components/admin/voucher/VoucherOrdersModal";

const sampleProducts: VoucherProduct[] = [
  {
    id: "PRO-001",
    name: "Giày leo núi nữ Humtto Hiking Shoes 14013",
    image: "/placeholder-product.jpg",
    barcode: "MS:HUMTTO14013",
    price: 1299000,
    available: 12,
    quantity: 1,
  },
  {
    id: "PRO-002",
    name: "Giày chạy trail ON Cloudventure Ice Heron",
    image: "/placeholder-product.jpg",
    barcode: "MS:ONCLOUDVENTURE",
    price: 3490000,
    available: 8,
    quantity: 1,
  },
  {
    id: "PRO-003",
    name: "Bình giữ nhiệt Hydro Flask 621ml",
    image: "/placeholder-product.jpg",
    barcode: "MS:HYDROFLASK621",
    price: 890000,
    available: 25,
    quantity: 2,
  },
];

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

const mockVouchers: Voucher[] = [
  {
    id: "SHOP-001",
    code: "SHOP5",
    name: "Tháng 3 - Giảm 5% toàn shop",
    type: "Voucher toàn shop",
    voucherCategory: "Khuyến Mãi",
    products: "Tất cả sản phẩm",
    discount: "5%",
    maxUsage: 200,
    used: 48,
    savedCount: 512,
    display: "Website",
    startDate: formatDisplayDate("2024-03-01T08:00:00"),
    endDate: formatDisplayDate("2024-04-01T23:59:00"),
    status: "Đang diễn ra",
    editData: {
      voucherName: "Tháng 3 - Giảm 5% toàn shop",
      voucherCode: "SHOP5",
      description: "Khuyến mãi đầu xuân áp dụng cho toàn bộ sản phẩm.",
      startDate: "2024-03-01T08:00:00",
      endDate: "2024-04-01T23:59:00",
      discountType: "percentage",
      discountValue: "5",
      maxDiscountLimit: "limited",
      maxDiscountValue: "50000",
      minOrderAmount: "300000",
      maxUsage: "200",
      maxUsagePerCustomer: "2",
      displaySetting: "website",
    },
  },
  {
    id: "PRO-001",
    code: "GEAR50",
    name: "Combo đồ leo núi - Giảm 50K",
    type: "Voucher sản phẩm",
    voucherCategory: "Khuyến Mãi",
    products: "3 sản phẩm được chọn",
    discount: "50.000đ",
    maxUsage: 120,
    used: 5,
    savedCount: 86,
    display: "POS + Website",
    startDate: formatDisplayDate("2024-04-05T09:00:00"),
    endDate: formatDisplayDate("2024-05-05T22:00:00"),
    status: "Sắp diễn ra",
    editData: {
      voucherName: "Combo đồ leo núi - Giảm 50K",
      voucherCode: "GEAR50",
      description: "Ưu đãi cho nhóm sản phẩm leo núi bán chạy.",
      startDate: "2024-04-05T09:00:00",
      endDate: "2024-05-05T22:00:00",
      discountType: "fixed",
      discountValue: "50000",
      maxDiscountLimit: "unlimited",
      minOrderAmount: "500000",
      maxUsage: "120",
      maxUsagePerCustomer: "1",
      displaySetting: "pos-website",
      appliedProducts: sampleProducts,
    },
  },
  {
    id: "NEW-001",
    code: "WELCOME20",
    name: "Khách hàng mới - Giảm 20%",
    type: "Voucher khách hàng mới",
    voucherCategory: "Khuyến Mãi",
    products: "Tất cả sản phẩm",
    discount: "20%",
    maxUsage: 500,
    used: 132,
    savedCount: 218,
    display: "Website",
    startDate: formatDisplayDate("2024-01-15T00:00:00"),
    endDate: formatDisplayDate("2024-06-30T23:59:00"),
    status: "Đang diễn ra",
    editData: {
      voucherName: "Khách hàng mới - Giảm 20%",
      voucherCode: "WELCOME20",
      description: "Chào mừng khách hàng mới lần đầu mua sắm tại shop.",
      startDate: "2024-01-15T00:00:00",
      endDate: "2024-06-30T23:59:00",
      discountType: "percentage",
      discountValue: "20",
      maxDiscountLimit: "limited",
      maxDiscountValue: "80000",
      minOrderAmount: "200000",
      maxUsage: "500",
      maxUsagePerCustomer: "1",
      displaySetting: "website",
    },
  },
  {
    id: "RET-001",
    code: "RETURN15",
    name: "Khách hàng mua lại - Giảm 15%",
    type: "Voucher khách hàng mua lại",
    voucherCategory: "Khuyến Mãi",
    products: "Tất cả sản phẩm",
    discount: "15%",
    maxUsage: 300,
    used: 74,
    savedCount: 190,
    display: "Website",
    startDate: formatDisplayDate("2024-02-01T09:30:00"),
    endDate: formatDisplayDate("2024-04-30T21:00:00"),
    status: "Đang diễn ra",
    editData: {
      voucherName: "Khách hàng mua lại - Giảm 15%",
      voucherCode: "RETURN15",
      description: "Tri ân khách hàng đã từng mua sắm tại shop.",
      startDate: "2024-02-01T09:30:00",
      endDate: "2024-04-30T21:00:00",
      discountType: "percentage",
      discountValue: "15",
      maxDiscountLimit: "limited",
      maxDiscountValue: "70000",
      minOrderAmount: "250000",
      maxUsage: "300",
      maxUsagePerCustomer: "2",
      displaySetting: "website",
      totalSpendingAmount: "5000000",
      spendingDays: "60",
    },
  },
  {
    id: "PRI-001",
    code: "VIP2024",
    name: "Voucher VIP nội bộ - 10%",
    type: "Voucher riêng tư",
    voucherCategory: "Chương trình nội bộ",
    products: "Tất cả sản phẩm",
    discount: "10%",
    maxUsage: 80,
    used: 80,
    savedCount: 64,
    display: "POS",
    startDate: formatDisplayDate("2023-10-01T08:00:00"),
    endDate: formatDisplayDate("2024-01-01T22:00:00"),
    status: "Đã kết thúc",
    editData: {
      voucherName: "Voucher VIP nội bộ - 10%",
      voucherCode: "VIP2024",
      description: "Ưu đãi dành riêng cho nhân viên và đối tác.",
      startDate: "2023-10-01T08:00:00",
      endDate: "2024-01-01T22:00:00",
      discountType: "percentage",
      discountValue: "10",
      maxDiscountLimit: "unlimited",
      minOrderAmount: "0",
      maxUsage: "80",
      maxUsagePerCustomer: "3",
      displaySetting: "pos",
    },
  },
];

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

const AdminDiscounts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Filter vouchers based on active tab and search term
  const filteredVouchers = mockVouchers.filter((voucher) => {
    const matchesTab = activeTab === "all" ||
      (activeTab === "ongoing" && voucher.status === "Đang diễn ra") ||
      (activeTab === "upcoming" && voucher.status === "Sắp diễn ra") ||
      (activeTab === "ended" && voucher.status === "Đã kết thúc");

    const matchesSearch = voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

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
      const allIds = new Set(filteredVouchers.map(v => v.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  // Action handlers
  const handleEdit = (voucher: Voucher) => {
    const route = voucherRouteMap[voucher.type] || "/admin/discounts/new";
    navigate(route, { state: { mode: "edit", voucher } });
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
