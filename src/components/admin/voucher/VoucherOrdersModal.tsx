import React from "react";
import type {
  Voucher,
  VoucherOrder,
  VoucherOrderSummary,
} from "@/types/voucher";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";

interface VoucherOrdersModalProps {
  isOpen: boolean;
  voucher: Voucher | null;
  orders: VoucherOrder[];
  summary: VoucherOrderSummary;
  onClose: () => void;
}

const formatCurrencyVND = (value: number) => {
  try {
    const rounded = Math.round(value);
    return `${rounded.toLocaleString("vi-VN")}đ`;
  } catch (error) {
    console.error("Failed to format currency", error);
    return `${value.toLocaleString("vi-VN")}đ`;
  }
};

const formatDisplayDateTime = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const day = date.toLocaleDateString("vi-VN");
  return `${time} ${day}`;
};

const VoucherOrdersModal: React.FC<VoucherOrdersModalProps> = ({
  isOpen,
  voucher,
  orders,
  summary,
  onClose,
}) => {
  if (!isOpen || !voucher) return null;

  const startTime = formatDisplayDateTime(voucher.editData?.startDate);
  const endTime = formatDisplayDateTime(voucher.editData?.endDate);
  const discountValue =
    voucher.editData?.discountType === "percentage"
      ? `${voucher.editData?.discountValue ?? 0}%`
      : formatCurrencyVND(Number(voucher.editData?.discountValue ?? 0));
  const minOrderAmount = voucher.editData?.minOrderAmount
    ? formatCurrencyVND(Number(voucher.editData.minOrderAmount))
    : "Không áp dụng";
  const displayModeText = (() => {
    const mode = voucher.editData?.displaySetting;
    switch (mode) {
      case "website":
        return "Hiển thị trên một số trang";
      case "pos":
        return "Hiển thị tại điểm bán";
      case "pos-website":
        return "Hiển thị trên POS & Website";
      default:
        return voucher.display;
    }
  })();
  const voucherCategory = voucher.voucherCategory ?? "Khuyến Mãi";

  const statusChipMap: Record<
    VoucherOrder["status"],
    { key: ChipStatusKey; label: string }
  > = {
    "Đang xử lý": { key: "pending", label: "Đang xử lý" },
    "Đã giao": { key: "delivered", label: "Đã giao" },
    "Đã hủy": { key: "cancelled", label: "Đã hủy" },
    "Đã hoàn thành": { key: "completed", label: "Đã hoàn thành" },
    "Đang giao": { key: "shipping", label: "Đang giao" },
  };

  const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
  }) => (
    <div className="space-y-1">
      <p className="text-[12px] uppercase tracking-wide text-[#9ca3af] font-semibold">
        {label}
      </p>
      <div className="text-[14px] text-[#1f2937] font-medium leading-[1.4]">
        {value}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative z-[101] w-full max-w-[1024px] mx-4 max-h-[92vh] overflow-hidden rounded-[20px] bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
          <div>
            <h2 className="text-[20px] font-semibold text-[#222]">
              Đơn hàng sử dụng mã: {voucher.code}
            </h2>
            <p className="text-[13px] text-[#666] mt-1">
              Theo dõi hiệu quả và lịch sử sử dụng của chương trình giảm giá
            </p>
          </div>
          <button
            className="text-[#6b7280] hover:text-[#374151] transition-colors"
            aria-label="Đóng"
            onClick={onClose}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#f9fafb]">
          {/* Basic Info */}
          <div className="bg-white rounded-[18px] border border-[#e5e5e5] p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <InfoRow
                  label="Trạng thái"
                  value={
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f3f4f6] text-[#111827] font-semibold">
                      {voucher.status}
                    </span>
                  }
                />
                <InfoRow
                  label="Giá trị đơn hàng tối thiểu"
                  value={minOrderAmount}
                />
                <InfoRow label="Mã voucher" value={voucher.code} />
                <InfoRow label="Chế độ hiển thị Voucher" value={displayModeText} />
                <InfoRow
                  label="Đã dùng"
                  value={
                    <span className="inline-flex items-center">
                      {voucher.used.toLocaleString("vi-VN")}
                    </span>
                  }
                />
              </div>

              <div className="space-y-4">
                <InfoRow label="Tên chương trình giảm giá" value={voucher.name} />
                <InfoRow label="Giảm giá" value={discountValue} />
                <InfoRow label="Loại mã" value={voucher.type} />
                <InfoRow
                  label="Tổng lượt sử dụng tối đa"
                  value={voucher.maxUsage.toLocaleString("vi-VN")}
                />
                <InfoRow
                  label="Hiển thị"
                  value={
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] font-semibold">
                      {voucher.display}
                    </span>
                  }
                />
              </div>

              <div className="space-y-4">
                <InfoRow label="Loại Voucher" value={voucherCategory} />
                <InfoRow
                  label="Thời gian sử dụng"
                  value={
                    <span className="block text-[#4b5563]">
                      {startTime} đến {endTime}
                    </span>
                  }
                />
                <InfoRow label="Sản phẩm được áp dụng" value={voucher.products} />
                <InfoRow
                  label="Đã lưu"
                  value={
                    <span className="inline-flex items-center">
                      {(voucher.savedCount ?? 0).toLocaleString("vi-VN")}
                    </span>
                  }
                />
                <InfoRow
                  label="Giới hạn mỗi khách"
                  value={
                    voucher.editData?.maxUsagePerCustomer
                      ? `${voucher.editData.maxUsagePerCustomer} lần`
                      : "Không giới hạn"
                  }
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e5e5e5] rounded-[18px] p-5 text-center">
              <p className="text-[13px] text-[#6b7280] mb-2">
                Tổng số đơn hàng
              </p>
              <p className="text-[26px] font-semibold text-[#111827]">
                {summary.totalOrders.toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-[18px] p-5 text-center">
              <p className="text-[13px] text-[#6b7280] mb-2">
                Tổng giá trị giảm
              </p>
              <p className="text-[26px] font-semibold text-[#dc2626] no-underline">
                {formatCurrencyVND(summary.totalDiscountAmount)}
              </p>
            </div>
            <div className="bg-white border border-[#e5e5e5] rounded-[18px] p-5 text-center">
              <p className="text-[13px] text-[#6b7280] mb-2">
                Doanh thu sau giảm
              </p>
              <p className="text-[26px] font-semibold text-[#047857] no-underline">
                {formatCurrencyVND(summary.totalRevenue)}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-[18px] border border-[#e5e5e5]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#f9fafb] text-[#6b7280] text-[13px] uppercase">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-center">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Mức giảm
                    </th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Tổng số tiền
                    </th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Ngày đặt hàng
                    </th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[14px] text-[#111827]">
                  {orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-[#6b7280]"
                      >
                        Chưa có đơn hàng nào sử dụng voucher này.
                      </td>
                    </tr>
                  )}
                  {orders.map((order) => {
                    const mainItem = order.items[0];
                    const chip = statusChipMap[order.status] ?? {
                      key: "default" as ChipStatusKey,
                      label: order.status,
                    };
                    return (
                      <tr
                        key={order.id}
                        className="border-t border-[#e5e5e5] hover:bg-[#f9fafb]"
                      >
                        <td className="px-6 py-4 align-middle text-center">
                          <p className="font-medium text-[#1f2937]">
                            {order.code}
                          </p>
                        </td>
                        <td className="px-6 py-4 align-middle text-center">
                          <div className="mx-auto w-[48px] h-[48px] rounded-[12px] border border-[#e5e5e5] overflow-hidden flex items-center justify-center bg-white">
                            {mainItem?.image ? (
                              <img
                                src={mainItem.image}
                                alt={mainItem?.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[12px] text-[#9ca3af]">
                                N/A
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center align-middle text-[#dc2626] font-medium">
                          {formatCurrencyVND(order.discountAmount)}
                        </td>
                        <td className="px-6 py-4 text-center align-middle font-medium">
                          {formatCurrencyVND(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 align-middle text-center text-[#4b5563]">
                          {order.orderDate}
                        </td>
                        <td className="px-6 py-4 align-middle text-center">
                          <div className="flex justify-center">
                            <ChipStatus
                              status={chip.key}
                              labelOverride={chip.label}
                              className="h-[24px]"
                              textClassName="text-[12px]"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-3 px-6 py-4 border-t border-[#e5e5e5]">
              <div className="flex items-center gap-1 text-[14px] text-[#6b7280]">
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e5e5e5] text-[#6b7280] hover:text-[#111827]">
                  ‹
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e5e5e5] text-[#6b7280] hover:text-[#111827]">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#1d4ed8] bg-[#1d4ed8] text-white">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e5e5e5] text-[#6b7280] hover:text-[#111827]">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e5e5e5] text-[#6b7280] hover:text-[#111827]">
                  ›
                </button>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[#6b7280]">
                <span>Đi tới trang</span>
                <input
                  type="number"
                  min={1}
                  className="w-[60px] px-3 py-1 rounded-full border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                  placeholder="2"
                />
                <button className="px-4 py-1 rounded-full border border-[#d1d5db] text-[#1f2937] hover:bg-[#f9fafb]">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherOrdersModal;

