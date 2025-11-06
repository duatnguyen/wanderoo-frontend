import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";
import TabMenuAccount from "@/components/ui/tab-menu-account";
import { Pagination } from "@/components/ui/pagination";
import CaretDown from "@/components/ui/caret-down";
import Icon from "@/components/icons/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "processing", label: "Đang giao dịch" },
    { id: "completed", label: "Đã hoàn thành" },
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

  const getPaymentMethodChip = (method: WarehouseImport["paymentMethod"]) => {
    if (method === "cash" || method === "transfer") {
      return <ChipStatus status={method as ChipStatusKey} />;
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
    <div className="flex flex-col h-screen max-h-screen w-full gap-0">
      {/* Header */}
      <div className="flex items-center justify-between py-[4px] px-0 h-[32px] w-full mb-[6px]">
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

      {/* Main Content */}
      <div className="bg-white border border-[#e7e7e7] flex flex-col items-start relative rounded-[20px] w-full max-w-full flex-1 overflow-x-auto">
        {/* Tab Menu */}
        <div className="flex flex-col gap-[8px] items-center px-[15px] py-[8px] relative rounded-[20px] w-full">
          <TabMenuAccount
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => {
              setActiveTab(tabId as ImportStatus);
              setCurrentPage(1);
            }}
            className="w-full mx-auto"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col gap-[8px] items-center px-[15px] py-[8px] relative rounded-[20px] w-full">
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
        <div className="flex flex-col items-start px-[15px] py-0 relative rounded-[16px] w-full">
          {/* Table Container with Scroll */}
          <div className="w-full overflow-x-auto">
            <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full min-w-[1400px]">
              {/* Table Header */}
              <div className="bg[#f6f6f6] bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[8px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Mã đơn nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[8px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Ngày tạo
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Phương thức <br />
                      thanh toán
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Trạng thái
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Trạng thái nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Trạng thái
                      <br /> thanh toán
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Nhà cung cấp
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Người tạo
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      SL nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-end xl:justify-center px-[20px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Giá trị đơn
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                      Thao tác
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              {paginatedImports.map((importItem, index) => (
                <div
                  key={importItem.id}
                  className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[12px] py-0 w-full ${
                    index === paginatedImports.length - 1
                      ? "border-transparent"
                      : "border-[#e7e7e7]"
                  }`}
                >
                  <div className="flex items-center w-full">
                    <div className="flex flex-row items-center w-full">
                      <div className="flex h-full items-center justify-center px-[8px] py-[12px] shrink-0 flex-1 min-w-0">
                        <span
                          className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] text-center whitespace-nowrap cursor-pointer hover:underline"
                          onClick={() =>
                            navigate(
                              `/admin/warehouse/imports/${importItem.id}`
                            )
                          }
                        >
                          {importItem.importCode}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[8px] py-[12px] shrink-0 flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                          {formatDate(importItem.createdDate)}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        {getPaymentMethodChip(importItem.paymentMethod)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        {getStatusChip(importItem.status)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        {getImportStatusChip(importItem.importStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        {getPaymentStatusChip(importItem.paymentStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                          {importItem.supplier}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                          {importItem.createdBy}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center whitespace-nowrap">
                          {importItem.totalItems}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-end xl:justify-center pr-[20px] pl-[8px] py-[12px] shrink-0 flex-1 min-w-0">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-right xl:text-center whitespace-nowrap">
                          {formatCurrency(importItem.totalValue)}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[6px] py-[12px] shrink-0 flex-1 min-w-0">
                        <span
                          className="font-medium text-[13px] text-[#1a71f6] leading-[1.4] text-center whitespace-nowrap cursor-pointer hover:underline"
                          onClick={() =>
                            navigate(
                              `/admin/warehouse/returns/create?importId=${importItem.id}`
                            )
                          }
                        >
                          Trả hàng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default AdminWarehouseImports;
