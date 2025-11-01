// src/pages/admin/AdminStaff.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CaretDown from "@/components/ui/caret-down";
import { SearchBar } from "@/components/ui/search-bar";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Staff = {
  id: string;
  name: string;
  username: string;
  role: string;
  status: "active" | "disabled";
  avatar?: string;
};

type StoreOwner = {
  name: string;
  username: string;
  status: "active" | "disabled";
  avatar?: string;
};

const storeOwner: StoreOwner = {
  name: "AdminThanhNguyen",
  username: "adminthanhnguyen",
  status: "active",
  avatar: "/api/placeholder/40/40",
};

const mockStaff: Staff[] = [
  {
    id: "S001",
    name: "Nguyễn Thị Thanh",
    username: "nguyenthanh",
    role: "Quản lý",
    status: "active",
    avatar: "/api/placeholder/70/70",
  },
  {
    id: "S002",
    name: "Hoàng Văn Thụ",
    username: "hoangthu",
    role: "Quản lý hệ thống",
    status: "active",
    avatar: "/api/placeholder/70/70",
  },
  {
    id: "S003",
    name: "Lã Thị Duyên",
    username: "laduen",
    role: "Nhân viên",
    status: "active",
    avatar: "/api/placeholder/70/70",
  },
  {
    id: "S004",
    name: "Phạm Văn Đồng",
    username: "phamdong",
    role: "Nhân viên",
    status: "active",
    avatar: "/api/placeholder/70/70",
  },
  {
    id: "S005",
    name: "Nguyễn Đình Bách",
    username: "nguyenbach",
    role: "Nhân viên",
    status: "active",
    avatar: "/api/placeholder/70/70",
  },
];

