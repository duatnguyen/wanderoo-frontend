import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";
import { DatePicker } from "@/components/ui/date-picker";
import { useQuery } from "@tanstack/react-query";
import { getPosOrderList } from "@/api/endpoints/posApi";
import Loading from "@/components/common/Loading";

export type Order = {
  id: string;
  createdAt: string;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
};

export type SelectOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (orderId: string) => void;
  className?: string;
};

export const SelectOrderModal: React.FC<SelectOrderModalProps> = ({
  isOpen,
  onClose,
  onSelectOrder,
  className,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // reset pagination when filters change
    setCurrentPage(1);
  }, [searchValue, startDate, endDate]);

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "selectOrderModal",
      isOpen,
      searchValue,
      startDate,
      endDate,
      currentPage,
    ],
    queryFn: async () => {
      if (!isOpen) return null;
      return await getPosOrderList({
        search: searchValue || undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        page: currentPage - 1,
        size: pageSize,
        sort: "createdAt,desc",
      });
    },
    enabled: isOpen,
    refetchOnWindowFocus: false,
  });

  const orders = ordersData?.content ?? [];
  const mappedOrders = orders.map((order) => ({
    id: order.id,
    displayCode: order.code || order.id?.toString() || "",
    createdAt: order.createdAt,
    totalAmount: order.totalOrderPrice || 0,
  }));
  const totalPages = ordersData?.totalPages ?? 1;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const handleOrderReturn = (orderId: string) => {
    onSelectOrder(orderId);
    onClose();
    // Navigate to create return order page
    navigate(`/pos/returns/create/${orderId}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-50 bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e7e7]">
          <h2 className="text-xl font-bold text-[#272424]">
            Chọn đơn hàng để trả
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#272424]" />
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="px-6 py-4 border-b border-[#e7e7e7] flex items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm theo mã đơn hàng, tên, SĐT khách hàng"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <DatePicker
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              containerClassName="flex-1 min-w-[160px]"
            />
            <span className="text-[#272424] font-medium px-2">-</span>
            <DatePicker
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              containerClassName="flex-1 min-w-[160px]"
            />
          </div>
        </div>

        {/* Order List Table */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loading />
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <p className="text-sm text-red-500">
                Lỗi khi tải danh sách đơn hàng
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#e04d30] text-white rounded hover:bg-[#c23e24] text-sm"
              >
                Thử lại
              </button>
            </div>
          )}
          {!isLoading && !error && (
          <table className="w-full">
            <thead className="bg-[#f6f6f6] sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#272424]">
                  Mã đơn hàng
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#272424]">
                  Ngày tạo
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#272424]">
                  Tổng tiền
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-[#272424]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e7e7] bg-white">
              {mappedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-[#737373]"
                  >
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                mappedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleOrderReturn(order.id?.toString() || "")
                        }
                        className="text-sm font-medium text-[#007bff] hover:text-[#0056b3] hover:underline"
                      >
                        #{order.displayCode}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#272424]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#272424]">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleOrderReturn(order.id?.toString() || "")
                        }
                        className="text-sm font-medium text-[#007bff] hover:text-[#0056b3] hover:underline"
                      >
                        Trả hàng
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          )}
        </div>
        {!isLoading && !error && mappedOrders.length > 0 && (
          <div className="px-6 py-3 border-t border-[#e7e7e7] flex items-center justify-between text-sm">
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex items-center gap-3">
              <button
                className="px-3 py-1 rounded border border-[#e7e7e7] disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <button
                className="px-3 py-1 rounded border border-[#e7e7e7] disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
                }
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectOrderModal;
