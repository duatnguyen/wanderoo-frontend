import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  TabMenu,
  OrderTableHeader,
} from "@/components/common";
import type { TabItem } from "@/components/common";
import { ChipStatus } from "@/components/ui/chip-status";
import { DetailIcon } from "@/components/icons";
import {
  otherStatusOrders,
  STATUS_CHIP_MAP,
  TABLE_COLUMNS,
  type OtherStatusOrder,
  type ReturnStatus,
  type ShippingInfo,
  type TableColumnId,
} from "./orderOtherStatusData";

type ReturnStatusTab = "ALL" | ReturnStatus;
type MainTabValue = "ALL" | "RETURN" | "CANCEL" | "FAILED";

const MAIN_TABS: TabItem[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "RETURN", label: "Đơn Trả hàng Hoàn tiền" },
  { id: "CANCEL", label: "Đơn Hủy" },
  { id: "FAILED", label: "Đơn Giao hàng không thành công" },
];

const RETURN_STATUS_TABS: Array<{ id: ReturnStatusTab; label: string }> = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING_REVIEW", label: "Đang chờ xét duyệt" },
  { id: "RETURNING", label: "Đang trả hàng" },
  { id: "REFUNDED", label: "Đã hoàn tiền cho người mua" },
  { id: "INVALID", label: "Yêu cầu bị hủy/không hợp lệ" },
];

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatCurrency = (value: number) =>
  currencyFormatter.format(value).replace(" ₫", "₫");

type ReturnStatusCounter = Record<ReturnStatus | "ALL", number>;

const createEmptyReturnCounts = (): ReturnStatusCounter => ({
  ALL: 0,
  PENDING_REVIEW: 0,
  RETURNING: 0,
  REFUNDED: 0,
  INVALID: 0,
});

