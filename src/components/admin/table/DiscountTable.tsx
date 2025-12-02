import React from "react";
import { DataTable } from "./DataTable";
import type { TableColumn } from "./DataTable";
import { CreditCardPercentIcon } from "@/components/icons/discount";
import type { Voucher } from "@/types/voucher";

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
      width: "280px",
      minWidth: "280px",
      className: "",
      render: (_, voucher: Voucher) => (
        <div className="flex gap-[10px] items-center">
          <div className="flex items-center justify-center w-[24px] h-[24px] flex-shrink-0">
            <CreditCardPercentIcon size={24} color="#292D32" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-[4px] items-start justify-center">
              <div
                className={`flex gap-[10px] items-center justify-center h-[24px] px-[8px] rounded-[6px] ${getStatusBadgeClass(
                  voucher.status
                )}`}
              >
                <p className="font-bold text-[12px] leading-[normal] whitespace-nowrap">
                  {voucher.status}
                </p>
              </div>
              <div className="font-medium text-[13px] text-[#272424] leading-[1.4] min-w-0">
                <p className="mb-0 truncate" title={voucher.name}>
                  {voucher.name.length > 25 
                    ? `${voucher.name.substring(0, 25)}...` 
                    : voucher.name}
                </p>
                <p className="truncate">Mã voucher: {voucher.code}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      title: "Loại mã",
      width: "140px",
      minWidth: "140px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          {voucher.type === "Voucher khách hàng mới" ? (
            <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
              Voucher khách<br/>hàng mới
            </p>
          ) : (
            <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
              {voucher.type}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "products",
      title: "SP áp dụng",
      width: "150px",
      minWidth: "150px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
            {voucher.products}
          </p>
        </div>
      ),
    },
    {
      key: "discount",
      title: "Giảm giá",
      width: "120px",
      minWidth: "120px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
            {voucher.discount}
          </p>
        </div>
      ),
    },
    {
      key: "maxUsage",
      title: "Tổng lượt sử dụng tối đa",
      width: "130px",
      minWidth: "130px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
            {voucher.maxUsage}
          </p>
        </div>
      ),
    },
    {
      key: "used",
      title: "Đã dùng",
      width: "130px",
      minWidth: "130px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
            {voucher.used}
          </p>
        </div>
      ),
    },
    {
      key: "display",
      title: "Hiển thị",
      width: "140px",
      minWidth: "140px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center">
          <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
            {voucher.display}
          </p>
        </div>
      ),
    },
    {
      key: "dates",
      title: "Thời gian lưu",
      width: "220px",
      minWidth: "220px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center font-medium text-[13px] text-[#272424] leading-[1.4]">
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
      width: "120px",
      minWidth: "120px",
      className: "text-center justify-center",
      render: (_, voucher: Voucher) => (
        <div className="text-center w-full flex items-center justify-center font-semibold text-[13px] text-[#1a71f6] leading-[1.4]">
          <div>
            {onEdit && (
              <p 
                className="mb-0 hover:opacity-70 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(voucher);
                }}
              >
                Chỉnh sửa
              </p>
            )}
            {onViewOrders && (
              <p 
                className="mb-0 hover:opacity-70 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewOrders(voucher);
                }}
              >
                Đơn hàng
              </p>
            )}
            {onEnd && voucher.status !== "Đã kết thúc" && (
              <p
                className="hover:opacity-70 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEnd(voucher);
                }}
              >
                Kết thúc
              </p>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="table-responsive xl:overflow-x-visible table-scroll-horizontal">
      <div className="table-container" style={{ borderRadius: '24px', borderColor: '#e7e7e7' }}>
        <DataTable
          columns={columns}
          data={vouchers}
          loading={loading}
          selectable={selectable}
          selectedRows={selectedRows}
          onSelectRow={onSelectRow}
          onSelectAll={onSelectAll}
          getRowId={(voucher) => voucher.id}
          className={className}
          headerClassName="bg-[#f6f6f6] border-b border-[#e7e7e7] rounded-tl-[24px] rounded-tr-[24px]"
          rowClassName="border-t border-[#d1d1d1]"
        />
      </div>
    </div>
  );
};
