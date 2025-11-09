import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";

import { Pagination } from "@/components/ui/pagination";
import CaretDown from "@/components/ui/caret-down";
import Icon from "@/components/icons/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TabMenuWithBadge,
  PageContainer,
  ContentCard,
  type TabItemWithBadge,
} from "@/components/common";

type ImportStatus = "all" | "processing" | "completed";

interface WarehouseImport {
  id: string;
  importCode: string;
  createdDate: string;
  paymentMethod: "cash" | "transfer";
  status: "processing" | "completed";
  importStatus: "not_imported" | "imported";
  paymentStatus: "paid" | "unpaid";
  supplier: string;
  createdBy: string;
  totalItems: number;
  totalValue: number;
}

const mockImports: WarehouseImport[] = [
  {
    id: "1",
    importCode: "NK001",
    createdDate: "2024-01-15",
    paymentMethod: "cash",
    status: "processing",
    importStatus: "not_imported",
    paymentStatus: "unpaid",
    supplier: "Công ty TNHH ABC",
    createdBy: "Nguyễn Văn A",
    totalItems: 150,
    totalValue: 25000000,
  },
  {
    id: "2",
    importCode: "NK002",
    createdDate: "2024-01-16",
    paymentMethod: "transfer",
    status: "processing",
    importStatus: "imported",
    paymentStatus: "paid",
    supplier: "Công ty XYZ",
    createdBy: "Trần Thị B",
    totalItems: 200,
    totalValue: 35000000,
  },
  {
    id: "3",
    importCode: "NK003",
    createdDate: "2024-01-10",
    paymentMethod: "transfer",
    status: "completed",
    importStatus: "imported",
    paymentStatus: "paid",
    supplier: "Nhà cung cấp DEF",
    createdBy: "Lê Văn C",
    totalItems: 75,
    totalValue: 12000000,
  },
  {
    id: "4",
    importCode: "NK004",
    createdDate: "2024-01-12",
    paymentMethod: "cash",
    status: "processing",
    importStatus: "not_imported",
    paymentStatus: "unpaid",
    supplier: "Công ty GHI",
    createdBy: "Phạm Thị D",
    totalItems: 300,
    totalValue: 50000000,
  },
  {
    id: "5",
    importCode: "NK005",
    createdDate: "2024-01-08",
    paymentMethod: "transfer",
    status: "completed",
    importStatus: "imported",
    paymentStatus: "paid",
    supplier: "Nhà cung cấp JKL",
    createdBy: "Hoàng Văn E",
    totalItems: 120,
    totalValue: 18000000,
  },
];