const AdminOrderOtherStatus = () => {
  document.title = "Đơn trạng thái khác | Wanderoo";
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<MainTabValue>("RETURN");
  const [activeStatusTab, setActiveStatusTab] =
    useState<ReturnStatusTab>("ALL");

  useEffect(() => {
    if (activeMainTab === "RETURN" || activeStatusTab === "ALL") {
      return;
    }
    setActiveStatusTab("ALL");
  }, [activeMainTab, activeStatusTab]);

  const returnStatusCounts = useMemo(() => {
    return otherStatusOrders.reduce((acc, order) => {
      if (order.category === "RETURN") {
        acc.ALL += 1;
        acc[order.statusKey] = (acc[order.statusKey] || 0) + 1;
      }
      return acc;
    }, createEmptyReturnCounts());
  }, []);

  const filteredOrders = useMemo(() => {
    const base = otherStatusOrders.filter((order) => {
      if (activeMainTab === "ALL") return true;
      return order.category === activeMainTab;
    });

    if (activeMainTab === "RETURN" && activeStatusTab !== "ALL") {
      return base.filter((order) => order.statusKey === activeStatusTab);
    }

    return base;
  }, [activeMainTab, activeStatusTab]);

  const handleViewDetail = (order: OtherStatusOrder) => {
    navigate(`/admin/orders/otherstatus/${order.id}`, {
      state: { order },
    });
  };

  const renderProductCell = (order: OtherStatusOrder) => (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold uppercase text-[#737373]">
        Tên sản phẩm
      </p>
      {order.products.map((product) => (
        <div key={product.id} className="flex items-start gap-3">
          <div className="w-[60px] h-[60px] rounded-[10px] border border-dashed border-[#cfcfcf] bg-[#fafafa] flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[10px] text-[#9b9b9b] text-center px-1">
                No image
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-montserrat font-semibold text-[13px] text-[#272424] leading-snug">
              {product.name}
            </p>
            <p className="font-montserrat text-[12px] text-[#555] leading-snug">
              Phân loại hàng (Nếu có):{" "}
              <span className="font-semibold">
                {product.variant || product.classification || "Không có"}
              </span>
            </p>
            <p className="font-montserrat text-[12px] text-[#8c8c8c] leading-snug">
              x{product.quantity} •{" "}
              {formatCurrency(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAmountCell = (order: OtherStatusOrder) => {
    const totalItems = order.products.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
    const totalAmount = order.products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    return (
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase text-[#737373]">
            Tổng tiền sản phẩm trong đơn
          </p>
          <p className="font-montserrat font-bold text-[16px] text-[#e04d30]">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="text-[12px] text-[#555]">
          <p>
            Hoàn tiền dự kiến:{" "}
            <span className="font-semibold text-[#272424]">
              {formatCurrency(order.refundAmount)}
            </span>
          </p>
          <p>Số lượng sản phẩm: {totalItems}</p>
        </div>
      </div>
    );
  };

  const renderReasonCell = (order: OtherStatusOrder) => (
    <div className="flex flex-col gap-2">
      <p className="font-montserrat font-semibold text-[13px] text-[#272424]">
        {order.reason}
      </p>
      <p className="text-[12px] text-[#555]">
        Người tạo yêu cầu:{" "}
        <span className="font-semibold">{order.customerName}</span>
      </p>
      {order.reasonTags && order.reasonTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {order.reasonTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#ffd4c9] bg-[#fff4f0] px-2 py-0.5 text-[11px] font-semibold text-[#e04d30]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderResolutionCell = (order: OtherStatusOrder) => (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] text-[#555]">{order.optionDescription}</p>
      <ol className="list-decimal pl-4 text-[12px] text-[#272424] space-y-1">
        {order.options.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ol>
    </div>
  );

  const renderShippingCell = (
    shipping: ShippingInfo,
    alignTimeline = false
  ) => (
    <div className="flex flex-col gap-2">
      <ChipStatus
        status={shipping.chip}
        labelOverride={shipping.label}
        size="small"
      />
      {shipping.note && (
        <p className="text-[12px] text-[#555]">{shipping.note}</p>
      )}
      {shipping.timeline && (
        <ol
          className={`list-decimal pl-4 text-[11px] text-[#737373] space-y-0.5 ${
            alignTimeline ? "min-h-[72px]" : ""
          }`}
        >
          {shipping.timeline.map((step: string) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
    </div>
  );

  const renderStatusCell = (order: OtherStatusOrder) => (
    <div className="flex flex-col gap-2">
      <ChipStatus
        status={STATUS_CHIP_MAP[order.statusKey]}
        labelOverride={order.statusLabel}
        size="small"
      />
      <p className="text-[12px] text-[#555]">{order.statusDescription}</p>
      <p className="text-[11px] text-[#8c8c8c]">
        Cập nhật: {order.lastUpdated}
      </p>
    </div>
  );

  const renderSourceCell = (order: OtherStatusOrder) => {
    const isWebsite = order.source === "Website";

    return (
      <div className="flex flex-col gap-2">
        <span
          className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
            isWebsite
              ? "bg-[#e6f0ff] text-[#1a56db]"
              : "bg-[#fff1d6] text-[#c27803]"
          }`}
        >
          {order.source}
        </span>
        <p className="text-[12px] text-[#555]">{order.sourceNote}</p>
      </div>
    );
  };

  const renderActionCell = (order: OtherStatusOrder) => (
    <div className="flex flex-col gap-3">
      <button
        className="flex items-center gap-2 text-[12px] font-semibold text-[#1a71f6] hover:underline"
        onClick={() => handleViewDetail(order)}
      >
        <DetailIcon size={16} color="#1a71f6" />
        Xem chi tiết
      </button>
      <button className="text-[12px] font-semibold text-[#272424] underline-offset-2 hover:underline">
        Xem lịch sử xử lý
      </button>
    </div>
  );

  const columnRenderer: Record<
    TableColumnId,
    (order: OtherStatusOrder) => ReactNode
  > = {
    product: renderProductCell,
    amount: renderAmountCell,
    reason: renderReasonCell,
    resolution: renderResolutionCell,
    status: renderStatusCell,
    forward: (order) => renderShippingCell(order.forwardShipping, true),
    return: (order) => renderShippingCell(order.returnShipping),
    source: renderSourceCell,
    action: renderActionCell,
  };

  const renderOrderMetaRow = (order: OtherStatusOrder) => (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ececec] bg-[#f6f8fb] px-4 py-3">
      <div className="flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[#4a4a4a]">
        <span className="flex items-center gap-1">
          <span className="text-[#7b7b7b]">ID khách hàng:</span>
          <span className="text-[#1a71f6]">{order.customerId}</span>
        </span>
        <span className="hidden h-3 w-px bg-[#d9d9d9] sm:block" />
        <span className="flex items-center gap-1">
          <span className="text-[#7b7b7b]">Mã đơn hàng:</span>
          <span className="text-[#272424]">{order.orderCode}</span>
        </span>
      </div>
      <p className="text-[12px] font-medium text-[#8c8c8c]">
        Cập nhật gần nhất:{" "}
        <span className="font-semibold text-[#272424]">
          {order.lastUpdated}
        </span>
      </p>
    </div>
  );

  return (
    <PageContainer className="flex flex-col gap-6">
      <PageHeader
        title="Đơn Trả hàng / Trạng thái khác"
        subtitle="Theo dõi toàn bộ yêu cầu trả hàng, hủy và giao hàng thất bại trong cùng một bảng điều khiển."
      />

      <ContentCard className="bg-white border border-[#dcdcdc] rounded-[20px] p-[20px] flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <TabMenu
            tabs={MAIN_TABS}
            activeTab={activeMainTab}
            onTabChange={(tabId) => setActiveMainTab(tabId as MainTabValue)}
            variant="underline"
            className="border-none"
          />

          {activeMainTab === "RETURN" && (
            <div className="rounded-[14px] border border-[#f2f2f2] bg-[#fbfbfb] px-4 py-3">
              <div className="flex flex-wrap gap-4">
                {RETURN_STATUS_TABS.map((tab) => {
                  const isActive = activeStatusTab === tab.id;
                  const count = returnStatusCounts[tab.id];

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveStatusTab(tab.id)}
                      className={`flex items-center gap-2 border-b-2 pb-1 text-[13px] font-semibold transition-colors ${
                        isActive
                          ? "border-[#e04d30] text-[#e04d30]"
                          : "border-transparent text-[#737373] hover:text-[#e04d30]"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          isActive
                            ? "bg-[#ffe3dd] text-[#e04d30]"
                            : "bg-[#f1f1f1] text-[#737373]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-[12px] border border-dashed border-[#e7e7e7] bg-[#fffdfc] px-4 py-3">
          <p className="text-[13px] text-[#555]">
            Hiển thị{" "}
            <span className="font-semibold text-[#272424]">
              {filteredOrders.length} yêu cầu
            </span>{" "}
            phù hợp với bộ lọc hiện tại.
          </p>
          <p className="text-[12px] text-[#8c8c8c]">
            Cập nhật dữ liệu gần nhất: 20/11/2025 08:00
          </p>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[1200px] flex flex-col gap-4">
            <div className="border border-[#ededed] rounded-[14px] overflow-hidden w-fit">
              <OrderTableHeader columns={TABLE_COLUMNS} className="w-full" />
            </div>
            {filteredOrders.length === 0 ? (
              <div className="border border-dashed border-[#d9d9d9] rounded-[16px] bg-[#fdfdfd] px-6 py-10 text-center">
                <p className="font-montserrat text-[16px] font-semibold text-[#272424]">
                  Chưa có yêu cầu nào cho bộ lọc này
                </p>
                <p className="text-[13px] text-[#737373] mt-2">
                  Vui lòng chọn lại tab khác hoặc kiểm tra bộ lọc trạng thái.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#e5e5e5] rounded-[16px] bg-white shadow-[0px_6px_18px_rgba(39,36,36,0.08)] w-fit"
                >
                  <div className="flex flex-col w-full">
                    {renderOrderMetaRow(order)}
                    <div className="flex w-full">
                      {TABLE_COLUMNS.map((column, index) => (
                        <div
                          key={`${order.id}-${column.id}`}
                          className={`px-4 py-5 ${column.width} ${
                            column.minWidth || ""
                          } ${index > 0 ? "border-l border-[#f2f2f2]" : ""}`}
                        >
                          {columnRenderer[column.id](order)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default AdminOrderOtherStatus;
