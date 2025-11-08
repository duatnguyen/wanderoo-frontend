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

interface Voucher {
  id: string;
  code: string;
  name: string;
  type: string;
  products: string;
  discount: string;
  maxUsage: number;
  used: number;
  display: string;
  startDate: string;
  endDate: string;
  status: "Đang diễn ra" | "Sắp diễn ra" | "Đã kết thúc";
}

// Mock data
const mockVouchers: Voucher[] = [
  {
    id: "1",
    code: "KJAJHSS",
    name: "KHACH MOI",
    type: "Voucher khách hàng mới",
    products: "Tất cả sản phẩm",
    discount: "5.000đ",
    maxUsage: 50,
    used: 1,
    display: "Website",
    startDate: "12:00 17/3/2023",
    endDate: "12:00 17/3/2024",
    status: "Đang diễn ra",
  },
  {
    id: "2",
    code: "KJAJHSS",
    name: "KHACH MOI",
    type: "Voucher khách hàng mới",
    products: "Tất cả sản phẩm",
    discount: "5.000đ",
    maxUsage: 50,
    used: 1,
    display: "Website",
    startDate: "12:00 17/3/2023",
    endDate: "12:00 17/3/2024",
    status: "Đang diễn ra",
  },
  {
    id: "3",
    code: "KJAJHSS",
    name: "KHACH MOI",
    type: "Voucher khách hàng mới",
    products: "Tất cả sản phẩm",
    discount: "5.000đ",
    maxUsage: 50,
    used: 1,
    display: "Website",
    startDate: "12:00 17/3/2023",
    endDate: "12:00 17/3/2024",
    status: "Đang diễn ra",
  },
];

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

const AdminDiscounts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

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
    console.log("Edit voucher:", voucher);
    // Navigate to edit page
  };

  const handleViewOrders = (voucher: Voucher) => {
    console.log("View orders for voucher:", voucher);
    // Navigate to orders page
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
    // Map voucher types to different routes
    const routeMap: Record<string, string> = {
      "Voucher toàn shop": "/admin/discounts/new/shop-wide",
      "Voucher sản phẩm": "/admin/discounts/new/product",
      "Voucher khách hàng mới": "/admin/discounts/new/new-customer",
      "Voucher khách hàng mua lại": "/admin/discounts/new/returning-customer",
      "Voucher riêng tư": "/admin/discounts/new/private",
    };
    const route = routeMap[type] || "/admin/discounts/new";
    navigate(route);
  };

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Danh sách mã giảm giá"
        className="flex items-center justify-between w-full mb-6 flex-nowrap gap-2"
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
    </PageContainer>
  );
};

export default AdminDiscounts;
