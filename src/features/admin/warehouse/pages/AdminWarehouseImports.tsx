import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";
import TabMenuAccount from "@/components/ui/tab-menu-account";
import { Pagination } from "@/components/ui/pagination";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";

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
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");

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
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="flex flex-col h-screen max-h-screen w-full gap-1 px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-[4px] px-0 h-auto sm:h-[32px] w-full mb-2 gap-2 sm:gap-0">
        <h1 className="font-bold text-[20px] sm:text-[24px] text-[#272424] font-['Montserrat']">
          Nhập hàng
        </h1>
        <Button
          variant={"default"}
          onClick={() => navigate("/admin/warehouse/imports/create")}
          className="w-full sm:w-auto"
        >
          Tạo đơn nhập hàng
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-[#e7e7e7] flex flex-col items-start relative gap-3 rounded-[20px] w-full max-w-full flex-1 overflow-hidden">
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
        <div className="flex flex-col sm:flex-row gap-[8px] items-stretch sm:items-center px-[15px] justify-left relative w-full">
          <div className="flex flex-row items-center w-full sm:flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp..."
              className="w-full h-[40px] sm:max-w-[400px]"
            />
          </div>
          <div className="flex flex-row w-full sm:w-auto">
            <SimpleDropdown
              value={statusFilter}
              options={[
                "Tất cả trạng thái",
                "Đang kích hoạt",
                "Ngừng kích hoạt",
              ]}
              onValueChange={setStatusFilter}
              placeholder="Trạng thái"
              className="w-full sm:w-[200px]"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="px-[8px] sm:px-[15px] rounded-[16px] w-full">
          {/* Table Container with Scroll */}
          <div className="w-full overflow-x-auto -mx-[8px] sm:mx-0">
            <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-fit min-w-[1000px]">
              {/* Table Header */}
              <div className="bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center px-[4px] py-[12px] w-[150px] min-w-[150px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                      Mã đơn nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Ngày tạo
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Phương thức thanh toán
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái thanh toán
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[180px] min-w-[180px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Nhà cung cấp
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Người tạo
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Số lượng nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[130px] min-w-[130px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Giá trị đơn
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
                  } hover:bg-gray-50 cursor-pointer`}
                  onClick={() =>
                    navigate(`/admin/warehouse/imports/${importItem.id}`)
                  }
                >
                  <div className="flex items-center w-full">
                    <div className="flex flex-row items-center w-full">
                      <div className="flex h-full items-center px-[4px] py-[12px] w-[150px] min-w-[150px]">
                        <span className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] text-left">
                          {importItem.importCode}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {formatDate(importItem.createdDate)}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                        {getPaymentMethodChip(importItem.paymentMethod)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        {getStatusChip(importItem.status)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        {getImportStatusChip(importItem.importStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                        {getPaymentStatusChip(importItem.paymentStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[180px] min-w-[180px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {importItem.supplier}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {importItem.createdBy}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {importItem.totalItems}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[130px] min-w-[130px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {formatCurrency(importItem.totalValue)}
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
