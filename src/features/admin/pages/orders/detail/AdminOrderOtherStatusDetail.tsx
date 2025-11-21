import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, ClipboardCopy } from "lucide-react";
import { PageContainer, ContentCard } from "@/components/common";
import { ChipStatus } from "@/components/ui/chip-status";
import {
  STATUS_CHIP_MAP,
  otherStatusOrders,
  type OtherStatusOrder,
  type ShippingInfo,
} from "../list/orderOtherStatusData";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatCurrency = (value: number) =>
  currencyFormatter.format(value).replace(" ₫", "₫");

const AddressCard = ({ label, value }: { label: string; value?: string }) => (
  <div className="rounded-[12px] border border-[#ececec] bg-white px-4 py-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#737373]">
      {label}
    </p>
    <p className="mt-1 text-[13px] font-medium text-[#272424] leading-snug">
      {value || "Chưa cập nhật"}
    </p>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col gap-1 rounded-[12px] border border-[#f1f1f1] bg-[#fcfcfc] px-4 py-3">
    <p className="text-[11px] font-semibold uppercase text-[#8c8c8c]">
      {label}
    </p>
    <p className="text-[14px] font-semibold text-[#272424]">
      {value || "Chưa cung cấp"}
    </p>
  </div>
);

const AdminOrderOtherStatusDetail = () => {
  document.title = "Chi tiết yêu cầu trả hàng | Wanderoo";
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [shippingExpanded, setShippingExpanded] = useState(true);

  const orderFromState = (location.state as { order?: OtherStatusOrder })
    ?.order;
  const order =
    orderFromState ||
    otherStatusOrders.find((candidate) => candidate.id === orderId);
  const shippingInfo = order?.forwardShipping;

  const statusBannerStyle = useMemo(() => {
    if (!order) {
      return {
        border: "border-[#e5e5e5]",
        bg: "bg-[#fbfbfb]",
        heading: "text-[#272424]",
      };
    }
    switch (order.statusKey) {
      case "PENDING_REVIEW":
        return {
          border: "border-[#f6d7a6]",
          bg: "bg-[#fff9f0]",
          heading: "text-[#b5721f]",
        };
      case "RETURNING":
        return {
          border: "border-[#c3e6cb]",
          bg: "bg-[#f2fff4]",
          heading: "text-[#1a7a33]",
        };
      case "REFUNDED":
        return {
          border: "border-[#b8daff]",
          bg: "bg-[#f1f8ff]",
          heading: "text-[#0f62c0]",
        };
      case "INVALID":
        return {
          border: "border-[#f5c2c7]",
          bg: "bg-[#fff5f5]",
          heading: "text-[#c11f2f]",
        };
      default:
        return {
          border: "border-[#e5e5e5]",
          bg: "bg-[#fbfbfb]",
          heading: "text-[#272424]",
        };
    }
  }, [order]);

  const handleCopyBankInfo = async () => {
    if (!order?.refundAccount) return;
    const { bankName, accountNumber, accountHolder, email } =
      order.refundAccount;
    const payload = [
      `Tên ngân hàng: ${bankName}`,
      `Số tài khoản: ${accountNumber}`,
      `Chủ tài khoản: ${accountHolder}`,
      email ? `Email: ${email}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Clipboard error:", error);
    }
  };

  // Check if return package has been delivered to seller (ready for inspection)
  const canInspectGoods = useMemo(() => {
    if (!order?.returnShipping) return false;
    // Button appears when return shipping is completed (delivered to warehouse/seller)
    // and status is RETURNING (package is at warehouse waiting for inspection)
    const isDeliveredToSeller =
      order.returnShipping.chip === "completed" ||
      order.returnShipping.label?.toLowerCase().includes("đã hoàn thành") ||
      order.returnShipping.label?.toLowerCase().includes("đã nhận") ||
      order.returnShipping.note?.toLowerCase().includes("chờ nhập kho") ||
      order.returnShipping.note?.toLowerCase().includes("đã nhận lại hàng");

    const isWaitingForInspection =
      order.statusKey === "RETURNING" ||
      order.statusDescription?.toLowerCase().includes("chờ kiểm hàng");

    return isDeliveredToSeller && isWaitingForInspection;
  }, [order]);

  const handleInspectGoods = () => {
    // TODO: Implement API call to update order status after inspection
    console.log("Inspect goods for order:", order?.id);
    // This would typically open a modal or navigate to inspection page
    // For now, we'll just log it
  };

  if (!order) {
    return (
      <PageContainer className="flex flex-col gap-6">
        <ContentCard className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-[18px] font-semibold text-[#272424]">
            Không tìm thấy yêu cầu
          </p>
          <p className="text-[13px] text-[#737373] max-w-[480px]">
            Vui lòng quay lại danh sách đơn trạng thái khác và chọn lại yêu cầu.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-[10px] bg-[#272424] px-5 py-2 text-[13px] font-semibold text-white"
          >
            Quay lại
          </button>
        </ContentCard>
      </PageContainer>
    );
  }

  const bankInfo = order.refundAccount;
  const addresses = order.addresses;
  const preferredResolution =
    order.preferredResolution || order.options[0] || "Trả hàng & hoàn tiền";

  const renderShippingTimeline = (shipping: ShippingInfo) => {
    if (!shipping.timeline || shipping.timeline.length === 0) return null;

    return (
      <ol className="mt-3 space-y-1 border-t border-dashed border-[#e6e6e6] pt-3 text-[12px] text-[#595959]">
        {shipping.timeline.map((step) => (
          <li key={step}>• {step}</li>
        ))}
      </ol>
    );
  };

  const renderShippingSummary = () => {
    if (!shippingInfo) return null;

    return (
      <div className="border-b border-[#f0f0f0] px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase text-[#737373]">
              Thông tin vận chuyển
            </p>
            <p className="text-[14px] font-semibold text-[#272424]">
              {shippingInfo.label}
            </p>
            <p className="text-[12px] text-[#4a4a4a]">
              GHN: {shippingInfo.note || "Mã vận đơn đang cập nhật"}
            </p>
          </div>
          {shippingInfo.timeline && (
            <button
              onClick={() => setShippingExpanded((prev) => !prev)}
              className="text-[12px] font-semibold text-[#1a71f6] hover:underline"
            >
              {shippingExpanded ? "Thu gọn" : "Mở rộng"}
            </button>
          )}
        </div>
        <div className="mt-3 rounded-[12px] border border-dashed border-[#cfcfcf] bg-[#fcfcfc] px-4 py-3">
          {shippingInfo.timeline && shippingExpanded ? (
            <div className="space-y-2 text-[12px] text-[#4a4a4a]">
              <p className="font-semibold text-[#272424]">
                {shippingInfo.timeline[0]}
              </p>
              {renderShippingTimeline(shippingInfo)}
            </div>
          ) : (
            <p className="text-[12px] text-[#8c8c8c]">
              Thông tin đang được cập nhật.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <PageContainer className="flex flex-col gap-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[13px] font-semibold text-[#1a71f6] hover:underline"
      >
        <ArrowLeft size={18} />
        Quay lại danh sách
      </button>

      <ContentCard className="flex flex-col gap-6">
        <div
          className={`flex flex-wrap items-center justify-between gap-4 rounded-[16px] border px-5 py-4 ${statusBannerStyle.bg} ${statusBannerStyle.border}`}
        >
          <div className="flex flex-col gap-1">
            <p
              className={`text-[14px] font-semibold ${statusBannerStyle.heading}`}
            >
              {order.statusLabel}
              {order.forwardShipping?.label
                ? ` • ${order.forwardShipping.label}`
                : ""}
            </p>
            <p className="text-[13px] text-[#4a4a4a] max-w-[620px]">
              {order.statusDescription}
            </p>
            <p className="text-[13px] text-[#555]">
              Phương án cho người mua:{" "}
              <span className="font-semibold text-[#272424]">
                {preferredResolution}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {canInspectGoods && (
              <button
                onClick={handleInspectGoods}
                className="rounded-[10px] bg-[#272424] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#3a3a3a] transition-colors"
              >
                Kiểm hàng
              </button>
            )}
            <ChipStatus
              status={STATUS_CHIP_MAP[order.statusKey]}
              labelOverride={order.statusLabel}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[18px] border border-[#e2e2e2] bg-[#fffdfb]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0f0f0] px-5 py-4">
            <div>
              <p className="text-[12px] font-semibold text-[#737373] uppercase">
                Mã đơn hàng liên quan
              </p>
              <button className="text-[14px] font-bold text-[#1a71f6] hover:underline">
                {order.relatedOrderCode || order.orderCode}
              </button>
            </div>
            <div className="text-[12px] text-[#8c8c8c]">
              Cập nhật:{" "}
              <span className="font-semibold text-[#272424]">
                {order.lastUpdated}
              </span>
            </div>
          </div>

          <div className="border-b border-[#f0f0f0] px-5 py-4 flex flex-col gap-3">
            <p className="text-[13px] text-[#4a4a4a] leading-relaxed">
              <span className="font-semibold">Lý do từ người mua:</span>{" "}
              {order.reason}
            </p>
            {order.evidenceImages && (
              <div className="flex flex-wrap gap-3">
                {order.evidenceImages.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-[10px] border border-dashed border-[#d7d7d7] bg-[#fafafa]"
                  >
                    <img
                      src={src}
                      alt={`Bằng chứng ${index + 1}`}
                      className="h-full w-full rounded-[10px] object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {addresses && (
            <div className="border-b border-[#f0f0f0] px-5 py-4">
              <div className="grid gap-4 md:grid-cols-3">
                <AddressCard
                  label="Địa chỉ nhận hàng"
                  value={addresses.receivingAddress}
                />
                <AddressCard
                  label="Địa chỉ nhận hàng của khách"
                  value={addresses.customerReturnAddress}
                />
                <AddressCard
                  label="Địa chỉ của shop"
                  value={addresses.shopWarehouseAddress}
                />
              </div>
            </div>
          )}

          {renderShippingSummary()}

          <div className="px-5 py-4">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[720px] rounded-[16px] border border-[#ededed] bg-white">
                <div className="grid grid-cols-[minmax(320px,1fr)_130px_110px] gap-0 border-b border-[#f3f3f3] bg-[#f8f8f8] px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#737373]">
                  <span>Sản phẩm</span>
                  <span className="text-right">Đơn giá</span>
                  <span className="text-right">Số lượng</span>
                </div>
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[minmax(320px,1fr)_130px_110px] items-center gap-0 border-b border-[#f5f5f5] px-4 py-4 text-[13px]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#dfdfdf] bg-[#fafafa]">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[11px] text-[#9b9b9b]">
                            Hình ảnh
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-[#272424]">
                          {product.name}
                        </p>
                        <p className="text-[12px] text-[#737373]">
                          Phân loại hàng (Nếu có):{" "}
                          <span className="font-semibold">
                            {product.variant ||
                              product.classification ||
                              "Không có"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="text-right font-semibold text-[#272424]">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-right font-semibold text-[#272424]">
                      x{product.quantity}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4 px-4 py-4 text-[14px] font-semibold text-[#272424]">
                  <span>Tổng tiền hoàn dự kiến</span>
                  <span>{formatCurrency(order.refundAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e4e4e4] bg-white px-5 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[15px] font-semibold text-[#272424]">
                Thông tin tài khoản hoàn tiền
              </p>
              <p className="text-[13px] text-[#737373]">
                Bộ phận kế toán sẽ dùng thông tin này để xử lý hoàn tiền.
              </p>
            </div>
            {bankInfo && (
              <button
                onClick={handleCopyBankInfo}
                className="flex items-center gap-2 rounded-[12px] border border-[#d9d9d9] bg-[#f9f9f9] px-4 py-2 text-[13px] font-semibold text-[#272424] hover:bg-white"
              >
                <ClipboardCopy size={16} />
                {copied ? "Đã sao chép" : "Copy thông tin tài khoản"}
              </button>
            )}
          </div>

          {bankInfo ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoRow label="Tên ngân hàng" value={bankInfo.bankName} />
              <InfoRow label="Số tài khoản" value={bankInfo.accountNumber} />
              <InfoRow label="Chủ tài khoản" value={bankInfo.accountHolder} />
              <InfoRow label="Email" value={bankInfo.email} />
            </div>
          ) : (
            <p className="mt-4 text-[13px] text-[#8c8c8c]">
              Chưa có thông tin tài khoản hoàn tiền cho yêu cầu này.
            </p>
          )}
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default AdminOrderOtherStatusDetail;
