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

// Utility functions for invoice printing
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Export function to print invoice directly without modal
export const printInvoice = (order: OrderDetails) => {
  if (!order) return;

  const invoiceHTML = `
    <div class="invoice-container">
      <!-- Header -->
      <div class="header">
        <div class="company-name">Wanderoo</div>
        <div class="company-info">
          Số 79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội<br />
          0802692838
        </div>
      </div>

      <!-- Invoice Title -->
      <div class="invoice-title">HÓA ĐƠN</div>

      <!-- Order Information -->
      <div class="order-info">
        <div class="info-row">
          <span class="info-label">SỐ HĐ:</span>
          <span class="info-value">${order.id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Ngày:</span>
          <span class="info-value">${formatDate(order.createdAt)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Nhân viên:</span>
          <span class="info-value">${order.createdBy}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Ghi chú:</span>
          <span class="info-value">
            ${order.notes && order.notes.trim() !== "" ? order.notes : "---"}
          </span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Products Table -->
      <table class="products-table">
        <thead>
          <tr>
            <th style="width: 50px;">STT</th>
            <th class="col-name">Tên SP</th>
            <th style="width: 60px;">SL</th>
            <th class="col-price" style="width: 100px;">Đơn giá</th>
            <th class="col-total" style="width: 100px;">TT</th>
          </tr>
        </thead>
        <tbody>
          ${order.products
      .map((product, index) => {
        const lineTotal =
          product.totalPrice ??
          product.price * (product.quantity || 0);
        return `
                <tr>
                  <td>${index + 1}</td>
                  <td class="col-name">${product.name}</td>
                  <td>${product.quantity}</td>
                  <td class="col-price">${formatCurrency(product.price)}</td>
                  <td class="col-total">${formatCurrency(lineTotal)}</td>
                </tr>
              `;
      })
      .join("")}
        </tbody>
      </table>

      <div class="divider"></div>

      <!-- Summary -->
      <div class="summary">
        <div class="summary-row">
          <span class="summary-label">Tổng tiền hàng</span>
          <span class="summary-value">${formatCurrency(order.totalAmount)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Giảm giá</span>
          <span class="summary-value ${order.discount > 0 ? "discount-value" : ""}">
            ${order.discount > 0
      ? `- ${formatCurrency(order.discount)}`
      : formatCurrency(0)}
          </span>
        </div>
        <div class="summary-row total-row">
          <span class="summary-label">Khách phải trả</span>
          <span class="summary-value">${formatCurrency(order.finalAmount)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Tiền khách đưa</span>
          <span class="summary-value">${formatCurrency(order.amountPaid)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Tiền thừa trả khách</span>
          <span class="summary-value">${formatCurrency(order.change)}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        Cám ơn quý khách và hẹn gặp lại!
      </div>
    </div>
  `;

  const printWindow = window.open("", "", "height=800,width=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hóa đơn thanh toán ${order.id}</title>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            padding: 20px;
            background-color: #ffffff;
            color: #000;
          }
          .invoice-container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 16px;
          }
          .company-name {
            font-size: 24px;
            font-weight: 700;
            color: #000;
            margin-bottom: 8px;
          }
          .company-info {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
          }
          .invoice-title {
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            color: #000;
            margin: 16px 0;
            letter-spacing: 1px;
          }
          .order-info {
            margin: 16px 0;
          }
          .info-row {
            display: flex;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .info-label {
            min-width: 100px;
            font-weight: 500;
          }
          .info-value {
            flex: 1;
          }
          .divider {
            border-top: 1px dashed #ccc;
            margin: 16px 0;
          }
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            font-size: 14px;
          }
          .products-table th,
          .products-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .products-table th {
            background-color: #f5f5f5;
            font-weight: 600;
            text-align: center;
          }
          .products-table td {
            text-align: center;
          }
          .products-table .col-name {
            text-align: left;
          }
          .products-table .col-price,
          .products-table .col-total {
            text-align: right;
          }
          .summary {
            margin: 16px 0;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .summary-label {
            color: #333;
          }
          .summary-value {
            font-weight: 600;
          }
          .summary-row.total-row {
            border-top: 1px solid #ddd;
            padding-top: 8px;
            margin-top: 8px;
          }
          .summary-row.total-row .summary-value {
            font-weight: 700;
            color: #e04d30;
          }
          .discount-value {
            color: #e04d30;
          }
          .footer {
            text-align: center;
            margin-top: 24px;
            font-size: 14px;
            color: #333;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-container {
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        ${invoiceHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  open,
  onOpenChange,
  order,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    if (!order) return;
    printInvoice(order);
  };

  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle>Hóa đơn thanh toán</AlertDialogTitle>
        </AlertDialogHeader>

        <div ref={printRef} className="invoice-container bg-white">
          {/* Header */}
          <div className="header">
            <div className="company-name">Wanderoo</div>
            <div className="company-info">
              Số 79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội<br />
              0802692838
            </div>
          </div>

          {/* Invoice Title */}
          <div className="invoice-title">HÓA ĐƠN</div>

          {/* Order Information */}
          <div className="order-info">
            <div className="info-row">
              <span className="info-label">SỐ HĐ:</span>
              <span className="info-value font-semibold">{order.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày:</span>
              <span className="info-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nhân viên:</span>
              <span className="info-value">{order.createdBy}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ghi chú:</span>
              <span className="info-value">
                {order.notes && order.notes.trim() !== "" ? order.notes : "---"}
              </span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Products Table */}
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>STT</th>
                <th className="col-name">Tên SP</th>
                <th style={{ width: "60px" }}>SL</th>
                <th className="col-price" style={{ width: "100px" }}>Đơn giá</th>
                <th className="col-total" style={{ width: "100px" }}>TT</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => {
                const lineTotal =
                  product.totalPrice ??
                  product.price * (product.quantity || 0);
                return (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td className="col-name">{product.name}</td>
                    <td>{product.quantity}</td>
                    <td className="col-price">{formatCurrency(product.price)}</td>
                    <td className="col-total font-semibold">
                      {formatCurrency(lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="divider"></div>

          {/* Summary */}
          <div className="summary">
            <div className="summary-row">
              <span className="summary-label">Tổng tiền hàng</span>
              <span className="summary-value">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Giảm giá</span>
              <span className={`summary-value ${order.discount > 0 ? "discount-value" : ""}`}>
                {order.discount > 0
                  ? `- ${formatCurrency(order.discount)}`
                  : formatCurrency(0)}
              </span>
            </div>
            <div className="summary-row total-row">
              <span className="summary-label font-semibold">Khách phải trả</span>
              <span className="summary-value">{formatCurrency(order.finalAmount)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tiền khách đưa</span>
              <span className="summary-value">{formatCurrency(order.amountPaid)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tiền thừa trả khách</span>
              <span className="summary-value">{formatCurrency(order.change)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            Cám ơn quý khách và hẹn gặp lại!
          </div>
        </div>

        <AlertDialogFooter className="mt-6 flex gap-3">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="border-[#e04d30] text-[#e04d30] hover:bg-[#e04d30] hover:text-white"
            >
              Đóng
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handlePrint}
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
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
