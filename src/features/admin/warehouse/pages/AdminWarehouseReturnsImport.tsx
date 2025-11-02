import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";

interface ReturnImport {
  id: string;
  returnCode: string;
  importCode: string;
  createdDate: string;
  paymentMethod: "cash" | "transfer";
  returnStatus: "returned" | "pending_return";
  refundStatus: "refunded" | "pending_refund";
  supplier: string;
  createdBy: string;
  returnQuantity: number;
  totalValue: number;
}

const mockReturns: ReturnImport[] = [
  {
    id: "1",
    returnCode: "SRT001",
    importCode: "REI001",
    createdDate: "2025-09-13T21:05:00",
    paymentMethod: "cash",
    returnStatus: "returned",
    refundStatus: "refunded",
    supplier: "Kho Nhật Quang",
    createdBy: "Admin ThanhNguyen",
    returnQuantity: 10000,
    totalValue: 1000000,
  },
  {
    id: "2",
    returnCode: "SRT002",
    importCode: "REI002",
    createdDate: "2025-09-12T15:30:00",
    paymentMethod: "transfer",
    returnStatus: "pending_return",
    refundStatus: "pending_refund",
    supplier: "Công ty ABC",
    createdBy: "Admin NguyenVanA",
    returnQuantity: 5000,
    totalValue: 750000,
  },
];

