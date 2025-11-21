import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { ChipStatus } from "@/components/ui/chip-status";
import { useState, useEffect } from "react";
import FormInput from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";
import CityDropdown from "@/components/ui/city-dropdown";
import DistrictDropdown from "@/components/ui/district-dropdown";
import WardDropdown from "@/components/ui/ward-dropdown";
import { PageContainer, ContentCard } from "@/components/common";
import {
  getCustomerById,
  updateCustomer,
  getCustomerAddresses,
  updateCustomerAddress,
  createCustomerAddress,
} from "@/api/endpoints/userApi";
import { toast } from "sonner";
import type { CustomerResponse, CustomerUpdateRequest } from "@/types/api";
import type {
  AddressResponse,
  AddressUpdateRequest,
  AddressCreationRequest,
} from "@/types";

const AdminCustomerDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    id: null as number | null,
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    location: "",
    wardCode: "",
    districtId: null as number | null,
  });
  const [defaultAddress, setDefaultAddress] = useState<AddressResponse | null>(
    null
  );

  // Fetch customer data from API
  const {
    data: customer,
    isLoading,
    isError,
    refetch: refetchCustomer,
  } = useQuery<CustomerResponse>({
    queryKey: ["admin-customer-detail", customerId],
    queryFn: () => getCustomerById(Number(customerId)),
    enabled: !!customerId,
  });

  // Fetch customer addresses
  const { data: addressesData, refetch: refetchAddresses } = useQuery({
    queryKey: ["admin-customer-addresses", customerId],
    queryFn: () => getCustomerAddresses(Number(customerId)),
    enabled: !!customerId,
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: (data: CustomerUpdateRequest) => {
      console.log("updateCustomerMutation called with:", data);
      return updateCustomer(data.id, data);
    },
    onSuccess: async () => {
      toast.success("Cập nhật thông tin khách hàng thành công");
      await refetchCustomer();
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      setIsEditModalOpen(false);
    },
    onError: (error: any) => {
      console.error("updateCustomerMutation error:", error);
      console.error("Error response:", error?.response);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật thông tin khách hàng";
      toast.error(errorMessage);
    },
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: (data: AddressUpdateRequest) => {
      console.log("updateAddressMutation called with:", data);
      return updateCustomerAddress(Number(customerId), data);
    },
    onSuccess: async () => {
      toast.success("Cập nhật địa chỉ giao hàng thành công");
      await refetchAddresses();
      setIsAddressModalOpen(false);
    },
    onError: (error: any) => {
      console.error("updateAddressMutation error:", error);
      console.error("Error response:", error?.response);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật địa chỉ giao hàng";
      toast.error(errorMessage);
    },
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: (data: AddressCreationRequest) =>
      createCustomerAddress(Number(customerId), data),
    onSuccess: async () => {
      toast.success("Tạo địa chỉ giao hàng thành công");
      await refetchAddresses();
      setIsAddressModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tạo địa chỉ giao hàng";
      toast.error(errorMessage);
    },
  });

  // Initialize form data when customer data is loaded
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        birthdate: customer.birthday
          ? new Date(customer.birthday).toISOString().split("T")[0]
          : "",
        gender:
          (customer.gender?.toLowerCase() === "male" ? "Nam" : "Nữ") || "Nữ",
        email: customer.email || "",
      });
    }
  }, [customer]);

  // Initialize default address when addresses are loaded
  useEffect(() => {
    if (addressesData?.addresses && addressesData.addresses.length > 0) {
      // Find default address or use first address
      const defaultAddr =
        addressesData.addresses.find(
          (addr) => addr.isDefault === "Địa chỉ mặc định"
        ) || addressesData.addresses[0];
      setDefaultAddress(defaultAddr);
    } else {
      setDefaultAddress(null);
    }
  }, [addressesData]);

  // Loading state
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-8">
          <p className="text-[#272424] text-[16px]">
            Đang tải thông tin khách hàng...
          </p>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (isError || !customer) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-8">
          <p className="text-[#272424] text-[16px]">
            {isError
              ? "Không thể tải thông tin khách hàng"
              : "Không tìm thấy khách hàng"}
          </p>
        </div>
      </PageContainer>
    );
  }

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (!customer) return;

    console.log("handleSave called with formData:", formData);

    // Validation
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    const updateData: CustomerUpdateRequest = {
      id: customer.id,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      username: customer.username, // Keep existing username
      password: "", // Password not required for update - backend will skip encoding if empty
      gender: formData.gender === "Nam" ? "MALE" : "FEMALE", // Convert to backend format
      birthday: formData.birthdate
        ? new Date(formData.birthdate).toISOString()
        : customer.birthday
          ? new Date(customer.birthday).toISOString()
          : undefined,
      // Note: address field is for contact address, not delivery address
      // Delivery address is managed separately via Address entity
    };

    console.log("Updating customer with data:", updateData);
    updateCustomerMutation.mutate(updateData);
  };

  const handleAddressEditClick = () => {
    if (defaultAddress) {
      // Edit existing address
      setAddressData({
        id: defaultAddress.id,
        name: defaultAddress.name || customer.name,
        phone: defaultAddress.phone || customer.phone,
        province: defaultAddress.province || "",
        district: defaultAddress.district || "",
        ward: defaultAddress.ward || "",
        location: defaultAddress.location || "",
        wardCode: defaultAddress.wardCode || "",
        districtId: defaultAddress.districtId || null,
      });
    } else {
      // Create new address
      setAddressData({
        id: null,
        name: customer.name,
        phone: customer.phone,
        province: "",
        district: "",
        ward: "",
        location: "",
        wardCode: "",
        districtId: null,
      });
    }
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = () => {
    if (!customerId) return;

    console.log("handleAddressSave called with addressData:", addressData);

    // Validation
    if (!addressData.name.trim()) {
      toast.error("Vui lòng nhập tên người nhận");
      return;
    }
    if (!addressData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!addressData.province.trim()) {
      toast.error("Vui lòng chọn tỉnh/thành phố");
      return;
    }
    if (!addressData.district.trim()) {
      toast.error("Vui lòng chọn quận/huyện");
      return;
    }
    if (!addressData.ward.trim()) {
      toast.error("Vui lòng chọn phường/xã");
      return;
    }
    if (!addressData.location.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    // Use existing wardCode and districtId if available, otherwise use defaults
    // Note: In production, these should be fetched from an API based on selected district/ward
    const finalWardCode = addressData.wardCode.trim() || "WARD001";
    const finalDistrictId = addressData.districtId || 1;

    if (addressData.id) {
      // Update existing address
      const updateData: AddressUpdateRequest = {
        id: addressData.id,
        name: addressData.name.trim(),
        phone: addressData.phone.trim(),
        province: addressData.province.trim(),
        district: addressData.district.trim(),
        ward: addressData.ward.trim(),
        location: addressData.location.trim(),
        wardCode: finalWardCode,
        districtId: finalDistrictId,
      };
      console.log("Updating address with data:", updateData);
      updateAddressMutation.mutate(updateData);
    } else {
      // Create new address
      const createData: AddressCreationRequest = {
        name: addressData.name.trim(),
        phone: addressData.phone.trim(),
        province: addressData.province.trim(),
        district: addressData.district.trim(),
        ward: addressData.ward.trim(),
        location: addressData.location.trim(),
        wardCode: finalWardCode,
        districtId: finalDistrictId,
      };
      console.log("Creating address with data:", createData);
      createAddressMutation.mutate(createData);
    }
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
                    <div
                      className={`w-[6px] h-[6px] rounded-full ${customer.status?.toUpperCase() === "ACTIVE" ? "bg-[#28a745]" : "bg-[#dc3545]"}`}
                    ></div>
                    <span
                      className={`font-medium text-[12px] leading-[1.4] ${customer.status?.toUpperCase() === "ACTIVE" ? "text-[#28a745]" : "text-[#dc3545]"}`}
                    >
                      {customer.status?.toUpperCase() === "ACTIVE"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
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
                    ---
                  </p>
                </div>
                <div className="w-[1px] h-[40px] bg-[#d1d1d1]"></div>
                <div className="flex flex-col items-center gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Đơn hàng
                  </p>
                  <p className="font-bold text-[#272424] text-[24px] leading-normal">
                    ---
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
                  {/* Note: Recent orders would need to be fetched separately */}
                  <div className="px-[16px] py-[8px] text-[#737373] text-[14px]">
                    Chức năng đơn hàng gần đây sẽ được tích hợp sau
                  </div>
                  {/* {customer.recentOrders?.map((order, index) => (
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
                  ))} */}
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
                    {customer.gender
                      ? customer.gender.toLowerCase() === "male"
                        ? "Nam"
                        : "Nữ"
                      : "---"}
                  </p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Địa chỉ email
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4] break-all">
                    {customer.email || "---"}
                  </p>
                </div>
              </div>
            </div>

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
                    {defaultAddress?.name || customer.name}
                  </p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Số điện thoại
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4]">
                    {defaultAddress?.phone || customer.phone}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[4px]">
                <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                  Địa chỉ chi tiết
                </p>
                <p className="font-semibold text-[#272424] text-[15px] leading-[1.5] break-words">
                  {defaultAddress
                    ? `${defaultAddress.location || ""}, ${defaultAddress.ward || ""}, ${defaultAddress.district || ""}, ${defaultAddress.province || ""}`
                        .replace(/^,\s*|,\s*$/g, "")
                        .trim() || "Chưa có địa chỉ"
                    : "Chưa có địa chỉ"}
                </p>
              </div>
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
            className="bg-white rounded-[8px] p-[24px] w-[520px] shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-[20px] font-bold text-[#272424] mb-[16px]">
              Cập nhật thông tin liên hệ
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-[12px]">
              {/* Name and Phone */}
              <div className="grid grid-cols-2 gap-[12px]">
                <div className="flex flex-col gap-[6px]">
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
                <div className="flex flex-col gap-[6px]">
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
              <div className="grid grid-cols-2 gap-[12px]">
                <div className="flex flex-col gap-[6px]">
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
                <div className="flex flex-col gap-[6px]">
                  <label className="font-medium text-[#272424] text-[14px]">
                    Giới tính
                  </label>
                  <div className="flex gap-[16px] items-center h-[40px]">
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
              <div className="flex flex-col gap-[6px]">
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
              <div className="flex gap-[12px] justify-end mt-[4px]">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="default"
                  onClick={handleSave}
                  disabled={updateCustomerMutation.isPending}
                >
                  {updateCustomerMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu thay đổi"}
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
            className="bg-white rounded-[8px] p-[24px] w-[520px] shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-[20px] font-bold text-[#272424] mb-[16px]">
              Cập nhật địa chỉ giao hàng
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-[12px]">
              {/* Name and Phone */}
              <div className="grid grid-cols-2 gap-[12px]">
                <div className="flex flex-col gap-[6px]">
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
                <div className="flex flex-col gap-[6px]">
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

              {/* Province */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Tỉnh/Thành phố <span className="text-[#e04d30]">*</span>
                </label>
                <CityDropdown
                  value={addressData.province}
                  onValueChange={(value) =>
                    setAddressData({ ...addressData, province: value })
                  }
                  placeholder="Chọn tỉnh/thành phố"
                />
              </div>

              {/* District */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Quận/Huyện <span className="text-[#e04d30]">*</span>
                </label>
                <DistrictDropdown
                  value={addressData.district}
                  onValueChange={(value) => {
                    setAddressData({
                      ...addressData,
                      district: value,
                      // Note: districtId will need to be set manually or via API
                      // For now, we'll use a placeholder value
                      districtId: addressData.districtId || 1,
                    });
                  }}
                  placeholder="Chọn quận/huyện"
                />
              </div>

              {/* Ward */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Phường/Xã <span className="text-[#e04d30]">*</span>
                </label>
                <WardDropdown
                  value={addressData.ward}
                  onValueChange={(value) => {
                    setAddressData({
                      ...addressData,
                      ward: value,
                      // Note: wardCode will need to be set manually or via API
                      // For now, we'll use a placeholder value
                      wardCode: addressData.wardCode || "WARD001",
                    });
                  }}
                  placeholder="Chọn phường/xã"
                />
              </div>

              {/* Detail Address */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Địa chỉ chi tiết <span className="text-[#e04d30]">*</span>
                </label>
                <FormInput
                  value={addressData.location}
                  onChange={(e) =>
                    setAddressData({
                      ...addressData,
                      location: e.target.value,
                    })
                  }
                  placeholder="Nhập số nhà, tên đường..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-[12px] justify-end mt-[4px]">
                <Button
                  variant="secondary"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="default"
                  onClick={handleAddressSave}
                  disabled={
                    updateAddressMutation.isPending ||
                    createAddressMutation.isPending
                  }
                >
                  {updateAddressMutation.isPending ||
                  createAddressMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu địa chỉ"}
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
