// src/pages/admin/AdminDiscounts.tsx
import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Gift,
  Users,
  ShoppingCart,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TabMenu } from "@/components/common";
import type { TabItem } from "@/components/common";
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

// Mock data cho vouchers
const mockVouchers = [
  {
    id: "SUMMER2024",
    name: "Voucher khách hàng mới",
    type: "Tỷ lệ sản phẩm",
    productCount: 10,
    discountValue: "1 point",
    usageLimit: 10,
    used: 1,
    status: "Đang diễn ra",
    expiry: "12/02/2025",
    createdDate: "12/02/2024",
    actions: "Chưa có",
  },
  {
    id: "NEWBIE50",
    name: "Voucher khách hàng mới",
    type: "Tỷ lệ sản phẩm",
    productCount: 10,
    discountValue: "1 point",
    usageLimit: 10,
    used: 1,
    status: "Đang diễn ra",
    expiry: "12/02/2025",
    createdDate: "12/02/2024",
    actions: "Chưa có",
  },
  {
    id: "LOYALTY100",
    name: "Voucher khách hàng mới",
    type: "Tỷ lệ sản phẩm",
    productCount: 10,
    discountValue: "1 point",
    usageLimit: 10,
    used: 1,
    status: "Đang diễn ra",
    expiry: "12/02/2025",
    createdDate: "12/02/2024",
    actions: "Chưa có",
  },
];

// Discount tabs data
const discountTabs: TabItem[] = [
  { id: "all", label: "Tất cả", count: 3 },
  { id: "ongoing", label: "Đang diễn ra", count: 3 },
  { id: "upcoming", label: "Sắp diễn ra", count: 0 },
  { id: "ended", label: "Đã kết thúc", count: 0 },
  { id: "paused", label: "Tạm dừng hoàn đền", count: 0 },
  { id: "paused_complete", label: "Tạm dừng hoàn đền", count: 0 },
  { id: "history", label: "Thao tác", count: 0 },
];

const AdminDiscounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang diễn ra":
        return "bg-green-100 text-green-800 ";
      case "Sắp diễn ra":
        return "bg-blue-100 text-blue-800 ";
      case "Đã kết thúc":
        return "bg-gray-100 text-gray-800 ";
      case "Tạm dừng":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  return (
    <div className="space-y-4 p-3">
      {/* Voucher Creation Options */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 ">Tạo voucher</h3>
          <p className="text-sm text-gray-600 ">
            Chọn một trong những loại voucher bên dưới để tạo cho hoạt động kinh
            doanh cửa hàng của bạn
          </p>

          <h4 className="text-md font-medium text-gray-900 ">
            Cài thiết tỷ lệ chuyển đổi
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voucher toàn shop */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h5 className="font-medium text-gray-900  mb-2">
                  Voucher toàn shop
                </h5>
                <p className="text-sm text-gray-600 ">
                  Voucher áp dụng cho tất cả sản phẩm trong cửa hàng của bạn
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Tạo
                </Button>
              </CardContent>
            </Card>

            {/* Voucher sản phẩm */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h5 className="font-medium text-gray-900  mb-2">
                  Voucher sản phẩm
                </h5>
                <p className="text-sm text-gray-600 ">
                  Voucher áp dụng cho những sản phẩm cụ thể đã được tạo trước
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Tạo
                </Button>
              </CardContent>
            </Card>
          </div>

          <h4 className="text-md font-medium text-gray-900 ">
            Tập trung vào nhóm khách hàng mục tiêu
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voucher khách hàng mới */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h5 className="font-medium text-gray-900  mb-2">
                  Voucher khách hàng mới
                </h5>
                <p className="text-sm text-gray-600 ">
                  Voucher nhằm thu hút khách hàng mới và khi khách hàng ở tỉnh
                  thành khác có thể
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Tạo
                </Button>
              </CardContent>
            </Card>

            {/* Voucher khách hàng mua lại */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h5 className="font-medium text-gray-900  mb-2">
                  Voucher khách hàng mua lại
                </h5>
                <p className="text-sm text-gray-600 ">
                  Voucher nhằm thu hút khách hàng cũ quay lại mua hàng tại của
                  hàng
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Tạo
                </Button>
              </CardContent>
            </Card>
          </div>

          <h4 className="text-md font-medium text-gray-900 ">
            Tập trung vào kênh hiển thị rộng rãi
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Voucher rộng tú */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 cursor-pointer transition-colors">
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                <h5 className="font-medium text-gray-900  mb-2">
                  Voucher rộng tú
                </h5>
                <p className="text-sm text-gray-600 ">
                  Voucher phân phối rộng để mọi người có thể cùng sử dụng nó để
                  mua sắm tại của bạn
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Tạo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">
            Quản lý mã giảm giá
          </h1>
          <p className="text-sm text-gray-500  mt-1">
            Tạo và quản lý các voucher khuyến mãi
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Tạo voucher mới
        </Button>
      </div>

      {/* Filter Tabs */}
      <TabMenu
        tabs={discountTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="card"
      />

      {/* Search and Voucher Table */}
      <Card>
        <CardContent className="p-0">
          <CardContent className="mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <FormInput
                  placeholder="Tìm voucher/Mã voucher"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Loại voucher
                </Button>
                <Button variant="outline" size="sm">
                  Trạng thái
                </Button>
                <Button variant="outline" size="sm">
                  Thời gian tạo
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
                <TableHead>Tên voucher/Mã voucher</TableHead>
                <TableHead>Loại mã</TableHead>
                <TableHead>Sản phẩm sử dụng</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Tổng lượt sử dụng tối đa</TableHead>
                <TableHead>Đã dùng</TableHead>
                <TableHead>Hiệu lực</TableHead>
                <TableHead>Thời gian lưu</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVouchers.map((voucher) => (
                <TableRow key={voucher.id} className="hover:bg-gray-50 ">
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Gift className="w-10 h-10 p-2 bg-orange-100 text-orange-600 rounded-lg flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-gray-900 ">
                          {voucher.id}
                        </p>
                        <p className="text-xs text-gray-500">{voucher.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 ">
                      {voucher.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 ">
                      {voucher.productCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 ">
                      {voucher.discountValue}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 ">
                      {voucher.usageLimit}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 ">
                      {voucher.used}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs px-2 py-1 ${getStatusColor(voucher.status)}`}
                    >
                      {voucher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-600 ">{voucher.expiry}</p>
                      <p className="text-xs text-gray-500">
                        {voucher.createdDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
                          <DropdownMenuItem className="text-blue-600">
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
    </div>
  );
};

export default AdminDiscounts;
