// src/components/admin/CustomerOrderCard.tsx
import { Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface CustomerOrderCardProps {
    order: {
        id: string;
        customer: string;
        products: {
            id: number;
            name: string;
            price: string;
            quantity: number;
            image: string;
        }[];
        totalPrice: string;
        status: string;
        paymentStatus: string;
        category: string;
        date: string;
        tabStatus: string;
    };
    onViewDetails?: (orderId: string) => void;
}

export function CustomerOrderCard({ order, onViewDetails }: CustomerOrderCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Chờ xác nhận':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã xác nhận':
                return 'bg-blue-100 text-blue-800';
            case 'Đang giao':
                return 'bg-purple-100 text-purple-800';
            case 'Đã hoàn thành':
                return 'bg-green-100 text-green-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'Đã thanh toán':
                return 'bg-green-100 text-green-800';
            case 'Chưa thanh toán':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã hoàn tiền':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                {order.customer.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {order.customer}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Mã đơn hàng:</span>
                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {order.id}
                        </span>
                    </div>
                </div>

                {/* Products List */}
                <div className="mb-4">
                    <div className="space-y-3">
                        {order.products.map((product) => (
                            <div key={product.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">
                                        {product.name}
                                    </h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm font-semibold text-blue-600">
                                            {product.price}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Số lượng: {product.quantity}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Price */}
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">
                                Tổng cộng:
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                {order.totalPrice}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {order.products.length} sản phẩm
                        </div>
                    </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                            {order.category}
                        </Badge>
                        <span className="text-xs text-gray-500">•••</span>
                        <div className="flex gap-2">
                            <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                                {order.status}
                            </Badge>
                            <Badge className={`text-xs px-2 py-1 ${getPaymentStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onViewDetails?.(order.id)}
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem chi tiết
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="text-blue-600"
                                    onClick={() => onViewDetails?.(order.id)}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Chỉnh sửa đơn hàng
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                    Hủy đơn hàng
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}