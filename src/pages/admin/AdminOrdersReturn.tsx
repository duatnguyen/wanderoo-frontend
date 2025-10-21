// src/pages/admin/AdminOrdersReturn.tsx
import React, { useState } from 'react';
import { Search, MoreHorizontal, Eye, Edit, Trash2, RotateCcw, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

// Mock data for return orders
const mockReturnOrders = [
  {
    id: 'ORD001',
    customer: 'nguyenlan',
    product: 'Áo thun nữ cộc tay Jouthing Kill Producer LOVEGOS',
    originalPrice: '250.000đ',
    refundAmount: '250.000đ',
    status: 'Chờ xử lý',
    returnReason: 'Sản phẩm lỗi',
    returnType: 'Trả hàng',
    date: '2024-10-17',
    category: 'Thời trang',
    image: '/api/placeholder/50/50'
  },
  {
    id: 'ORD002',
    customer: 'maianh',
    product: 'Áo thun đài tay nhanh Kid Northumberland',
    originalPrice: '180.000đ',
    refundAmount: '180.000đ',
    status: 'Đã xử lý',
    returnReason: 'Không đúng size',
    returnType: 'Hoàn tiền',
    date: '2024-10-16',
    category: 'Thời trang',
    image: '/api/placeholder/50/50'
  },
  {
    id: 'ORD003',
    customer: 'vanminh',
    product: 'Giày thể thao nữ chất liệu thoáng khí hiking',
    originalPrice: '450.000đ',
    refundAmount: '450.000đ',
    status: 'Đã hủy',
    returnReason: 'Khách hàng thay đổi ý định',
    returnType: 'Hủy đơn',
    date: '2024-10-15',
    category: 'Webstore',
    image: '/api/placeholder/50/50'
  },
  {
    id: 'ORD004',
    customer: 'vanlinh',
    product: 'Áo hoodie ghi chữ Hip Hop crphone Vintage',
    originalPrice: '320.000đ',
    refundAmount: '0đ',
    status: 'Từ chối',
    returnReason: 'Sản phẩm đã sử dụng',
    returnType: 'Trả hàng',
    date: '2024-10-14',
    category: 'POS',
    image: '/api/placeholder/50/50'
  }
];

const AdminOrdersReturn: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders] = useState(mockReturnOrders);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã xử lý':
        return 'bg-green-100 text-green-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      case 'Từ chối':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReturnTypeColor = (type: string) => {
    switch (type) {
      case 'Trả hàng':
        return 'bg-blue-100 text-blue-800';
      case 'Hoàn tiền':
        return 'bg-green-100 text-green-800';
      case 'Hủy đơn':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders by status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trả hàng/Hoàn tiền/Hủy</h1>
          <p className="text-sm text-gray-500">Quản lý các đơn hàng trả về, hoàn tiền và hủy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
            <DollarSign className="w-4 h-4 mr-2" />
            Xử lý hoàn tiền
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <RotateCcw className="w-4 h-4 mr-2" />
            Tạo yêu cầu trả hàng
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
          className={filterStatus === 'all' ? 'bg-red-500 text-white' : ''}
        >
          Tất cả ({orders.length})
        </Button>
        <Button
          variant={filterStatus === 'Chờ xử lý' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('Chờ xử lý')}
          className={filterStatus === 'Chờ xử lý' ? 'bg-yellow-500 text-white' : ''}
        >
          Chờ xử lý ({orders.filter(o => o.status === 'Chờ xử lý').length})
        </Button>
        <Button
          variant={filterStatus === 'Đã xử lý' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('Đã xử lý')}
          className={filterStatus === 'Đã xử lý' ? 'bg-green-500 text-white' : ''}
        >
          Đã xử lý ({orders.filter(o => o.status === 'Đã xử lý').length})
        </Button>
        <Button
          variant={filterStatus === 'Đã hủy' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('Đã hủy')}
          className={filterStatus === 'Đã hủy' ? 'bg-red-500 text-white' : ''}
        >
          Đã hủy ({orders.filter(o => o.status === 'Đã hủy').length})
        </Button>
        <Button
          variant={filterStatus === 'Từ chối' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('Từ chối')}
          className={filterStatus === 'Từ chối' ? 'bg-gray-500 text-white' : ''}
        >
          Từ chối ({orders.filter(o => o.status === 'Từ chối').length})
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm đơn hàng trả về..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Loại yêu cầu
              </Button>
              <Button variant="outline" size="sm">
                Lý do trả hàng
              </Button>
              <Button variant="outline" size="sm">
                Khoảng thời gian
              </Button>
              <Button variant="outline" size="sm">
                Khách hàng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Loại yêu cầu</TableHead>
                <TableHead>Lý do trả hàng</TableHead>
                <TableHead>Giá gốc</TableHead>
                <TableHead>Số tiền hoàn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
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
                        <Badge variant="secondary" className="text-xs mt-1">
                          {order.category}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs px-2 py-1 ${getReturnTypeColor(order.returnType)}`}>
                      {order.returnType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700">{order.returnReason}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{order.originalPrice}</p>
                  </TableCell>
                  <TableCell>
                    <p className={`text-sm font-medium ${order.refundAmount === '0đ' ? 'text-red-600' : 'text-green-600'}`}>
                      {order.refundAmount}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600">{order.date}</p>
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
                        {order.status === 'Chờ xử lý' && (
                          <DropdownMenuItem className="text-green-600">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Xử lý yêu cầu
                          </DropdownMenuItem>
                        )}
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
          Hiển thị 1-{filteredOrders.length} trong tổng số {orders.length} yêu cầu trả hàng
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

export default AdminOrdersReturn;
