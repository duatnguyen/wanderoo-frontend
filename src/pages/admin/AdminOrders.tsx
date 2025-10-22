// src/pages/admin/AdminOrders.tsx
import React, { useState, useMemo } from "react";
import { Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TabMenuAccount, ChipStatus } from "@/components/common";
import type { TabMenuAccountItem, ChipStatusVariant } from "@/components/common";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    paymentType: "Tiền mặt",
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
      paymentType: "Tiền mặt",
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
      paymentType: "Chuyển khoản",
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
    paymentType: "Chuyển khoản",
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
    paymentType: "Chuyển khoản",
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
    paymentType: "Tiền mặt",
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
    paymentType: "Tiền mặt",
    status: "Chờ xác nhận",
    paymentStatus: "Chưa thanh toán",
    category: "Webstore",
    date: "2024-10-15",
    tabStatus: "pending",
  },
];

// Order tabs data
const orderTabs: TabMenuAccountItem[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "shipping", label: "Đang giao" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "returned", label: "Đã hủy" },
];

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Handle view order detail
  const handleViewOrderDetail = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getStatusVariant = (status: string): ChipStatusVariant => {
    switch (status) {
      case "Chờ xác nhận":
        return "pending";
      case "Đã xác nhận":
        return "confirmed";
      case "Đang giao":
        return "shipping";
      case "Đã hoàn thành":
        return "completed";
      case "Đã hủy":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const getPaymentStatusVariant = (status: string): ChipStatusVariant => {
    switch (status) {
      case "Đã thanh toán":
        return "paid";
      case "Chưa thanh toán":
        return "unpaid";
      case "Đã hoàn tiền":
        return "refunded";
      default:
        return "unpaid";
    }
  };

  const getPaymentTypeVariant = (paymentType: string): ChipStatusVariant => {
    switch (paymentType) {
      case "Tiền mặt":
        return "cash";
      case "Chuyển khoản":
        return "bank-transfer";
      default:
        return "cash";
    }
  };

  // Filter orders by active tab and search term
  const filteredOrders = useMemo(() => {
    const result = orders.filter((order) => {
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
    
    // Reset to page 1 when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
    return result;
  }, [orders, activeTab, searchTerm, currentPage]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);


  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredOrders.length / 10);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  return (
    <div className="flex flex-col gap-[22px] items-center px-[10px] md:px-[20px] lg:px-[50px] py-[20px] md:py-[32px] w-full">
      {/* Tab Menu */}
      <TabMenuAccount
        tabs={orderTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}/>

      {/* Orders Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[10px] md:px-[16px] lg:px-[24px] py-[16px] md:py-[24px] rounded-[24px] w-full">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
            Danh sách đơn hàng
          </h2>
        </div>

        {/* Search */}
        <div className="flex gap-[10px] items-center w-full">
          <div className="bg-white border border-[#e04d30] flex items-center justify-between px-[12px] md:px-[16px] py-[8px] rounded-[12px] w-full max-w-[500px]">
            <div className="flex items-center gap-[8px] relative flex-1">
              <span className="text-[10px] font-medium text-[#888888] leading-[1.4]">
                {searchTerm ? "" : "Tìm kiếm"}
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="absolute left-0 top-0 w-full h-full bg-transparent border-0 outline-none px-[12px] md:px-[16px] py-[8px] text-sm"
                placeholder=""
              />
            </div>
            <div className="w-6 h-6 relative">
              <Search className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border-[0.5px] border-[#d1d1d1] rounded-[24px] overflow-hidden w-full">
          <div className="overflow-x-auto">
            <Table className="table-fixed min-w-[600px] lg:min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[200px] lg:w-[250px] xl:w-[300px]">
                    <span className="font-montserrat font-semibold text-[#272424] text-[12px] md:text-[14px] leading-[1.5]">
                      Tên sản phẩm
                    </span>
                  </TableHead>
                  <TableHead className="w-[100px] lg:w-[120px] xl:w-[150px]">
                    <span className="font-montserrat font-semibold text-[#272424] text-[12px] md:text-[14px] leading-[1.5]">
                      Tổng đơn hàng
                    </span>
                  </TableHead>
                  <TableHead className="w-[80px] lg:w-[100px] xl:w-[120px]">
                    <span className="font-montserrat font-semibold text-[#272424] text-[12px] md:text-[14px] leading-[1.5]">
                      Nguồn đơn
                    </span>
                  </TableHead>
                  <TableHead className="w-[60px] lg:w-[80px] xl:w-[100px]">
                    <span className="font-montserrat font-semibold text-[#272424] text-[12px] md:text-[14px] leading-[1.5]">
                      ĐVVC
                    </span>
                  </TableHead>
                  <TableHead className="w-[100px] lg:w-[120px] xl:w-[150px]">
                    <span className="font-montserrat font-semibold text-[#272424] text-[12px] md:text-[14px] leading-[1.5]">
                      Trạng thái xử lý
                    </span>
                  </TableHead>
                  <TableHead className="w-[100px] lg:w-[120px] xl:w-[150px]">
                    <span className="font-montserrat font-semibold text-[#272424] text-[12px] md:text-[14px] leading-[1.5]">
                      Trạng thái thanh toán
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px] lg:w-[150px] xl:w-[200px] text-right">
                    <span className="font-montserrat font-semibold text-[#272424] text-[12px] md:text-[14px] leading-[1.5]">
                      Thao tác
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 md:gap-3">
                        <img
                          src={order.products[0].image}
                          alt={order.products[0].name}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-montserrat font-medium text-xs md:text-sm line-clamp-2">
                            {order.products.length === 1
                              ? order.products[0].name
                              : `${order.products[0].name} và ${order.products.length - 1} sản phẩm khác`}
                          </p>
                          <p className="font-montserrat text-xs text-gray-500">
                            {order.customer}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <ChipStatus variant={getPaymentTypeVariant(order.paymentType)} className="text-xs px-1 md:px-2 py-1">
                          {order.paymentType}
                        </ChipStatus>
                        <p className="text-xs text-blue-600 mt-1">300.000đ</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChipStatus variant="completed" className="text-xs">
                        {order.category}
                      </ChipStatus>
                    </TableCell>
                    <TableCell className="text-center text-xs md:text-sm">--</TableCell>
                    <TableCell>
                      <ChipStatus variant={getStatusVariant(order.status)} className="text-xs px-1 md:px-2 py-1">
                        {order.status}
                      </ChipStatus>
                    </TableCell>
                    <TableCell>
                      <ChipStatus variant={getPaymentStatusVariant(order.paymentStatus)} className="text-xs px-1 md:px-2 py-1">
                        {order.paymentStatus}
                      </ChipStatus>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 md:gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                          onClick={() => handleViewOrderDetail(order.id)}
                        >
                          <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="hidden sm:inline">Chi tiết</span>
                        </Button>                    
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>      

        {/* Pagination */}
        <div className="bg-white border border-[#e7e7e7] flex flex-col sm:flex-row h-auto sm:h-[48px] items-center justify-between px-[15px] md:px-[30px] py-[10px] rounded-[12px] w-full gap-2 sm:gap-0">
          <div className="flex gap-[3px] items-start">
            <div className="flex flex-col font-normal justify-center leading-[0] text-[10px] md:text-[12px] text-[#737373]">
              <p className="leading-[1.5]">
                Đang hiển thị {Math.min((currentPage - 1) * 10 + 1, filteredOrders.length)} - {Math.min(currentPage * 10, filteredOrders.length)} trong tổng {Math.ceil(filteredOrders.length / 10)} trang
              </p>
            </div>
          </div>
          <div className="flex gap-[16px] items-start">
            <div className="flex gap-[13px] items-center">
              <div className="flex flex-col font-montserrat font-normal justify-center leading-[0] text-[10px] md:text-[12px] text-[#454545]">
                <p className="leading-[1.5]">Trang số</p>
              </div>
              <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                <div className="flex flex-col font-montserrat font-normal justify-center leading-[0] text-[10px] md:text-[12px] text-[#454545]">
                  <p className="leading-[1.5]">{currentPage}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-[6px] items-start">
              <div 
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handlePrevPage}
              >
                <ChevronLeft className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] text-[#d1d1d1]" />
              </div>
              <div 
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage >= Math.ceil(filteredOrders.length / 10) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleNextPage}
              >
                <ChevronRight className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] text-[#454545]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminOrders;
