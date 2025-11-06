import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icons/Icon";
import { SearchBar } from "@/components/ui/search-bar";
import CaretDown from "@/components/ui/caret-down";
import { Pagination } from "@/components/ui/pagination";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { ChipStatus } from "@/components/ui/chip-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Supplier = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  contactPerson: string;
  registrationDate: string;
  totalProducts: number;
  lastOrderDate: string;
};

const mockSuppliers: Supplier[] = [
  {
    id: "S001",
    name: "Công ty TNHH Thời trang ABC",
    company: "ABC Fashion Co.",
    email: "contact@abcfashion.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    status: "active",
    contactPerson: "Nguyễn Văn A",
    registrationDate: "2024-01-15",
    totalProducts: 150,
    lastOrderDate: "2024-10-15",
  },
  {
    id: "S002",
    name: "Nhà cung cấp Thể thao XYZ",
    company: "XYZ Sports Supply",
    email: "info@xyzsports.com",
    phone: "0987654321",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    status: "active",
    contactPerson: "Trần Thị B",
    registrationDate: "2024-02-20",
    totalProducts: 89,
    lastOrderDate: "2024-10-10",
  },
  {
    id: "S003",
    name: "Công ty Dệt may DEF",
    company: "DEF Textile Ltd.",
    email: "sales@deftextile.com",
    phone: "0369852147",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    status: "inactive",
    contactPerson: "Lê Văn C",
    registrationDate: "2024-03-10",
    totalProducts: 200,
    lastOrderDate: "2024-09-20",
  },
  {
    id: "S004",
    name: "Nhà cung cấp Phụ kiện GHI",
    company: "GHI Accessories Co.",
    email: "contact@ghiaccessories.com",
    phone: "0741258963",
    address: "321 Đường GHI, Quận 4, TP.HCM",
    status: "active",
    contactPerson: "Phạm Thị D",
    registrationDate: "2024-01-05",
    totalProducts: 75,
    lastOrderDate: "2024-10-12",
  },
  {
    id: "S005",
    name: "Công ty Giày dép JKL",
    company: "JKL Footwear Inc.",
    email: "info@jklfootwear.com",
    phone: "0852369741",
    address: "654 Đường JKL, Quận 5, TP.HCM",
    status: "active",
    contactPerson: "Hoàng Văn E",
    registrationDate: "2024-04-12",
    totalProducts: 120,
    lastOrderDate: "2024-10-08",
  },
  {
    id: "S006",
    name: "Nhà cung cấp Túi xách MNO",
    company: "MNO Bags & More",
    email: "sales@mnobags.com",
    phone: "0963258741",
    address: "987 Đường MNO, Quận 6, TP.HCM",
    status: "active",
    contactPerson: "Vũ Thị F",
    registrationDate: "2024-02-28",
    totalProducts: 95,
    lastOrderDate: "2024-10-05",
  },
  {
    id: "S007",
    name: "Công ty Đồng hồ PQR",
    company: "PQR Watches Co.",
    email: "contact@pqrwatches.com",
    phone: "0147258369",
    address: "147 Đường PQR, Quận 7, TP.HCM",
    status: "inactive",
    contactPerson: "Đặng Văn G",
    registrationDate: "2024-01-20",
    totalProducts: 60,
    lastOrderDate: "2024-08-15",
  },
  {
    id: "S008",
    name: "Nhà cung cấp Trang sức STU",
    company: "STU Jewelry Ltd.",
    email: "info@stujewelry.com",
    phone: "0789632145",
    address: "258 Đường STU, Quận 8, TP.HCM",
    status: "active",
    contactPerson: "Bùi Thị H",
    registrationDate: "2024-03-25",
    totalProducts: 180,
    lastOrderDate: "2024-10-18",
  },
];

const AdminWarehouseSupplier = () => {
  document.title = "Nhà cung cấp | Wanderoo";

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(
    new Set()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const result = suppliers.filter((s) => {
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    // Reset to page 1 when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
    return result;
  }, [suppliers, statusFilter, searchTerm, currentPage]);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

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

  const handleSelectItem = (supplierId: string) => (checked: boolean) => {
    const newSelected = new Set(selectedSuppliers);
    if (checked) {
      newSelected.add(supplierId);
    } else {
      newSelected.delete(supplierId);
    }
    setSelectedSuppliers(newSelected);
  };

  const handlePrimaryAction = () => {
    // TODO: Implement primary action (e.g., activate suppliers)
    console.log(
      "Primary action on selected suppliers:",
      Array.from(selectedSuppliers)
    );
    setSelectedSuppliers(new Set());
  };

  const handleSecondaryAction = () => {
    // TODO: Implement secondary action (e.g., deactivate suppliers)
    console.log(
      "Secondary action on selected suppliers:",
      Array.from(selectedSuppliers)
    );
    setSelectedSuppliers(new Set());
  };

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
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full overflow-x-auto">
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
                    >
                      Đang kích hoạt
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSecondaryAction}
                      className="text-[12px] px-[12px] py-[6px] h-auto whitespace-nowrap"
                    >
                      Ngừng kích hoạt
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-[6px] items-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                      Mã NCC
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                      Tên NCC
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                      Số điện thoại
                    </span>
                  </div>
                  <div className="flex gap-[6px] items-center px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                      Email
                    </span>
                  </div>
                  <div className="flex gap-[4px] items-center justify-end p-[14px] flex-1 min-w-0">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
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
                  <div className="flex h-full items-center px-[4px] py-[12px] flex-1 min-w-0 ml-[7px]">
                    <span
                      className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] whitespace-nowrap cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/admin/warehouse/supplier/${s.id}`)
                      }
                    >
                      {s.id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                      {s.name}
                    </span>
                    <span className="font-medium text-[#737373] text-[11px] leading-[1.3]">
                      {s.company}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4]">
                      {s.phone}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px] flex-1 min-w-0">
                    <span className="font-medium text-[#272424] text-[13px] leading-[1.4] truncate">
                      {s.email}
                    </span>
                  </div>
                  <div className="flex gap-[4px] h-full items-center justify-end p-[14px] flex-1 min-w-0">
                    <ChipStatus
                      status={s.status === "active" ? "active" : "disabled"}
                      labelOverride={
                        s.status === "active"
                          ? " Đang kích hoạt"
                          : "Ngừng kích hoạt"
                      }
                      className="font-bold text-[12px] leading-normal"
                    />
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

export default AdminWarehouseSupplier;
