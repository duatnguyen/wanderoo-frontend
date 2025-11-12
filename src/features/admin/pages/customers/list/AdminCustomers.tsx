// src/pages/admin/AdminCustomers.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icons/Icon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SearchBar } from "@/components/ui/search-bar";
import CaretDown from "@/components/ui/caret-down";
import { Pagination } from "@/components/ui/pagination";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  PageContainer,
  ContentCard,
  PageHeader,
} from "@/components/common";
import { ChipStatus } from "@/components/ui/chip-status";

type Customer = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  status: "active" | "disabled";
  avatar?: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
};

const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Nguyễn Văn An",
    username: "nguyenvanan",
    email: "nguyenvanan@email.com",
    phone: "0123456789",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-01-15",
    totalOrders: 25,
    totalSpent: 12500000,
  },
  {
    id: "C002",
    name: "Trần Thị Bình",
    username: "tranthibinh",
    email: "tranthibinh@email.com",
    phone: "0987654321",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-02-20",
    totalOrders: 18,
    totalSpent: 8900000,
  },
  {
    id: "C003",
    name: "Lê Văn Cường",
    username: "levancuong",
    email: "levancuong@email.com",
    phone: "0369852147",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-03-10",
    totalOrders: 32,
    totalSpent: 18750000,
  },
  {
    id: "C004",
    name: "Phạm Thị Dung",
    username: "phamthidung",
    email: "phamthidung@email.com",
    phone: "0741258963",
    status: "disabled",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-01-05",
    totalOrders: 8,
    totalSpent: 3200000,
  },
  {
    id: "C005",
    name: "Hoàng Văn Em",
    username: "hoangvanem",
    email: "hoangvanem@email.com",
    phone: "0852369741",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-04-12",
    totalOrders: 15,
    totalSpent: 7500000,
  },
  {
    id: "C006",
    name: "Vũ Thị Phương",
    username: "vuthiphuong",
    email: "vuthiphuong@email.com",
    phone: "0963258741",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-02-28",
    totalOrders: 42,
    totalSpent: 25600000,
  },
  {
    id: "C007",
    name: "Đặng Văn Giang",
    username: "dangvangiang",
    email: "dangvangiang@email.com",
    phone: "0147258369",
    status: "disabled",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-01-20",
    totalOrders: 12,
    totalSpent: 5600000,
  },
  {
    id: "C008",
    name: "Bùi Thị Hoa",
    username: "buithihoa",
    email: "buithihoa@email.com",
    phone: "0789632145",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-03-25",
    totalOrders: 28,
    totalSpent: 14200000,
  },
];

