// src/pages/admin/AdminOrders.tsx
import React, { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Grid3X3,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TabMenu } from "@/components/common";
import type { TabItem } from "@/components/common";
import { CustomerOrderCard } from "@/components/admin/CustomerOrderCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

// Mock data dựa trên hình ảnh
const mockOrders = [
  {
    id: "A122F23153",
    customer: "nguyenbh96",
    products: [
      {
        id: 1,
        name: "Áo thun cờ giấn thoáng khí Rockbros LKW008",
        price: "1.500.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
      {
        id: 2,
        name: "Áo thun đài tay nhanh khô Northshengwolf ch...",
        price: "850.000đ",
        quantity: 2,
        image: "/api/placeholder/50/50",
      },
      {
        id: 3,
        name: "Áo thun ngắn tay nam Gothiar Active",
        price: "650.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
      {
        id: 4,
        name: "Áo thun dài tay nam Gothiar Active",
        price: "750.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    totalPrice: "4.750.000đ",
    status: "Đã hoàn thành",
    paymentStatus: "Đã thanh toán",
    category: "POS",
    date: "2024-10-17",
    tabStatus: "completed",
  },
  {
    id: "ORD001",
    customer: "nguyenlan",
    products: [
      {
        id: 1,
        name: "Áo thun nữ cộc tay Jouthing Kill Producer LOVEGOS",
        price: "250.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    totalPrice: "250.000đ",
    status: "Chờ xác nhận",
    paymentStatus: "Chưa thanh toán",
    category: "Thời trang",
    date: "2024-10-17",
    tabStatus: "pending",
  },
  {
    id: "ORD002",
    customer: "maianh",
    products: [
      {
        id: 1,
        name: "Áo thun đài tay nhanh Kid Northumberland",
        price: "180.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    totalPrice: "180.000đ",
    status: "Đã xác nhận",
    paymentStatus: "Đã thanh toán",
    category: "Thời trang",
    date: "2024-10-17",
    tabStatus: "confirmed",
  },
  {
    id: "ORD003",
    customer: "vanminh",
    products: [
      {
        id: 1,
        name: "Giày thể thao nữ chất liệu thoáng khí hiking",
        price: "450.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    totalPrice: "450.000đ",
    status: "Đang giao",
    paymentStatus: "Đã thanh toán",
    category: "Webstore",
    date: "2024-10-16",
    tabStatus: "shipping",
  },
  {
    id: "ORD004",
    customer: "vanlinh",
    products: [
      {
        id: 1,
        name: "Áo hoodie ghi chữ Hip Hop crphone Vintage",
        price: "320.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    totalPrice: "320.000đ",
    status: "Đã hoàn thành",
    paymentStatus: "Đã thanh toán",
    category: "POS",
    date: "2024-10-16",
    tabStatus: "completed",
  },
  {
    id: "ORD005",
    customer: "minhquan",
    products: [
      {
        id: 1,
        name: "Túi ba lô nam từ Canvas Performance Cross Series",
        price: "280.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    totalPrice: "280.000đ",
    status: "Đã hủy",
    paymentStatus: "Đã hoàn tiền",
    category: "POS",
    date: "2024-10-15",
    tabStatus: "returned",
  },
  {
    id: "ORD006",
    customer: "thanhha",
    products: [
      {
        id: 1,
        name: "Váy dài màu xanh vintage style",
        price: "350.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    totalPrice: "350.000đ",
    status: "Chờ xác nhận",
    paymentStatus: "Chưa thanh toán",
    category: "Webstore",
    date: "2024-10-15",
    tabStatus: "pending",
  },
];

// Order tabs data
const orderTabs: TabItem[] = [
  { id: "all", label: "Tất cả", count: 7 },
  { id: "pending", label: "Chờ xác nhận", count: 2 },
  { id: "confirmed", label: "Đã xác nhận", count: 1 },
  { id: "shipping", label: "Đang giao", count: 1 },
  { id: "completed", label: "Đã hoàn thành", count: 2 },
  { id: "returned", label: "Đã hủy", count: 1 },
];

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const navigate = useNavigate();

  // Handle view order detail
  const handleViewOrderDetail = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-800 ";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-800 ";
      case "Đang giao":
        return "bg-purple-100 text-purple-800 ";
      case "Đã hoàn thành":
        return "bg-green-100 text-green-800 ";
      case "Đã hủy":
        return "bg-red-100 text-red-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-100 text-green-800 ";
      case "Chưa thanh toán":
        return "bg-yellow-100 text-yellow-800 ";
      case "Đã hoàn tiền":
        return "bg-blue-100 text-blue-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  // Filter orders by active tab and search term
  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    const matchesTab = activeTab === "all" || order.tabStatus === activeTab;

    // Filter by search term - search in all products
    const matchesSearch =
      searchTerm === "" ||
      order.products.some((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">
            Quản lý đơn hàng
          </h1>
          <p className="text-sm text-gray-500 ">Tất cả sản phẩm</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4 mr-1" />
            Bảng
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("card")}
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Card
          </Button>
        </div>
      </div>

      {/* Tab Menu */}
      <TabMenu
        tabs={orderTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="card"
      />

      {/* Orders Table or Cards */}
      {viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <CardContent className="mb-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Chủ sở hữu
                  </Button>
                  <Button variant="outline" size="sm">
                    Kênh nhận
                  </Button>
                  <Button variant="outline" size="sm">
                    Dòng phẩm
                  </Button>
                  <Button variant="outline" size="sm">
                    Đã thanh toán
                  </Button>
                  <Button variant="outline" size="sm">
                    Tất cả nghiệp tình/khách
                  </Button>
                </div>
              </div>
            </CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 ">
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tình trạng hàng</TableHead>
                  <TableHead>Nguyên đơn</TableHead>
                  <TableHead>BVQC</TableHead>
                  <TableHead>Tình trạng tt/lỗi</TableHead>
                  <TableHead>Trạng thái thanh toán</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 ">
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={order.products[0].image}
                          alt={order.products[0].name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        />
                        <div>
                          <p className="font-medium text-sm line-clamp-2">
                            {order.products.length === 1
                              ? order.products[0].name
                              : `${order.products[0].name} và ${order.products.length - 1} sản phẩm khác`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customer}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <Badge className="text-xs px-2 py-1 bg-purple-100 text-purple-800">
                          300.000đ
                        </Badge>
                        <p className="text-xs text-blue-600 mt-1">Thêm mới</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {order.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">--</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs px-2 py-1 ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewOrderDetail(order.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-blue-600"
                              onClick={() => handleViewOrderDetail(order.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Search and Filters for Card View */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Chủ sở hữu
                  </Button>
                  <Button variant="outline" size="sm">
                    Kênh nhận
                  </Button>
                  <Button variant="outline" size="sm">
                    Dòng phẩm
                  </Button>
                  <Button variant="outline" size="sm">
                    Đã thanh toán
                  </Button>
                  <Button variant="outline" size="sm">
                    Tất cả nghiệp tình/khách
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <CustomerOrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewOrderDetail}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Hiển thị 1-{filteredOrders.length} trong tổng số {orders.length} đơn
          hàng
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
          <Button variant="outline" size="sm" className="bg-red-500 text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            Tiếp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
