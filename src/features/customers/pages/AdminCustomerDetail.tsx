import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

// Mock type and data, eventually get from API or context
const mockCustomers = [
  {
    id: "C001",
    name: "Thanh",
    username: "thanh",
    email: "---",
    phone: "+84234245969",
    gender: "Nữ",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-01-15",
    totalOrders: 2,
    totalSpent: 1000000,
    address: "Phường Phố Huế, Quận Hai Bà Trưng, Hà Nội",
    recentOrders: [
      {
        id: "10292672H68229",
        source: "POS",
        date: "19/7/2025 15:50",
        paymentStatus: "Đã thanh toán",
        fulfillmentStatus: "Đã hoàn thành",
      },
      {
        id: "10292672H68229",
        source: "POS",
        date: "19/7/2025 15:50",
        paymentStatus: "Đã hoàn tiền 1 phần",
        fulfillmentStatus: "Đã thanh toán",
      },
    ],
  },
  {
    id: "C002",
    name: "Trần Thị Bình",
    username: "tranthibinh",
    email: "tranthibinh@email.com",
    phone: "0987654321",
    gender: "Nữ",
    status: "active",
    avatar: "/api/placeholder/70/70",
    registrationDate: "2024-02-20",
    totalOrders: 18,
    totalSpent: 8900000,
    address: "Hà Nội",
    recentOrders: [],
  },
];

const AdminCustomerDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const customer = mockCustomers.find((c) => c.id === customerId);

  if (!customer) {
    return <div className="p-8 text-center">Không tìm thấy khách hàng</div>;
  }

  return (
    <div className="flex flex-col gap-[10px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px] py-[10px] w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-[8px] items-center">
            <button
              onClick={() => navigate(-1)}
              className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-[18px] h-[18px] text-[#737373]" />
            </button>
            <div className="flex gap-[4px] items-center">
              <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
                {customer.name}
              </h1>
              <p className="font-normal text-[#272424] text-[12px] leading-[1.5]">
                ID Khách hàng: {customerId}
              </p>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <Button variant="secondary">Huỷ</Button>
            <Button variant="default">Lưu</Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-[15px] w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-[8px] flex-1">
          {/* Customer Summary Card */}
          <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[14px] h-[152px] flex items-center justify-between">
            <div className="flex gap-[8px] items-center">
              <Avatar className="w-[70px] h-[70px] rounded-[25px]">
                {customer.avatar ? (
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                ) : (
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <p className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                {customer.name}
              </p>
            </div>
            <div className="flex flex-col gap-[8px] items-center text-[#272424]">
              <p className="font-semibold text-[16px] leading-[1.4]">
                Tổng chi tiêu
              </p>
              <p className="font-bold text-[20px] leading-normal">
                {customer.totalSpent.toLocaleString("vi-VN")}đ
              </p>
              <p className="font-semibold text-[16px] leading-[1.4]">
                {customer.totalOrders} đơn hàng
              </p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white border border-[#d1d1d1] rounded-[24px] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#d1d1d1] px-[16px] pt-[16px] pb-[8px]">
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Đơn hàng gần đây
              </p>
              <p className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer">
                Danh sách đơn hàng
              </p>
            </div>
            <div className="flex flex-col py-[8px]">
              {customer.recentOrders?.map((order, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-[16px] py-[8px] ${
                    index < customer.recentOrders.length - 1
                      ? "border-b border-[#d1d1d1]"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-semibold text-[#1a71f6] text-[12px] leading-[1.5]">
                      {order.id}
                    </p>
                    <p className="font-normal text-[#737373] text-[12px] leading-[1.4]">
                      Từ {order.source} | {order.date}
                    </p>
                  </div>
                  <div className="flex gap-[15px]">
                    <div
                      className={`px-[8px] py-[6px] rounded-[10px] ${
                        order.paymentStatus === "Đã thanh toán"
                          ? "bg-[#b2ffb4]"
                          : "bg-[#d9edff]"
                      }`}
                    >
                      <p
                        className={`font-bold text-[14px] leading-normal ${
                          order.paymentStatus === "Đã thanh toán"
                            ? "text-[#04910c]"
                            : "text-[#1a71f6]"
                        }`}
                      >
                        {order.paymentStatus}
                      </p>
                    </div>
                    <div className="px-[8px] py-[6px] rounded-[10px] bg-[#b2ffb4]">
                      <p className="font-bold text-[#04910c] text-[14px] leading-normal">
                        {order.fulfillmentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-[16px] py-[8px]">
              <div className="bg-white rounded-[12px] px-[30px] py-[10px] h-[48px] flex items-center justify-between">
                <p className="font-normal text-[#737373] text-[12px] leading-[1.5]">
                  Đang hiển thị 1 - 10 trong tổng 1 trang
                </p>
                <div className="flex gap-[16px] items-center">
                  <div className="flex gap-[13px] items-center">
                    <p className="font-normal text-[#454545] text-[12px] leading-[1.5]">
                      Trang số
                    </p>
                    <div className="px-[8px] py-[4px] rounded-[8px]">
                      <p className="font-normal text-[#454545] text-[12px] leading-[1.5]">
                        1
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-[6px]">
                    <button className="border border-[#b0b0b0] rounded-[8px] px-[6px] py-[4px] w-[32px] h-[28px] flex items-center justify-center">
                      <ArrowLeft className="w-[20px] h-[20px] text-[#d1d1d1]" />
                    </button>
                    <button className="border border-[#b0b0b0] rounded-[8px] px-[6px] py-[4px] w-[32px] h-[28px] flex items-center justify-center">
                      <ArrowLeft className="w-[20px] h-[20px] text-[#d1d1d1] rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[8px] w-[428px]">
          {/* Contact Info */}
          <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[16px] flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Liên hệ
              </p>
              <button className="flex items-center gap-[6px] px-[6px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 14L10 6M10 6H4M10 6V12"
                    stroke="#1a71f6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-[#1a71f6] text-[12px] leading-[1.4]">
                  Chỉnh sửa
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                Tên khách hàng
              </p>
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                {customer.name}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                Số điện thoại
              </p>
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                {customer.phone}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                Giới tính
              </p>
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                {customer.gender}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                Email
              </p>
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                {customer.email}
              </p>
            </div>
          </div>

          {/* Address Book */}
          <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[16px] flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Sổ địa chỉ
              </p>
              <button className="flex items-center gap-[6px] px-[6px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 14L10 6M10 6H4M10 6V12"
                    stroke="#1a71f6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-[#1a71f6] text-[12px] leading-[1.4]">
                  Chỉnh sửa
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                Tên khách hàng
              </p>
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                {customer.name}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                Số điện thoại
              </p>
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                {customer.phone}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                Địa chỉ
              </p>
              <p className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                {customer.address}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[16px] flex flex-col gap-[6px] h-[234px]">
            <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
              Ghi chú
            </p>
            <div className="flex-1 border border-[#d1d1d1] rounded-[12px] p-[16px]">
              <p className="font-normal text-[#737373] text-[12px] leading-[1.5]">
                Viết ghi chú vào đây
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerDetail;
