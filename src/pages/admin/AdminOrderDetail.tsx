// src/pages/admin/AdminOrderDetail.tsx
import React from "react";
import { ArrowLeft, MapPin, Truck, CreditCard, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock data cho order detail
const orderDetail = {
  id: "SPS78KQR",
  status: "Đã hoàn thành",
  source: "Website",
  customer: {
    name: "buiminhhang",
    avatar: "",
  },
  shipping: {
    address: "03kcad4-658, Nguyên Thị Thạnh",
    district: "Xóm *** - Gia Lâm *** Hà Nội Thái Bình",
    method: "SPX #123FG24QN2",
  },
  timeline: [
    {
      status: "Giao hàng thành công",
      date: "13:20 12/3/2003",
      isCompleted: true,
    },
  ],
  items: [
    {
      id: 1,
      name: "Áo thun cờ giấn thoáng khí Rockbros LKW008",
      price: 1500000,
      quantity: 1,
      total: 1500000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Áo thun đài tay nhanh khô Northshengwolf ch...",
      price: 850000,
      quantity: 2,
      total: 1700000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 3,
      name: "Áo thun ngắn tay nam Gothiar Active",
      price: 650000,
      quantity: 1,
      total: 650000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 4,
      name: "Áo thun dài tay nam Gothiar Active",
      price: 750000,
      quantity: 1,
      total: 750000,
      image: "/api/placeholder/80/80",
    },
  ],
  summary: {
    subtotal: 4600000,
    shipping: 30000,
    fee: 34000,
    total: 4596000,
  },
  payment: {
    subtotal: 4600000,
    shipping: 0,
    discount: 34000,
    total: 4566000,
  },
};

const AdminOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const handleBackClick = () => {
    navigate("/admin/orders");
  };

  // Function to get order data based on orderId
  const getOrderData = () => {
    // If orderId matches our mock orders, we could fetch real data here
    // For now, we'll use the mock data but display the correct orderId
    return {
      ...orderDetail,
      id: orderId || orderDetail.id,
    };
  };

  const currentOrder = getOrderData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-4 p-3">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 ">
          Chi tiết đơn hàng {currentOrder.id}
        </h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Trạng thái đơn: {currentOrder.status}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-800">
                Nguồn đơn: {currentOrder.source}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order ID */}
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600 ">Mã đơn hàng</p>
                <p className="font-semibold text-gray-900 ">
                  {currentOrder.id}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600 ">Địa chỉ nhận hàng</p>
                <p className="font-medium text-gray-900 ">
                  {currentOrder.shipping.address}
                </p>
                <p className="text-sm text-gray-600 ">
                  {currentOrder.shipping.district}
                </p>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600 ">Thông tin vận chuyển</p>
                <p className="font-medium text-gray-900 ">
                  {currentOrder.shipping.method}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-gray-900  mb-4">
              Lịch sử đơn hàng
            </h3>
            {currentOrder.timeline.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-green-600">{item.status}</p>
                  <p className="text-sm text-gray-600 ">{item.date}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-gray-600"
                >
                  Mở rộng ↓
                </Button>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Customer */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-gray-200">
                {currentOrder.customer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-900 ">
              {currentOrder.customer.name}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Thông tin thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-sm font-medium text-gray-600 ">
                    STT
                  </th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600 ">
                    Sản phẩm
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600 ">
                    Đơn giá
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600 ">
                    Số lượng
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600 ">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-4">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="text-center py-4">{item.quantity}</td>
                    <td className="text-right py-4 font-semibold">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator className="my-6" />

          {/* Order Summary - Chỉ Doanh thu đơn hàng */}
          <div>
            {/* Doanh thu đơn hàng */}
            <div>
              <h4 className="font-semibold text-gray-900  mb-4">
                Doanh thu đơn hàng
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 ">Tổng tiền sản phẩm:</span>
                  <span className="font-medium">
                    {formatCurrency(currentOrder.summary.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 ">Tổng phí vận chuyển:</span>
                  <span className="font-medium">
                    {formatCurrency(currentOrder.summary.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 ">Phí phụ:</span>
                  <span className="font-medium">
                    {formatCurrency(currentOrder.summary.fee)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Doanh thu đơn hàng</span>
                  <span>{formatCurrency(currentOrder.summary.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Thanh toán của người mua
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 ">Tổng tiền sản phẩm:</span>
              <span className="font-medium">
                {formatCurrency(currentOrder.payment.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 ">Phí vận chuyển:</span>
              <span className="font-medium">
                {formatCurrency(currentOrder.payment.shipping)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 ">Mã giảm giá của shop:</span>
              <span className="font-medium">
                -{formatCurrency(currentOrder.payment.discount)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Tổng tiền thanh toán</span>
              <span>{formatCurrency(currentOrder.payment.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderDetail;