const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");
  const [customers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const result = customers.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    // Reset to page 1 when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
    return result;
  }, [customers, statusFilter, searchTerm, currentPage]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all items on current page
      const newSelected = new Set(selectedCustomers);
      paginatedCustomers.forEach((c) => newSelected.add(c.id));
      setSelectedCustomers(newSelected);
    } else {
      // Deselect all items on current page
      const newSelected = new Set(selectedCustomers);
      paginatedCustomers.forEach((c) => newSelected.delete(c.id));
      setSelectedCustomers(newSelected);
    }
  };

  const handleSelectItem = (customerId: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      newSelected.add(customerId);
    } else {
      newSelected.delete(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const handleDeactivateSelected = () => {
    // TODO: Implement deactivation logic
    console.log(
      "Deactivating selected customers:",
      Array.from(selectedCustomers)
    );
    // Reset selection after action
    setSelectedCustomers(new Set());
  };

  return (
    <PageContainer>
      <PageHeader
        title="Danh sách khách hàng"
        actions={
          <Button
            onClick={() => navigate("/admin/customers/new")}
            className="h-[36px] flex-shrink-0"
          >
            <Icon name="plus" size={16} color="#ffffff" strokeWidth={3} />
            <span className="whitespace-nowrap">Thêm mới khách hàng</span>
          </Button>
        }
      />

      <ContentCard>
        <div className="flex gap-[8px] items-center w-full">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm khách hàng..."
            className="flex-1 min-w-0 max-w-[400px]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] cursor-pointer">
                <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4]">
                  {statusFilter === "all"
                    ? "Tất cả trạng thái"
                    : statusFilter === "active"
                      ? "Đang kích hoạt"
                      : "Ngừng kích hoạt"}
                </span>
                <CaretDown className="text-[#e04d30]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Tất cả trạng thái
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Đang kích hoạt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("disabled")}>
                Ngừng kích hoạt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] rounded-tl-[16px] rounded-tr-[16px] w-full h-[58px]">
            <div className="grid grid-cols-[50px_1fr_200px_140px_120px_160px_120px] gap-0 items-center h-full px-[12px]">
              {/* Checkbox column */}
              <div className="flex h-full items-center justify-center">
                <CustomCheckbox
                  checked={
                    paginatedCustomers.length > 0 &&
                    paginatedCustomers.every((c) => selectedCustomers.has(c.id))
                  }
                  onChange={(checked) => handleSelectAll(checked)}
                  className="w-[20px] h-[20px]"
                />
              </div>

              {/* If selection active, show actions across remaining columns */}
              {selectedCustomers.size > 0 ? (
                <div className="col-span-6 flex items-center gap-[12px] px-[4px]">
                  <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] whitespace-nowrap">
                    Đã chọn {selectedCustomers.size} khách hàng
                  </span>
                  <div className="flex items-center gap-[8px]">
                    <Button
                      className="h-[32px] px-[16px] rounded-[10px] bg-[#e04d30] text-white hover:bg-[#d54933] transition-colors duration-150 text-[12px]"
                      onClick={() =>
                        console.log(
                          "Activate selected:",
                          Array.from(selectedCustomers)
                        )
                      }
                    >
                      Đang kích hoạt
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-[32px] px-[16px] rounded-[10px] border-2 border-[#e04d30] text-[#e04d30] hover:bg-[#ffe9e5] hover:text-[#c73722] transition-colors duration-150 text-[12px]"
                      onClick={handleDeactivateSelected}
                    >
                      Ngừng kích hoạt
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center px-[4px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Khách hàng
                    </span>
                  </div>
                  <div className="flex items-center px-[4px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Email
                    </span>
                  </div>
                  <div className="flex items-center px-[4px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Số điện thoại
                    </span>
                  </div>
                  <div className="flex items-center px-[4px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Ngày đăng ký
                    </span>
                  </div>
                  <div className="flex items-center px-[4px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Tổng chi tiêu
                    </span>
                  </div>
                  <div className="flex items-center justify-center px-[4px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      Trạng thái
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Table Body */}
          {paginatedCustomers.map((c, index) => (
            <div
              key={c.id}
              className={`w-full min-h-[70px] ${index === paginatedCustomers.length - 1
                ? "border-transparent"
                : "border-b border-[#e7e7e7]"
                } ${selectedCustomers.has(c.id)
                  ? "bg-blue-50"
                  : "hover:bg-gray-50 cursor-pointer"
                }`}
            >
              <div className="grid grid-cols-[50px_1fr_200px_140px_120px_160px_120px] gap-0 items-center h-full px-[12px] py-[8px]">
                {/* Checkbox col */}
                <div className="flex items-center justify-center">
                  <CustomCheckbox
                    checked={selectedCustomers.has(c.id)}
                    onChange={(checked) => handleSelectItem(c.id, checked)}
                    className="w-[20px] h-[20px]"
                  />
                </div>

                {/* Customer info col */}
                <div className="flex items-center gap-[8px] px-[4px]">
                  <div className="w-[45px] h-[45px] relative overflow-hidden rounded-lg border-2 border-[#d1d1d1] flex-shrink-0">
                    <Avatar className="w-full h-full">
                      {c.avatar ? (
                        <AvatarImage src={c.avatar} alt={c.name} />
                      ) : (
                        <AvatarFallback className="text-xs">
                          {c.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                    <button
                      className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] hover:underline truncate w-full text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/customers/${c.id}`);
                      }}
                    >
                      {c.name}
                    </button>
                    <span className="font-medium text-[11px] text-[#737373] leading-[1.3] truncate w-full">
                      @{c.username}
                    </span>
                  </div>
                </div>

                {/* Email col */}
                <div className="flex items-center px-[4px]">
                  <span className="font-medium text-[#272424] text-[13px] leading-[1.4] truncate w-full">
                    {c.email}
                  </span>
                </div>

                {/* Phone col */}
                <div className="flex items-center px-[4px]">
                  <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                    {c.phone}
                  </span>
                </div>

                {/* Registration date col */}
                <div className="flex items-center px-[4px]">
                  <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                    {new Date(c.registrationDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Total spent col */}
                <div className="flex flex-col gap-[2px] items-start justify-center px-[4px]">
                  <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                    {c.totalSpent.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="font-medium text-[#737373] text-[11px] leading-[1.3]">
                    {c.totalOrders} đơn hàng
                  </span>
                </div>

                {/* Status col */}
                <div className="flex items-center justify-center px-[4px]">
                  <ChipStatus
                    status={c.status === "active" ? "active" : "disabled"}
                    labelOverride={c.status === "active" ? "Đang kích hoạt" : "Ngừng kích hoạt"}
                    size="small"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={Math.ceil(filtered.length / 10)}
          onChange={setCurrentPage}
        />
      </ContentCard>
    </PageContainer>
  );
};

export default AdminCustomers;
