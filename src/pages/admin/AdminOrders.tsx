// src/pages/admin/AdminOrders.tsx
import React, { useState } from 'react';
import { Search, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OrderTabMenu, orderTabs } from '@/components/admin/OrderTabMenu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

// Mock data dựa trên hình ảnh
const mockOrders = [
  {
    id: 'ORD001',
    customer: 'nguyenlan',
    product: 'Áo thun nữ cộc tay Jouthing Kill Producer LOVEGOS',
    price: '250.000đ',
    status: 'Chờ xác nhận',
    paymentStatus: 'Chưa thanh toán',
    image: '/api/placeholder/50/50',
    category: 'Thời trang',
    date: '2024-10-17',
    tabStatus: 'pending'
  },
  {
    id: 'ORD002',
    customer: 'maianh',
    product: 'Áo thun đài tay nhanh Kid Northumberland',
    price: '180.000đ',
    status: 'Đã xác nhận',
    paymentStatus: 'Đã thanh toán',
    image: '/api/placeholder/50/50',
    category: 'Thời trang',
    date: '2024-10-17',
    tabStatus: 'confirmed'
  },
  {
    id: 'ORD003',
    customer: 'vanminh',
    product: 'Giày thể thao nữ chất liệu thoáng khí hiking',
    price: '450.000đ',
    status: 'Đang giao',
    paymentStatus: 'Đã thanh toán',
    image: '/api/placeholder/50/50',
    category: 'Webstore',
    date: '2024-10-16',
    tabStatus: 'shipping'
  },
  {
    id: 'ORD004',
    customer: 'vanlinh',
    product: 'Áo hoodie ghi chữ Hip Hop crphone Vintage',
    price: '320.000đ',
    status: 'Đã hoàn thành',
    paymentStatus: 'Đã thanh toán',
    image: '/api/placeholder/50/50',
    category: 'POS',
    date: '2024-10-16',
    tabStatus: 'completed'
  },
  {
    id: 'ORD005',
    customer: 'minhquan',
    product: 'Túi ba lô nam từ Canvas Performance Cross Series',
    price: '280.000đ',
    status: 'Đã hủy',
    paymentStatus: 'Đã hoàn tiền',
    image: '/api/placeholder/50/50',
    category: 'POS',
    date: '2024-10-15',
    tabStatus: 'returned'
  },
  {
    id: 'ORD006',
    customer: 'thanhha',
    product: 'Váy dài màu xanh vintage style',
    price: '350.000đ',
    status: 'Chờ xác nhận',
    paymentStatus: 'Chưa thanh toán',
    image: '/api/placeholder/50/50',
    category: 'Webstore',
    date: '2024-10-15',
    tabStatus: 'pending'
  }
];

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Đã xác nhận':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Đang giao':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Đã hoàn thành':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Đã thanh toán':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Chưa thanh toán':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Đã hoàn tiền':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Filter orders by active tab and search term
  const filteredOrders = orders.filter(order => {
    // Filter by tab
    const matchesTab = activeTab === 'all' || order.tabStatus === activeTab;

    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tất cả sản phẩm</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          Tạo đơn hàng
        </Button>
      </div>

      {/* Tab Menu */}
      <OrderTabMenu
        tabs={orderTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Search and Filters */}
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

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
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
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={order.image}
                        alt={order.product}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-sm line-clamp-2">{order.product}</p>
                        <p className="text-xs text-gray-500">{order.customer}</p>
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
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs px-2 py-1 ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Hiển thị 1-{filteredOrders.length} trong tổng số {orders.length} đơn hàng
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