const AdminStaff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");
  const [staff] = useState<Staff[]>(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const result = staff.filter((s) => {
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    // Reset to page 1 when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
    return result;
  }, [staff, statusFilter, searchTerm, currentPage]);

  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all items on current page
      const newSelected = new Set(selectedStaff);
      paginatedStaff.forEach((s) => newSelected.add(s.id));
      setSelectedStaff(newSelected);
    } else {
      // Deselect all items on current page
      const newSelected = new Set(selectedStaff);
      paginatedStaff.forEach((s) => newSelected.delete(s.id));
      setSelectedStaff(newSelected);
    }
  };

  const handleSelectItem = (staffId: string, checked: boolean) => {
    const newSelected = new Set(selectedStaff);
    if (checked) {
      newSelected.add(staffId);
    } else {
      newSelected.delete(staffId);
    }
    setSelectedStaff(newSelected);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filtered.length / 10);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleActivateSelected = () => {
    // TODO: Implement activation logic
    console.log("Activating selected staff:", Array.from(selectedStaff));
    // Reset selection after action
    setSelectedStaff(new Set());
  };

  const handleDeactivateSelected = () => {
    // TODO: Implement deactivation logic
    console.log("Deactivating selected staff:", Array.from(selectedStaff));
    // Reset selection after action
    setSelectedStaff(new Set());
  };

  return (
    <div className="flex flex-col gap-[22px] items-center w-full">
      {/* Store Owner Header */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[8px] items-start justify-center px-[24px] py-[20px] rounded-[24px] w-full">
        <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
          Tài khoản chủ cửa hàng
        </h1>
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-[8px] items-center">
            <div className="border border-[#d1d1d1] h-[37px] rounded-[24px] w-[40px] overflow-hidden">
              <Avatar className="w-full h-full">
                {storeOwner.avatar ? (
                  <AvatarImage src={storeOwner.avatar} alt={storeOwner.name} />
                ) : (
                  <AvatarFallback className="text-xs">
                    {storeOwner.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="flex flex-col gap-[4px]">
              <h2 className="font-bold text-[#272424] text-[16px] leading-normal">
                {storeOwner.name}
              </h2>
            </div>
          </div>
          <div className="bg-[#b2ffb4] flex gap-[10px] items-center justify-center px-[8px] py-[6px] rounded-[10px]">
            <span className="font-semibold text-[14px] text-[#04910c] leading-[1.4]">
              Đang kích hoạt
            </span>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[24px] py-[24px] rounded-[24px] w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-[8px] items-center">
            <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
              Tài khoản nhân viên
            </h2>
          </div>
          <Button onClick={() => navigate("/admin/staff/new")}>
            Thêm tài khoản nhân viên
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-[10px] items-center w-full">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-[500px]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white border-2 border-[#e04d30] flex gap-[6px] items-center justify-center px-[24px] py-[12px] rounded-[12px] cursor-pointer">
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
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full h-[58px]">
            <div className="flex flex-row items-center w-full h-full">
              <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-[450px] min-h-[58px]">
                <CustomCheckbox
                  checked={
                    paginatedStaff.length > 0 &&
                    paginatedStaff.every((s) => selectedStaff.has(s.id))
                  }
                  onChange={(checked) => handleSelectAll(checked)}
                  className="w-[30px] h-[30px]"
                />
                {selectedStaff.size > 0 ? (
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                    Đã chọn {selectedStaff.size} tài khoản
                  </span>
                ) : (
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                    Tài khoản
                  </span>
                )}
              </div>
              <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] flex-1 min-h-[58px]">
                {selectedStaff.size === 0 && (
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                    Vai trò
                  </span>
                )}
              </div>
              <div className="flex gap-[4px] h-full items-center justify-end p-[14px] flex-1 min-h-[58px]">
                {selectedStaff.size > 0 ? (
                  <div className="flex gap-[6px] items-center">
                    <Button
                      variant="secondary"
                      onClick={handleDeactivateSelected}
                    >
                      Ngừng kích hoạt
                    </Button>
                    <Button onClick={handleActivateSelected}>Kích hoạt</Button>
                  </div>
                ) : (
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                    Trạng thái
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table Body */}
          {paginatedStaff.map((s, index) => (
            <div
              key={s.id}
              onClick={() => navigate(`/admin/staff/${s.id}`)}
              className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[15px] py-0 w-full cursor-pointer ${
                index === paginatedStaff.length - 1
                  ? "border-transparent"
                  : "border-[#e7e7e7]"
              } ${selectedStaff.has(s.id) ? "bg-blue-50" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-[450px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedStaff.has(s.id)}
                        onChange={(checked) => handleSelectItem(s.id, checked)}
                        className="w-[30px] h-[30px]"
                      />
                    </div>
                    <div className="w-[70px] h-[70px] relative overflow-hidden rounded-lg border-2 border-dotted border-[#e04d30]">
                      <Avatar className="w-full h-full">
                        {s.avatar ? (
                          <AvatarImage src={s.avatar} alt={s.name} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {s.name.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col gap-[10px] h-full items-center justify-center">
                      <span className="font-semibold text-[14px] text-[#1a71f6] leading-[1.4] h-[70px] flex items-center">
                        {s.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-[8px] h-[50px] items-center px-[5px] py-[14px] flex-1">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                      {s.role}
                    </span>
                  </div>
                  <div className="flex gap-[4px] h-full items-center justify-end p-[14px] flex-1">
                    <div className="bg-[#b2ffb4] rounded-[10px]">
                      <div className="flex gap-[10px] items-center justify-center px-[8px] py-[6px]">
                        <span className="font-semibold text-[14px] text-[#04910c] leading-[1.4]">
                          Đang kích hoạt
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
        <div className="bg-white border border-[#e7e7e7] flex h-[48px] items-center justify-between px-[30px] py-[10px] rounded-[12px] w-full">
          <div className="flex gap-[3px] items-start">
            <div className="flex flex-col font-normal justify-center leading-[0] text-[12px] text-[#737373]">
              <p className="leading-[1.5]">
                Đang hiển thị{" "}
                {Math.min((currentPage - 1) * 10 + 1, filtered.length)} -{" "}
                {Math.min(currentPage * 10, filtered.length)} trong tổng{" "}
                {Math.ceil(filtered.length / 10)} trang
              </p>
            </div>
          </div>
          <div className="flex gap-[16px] items-start">
            <div className="flex gap-[13px] items-center">
              <div className="flex flex-col font-normal justify-center leading-[0] text-[12px] text-[#454545]">
                <p className="leading-[1.5]">Trang số</p>
              </div>
              <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                <div className="flex flex-col font-normal justify-center leading-[0] text-[12px] text-[#454545]">
                  <p className="leading-[1.5]">{currentPage}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-[6px] items-start">
              <div
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
              >
                <ChevronLeft className="w-[20px] h-[20px] text-[#d1d1d1]" />
              </div>
              <div
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage >= Math.ceil(filtered.length / 10)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleNextPage}
              >
                <ChevronRight className="w-[20px] h-[20px] text-[#454545]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;
