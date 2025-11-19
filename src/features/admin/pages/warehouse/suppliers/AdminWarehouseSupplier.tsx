import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icons/Icon";
import { SearchBar } from "@/components/ui/search-bar";
import CaretDown from "@/components/ui/caret-down";
import { Pagination } from "@/components/ui/pagination";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { ChipStatus } from "@/components/ui/chip-status";
import { getProviderList, deleteAllProviders } from "@/api/endpoints/warehouseApi";
import type { ProviderResponse } from "@/types";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SupplierRow = {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
};

const PAGE_SIZE = 10;

const AdminWarehouseSupplier = () => {
  document.title = "Nhà cung cấp | Wanderoo";

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<number>>(new Set());
  const [statusOverrides, setStatusOverrides] = useState<Record<number, "active" | "inactive">>({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["providers", { keyword: debouncedSearch, page: currentPage }],
    queryFn: () =>
      getProviderList(
        debouncedSearch || undefined,
        undefined,
        currentPage,
        PAGE_SIZE
      ),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const providers = data?.providers ?? [];
  const totalPages = data?.totalPages ?? 1;

  const normalizedSuppliers = useMemo<SupplierRow[]>(() => {
    return providers.map((provider: ProviderResponse) => {
      const backendStatus =
        provider.status?.toLowerCase() === "inactive" ? "inactive" : "active";
      const overrideStatus = statusOverrides[provider.id];
      return {
        id: provider.id,
        code:
          provider.code ||
          `NCC${(provider.id ?? 0).toString().padStart(4, "0")}`,
        name: provider.name ?? "—",
        email: provider.email ?? "—",
        phone: provider.phone ?? "—",
        status: overrideStatus ?? backendStatus,
      };
    });
  }, [providers, statusOverrides]);

  useEffect(() => {
    if (!providers.length) return;
    setStatusOverrides((prev) => {
      const next = { ...prev };
      providers.forEach((provider) => {
        const backendStatus =
          provider.status?.toLowerCase() === "inactive" ? "inactive" : "active";
        const override = next[provider.id];
        if (override && override === backendStatus) {
          delete next[provider.id];
        }
      });
      return next;
    });
  }, [providers]);

  const paginatedSuppliers = useMemo(() => {
    if (statusFilter === "all") {
      return normalizedSuppliers;
    }
    return normalizedSuppliers.filter(
      (supplier) => supplier.status === statusFilter
    );
  }, [normalizedSuppliers, statusFilter]);

  useEffect(() => {
    setSelectedSuppliers(new Set());
  }, [currentPage, normalizedSuppliers]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all items on current page
      const newSelected = new Set(selectedSuppliers);
      paginatedSuppliers.forEach((s) => newSelected.add(s.id));
      setSelectedSuppliers(newSelected);
    } else {
      // Deselect all items on current page
      const newSelected = new Set(selectedSuppliers);
      paginatedSuppliers.forEach((s) => newSelected.delete(s.id));
      setSelectedSuppliers(newSelected);
    }
  };

  const handleSelectItem = (supplierId: number) => (checked: boolean) => {
    const newSelected = new Set(selectedSuppliers);
    if (checked) {
      newSelected.add(supplierId);
    } else {
      newSelected.delete(supplierId);
    }
    setSelectedSuppliers(newSelected);
  };

  const { mutateAsync: deactivateSuppliers, isPending: isDeactivating } = useMutation({
    mutationFn: async (ids: number[]) => {
      await deleteAllProviders({ getAll: ids });
    },
    onSuccess: (_, ids) => {
      toast.success(`Đã ngừng kích hoạt ${ids.length} nhà cung cấp`);
      setSelectedSuppliers(new Set());
      setStatusOverrides((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          next[id] = "inactive";
        });
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
    onError: (error) => {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Không thể ngừng kích hoạt, vui lòng thử lại.";
      toast.error(message);
    },
  });

  const handlePrimaryAction = () => {
    toast.info("API kích hoạt chưa được hỗ trợ từ backend.");
  };

  const handleSecondaryAction = async () => {
    const ids = Array.from(selectedSuppliers);
    if (ids.length === 0) return;
    await deactivateSuppliers(ids);
  };

  const isEmpty = !isLoading && !isFetching && paginatedSuppliers.length === 0;
  const safeTotalPages = Math.max(1, totalPages);
  const loadingState = isLoading || isFetching;
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Vui lòng thử lại sau.";

  return (
    <div className="flex flex-col gap-[8px] items-center w-full max-w-full overflow-hidden">
      {/* Suppliers Table */}
      <div className="flex items-center justify-between w-full flex-nowrap gap-2">
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
          Danh sách nhà cung cấp
        </h2>
        <Button
          variant={"default"}
          className="h-[36px] flex-shrink-0"
          onClick={() => navigate("/admin/warehouse/supplier/new")}
        >
          <Icon name="plus" size={16} color="#ffffff" strokeWidth={3} />
          <span className="whitespace-nowrap">Thêm mới nhà cung cấp</span>
        </Button>
      </div>
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[12px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
        {/* Search and Filter */}
        <div className="flex gap-[8px] items-center w-full">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
            className="flex-1 max-w-[400px]"
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
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Ngừng kích hoạt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full overflow-x-auto relative">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full min-w-[1180px] h-[56px]">
                  <div className="flex flex-row items-center w-full">
              <div className="flex gap-[6px] items-center px-[4px] py-[12px] min-w-[24px] flex-shrink-0">
                <CustomCheckbox
                  checked={
                    paginatedSuppliers.length > 0 &&
                    paginatedSuppliers.every((s) => selectedSuppliers.has(s.id))
                  }
                  onChange={handleSelectAll}
                />
              </div>
              {selectedSuppliers.size > 0 ? (
                <div className="flex items-center gap-[12px] flex-1 px-[4px]">
                  <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] whitespace-nowrap">
                    Đã chọn {selectedSuppliers.size} nhà cung cấp
                  </span>
                  <div className="flex gap-[8px]">
                    <Button
                      variant="default"
                      onClick={handlePrimaryAction}
                      className="text-[12px] px-[12px] py-[6px] h-auto"
                      disabled={isDeactivating}
                    >
                      Kích hoạt
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSecondaryAction}
                      className="text-[12px] px-[12px] py-[6px] h-auto whitespace-nowrap"
                      disabled={isDeactivating}
                    >
                      Ngừng kích hoạt
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-[6px] items-center justify-center -ml-[24px] pr-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Mã NCC
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Tên NCC
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Số điện thoại
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Email
                    </span>
                  </div>
                  <div className="flex gap-[4px] items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Table Body */}
          {paginatedSuppliers.map((s, index) => (
            <div
              key={s.id}
              className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[12px] py-0 w-full min-w-[1180px] ${
                index === paginatedSuppliers.length - 1
                  ? "border-transparent"
                  : "border-[#e7e7e7]"
              } ${
                selectedSuppliers.has(s.id) ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center px-[4px] py-[12px] min-w-[24px] flex-shrink-0">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedSuppliers.has(s.id)}
                        onChange={handleSelectItem(s.id)}
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center justify-center -ml-[24px] pr-[12px] py-[12px] flex-1 min-w-0">
                    <span
                      className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] whitespace-nowrap cursor-pointer hover:underline text-center"
                      onClick={() =>
                        navigate(`/admin/warehouse/supplier/${s.id}`)
                      }
                    >
                      {s.code}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                      {s.name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                      {s.phone}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center truncate">
                      {s.email}
                    </span>
                  </div>
                  <div className="flex gap-[4px] h-full items-center justify-center px-[12px] py-[12px] flex-1 min-w-0">
                    <ChipStatus
                      status={s.status === "active" ? "active" : "disabled"}
                      labelOverride={
                        s.status === "active"
                          ? " Đang kích hoạt"
                          : "Ngừng kích hoạt"
                      }
                      size="small"
                      className="font-bold leading-normal"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isEmpty && (
            <div className="flex flex-col items-center justify-center w-full min-w-[1180px] py-10 text-[#737373]">
              <p className="text-sm font-medium">Không có nhà cung cấp nào phù hợp.</p>
              <p className="text-xs">Hãy kiểm tra lại bộ lọc hoặc từ khóa tìm kiếm.</p>
            </div>
          )}

          {loadingState && (
            <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#e04d30] animate-spin" />
              <p className="text-sm font-semibold text-[#e04d30]">
                Đang tải danh sách nhà cung cấp...
              </p>
            </div>
          )}

          {isError && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="font-semibold text-red-600">Không thể tải danh sách nhà cung cấp</p>
              <p className="text-sm text-[#737373]">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={safeTotalPages}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminWarehouseSupplier;
