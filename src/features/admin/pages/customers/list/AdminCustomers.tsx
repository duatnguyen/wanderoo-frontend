// src/pages/admin/AdminCustomers.tsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { 
  getCustomers, 
  enableCustomerAccounts, 
  disableCustomerAccounts
} from "@/api/endpoints/userApi";
import { toast } from "sonner";
import type { CustomerPageResponse } from "@/types";
import type { CustomerResponse } from "@/types/api";

const AdminCustomers: React.FC = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputValue, setSearchInputValue] = useState(""); // Temporary value for input
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");
  const [selectedCustomers, setSelectedCustomers] = useState<Set<number>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldFocusLastPage, setShouldFocusLastPage] = useState(false);
  const navigate = useNavigate();

  // Check if we should focus last page after adding new customer
  useEffect(() => {
    const state = location.state as { shouldFocusLastPage?: boolean } | null;
    if (state?.shouldFocusLastPage) {
      setShouldFocusLastPage(true);
      // Clear the state to avoid re-triggering on re-render
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Fetch customers from API
  const {
    data: customersData,
    isLoading,
    isError,
  } = useQuery<CustomerPageResponse>({
    queryKey: ["admin-customers", currentPage, searchTerm, statusFilter],
    queryFn: () =>
      getCustomers({
        page: currentPage,
        size: 10,
        search: searchTerm || undefined,
        // Note: Backend doesn't support status filter, we'll filter on frontend
      }),
  });

  // Filter customers by status on frontend (backend doesn't support status filter)
  // Note: When filtering, we need to fetch all customers first, then filter
  const { data: allCustomersData } = useQuery<CustomerPageResponse>({
    queryKey: ["admin-customers-all", searchTerm],
    queryFn: () =>
      getCustomers({
        page: 1,
        size: 1000, // Fetch a large number to get all customers for filtering
        search: searchTerm || undefined,
      }),
    enabled: statusFilter !== "all", // Only fetch when filtering
  });

  // Filter customers by status on frontend (backend doesn't support status filter)
  const filteredCustomers = useMemo(() => {
    // Use all customers data when filtering, otherwise use paginated data
    const sourceData = statusFilter !== "all" ? allCustomersData : customersData;
    const allCustomers = sourceData?.content || [];
    
    console.log("Customers from API:", allCustomers);
    console.log("Status filter:", statusFilter);
    
    if (statusFilter === "all") {
      return allCustomers;
    }
    
    const filtered = allCustomers.filter((c) => {
      const customerStatus = c.status?.toUpperCase();
      if (statusFilter === "active") {
        return customerStatus === "ACTIVE";
      } else if (statusFilter === "disabled") {
        return customerStatus === "INACTIVE" || customerStatus === "DISABLED";
      }
      return true;
    });
    
    console.log("Filtered customers:", filtered);
    return filtered;
  }, [customersData?.content, allCustomersData?.content, statusFilter]);

  // Calculate total pages based on filter mode
  const totalPages = useMemo(() => {
    if (statusFilter !== "all") {
      // When filtering, calculate from filtered customers
      return Math.max(1, Math.ceil(filteredCustomers.length / 10));
    } else {
      // When showing all, use backend pagination
      return customersData?.totalPages || 1;
    }
  }, [statusFilter, filteredCustomers.length, customersData?.totalPages]);

  // Handle focusing last page after adding new customer
  useEffect(() => {
    if (shouldFocusLastPage && totalPages) {
      const lastPage = Math.max(1, totalPages);
      if (currentPage !== lastPage) {
        setCurrentPage(lastPage);
      }
      setShouldFocusLastPage(false);
    }
  }, [shouldFocusLastPage, currentPage, totalPages]);

  // Paginate filtered customers
  const customers = useMemo(() => {
    if (statusFilter === "all") {
      // When showing all, use backend pagination
      return filteredCustomers;
    } else {
      // When filtering, paginate on frontend
      const startIndex = (currentPage - 1) * 10;
      const endIndex = startIndex + 10;
      return filteredCustomers.slice(startIndex, endIndex);
    }
  }, [filteredCustomers, currentPage, statusFilter]);

  // Enable/Disable customer mutations
  const enableMutation = useMutation({
    mutationFn: (ids: number[]) => enableCustomerAccounts({ ids }),
    onSuccess: () => {
      toast.success("Kích hoạt khách hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      setSelectedCustomers(new Set());
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Không thể kích hoạt khách hàng"
      );
    },
  });

  const disableMutation = useMutation({
    mutationFn: (ids: number[]) => disableCustomerAccounts({ ids }),
    onSuccess: () => {
      toast.success("Ngừng kích hoạt khách hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      setSelectedCustomers(new Set());
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Không thể ngừng kích hoạt khách hàng"
      );
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all items on current page
      const newSelected = new Set(selectedCustomers);
      customers.forEach((c) => newSelected.add(c.id));
      setSelectedCustomers(newSelected);
    } else {
      // Deselect all items on current page
      const newSelected = new Set(selectedCustomers);
      customers.forEach((c) => newSelected.delete(c.id));
      setSelectedCustomers(newSelected);
    }
  };

  const handleSelectItem = (customerId: number, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      newSelected.add(customerId);
    } else {
      newSelected.delete(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const handleActivateSelected = () => {
    if (selectedCustomers.size === 0) return;
    enableMutation.mutate(Array.from(selectedCustomers));
  };

  const handleDeactivateSelected = () => {
    if (selectedCustomers.size === 0) return;
    disableMutation.mutate(Array.from(selectedCustomers));
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Danh sách khách hàng" />
        <ContentCard>
          <div className="flex items-center justify-center py-8">
            <p className="text-[#272424] text-[16px]">Đang tải danh sách khách hàng...</p>
          </div>
        </ContentCard>
      </PageContainer>
    );
  }

  // Error state
  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Danh sách khách hàng" />
        <ContentCard>
          <div className="flex items-center justify-center py-8">
            <p className="text-[#272424] text-[16px]">Không thể tải danh sách khách hàng</p>
          </div>
        </ContentCard>
      </PageContainer>
    );
  }

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
            value={searchInputValue}
            onChange={(e) => {
              setSearchInputValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent form submission and keep focus in input
                setSearchTerm(searchInputValue);
                setCurrentPage(1); // Reset to page 1 when search changes
              }
            }}
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
                      ? "Đang hoạt động"
                      : "Ngừng kích hoạt"}
                </span>
                <CaretDown className="text-[#e04d30]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                setStatusFilter("all");
                setCurrentPage(1);
              }}>
                Tất cả trạng thái
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setStatusFilter("active");
                setCurrentPage(1);
              }}>
                Đang hoạt động
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setStatusFilter("disabled");
                setCurrentPage(1);
              }}>
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
                    customers.length > 0 &&
                    customers.every((c) => selectedCustomers.has(c.id))
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
                      onClick={handleActivateSelected}
                      disabled={enableMutation.isPending || disableMutation.isPending}
                    >
                      Kích hoạt
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-[32px] px-[16px] rounded-[10px] border-2 border-[#e04d30] text-[#e04d30] hover:bg-[#ffe9e5] hover:text-[#c73722] transition-colors duration-150 text-[12px]"
                      onClick={handleDeactivateSelected}
                      disabled={enableMutation.isPending || disableMutation.isPending}
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
          {customers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-[#737373] text-[14px]">Không có khách hàng nào</p>
            </div>
          ) : (
            customers.map((c: CustomerResponse, index) => (
              <div
                key={c.id}
                className={`w-full min-h-[70px] ${index === customers.length - 1
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
                        {(c as any).image_url ? (
                          <AvatarImage src={(c as any).image_url} alt={c.name} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {c.name?.charAt(0) || "N"}
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
                      {c.email || "---"}
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
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("vi-VN") : "---"}
                    </span>
                  </div>

                  {/* Total spent col */}
                  <div className="flex flex-col gap-[2px] items-start justify-center px-[4px]">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                      {c.totalOrderAmount ? `${parseFloat(c.totalOrderAmount).toLocaleString('vi-VN')}đ` : "0đ"}
                    </span>
                    <span className="font-medium text-[#737373] text-[11px] leading-[1.3]">
                      {c.totalOrders || "0"} đơn hàng
                    </span>
                  </div>

                  {/* Status col */}
                  <div className="flex items-center justify-center px-[4px]">
                    <ChipStatus
                      status={c.status?.toUpperCase() === "ACTIVE" ? "active" : "disabled"}
                      labelOverride={c.status?.toUpperCase() === "ACTIVE" ? "Đang hoạt động" : "Ngừng kích hoạt"}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </ContentCard>
    </PageContainer>
  );
};

export default AdminCustomers;