const AdminWarehouseReturnsImport = () => {
  document.title = "Trả hàng nhập | Wanderoo";

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [returns] = useState<ReturnImport[]>(mockReturns);
  const [returnStatus, setReturnStatus] = useState("Trạng thái hoàn hàng");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");

  const filteredReturns = useMemo(() => {
    return returns.filter((returnItem) => {
      const matchesSearch =
        searchTerm === "" ||
        returnItem.returnCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        returnItem.importCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        returnItem.supplier.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [returns, searchTerm]);

  const paginatedReturns = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredReturns.slice(startIndex, startIndex + 10);
  }, [filteredReturns, currentPage]);

  const totalPages = Math.ceil(filteredReturns.length / 10);

  const getPaymentMethodChip = (method: ReturnImport["paymentMethod"]) => {
    if (method === "cash" || method === "transfer") {
      return <ChipStatus status={method as ChipStatusKey} />;
    }
    return null;
  };

  const getReturnStatusChip = (status: ReturnImport["returnStatus"]) => {
    if (status === "returned") {
      return <ChipStatus status="completed" />;
    } else if (status === "pending_return") {
      return <ChipStatus status="processing" />;
    }
    return null;
  };

  const getRefundStatusChip = (status: ReturnImport["refundStatus"]) => {
    if (status === "refunded") {
      return <ChipStatus status="paid" />;
    } else if (status === "pending_refund") {
      return <ChipStatus status="unpaid" />;
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
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen max-h-screen w-full gap-1 px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-[4px] px-0 h-auto sm:h-[32px] w-full mb-2 gap-2 sm:gap-0">
        <h1 className="font-bold text-[20px] sm:text-[24px] text-[#272424] font-['Montserrat']">
          Danh sách đơn trả hàng nhập
        </h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto"
        >
          Tạo đơn trả hàng nhập
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-[#e7e7e7] flex flex-col items-start relative rounded-[20px] w-full max-w-full gap-1 flex-1 overflow-hidden">
        {/* Search and Filter Section */}
        <div className="flex flex-col gap-[8px] items-center px-[15px] py-[8px] relative rounded-[20px] w-full">
          <div className="flex flex-col sm:flex-row gap-[8px] items-stretch sm:items-center justify-left relative w-full">
            <div className="flex flex-row items-center self-stretch">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-full min-w-0 sm:max-w-[400px] md:max-w-[500px]"
              />
            </div>
            <SimpleDropdown
              value={returnStatus}
              options={[
                "Trạng thái hoàn hàng",
                "Tất cả trạng thái",
                "Đã hoàn trả",
                "Chưa hoàn trả",
              ]}
              onValueChange={setReturnStatus}
              placeholder="Trạng thái hoàn hàng"
              className="w-full sm:w-[200px]"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="px-[8px] sm:px-[15px] rounded-[16px] w-full">
          {/* Table Container with Scroll */}
          <div className="w-full overflow-x-auto -mx-[8px] sm:mx-0">
            <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-fit min-w-[1400px]">
              {/* Table Header */}
              <div className="bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4]">
                      Mã đơn trả
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Mã đơn nhập
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[180px] min-w-[180px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Ngày tạo
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Phương thức thanh toán
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái hoàn hàng
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                    <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] text-center">
                      Trạng thái hoàn tiền
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
                      Số lượng trả
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
              {paginatedReturns.map((returnItem, index) => (
                <div
                  key={returnItem.id}
                  className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[12px] py-0 w-full ${
                    index === paginatedReturns.length - 1
                      ? "border-transparent"
                      : "border-[#e7e7e7]"
                  } hover:bg-gray-50 cursor-pointer`}
                  onClick={() =>
                    navigate(`/admin/warehouse/returns/${returnItem.id}`)
                  }
                >
                  <div className="flex items-center w-full">
                    <div className="flex flex-row items-center w-full">
                      <div className="flex h-full items-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        <span className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] text-left">
                          {returnItem.returnCode}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        <span className="font-semibold text-[13px] text-[#1a71f6] leading-[1.3] text-center">
                          {returnItem.importCode}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[180px] min-w-[180px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {formatDate(returnItem.createdDate)}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                        {getPaymentMethodChip(returnItem.paymentMethod)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                        {getReturnStatusChip(returnItem.returnStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[140px] min-w-[140px]">
                        {getRefundStatusChip(returnItem.refundStatus)}
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[180px] min-w-[180px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {returnItem.supplier}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {returnItem.createdBy}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[120px] min-w-[120px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {returnItem.returnQuantity}
                        </span>
                      </div>
                      <div className="flex h-full items-center justify-center px-[4px] py-[12px] w-[130px] min-w-[130px]">
                        <span className="font-medium text-[#272424] text-[13px] leading-[1.4] text-center">
                          {formatCurrency(returnItem.totalValue)}
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

      {/* Create Return Import Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white w-[800px] max-w-[90vw] max-h-[90vh] flex flex-col rounded-[24px] shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#D1D1D1]">
              <h2 className="text-[24px] font-bold text-[#272424] font-montserrat">
                Tạo đơn trả hàng nhập
              </h2>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <SearchBar
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm"
                  className="w-full"
                />
              </div>

              {/* Table */}
              <div className="border border-[#D1D1D1] rounded-[16px] overflow-hidden">
                {/* Table Header */}
                <div className="bg-[#f6f6f6] flex items-center px-[12px] py-3 border-b border-[#D1D1D1]">
                  <div className="flex flex-row items-center w-full text-[13px] font-semibold text-[#272424]">
                    <div className="w-[150px]">Mã đơn nhập</div>
                    <div className="w-[150px]">Ngày tạo</div>
                    <div className="w-[150px]">Nhân viên</div>
                    <div className="w-[150px]">Nhà cung cấp</div>
                    <div className="w-[200px]">Giá trị đơn nhập hàng</div>
                    <div className="w-[100px] text-center">Thao tác</div>
                  </div>
                </div>

                {/* Table Body */}
                {mockReturns.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center px-[12px] py-3 border-b border-[#e7e7e7] hover:bg-gray-50 text-[13px] text-[#272424] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/warehouse/returns/${item.id}`);
                    }}
                  >
                    <div className="flex flex-row items-center w-full">
                      <div className="w-[150px] font-semibold text-[#1a71f6]">
                        {item.importCode}
                      </div>
                      <div className="w-[150px]">
                        {new Date(item.createdDate).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="w-[150px]">{item.createdBy}</div>
                      <div className="w-[150px]">{item.supplier}</div>
                      <div className="w-[200px]">
                        {formatCurrency(item.totalValue)}
                      </div>
                      <div className="w-[100px] text-center">
                        <span className="text-[#1a71f6] hover:underline cursor-pointer">
                          Trả hàng
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouseReturnsImport;
