import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, ClipboardList, CreditCard, Factory, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChipStatus } from "@/components/ui/chip-status";

type ImportDetail = {
  id: string;
  importCode: string;
  createdDate: string;
  supplier: string;
  createdBy: string;
  status: "processing" | "completed";
  importStatus: "not_imported" | "imported";
  paymentStatus: "paid" | "unpaid";
  paymentMethod: "cash" | "transfer";
  items: Array<{ id: string; name: string; quantity: number; price: number; total: number }>;
  totals: { items: number; value: number };
};

const mockImportDetail: ImportDetail = {
  id: "1",
  importCode: "NK001",
  createdDate: "2024-01-15",
  supplier: "Công ty TNHH ABC",
  createdBy: "Nguyễn Văn A",
  status: "processing",
  importStatus: "not_imported",
  paymentStatus: "unpaid",
  paymentMethod: "cash",
  items: [
    { id: "p1", name: "Áo thun thoáng khí Rockbros LKW008", quantity: 100, price: 120000, total: 12000000 },
    { id: "p2", name: "Áo thun dài tay Northshengwolf", quantity: 50, price: 150000, total: 7500000 },
  ],
  totals: { items: 150, value: 19500000 },
};

const AdminWarehouseImportDetail: React.FC = () => {
  const navigate = useNavigate();
  const { importId } = useParams<{ importId: string }>();

  const detail: ImportDetail = {
    ...mockImportDetail,
    id: importId ?? mockImportDetail.id,
    importCode: mockImportDetail.importCode,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate("/admin/warehouse/imports")}> 
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết phiếu nhập {detail.importCode}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#f6f6f6] border-[#e7e7e7]">
          <CardContent className="p-4 flex items-center gap-3">
            <Package className="h-5 w-5 text-[#1a71f6]" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Trạng thái</span>
              <ChipStatus status={detail.status} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#f6f6f6] border-[#e7e7e7]">
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-[#e04d30]" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Trạng thái nhập</span>
              <ChipStatus status={detail.importStatus} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#f6f6f6] border-[#e7e7e7]">
          <CardContent className="p-4 flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-[#16a34a]" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Thanh toán</span>
              <ChipStatus status={detail.paymentStatus} />
              <ChipStatus status={detail.paymentMethod} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Thông tin phiếu nhập
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Mã phiếu nhập</p>
              <p className="font-semibold text-gray-900">{detail.importCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày tạo</p>
              <p className="font-medium text-gray-900">{new Date(detail.createdDate).toLocaleDateString("vi-VN")}</p>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Người tạo</p>
                <p className="font-medium text-gray-900">{detail.createdBy}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nhà cung cấp</p>
              <p className="font-medium text-gray-900">{detail.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số lượng nhập</p>
              <p className="font-semibold text-gray-900">{detail.totals.items}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Giá trị đơn</p>
              <p className="font-semibold text-gray-900">{formatCurrency(detail.totals.value)}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-sm font-medium text-gray-600">STT</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Sản phẩm</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600">Số lượng</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">Đơn giá</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((item, idx) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{idx + 1}</td>
                    <td className="py-4">
                      <span className="font-medium">{item.name}</span>
                    </td>
                    <td className="text-center py-4">{item.quantity}</td>
                    <td className="text-right py-4">{formatCurrency(item.price)}</td>
                    <td className="text-right py-4 font-semibold">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWarehouseImportDetail;


