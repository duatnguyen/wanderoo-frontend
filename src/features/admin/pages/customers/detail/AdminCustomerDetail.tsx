import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { ChipStatus } from "@/components/ui/chip-status";
import { useState } from "react";
import FormInput from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";
import CityDropdown from "@/components/ui/city-dropdown";
import DistrictDropdown from "@/components/ui/district-dropdown";
import WardDropdown from "@/components/ui/ward-dropdown";
import {
  PageContainer,
  ContentCard,
} from "@/components/common";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthdate: "",
    gender: "Nữ",
    email: "",
  });
  const [addressData, setAddressData] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    detailAddress: "",
  });

  if (!customer) {
    return <div className="p-8 text-center">Khách hàng không tồn tại</div>;
  }

  const handleEditClick = () => {
    setFormData({
      name: customer.name,
      phone: customer.phone,
      birthdate: customer.registrationDate,
      gender: customer.gender || "Nữ",
      email: customer.email,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving customer data:", formData);
    setIsEditModalOpen(false);
  };

  const handleAddressEditClick = () => {
    setAddressData({
      name: customer.name,
      phone: customer.phone,
      city: "Hà Nội",
      district: "Hoàn Kiếm",
      ward: "Đinh Tiên Hoàng",
      detailAddress: customer.address || "",
    });
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = () => {
    // TODO: Implement address save logic
    console.log("Saving address data:", addressData);
    setIsAddressModalOpen(false);
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex gap-[8px] items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-[#737373]" />
          </button>
          <div className="flex gap-[4px] items-center">
            <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
              Thông tin khách hàng
            </h1>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <Button variant="secondary" className="text-[14px]">
            Hủy bỏ
          </Button>
          <Button variant="default" className="text-[14px]">
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <ContentCard>
        <div className="flex gap-[15px] w-full">
          {/* Left Column */}
          <div className="flex flex-col gap-[8px] flex-[2]">
            {/* Customer Summary Card */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[20px] h-[120px] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-[16px] flex-1">
                <div className="w-[70px] h-[70px] rounded-[12px] border-2 border-dashed border-[#d1d1d1] p-[4px] bg-[#f8f9fa]">
                  <Avatar className="w-full h-full rounded-[8px]">
                    {customer.avatar ? (
                      <AvatarImage src={customer.avatar} alt={customer.name} />
                    ) : (
                      <AvatarFallback className="bg-[#1a71f6] text-white text-[24px] font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <h3 className="font-bold text-[#272424] text-[20px] leading-[1.3]">
                    {customer.name}
                  </h3>
                  <div className="flex items-center gap-[8px]">
                    <span className="font-medium text-[#737373] text-[14px] leading-[1.4]">
                      Mã KH:
                    </span>
                    <span className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4]">
                      {customer.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#28a745]"></div>
                    <span className="font-medium text-[#28a745] text-[12px] leading-[1.4]">
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-[32px] items-center">
                <div className="flex flex-col items-center gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Tổng chi tiêu
                  </p>
                  <p className="font-bold text-[#272424] text-[24px] leading-normal">
                    {customer.totalSpent.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="w-[1px] h-[40px] bg-[#d1d1d1]"></div>
                <div className="flex flex-col items-center gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Đơn hàng
                  </p>
                  <p className="font-bold text-[#272424] text-[24px] leading-normal">
                    {customer.totalOrders}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] flex flex-col h-[400px]">
              {/* Header - Fixed */}
              <div className="flex items-center justify-between border-b border-[#d1d1d1] px-[16px] pt-[16px] pb-[8px] flex-shrink-0">
                <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Đơn hàng gần đây
                </p>
                <p className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer">
                  Xem tất cả
                </p>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col py-[8px]">
                  {customer.recentOrders?.map((order, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between px-[16px] py-[8px] ${index < customer.recentOrders.length - 1
                        ? "border-b border-[#d1d1d1]"
                        : ""
                        }`}
                    >
                      <div className="flex flex-col gap-[4px]">
                        <p className="font-semibold text-[#1a71f6] text-[12px] leading-[1.5]">
                          {order.id}
                        </p>
                        <p className="font-normal text-[#737373] text-[12px] leading-[1.4]">
                          Nguồn: {order.source} • {order.date}
                        </p>
                      </div>
                      <div className="flex gap-[15px]">
                        <ChipStatus
                          status={
                            order.paymentStatus === "Đã thanh toán"
                              ? "paid"
                              : order.paymentStatus === "Đã hoàn tiền 1 phần"
                                ? "pending"
                                : "processing"
                          }
                          labelOverride={order.paymentStatus}
                          size="small"
                        />
                        <ChipStatus
                          status={
                            order.fulfillmentStatus === "Đã hoàn thành"
                              ? "completed"
                              : order.fulfillmentStatus === "Đã thanh toán"
                                ? "paid"
                                : "processing"
                          }
                          labelOverride={order.fulfillmentStatus}
                          size="small"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Pagination - Fixed at bottom */}
            <Pagination
              current={currentPage}
              total={1}
              onChange={setCurrentPage}
            />
          </div>


          {/* Right Column */}
          <div className="flex flex-col gap-[8px] flex-[1]">
            {/* Contact Info */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[16px] flex flex-col gap-[12px] h-[180px]">
              <div className="flex items-center justify-between border-b border-[#d1d1d1] pb-[8px]">
                <p className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                  Thông tin liên hệ
                </p>
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] hover:bg-[#f5f5f5] transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
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
                  <span className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4]">
                    Chỉnh sửa
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Họ và tên
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4]">
                    {customer.name}
                  </p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Số điện thoại
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4]">
                    {customer.phone}
                  </p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Giới tính
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4]">
                    {customer.gender}
                  </p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Địa chỉ email
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4] break-all">
                    {customer.email}
                  </p>
                </div>
              </div>
            </div>
F
            {/* Address Book */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[16px] flex flex-col gap-[12px] h-[200px]">
              <div className="flex items-center justify-between border-b border-[#d1d1d1] pb-[8px]">
                <p className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                  Địa chỉ giao hàng
                </p>
                <button
                  onClick={handleAddressEditClick}
                  className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] hover:bg-[#f5f5f5] transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
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
                  <span className="font-semibold text-[#1a71f6] text-[14px] leading-[1.4]">
                    Chỉnh sửa
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Người nhận
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4]">
                    {customer.name}
                  </p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Số điện thoại
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4]">
                    {customer.phone}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[4px]">
                <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                  Địa chỉ chi tiết
                </p>
                <p className="font-semibold text-[#272424] text-[15px] leading-[1.5] break-words">
                  {customer.address?.replace(/Hà Nội/g, "Hà\u00A0Nội")}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[16px] flex flex-col gap-[12px] flex-1">
              <div className="border-b border-[#d1d1d1] pb-[8px]">
                <p className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                  Ghi chú
                </p>
                <p className="font-normal text-[#737373] text-[12px] leading-[1.4] mt-[2px]">
                  Thêm thông tin quan trọng về khách hàng
                </p>
              </div>
              <textarea
                className="border border-[#d1d1d1] rounded-[8px] p-[16px] flex-1 resize-none font-normal text-[#272424] text-[14px] leading-[1.5] focus:border-[#1a71f6] focus:outline-none transition-colors"
                placeholder="Nhập ghi chú về khách hàng, lịch sử mua hàng, sở thích, yêu cầu đặc biệt..."
              />
            </div>
          </div>
        </div>
      </ContentCard>

      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-[8px] p-[32px] w-[658px] shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-[20px] font-bold text-[#272424] mb-[24px]">
              Cập nhật thông tin liên hệ
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-[16px]">
              {/* Name and Phone */}
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Họ và tên
                  </label>
                  <FormInput
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Số điện thoại
                  </label>
                  <FormInput
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              {/* Birthdate and Gender */}
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Ngày sinh
                  </label>
                  <FormInput
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthdate: e.target.value })
                    }
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Giới tính
                  </label>
                  <div className="flex gap-[24px] items-center h-[54px]">
                    <CustomRadio
                      label="Nữ"
                      checked={formData.gender === "Nữ"}
                      onChange={() =>
                        setFormData({ ...formData, gender: "Nữ" })
                      }
                    />
                    <CustomRadio
                      label="Nam"
                      checked={formData.gender === "Nam"}
                      onChange={() =>
                        setFormData({ ...formData, gender: "Nam" })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Địa chỉ email
                </label>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-[12px] justify-end mt-[8px]">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button variant="default" onClick={handleSave}>
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isAddressModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            className="bg-white rounded-[8px] p-[32px] w-[658px] shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-[20px] font-bold text-[#272424] mb-[24px]">
              Cập nhật địa chỉ giao hàng
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-[16px]">
              {/* Name and Phone */}
              <div className="grid grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Họ và tên
                  </label>
                  <FormInput
                    value={addressData.name}
                    onChange={(e) =>
                      setAddressData({ ...addressData, name: e.target.value })
                    }
                    placeholder="Nhập tên người nhận"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Số điện thoại
                  </label>
                  <FormInput
                    value={addressData.phone}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Nhập số điện thoại người nhận"
                  />
                </div>
              </div>

              {/* City */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Tỉnh/Thành phố
                </label>
                <CityDropdown
                  value={addressData.city}
                  onValueChange={(value) =>
                    setAddressData({ ...addressData, city: value })
                  }
                  placeholder="Chọn tỉnh/thành phố"
                />
              </div>

              {/* District */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Phường/Xã
                </label>
                <WardDropdown
                  value={addressData.ward}
                  onValueChange={(value) =>
                    setAddressData({ ...addressData, ward: value })
                  }
                  placeholder="Chọn phường/xã"
                />
              </div>

              {/* Ward */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Quận/Huyện
                </label>
                <DistrictDropdown
                  value={addressData.district}
                  onValueChange={(value) =>
                    setAddressData({ ...addressData, district: value })
                  }
                  placeholder="Chọn quận/huyện"
                />
              </div>

              {/* Detail Address */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Địa chỉ chi tiết <span className="text-[#e04d30]">*</span>
                </label>
                <FormInput
                  value={addressData.detailAddress}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      detailAddress: e.target.value,
                    })
                  }
                  placeholder="Nhập số nhà, tên đường..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-[12px] justify-end mt-[8px]">
                <Button
                  variant="secondary"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button variant="default" onClick={handleAddressSave}>
                  Lưu địa chỉ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminCustomerDetail;