const AdminWarehouseImports = () => {
  document.title = "Nhập hàng | Wanderoo";

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ImportStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [imports] = useState<WarehouseImport[]>(mockImports);
  const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");

  // Calculate counts for each tab
  const tabCounts = useMemo(() => {
    const counts = {
      all: imports.length,
      processing: imports.filter(item => item.status === 'processing').length,
      completed: imports.filter(item => item.status === 'completed').length,
    };
    return counts;
  }, [imports]);

  const tabs: TabItemWithBadge[] = [
    { id: "all", label: "Tất cả", count: tabCounts.all },
    { id: "processing", label: "Đang giao dịch", count: tabCounts.processing },
    { id: "completed", label: "Đã hoàn thành", count: tabCounts.completed },
  ];

  const filteredImports = useMemo(() => {
    return imports.filter((importItem) => {
      const matchesTab = activeTab === "all" || importItem.status === activeTab;
      const matchesSearch =
        searchTerm === "" ||
        importItem.importCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        importItem.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        importItem.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [imports, activeTab, searchTerm]);

  const paginatedImports = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredImports.slice(startIndex, startIndex + 10);
  }, [filteredImports, currentPage]);

  const totalPages = Math.ceil(filteredImports.length / 10);

  const getStatusChip = (status: ImportStatus) => {
    if (status === "processing" || status === "completed") {
      return <ChipStatus status={status as ChipStatusKey} />;
    }
    return null;
  };



  const getImportStatusChip = (status: WarehouseImport["importStatus"]) => {
    if (status === "not_imported" || status === "imported") {
      return <ChipStatus status={status as ChipStatusKey} />;
    }
    return null;
  };

  const getPaymentStatusChip = (status: WarehouseImport["paymentStatus"]) => {
    if (status === "paid" || status === "unpaid") {
      return <ChipStatus status={status as ChipStatusKey} />;
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
    })
      .format(amount)
      .replace("VND", "đ")
      .replace(/\s/g, "");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-[5px]">
        <h1 className="font-bold text-[24px] text-[#272424] font-['Montserrat']">
          Nhập hàng
        </h1>
        <Button
          variant={"default"}
          className="h-[36px]"
          onClick={() => navigate("/admin/warehouse/imports/create")}
        >
          <Icon name="plus" size={16} color="#ffffff" strokeWidth={3} />
          <span>Tạo đơn nhập hàng</span>
        </Button>
      </div>
      {/* Tab Menu */}
      <TabMenuWithBadge
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId as ImportStatus);
          setCurrentPage(1);
        }}
        className="w-full mx-auto"
      />
      <ContentCard>
        {/* Search and Filter Section */}
        <div className="flex flex-col gap-[8px] items-center relative rounded-[20px] w-full">
          <div className="flex gap-[8px] items-center justify-left relative w-full">
            <div className="flex flex-row items-center self-stretch">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp..."
                className="flex-1 w-[clamp(180px,40vw,400px)]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-white border-2 border-[#e04d30] flex gap-[6px] items-center justify-center px-[20px] py-[8px] rounded-[10px] cursor-pointer">
                  <span className="text-[#e04d30] text-[11px] font-semibold leading-[1.4]">
                    {selectedStatus}
                  </span>
                  <CaretDown className="text-[#e04d30]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Tất cả trạng thái")}
                >
                  Tất cả trạng thái
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Đang giao dịch")}
                >
                  Đang giao dịch
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Đã hoàn thành")}
                >
                  Đã hoàn thành
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Chưa nhập")}
                >
                  Chưa nhập
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("Đã nhập")}>
                  Đã nhập
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Chưa thanh toán")}
                >
                  Chưa thanh toán
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Đã thanh toán")}
                >
                  Đã thanh toán
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Section */}
        <div className="border-[0.5px] border-[#d1d1d1] rounded-[16px] w-full">
          {/* Fixed Table Header - Desktop */}
          <div className="bg-[#f6f6f6] rounded-tl-[16px] rounded-tr-[16px] sticky top-0 z-10 hidden lg:block">
            <div className="grid grid-cols-12 gap-2 px-4 py-3">
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Mã đơn
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Ngày tạo
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Trạng thái
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  TT Nhập
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  TT Thanh toán
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Nhà cung cấp
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Người tạo
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  SL
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Giá trị
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                  Thao tác
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="max-h-[600px] overflow-y-auto">
            {paginatedImports.map((importItem, index) => (
              <div
                key={importItem.id}
                className={`border-b border-[#e7e7e7] hover:bg-gray-50 ${index === paginatedImports.length - 1 ? "border-b-0 rounded-bl-[16px] rounded-br-[16px]" : ""}`}
              >
                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-4 items-center">
                  <div className="col-span-1 text-center">
                    <span
                      className="font-semibold text-[12px] text-[#1a71f6] cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin/warehouse/imports/${importItem.id}`)}
                    >
                      {importItem.importCode}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium text-[#272424] text-[12px]">
                      {formatDate(importItem.createdDate)}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getStatusChip(importItem.status)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getImportStatusChip(importItem.importStatus)}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getPaymentStatusChip(importItem.paymentStatus)}
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium text-[#272424] text-[12px] truncate block" title={importItem.supplier}>
                      {importItem.supplier}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium text-[#272424] text-[12px] truncate block" title={importItem.createdBy}>
                      {importItem.createdBy}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium text-[#272424] text-[12px]">
                      {importItem.totalItems}
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium text-[#272424] text-[12px]" title={formatCurrency(importItem.totalValue)}>
                      {(importItem.totalValue / 1000000).toFixed(0)}M
                    </span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span
                      className="font-medium text-[12px] text-[#1a71f6] cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin/warehouse/returns/create?importId=${importItem.id}`)}
                    >
                      Trả hàng
                    </span>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden px-4 py-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className="font-semibold text-[14px] text-[#1a71f6] cursor-pointer hover:underline"
                        onClick={() => navigate(`/admin/warehouse/imports/${importItem.id}`)}
                      >
                        {importItem.importCode}
                      </span>
                      <div className="text-[12px] text-gray-500 mt-1">
                        {formatDate(importItem.createdDate)}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {getStatusChip(importItem.status)}
                      {getImportStatusChip(importItem.importStatus)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-gray-600">Nhà cung cấp:</span>
                      <span className="font-medium text-right max-w-[60%] truncate" title={importItem.supplier}>
                        {importItem.supplier}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-gray-600">Người tạo:</span>
                      <span className="font-medium">{importItem.createdBy}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-600">SL / Giá trị:</span>
                      <span className="font-medium">
                        {importItem.totalItems} / {(importItem.totalValue / 1000000).toFixed(0)}M
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      {getPaymentStatusChip(importItem.paymentStatus)}
                    </div>
                    <span
                      className="font-medium text-[12px] text-[#1a71f6] cursor-pointer hover:underline bg-blue-50 px-3 py-1 rounded-lg"
                      onClick={() => navigate(`/admin/warehouse/returns/create?importId=${importItem.id}`)}
                    >
                      Trả hàng
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="py-[8px] w-full flex-shrink-0">
          <Pagination
            current={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      </ContentCard>
    </PageContainer>
  );

};

export default AdminWarehouseImports;
