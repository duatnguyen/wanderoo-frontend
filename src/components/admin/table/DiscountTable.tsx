import React from "react";
import { DataTable } from "./DataTable";
import type { TableColumn } from "./DataTable";
import { CreditCardPercentIcon } from "@/components/icons/discount";
import type { Voucher } from "@/types/voucher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, FileText, X } from "lucide-react";

import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";

export interface DiscountTableProps {
  vouchers: Voucher[];
  loading?: boolean;
  selectedRows?: Set<string | number>;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onEdit?: (voucher: Voucher) => void;
  onViewOrders?: (voucher: Voucher) => void;
  onEnd?: (voucher: Voucher) => void;
  className?: string;
  selectable?: boolean;
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Đang diễn ra":
      return "bg-[#b2ffb4] text-[#04910c]";
    case "Sắp diễn ra":
      return "bg-[#cce5ff] text-[#0066cc]";
    case "Đã kết thúc":
      return "bg-[#f6f6f6] text-[#737373]";
    default:
      return "bg-[#f6f6f6] text-[#737373]";
  }
};

const getDisplayStatusKey = (display: string): ChipStatusKey => {
  switch (display) {
    case "Website":
      return "active";
    case "POS":
      return "processing";
    case "POS + Website":
      return "confirmed";
    default:
      return "default";
  }
};

export const DiscountTable: React.FC<DiscountTableProps> = ({
  vouchers,
  loading = false,
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
  onEdit,
  onViewOrders,
  onEnd,
  className,
  selectable = false,
}) => {
  const columns: TableColumn[] = [
    {
      key: "name",
      title: "Tên voucher | Mã voucher",
      width: "250px",
      minWidth: "200px",
      className: "",
      render: (_, voucher: Voucher) => (
        <div className="flex gap-2 sm:gap-[10px] items-center">
          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
            <CreditCardPercentIcon size={20} color="#292D32" className="sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1 sm:gap-[4px] items-start justify-center">
              <div
                className={`flex gap-1 sm:gap-[10px] items-center justify-center h-5 sm:h-6 px-1.5 sm:px-2 rounded-[4px] sm:rounded-[6px] ${getStatusBadgeClass(
                  voucher.status
                )}`}
              >
                <p className="font-bold text-[10px] sm:text-[12px] leading-[normal] whitespace-nowrap">
                  {voucher.status}
                </p>
              </div>
              <div className="font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4] min-w-0">
                <p className="mb-0 truncate" title={voucher.name}>
                  <span className="hidden sm:inline">
                    {voucher.name.length > 25
                      ? `${voucher.name.substring(0, 25)}...`
                      : voucher.name}
                  </span>
                  <span className="sm:hidden">
                    {voucher.name.length > 15
                      ? `${voucher.name.substring(0, 15)}...`
                      : voucher.name}
                  </span>
                </p>
                <p className="truncate text-[10px] sm:text-[13px]">Mã: {voucher.code}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Loại mã",
      width: "120px",
      minWidth: "100px",
      className: "text-center justify-center hidden md:flex",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          {voucher.type === "Voucher khách hàng mới" ? (
            <p className="font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4]">
              Voucher khách<br className="hidden lg:block" />hàng mới
            </p>
          ) : (
            <p className="font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4]">
              {voucher.type}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "products",
      title: "SP áp dụng",
      width: "120px",
      minWidth: "90px",
      className: "text-center justify-center hidden lg:flex",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4]">
            {voucher.products}
          </p>
        </div>
      ),
    },
    {
      key: "discount",
      title: "Giảm giá",
      width: "100px",
      minWidth: "80px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4]">
            {voucher.discount}
          </p>
        </div>
      ),
    },
    {
      key: "maxUsage",
      title: "Lượt dùng tối đa",
      width: "120px",
      minWidth: "100px",
      className: "text-center justify-center hidden sm:flex",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4]">
            {voucher.maxUsage}
          </p>
        </div>
      ),
    },
    {
      key: "used",
      title: "Đã dùng",
      width: "80px",
      minWidth: "70px",
      className: "text-center justify-center hidden lg:flex",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4]">
            {voucher.used}
          </p>
        </div>
      ),
    },
    {
      key: "display",
      title: "Hiển thị",
      width: "120px",
      minWidth: "100px",
      className: "text-center justify-center hidden lg:flex",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          {voucher.display ? (
            <ChipStatus
              status={getDisplayStatusKey(voucher.display)}
              labelOverride={voucher.display}
              size="small"
            />
          ) : (
            <span className="text-gray-400 text-xs">-</span>
          )}
        </div>
      ),
    },
    {
      key: "dates",
      title: "Thời gian",
      width: "180px",
      minWidth: "140px",
      className: "text-center justify-center hidden md:flex",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center font-medium text-xs sm:text-[13px] text-[#272424] leading-[1.4]">
          <div>
            <p className="mb-0">{voucher.startDate} -</p>
            <p>{voucher.endDate}</p>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      width: "80px",
      minWidth: "80px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => {
        const hasActions = (onEdit || onViewOrders || (onEnd && voucher.status !== "Đã kết thúc"));
        
        if (!hasActions) {
          return (
            <div className="text-center w-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">-</span>
            </div>
          );
        }

        return (
          <div className="text-center w-full flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Thao tác"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(voucher);
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </DropdownMenuItem>
                )}
                {onViewOrders && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrders(voucher);
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Xem đơn hàng</span>
                  </DropdownMenuItem>
                )}
                {onEnd && voucher.status !== "Đã kết thúc" && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnd(voucher);
                    }}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Kết thúc</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <DataTable
          columns={columns}
          data={vouchers}
          loading={loading}
          selectable={selectable}
          selectedRows={selectedRows}
          onSelectRow={onSelectRow}
          onSelectAll={onSelectAll}
          getRowId={(voucher) => voucher.id}
          className=""
          headerClassName="bg-[#f6f6f6] border-b border-[#e7e7e7] rounded-t-lg sticky top-0 z-10"
          rowClassName={(voucher) => 
            `border-t border-[#d1d1d1] transition-colors ${
              selectedRows.has(voucher.id) 
                ? "bg-blue-50" 
                : "hover:bg-gray-50"
            }`
          }
        />
      </div>
    </div>
  );
};
