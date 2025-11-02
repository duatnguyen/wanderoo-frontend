// src/pages/admin/AdminStaff.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icons/Icon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CaretDown from "@/components/ui/caret-down";
import { SearchBar } from "@/components/ui/search-bar";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { Pagination } from "@/components/ui/pagination";
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

  const totalPages = Math.ceil(filtered.length / 10);

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
    <div className="flex flex-col gap-[8px] items-center w-full max-w-full overflow-x-hidden">
      {/* Store Owner Header */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[8px] items-start justify-center px-[24px] py-[20px] rounded-[24px] w-full">
        <h1 className="font-bold text-[#272424] text-[20px] leading-normal">
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
              <span
                className="font-semibold text-[#1a71f6] text-[14px] leading-normal cursor-pointer hover:underline"
                onClick={() => navigate("/admin/staff/S001")}
              >
                {storeOwner.name}
              </span>
            </div>
          </div>
          <div className="bg-[#b2ffb4] h-[24px] flex gap-[10px] items-center justify-center px-[8px] rounded-[10px]">
            <span className="font-semibold text-[13px] text-[#04910c] leading-[1.4]">
              Đang kích hoạt
            </span>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[8px] items-start px-[24px] py-[24px] rounded-[24px] w-full">
        <div className="flex items-center justify-between w-full flex-nowrap gap-2">
          <div className="flex gap-[8px] items-center min-w-0 flex-1">
            <h2 className="font-bold text-[#272424] text-[20px] leading-normal whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
              Tài khoản nhân viên
            </h2>
          </div>
          <Button onClick={() => navigate("/admin/staff/new")} className="h-[36px] flex-shrink-0">
            <Icon name="plus" size={14} color="#ffffff" strokeWidth={3} />
            <span className="whitespace-nowrap">Thêm tài khoản nhân viên</span>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-[10px] items-center w-full flex-wrap">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
            className="flex-1 min-w-0 max-w-[500px]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white border border-[#e04d30] flex gap-[6px] items-center justify-center px-[24px] h-[36px] rounded-[12px] cursor-pointer flex-shrink-0 whitespace-nowrap">
                <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4]">
                  {statusFilter === "all" ? "Tất cả trạng thái" : statusFilter === "active" ? "Đang kích hoạt" : "Ngừng kích hoạt"}
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
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full overflow-x-auto">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full min-w-[1100px] h-[58px]">
            <div className="flex flex-row items-center w-full h-full">
              <div className={`flex gap-[8px] h-full items-center px-[5px] py-[14px] min-h-[58px] ${
                selectedStaff.size > 0 ? "flex-1" : "w-[450px]"
              }`}>
                <CustomCheckbox
                  checked={
                    paginatedStaff.length > 0 &&
                    paginatedStaff.every((s) => selectedStaff.has(s.id))
                  }
                  onChange={(checked) => handleSelectAll(checked)}
                  className="w-[30px] h-[30px]"
                />
                {selectedStaff.size > 0 ? (
                  <div className="flex items-center gap-[8px] whitespace-nowrap">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                      Đã chọn {selectedStaff.size} tài khoản
                    </span>
                    <div className="flex gap-[6px] items-center ml-[8px]">
                      <Button
                        className="h-[36px] rounded-[10px] text-[14px]"
                        onClick={handleActivateSelected}
                      >
                        Đang kích hoạt
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-[36px] rounded-[10px] text-[14px]"
                        onClick={handleDeactivateSelected}
                      >
                        Ngừng kích hoạt
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                    Tài khoản
                  </span>
                )}
              </div>
              <div className="flex gap-[8px] h-full items-center justify-center pl-0 pr-[5px] py-[14px] flex-1 min-h-[58px]">
                {selectedStaff.size === 0 && (
                  <span className="font-semibold text-[#272424] text-[14px] leading-[1.5] text-center">
                    Vai trò
                  </span>
                )}
              </div>
              <div className="flex gap-[4px] h-full items-center justify-end px-[5px] py-[14px] flex-1 min-h-[58px]">
                {selectedStaff.size > 0 ? null : (
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
              className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[15px] py-0 w-full min-w-[1100px] ${
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
                    <div className="w-[56px] h-[56px] relative overflow-hidden rounded-lg border-2 border-dotted border-[#e04d30]">
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
                      <span
                        className="font-semibold text-[14px] text-[#1a71f6] leading-[1.4] h-[56px] flex items-center cursor-pointer hover:underline"
                        onClick={() => navigate(`/admin/staff/${s.id}`)}
                      >
                        {s.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-[8px] h-[50px] items-center justify-center pl-0 pr-[5px] py-[14px] flex-1">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.5] text-center">
                      {s.role}
                    </span>
                  </div>
                  <div className="flex gap-[4px] h-full items-center justify-end px-[5px] py-[14px] flex-1">
                    <div className="bg-[#b2ffb4] h-[24px] rounded-[10px] flex items-center">
                      <div className="flex gap-[10px] items-center justify-center px-[8px]">
                        <span className="font-semibold text-[13px] text-[#04910c] leading-[1.4]">
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
        <div className="px-[15px] py-[8px] w-full flex-shrink-0">
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;
