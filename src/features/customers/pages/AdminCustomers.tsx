// src/pages/admin/AdminCustomers.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-[16px] items-center w-full max-w-full overflow-hidden">
      {/* Customers Table */}
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
          Danh sách khách hàng
        </h2>
        <Button onClick={() => navigate("/admin/customers/new")}>
          Thêm khách hàng
        </Button>
      </div>
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[12px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
        {/* Search and Filter */}
        <div className="flex gap-[8px] items-center w-full">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-[400px]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] cursor-pointer">
                <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4]">
                  Trạng thái tài khoản
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
                Đã khóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full overflow-x-auto">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full min-w-[1000px] h-[58px]">
            <div className="flex flex-row items-center w-full h-full">
              <div className="flex gap-[6px] h-full items-center px-[4px] py-[12px] w-[350px] min-w-[350px] min-h-[58px]">
                <CustomCheckbox
                  checked={
                    paginatedCustomers.length > 0 &&
                    paginatedCustomers.every((c) => selectedCustomers.has(c.id))
                  }
                  onChange={(checked) => handleSelectAll(checked)}
                  className="w-[30px] h-[30px]"
                />
                {selectedCustomers.size > 0 ? (
                  <div className="flex gap-[6px] items-center">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                      Đã chọn {selectedCustomers.size} khách hàng
                    </span>
                    <Button onClick={handleDeactivateSelected}>
                      Ngừng kích hoạt
                    </Button>
                  </div>
                ) : (
                  <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                    Khách hàng
                  </span>
                )}
              </div>
              <div className="flex gap-[6px] h-full items-center px-[4px] py-[12px] w-[180px] min-w-[180px] min-h-[58px]">
                {selectedCustomers.size === 0 && (
                  <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                    Email
                  </span>
                )}
              </div>
              <div className="flex gap-[6px] h-full items-center px-[4px] py-[12px] w-[130px] min-w-[130px] min-h-[58px]">
                {selectedCustomers.size === 0 && (
                  <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                    Số điện thoại
                  </span>
                )}
              </div>
              <div className="flex gap-[6px] h-full items-center px-[4px] py-[12px] w-[180px] min-w-[180px] min-h-[58px]">
                {selectedCustomers.size === 0 && (
                  <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                    Tổng chi tiêu
                  </span>
                )}
              </div>
              <div className="flex gap-[4px] h-full items-center justify-end p-[14px] flex-1 min-h-[58px]">
                {selectedCustomers.size > 0 ? null : (
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                    Trạng thái
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table Body */}
          {paginatedCustomers.map((c, index) => (
            <div
              key={c.id}
              className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[12px] py-0 w-full min-w-[1000px] ${
                index === paginatedCustomers.length - 1
                  ? "border-transparent"
                  : "border-[#e7e7e7]"
              } ${
                selectedCustomers.has(c.id) ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex gap-[6px] h-full items-center px-[4px] py-[12px] w-[350px] min-w-[350px]">
                    <CustomCheckbox
                      checked={selectedCustomers.has(c.id)}
                      onChange={(checked) => handleSelectItem(c.id, checked)}
                      className="w-[30px] h-[30px]"
                    />
                    <div className="w-[50px] h-[50px] relative overflow-hidden rounded-lg border-2 border-[#d1d1d1]">
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
                    <div className="flex flex-col gap-[2px] h-full items-start justify-center">
                      <span className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3]">
                        {c.name}
                      </span>
                      <span className="font-medium text-[11px] text-[#737373] leading-[1.3]">
                        @{c.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px] w-[180px] min-w-[180px]">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4] truncate">
                      {c.email}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px] w-[130px] min-w-[130px]">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                      {c.phone}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px] w-[180px] min-w-[180px]">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                      {c.totalSpent.toLocaleString("vi-VN")} VNĐ
                    </span>
                    <span className="font-medium text-[#737373] text-[11px] leading-[1.3]">
                      {c.totalOrders} đơn hàng
                    </span>
                  </div>
                  <div className="flex gap-[4px] h-full items-center justify-end p-[14px] flex-1">
                    <div
                      className={`rounded-[10px] ${
                        c.status === "active" ? "bg-[#b2ffb4]" : "bg-[#ffdcdc]"
                      }`}
                    >
                      <div className="flex gap-[10px] items-center justify-center px-[8px] py-[6px]">
                        <span
                          className={`font-semibold text-[12px] leading-[1.4] ${
                            c.status === "active"
                              ? "text-[#04910c]"
                              : "text-[#eb2b0b]"
                          }`}
                        >
                          {c.status === "active" ? "Đang kích hoạt" : "Đã khóa"}
                        </span>
                      </div>
                    </div>
                  </div>
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
      </div>
    </div>
  );
};

export default AdminCustomers;
