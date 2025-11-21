// src/pages/admin/AdminStaff.tsx
import React, { useEffect, useMemo, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/api/endpoints/userApi";
import type { EmployeePageResponse, EmployeeResponse } from "@/types";

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

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  MANAGER: "Quản lý",
  EMPLOYEE: "Nhân viên",
  OPERATIONS_MANAGER: "Quản lý vận hành",
  CUSTOMER: "Khách hàng",
};

const getRoleLabel = (staff: EmployeeResponse) => {
  const rawType =
    (typeof staff.type === "string" ? staff.type : undefined) ?? staff.role;
  const normalizedType = rawType?.toUpperCase();
  if (normalizedType && ROLE_LABELS[normalizedType]) {
    return ROLE_LABELS[normalizedType];
  }
  if (staff.position) return staff.position;
  if (staff.department) return staff.department;
  return "Nhân viên";
};

const AdminStaff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => window.clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, isFetching, refetch } =
    useQuery<EmployeePageResponse>({
      queryKey: ["admin-staff", currentPage, debouncedSearch],
      queryFn: () =>
        getEmployees({
          page: currentPage,
          size: pageSize,
          search: debouncedSearch || undefined,
        }),
      placeholderData: (previousData: EmployeePageResponse | undefined) =>
        previousData,
    });

  const staff: EmployeeResponse[] = data?.content ?? [];

  const filtered = useMemo(() => {
    const result = staff.filter((s) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? s.status?.toUpperCase() === "ACTIVE"
            : s.status?.toUpperCase() !== "ACTIVE";
      const normalizedName = (s.name ?? "").toLowerCase();
      const normalizedUsername = (s.username ?? "").toLowerCase();
      const normalizedSearch = debouncedSearch.toLowerCase();
      const matchesSearch =
        debouncedSearch === "" ||
        normalizedName.includes(normalizedSearch) ||
        normalizedUsername.includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
    return result;
  }, [staff, statusFilter, debouncedSearch]);

  const paginatedStaff = filtered;
  const totalPages = data?.totalPages ?? 1;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all items on current page
      const newSelected = new Set(selectedStaff);
      paginatedStaff.forEach((s) => newSelected.add(String(s.id)));
      setSelectedStaff(newSelected);
    } else {
      // Deselect all items on current page
      const newSelected = new Set(selectedStaff);
      paginatedStaff.forEach((s) => newSelected.delete(String(s.id)));
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
          <Button
            onClick={() => navigate("/admin/staff/new")}
            className="h-[36px] flex-shrink-0"
          >
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
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full overflow-x-auto">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full min-w-[1100px] h-[58px]">
            <div className="flex flex-row items-center w-full h-full">
              <div
                className={`flex gap-[8px] h-full items-center px-[5px] py-[14px] min-h-[58px] ${
                  selectedStaff.size > 0 ? "flex-1" : "w-[450px]"
                }`}
              >
                <CustomCheckbox
                  checked={
                    paginatedStaff.length > 0 &&
                    paginatedStaff.every((s) => selectedStaff.has(String(s.id)))
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
                        Kích hoạt
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
          {isLoading || (isFetching && paginatedStaff.length === 0) ? (
            <div className="flex items-center justify-center w-full py-10">
              <span className="text-sm text-gray-500">
                Đang tải danh sách nhân viên...
              </span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center w-full py-10">
              <span className="text-sm font-medium text-red-500">
                Không thể tải danh sách nhân viên.
              </span>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => refetch()}
              >
                Thử lại
              </Button>
            </div>
          ) : paginatedStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full py-10">
              <span className="text-sm text-gray-600">
                Không có nhân viên nào phù hợp.
              </span>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => refetch()}
              >
                Tải lại
              </Button>
            </div>
          ) : (
            paginatedStaff.map((s, index) => (
              <div
                key={s.id}
                className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[15px] py-0 w-full min-w-[1100px] ${
                  index === paginatedStaff.length - 1
                    ? "border-transparent"
                    : "border-[#e7e7e7]"
                } ${
                  selectedStaff.has(String(s.id))
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center w-full">
                  <div className="flex flex-row items-center w-full">
                    <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-[450px]">
                      <div onClick={(e) => e.stopPropagation()}>
                        <CustomCheckbox
                          checked={selectedStaff.has(String(s.id))}
                          onChange={(checked) =>
                            handleSelectItem(String(s.id), checked)
                          }
                          className="w-[30px] h-[30px]"
                        />
                      </div>
                      <div className="w-[56px] h-[56px] relative overflow-hidden rounded-lg border-2 border-dotted border-[#e04d30]">
                        <Avatar className="w-full h-full">
                          {(
                            s as unknown as {
                              image_url?: string;
                              avatar?: string;
                            }
                          )?.image_url ||
                          (
                            s as unknown as {
                              image_url?: string;
                              avatar?: string;
                            }
                          )?.avatar ? (
                            <AvatarImage
                              src={
                                (
                                  s as unknown as {
                                    image_url?: string;
                                    avatar?: string;
                                  }
                                )?.image_url ??
                                (
                                  s as unknown as {
                                    image_url?: string;
                                    avatar?: string;
                                  }
                                )?.avatar
                              }
                              alt={s.name}
                            />
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
                        {getRoleLabel(s)}
                      </span>
                    </div>
                    <div className="flex gap-[4px] h-full items-center justify-end px-[5px] py-[14px] flex-1">
                      <div
                        className={`h-[24px] rounded-[10px] flex items-center ${
                          s.status?.toUpperCase() === "ACTIVE"
                            ? "bg-[#b2ffb4]"
                            : "bg-[#ffe0df]"
                        }`}
                      >
                        <div className="flex gap-[10px] items-center justify-center px-[8px]">
                          <span
                            className={`font-semibold text-[13px] leading-[1.4] ${
                              s.status?.toUpperCase() === "ACTIVE"
                                ? "text-[#04910c]"
                                : "text-[#c53030]"
                            }`}
                          >
                            {s.status?.toUpperCase() === "ACTIVE"
                              ? "Đang kích hoạt"
                              : "Ngừng kích hoạt"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
