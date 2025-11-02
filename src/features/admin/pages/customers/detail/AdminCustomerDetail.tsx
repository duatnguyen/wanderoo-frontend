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
    return <div className="p-8 text-center">Không tìm thấy khách hàng</div>;
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
    <div className="w-full overflow-x-auto min-h-screen">
      <div className="flex flex-col gap-[10px] items-start w-full max-w-[1100px] mx-auto px-[24px] min-w-[1070px] pb-[32px]">
        {/* Header */}
        <div className="flex flex-col gap-[8px] pt-[10px] pb-0 w-full">
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
            <Button variant="secondary" className="text-[14px]">Huỷ</Button>
            <Button variant="default" className="text-[14px]">Lưu</Button>
          </div>
        </div>
      </div>

        {/* Content */}
        <div className="flex gap-[15px] w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-[8px] flex-1">
          {/* Customer Summary Card */}
          <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[10px] h-[100px] flex items-center justify-between">
            <div className="flex w-full gap-[8px] items-start">
              <div className="w-[60px] h-[60px] rounded-[8px] border-2 border-dashed border-[#d1d1d1] p-[3px]">
                <Avatar className="w-full h-full rounded-[8px]">
                  {customer.avatar ? (
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                  ) : (
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <p className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                {customer.name}
              </p>
            </div>
            <div className="flex w-full flex-col gap-[4px] items-center text-[#272424]">
              <p className="font-normal text-[14px] leading-[1.4]">
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
          <div className="bg-white border border-[#d1d1d1] rounded-[8px] flex flex-col">
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
                    <ChipStatus
                      status={
                        order.paymentStatus === "Đã thanh toán"
                          ? "paid"
                          : "processing"
                      }
                      labelOverride={order.paymentStatus}
                      className="font-bold text-[14px] leading-normal"
                    />
                    <ChipStatus
                      status="completed"
                      labelOverride={order.fulfillmentStatus}
                      className="font-bold text-[14px] leading-normal"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-[16px] py-[8px]">
              <Pagination
                current={currentPage}
                total={1}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[8px] w-[400px]">
          {/* Contact Info */}
          <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[12px] flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Liên hệ
              </p>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-[4px] px-[4px] hover:opacity-80 transition-opacity"
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
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                Tên khách hàng
              </p>
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                {customer.name}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                Số điện thoại
              </p>
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                {customer.phone}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                Giới tính
              </p>
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                {customer.gender}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                Email
              </p>
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                {customer.email}
              </p>
            </div>
          </div>

          {/* Address Book */}
          <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[12px] flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Sổ địa chỉ
              </p>
              <button
                onClick={handleAddressEditClick}
                className="flex items-center gap-[4px] px-[4px] hover:opacity-80 transition-opacity"
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
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                Tên khách hàng
              </p>
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                {customer.name}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                Số điện thoại
              </p>
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                {customer.phone}
              </p>
            </div>
            <div className="flex items-start justify-between gap-[8px]">
              <p className="font-medium text-[#272424] text-[14px] leading-[1.4] flex-shrink-0">
                Địa chỉ
              </p>
              <p className="font-semibold text-[#272424] text-[14px] leading-[1.4] break-words flex-1 text-right">
                {customer.address?.replace(/Hà Nội/g, 'Hà\u00A0Nội')}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-[#d1d1d1] rounded-[8px] p-[16px] flex flex-col gap-[6px]">
            <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
              Ghi chú
            </p>
            <textarea
              className="border border-[#d1d1d1] rounded-[8px] p-[16px] h-[120px] resize-none font-normal text-[#737373] text-[14px] leading-[1.5] focus:border-orange-500 focus:outline-none"
              placeholder="Nhập ghi chú tại đây (Nếu có)"
            />
          </div>
        </div>
      </div>

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
                    placeholder="Nguyễn Thị Thanh"
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
                    placeholder="0234245969"
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
                    placeholder="20 / 10 / 1997"
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
                  Email
                </label>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="thanh@gmail.com"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-[12px] justify-end mt-[8px]">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Huỷ
                </Button>
                <Button variant="default" onClick={handleSave}>
                  Xác nhận
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
              Cập nhật thông tin địa chỉ
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
                    placeholder="Nguyễn Thị Thanh"
                  />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Số điện thoại
                  </label>
                  <FormInput
                    value={addressData.phone}
                    onChange={(e) =>
                      setAddressData({ ...addressData, phone: e.target.value })
                    }
                    placeholder="0234245969"
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
                  placeholder="Hà Nội"
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
                  placeholder="Đinh Tiên Hoàng"
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
                  placeholder="Hoàn Kiếm"
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
                  placeholder="40 Đinh Tiên Hoàng, Hà Nội"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-[12px] justify-end mt-[8px]">
                <Button
                  variant="secondary"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Huỷ
                </Button>
                <Button variant="default" onClick={handleAddressSave}>
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      <div className="h-[calc(100vh-200px)]"></div>
    </div>
  );
};

export default AdminCustomerDetail;
