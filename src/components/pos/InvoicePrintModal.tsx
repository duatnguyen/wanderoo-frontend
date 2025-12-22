import React, { useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { OrderDetails } from "./OrderDetailsPanel";

export type InvoicePrintModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: OrderDetails;
};

const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handlePrint = () => {
    if (!order) return;
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "height=800,width=480");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn thanh toán #${order.id}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
              margin: 0;
              padding: 10px;
              background-color: #ffffff;
            }
            .invoice-wrapper {
              width: 80mm;
              margin: 0 auto;
              border: 1px solid #000;
              padding: 8px 10px 10px;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              margin-bottom: 6px;
            }
            .header-line-1 {
              font-size: 14px;
              font-weight: 700;
            }
            .header-line-2 {
              font-size: 13px;
              font-weight: 600;
            }
            .header-extra {
              font-size: 11px;
              line-height: 1.35;
            }
            .divider {
              border-top: 1px solid #000;
              margin: 6px 0;
            }
            .title {
              text-align: center;
              font-size: 16px;
              font-weight: 700;
              margin: 4px 0 6px;
            }
            .info-row {
              display: flex;
              font-size: 11px;
              margin-bottom: 2px;
            }
            .info-label {
              width: 70px;
            }
            .info-value {
              flex: 1;
            }
            .section-margin {
              margin-top: 6px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 4px;
              font-size: 11px;
            }
            .invoice-table th,
            .invoice-table td {
              border: 1px solid #000;
              padding: 2px 3px;
              box-sizing: border-box;
            }
            .invoice-table th {
              font-weight: 600;
              text-align: center;
            }
            .col-stt {
              width: 32px;
              text-align: center;
            }
            .col-name {
              width: auto;
            }
            .col-qty {
              width: 40px;
              text-align: center;
            }
            .col-price,
            .col-total {
              width: 80px;
              text-align: right;
            }
            .totals {
              margin-top: 4px;
              font-size: 11px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            .totals-row.total {
              font-weight: 700;
            }
            .thank-you {
              text-align: center;
              margin-top: 8px;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-4 sm:p-6">
        <div
          ref={printRef}
          className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-xs sm:text-sm invoice-wrapper"
        >
          {/* Header trên hóa đơn */}
          <div className="text-center mb-1">
            <p className="text-[14px] font-bold text-[#111827]">
              Wanderoo
            </p>
            <p className="text-[11px] text-[#4b5563] leading-[1.3]">
              Địa chỉ: Số 79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội<br />
              Số điện thoại: 0802692838
            </p>
          </div>

          <div className="border-t border-[#111827] my-1" />

          <div className="text-center mb-2">
            <p className="text-[15px] font-extrabold tracking-wide text-[#111827]">
              HÓA ĐƠN
            </p>
          </div>

          {/* Info rows */}
          <div className="space-y-1 mb-2">
            <div className="flex text-[11px]">
              <span className="w-[70px]">Số HĐ:</span>
              <span className="flex-1 font-medium">
                {order.id}
              </span>
            </div>
            <div className="flex text-[11px]">
              <span className="w-[70px]">Ngày:</span>
              <span className="flex-1">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex text-[11px]">
              <span className="w-[70px]">Nhân viên:</span>
              <span className="flex-1">{order.createdBy}</span>
            </div>
            <div className="flex text-[11px]">
              <span className="w-[70px]">Ghi chú:</span>
              <span className="flex-1">
                {order.notes && order.notes.trim() !== "" ? order.notes : "---"}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 my-1" />

          {/* Bảng sản phẩm: STT, Tên SP, SL, Đơn giá, Thành tiền */}
          <div className="mt-1 rounded-sm overflow-hidden border border-gray-900">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th className="col-stt">STT</th>
                  <th className="col-name">Tên SP</th>
                  <th className="col-qty">SL</th>
                  <th className="col-price">Đơn giá</th>
                  <th className="col-total">TT</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => {
                  const lineTotal =
                    product.totalPrice ??
                    product.price * (product.quantity || 0);
                  return (
                    <tr key={product.id}>
                      <td className="col-stt">{index + 1}</td>
                      <td className="col-name product-name">{product.name}</td>
                      <td className="col-qty">{product.quantity}</td>
                      <td className="col-price">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="col-total font-semibold">
                        {formatCurrency(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-dashed border-gray-300 my-2" />

          <div className="space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#4b5563]">Tổng tiền hàng</span>
              <span className="font-semibold text-[#272424]">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4b5563]">Giảm giá</span>
              <span className="font-semibold text-[#e04d30]">
                {order.discount > 0
                  ? `- ${formatCurrency(order.discount)}`
                  : formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-gray-200 mt-1">
              <span className="font-semibold text-[#111827]">
                Khách phải trả
              </span>
              <span className="font-bold text-[#e04d30]">
                {formatCurrency(order.finalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4b5563]">Tiền khách đưa</span>
              <span className="font-semibold text-[#111827]">
                {formatCurrency(order.amountPaid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4b5563]">Tiền thừa trả khách</span>
              <span className="font-semibold text-[#111827]">
                {formatCurrency(order.change)}
              </span>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#4b5563] mt-2">
            Cám ơn quý khách và hẹn gặp lại!
          </p>
        </div>

        <AlertDialogFooter className="mt-3">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Đóng
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handlePrint}
              className="w-full sm:w-auto bg-[#e04d30] hover:bg-[#d04327] text-white"
            >
              In hóa đơn
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InvoicePrintModal;


