import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { ChipStatus } from "@/components/ui/chip-status";
import { useState, useEffect, useMemo } from "react";
import FormInput from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";
import {
  PageContainer,
  ContentCard,
} from "@/components/common";
import { getCustomerById, updateCustomer, getCustomerAddresses, updateCustomerAddress, createCustomerAddress } from "@/api/endpoints/userApi";
import { getProvinces, getDistrictsByPath, getWardsByPath } from "@/api/endpoints/shippingApi";
import { getCustomerOrders } from "@/api/endpoints/orderApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CaretDown from "@/components/ui/caret-down";
import { toast } from "sonner";
import type { CustomerResponse, CustomerUpdateRequest } from "@/types/api";
import type { AddressResponse, AddressUpdateRequest, AddressCreationRequest, ProvinceResponse, DistrictResponse, WardResponse } from "@/types";

type CustomerAddressFormState = {
  id: number | null;
  name: string;
  phone: string;
  province: string;
  provinceId: number | null;
  district: string;
  districtId: number | null;
  ward: string;
  wardCode: string;
  location: string;
};

const normalizeAddressPart = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower === "null" || lower === "undefined") return "";
  return trimmed;
};

const formatAddressText = (address?: AddressResponse | null) => {
  if (!address) return "Chưa có địa chỉ";

  const normalizedFull = normalizeAddressPart(address.fullAddress);
  if (normalizedFull) {
    return normalizedFull;
  }

  const parts = [
    normalizeAddressPart(address.street) || normalizeAddressPart((address as any).location),
    normalizeAddressPart(address.wardName) || normalizeAddressPart((address as any).ward),
    normalizeAddressPart(address.districtName) || normalizeAddressPart((address as any).district),
    normalizeAddressPart(address.provinceName) || normalizeAddressPart((address as any).province),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Chưa có địa chỉ";
};

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
  const [addressData, setAddressData] = useState<CustomerAddressFormState>({
    id: null,
    name: "",
    phone: "",
    province: "",
    provinceId: null,
    district: "",
    districtId: null,
    ward: "",
    wardCode: "",
    location: "",
  });
  const [defaultAddress, setDefaultAddress] = useState<AddressResponse | null>(null);
  const formattedDefaultAddress = useMemo(
    () => formatAddressText(defaultAddress),
    [defaultAddress]
  );

  const shouldHideLocationName = (name: string) => {
    const normalized = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return normalized.includes("test") || normalized === "ha noi 02";
  };

  const {
    data: provincesData,
    isLoading: isLoadingProvinces,
    isError: isProvinceError,
  } = useQuery({
    queryKey: ["shipping-provinces"],
    queryFn: getProvinces,
  });

  const provinces = useMemo(() => {
    if (!provincesData) return [];
    return provincesData
      .filter((province) => !shouldHideLocationName(province.provinceName))
      .sort((a, b) =>
        a.provinceName.localeCompare(b.provinceName, "vi", { sensitivity: "base" })
      );
  }, [provincesData]);

  const {
    data: districtsData,
    isLoading: isLoadingDistricts,
    isError: isDistrictError,
  } = useQuery({
    queryKey: ["shipping-districts", addressData.provinceId],
    queryFn: async () => {
      if (!addressData.provinceId) return [];
      return getDistrictsByPath(addressData.provinceId);
    },
    enabled: Boolean(addressData.provinceId),
  });

  const districts = useMemo(() => {
    if (!districtsData) return [];
    return districtsData
      .filter((district) => !shouldHideLocationName(district.districtName))
      .sort((a, b) =>
        a.districtName.localeCompare(b.districtName, "vi", { sensitivity: "base" })
      );
  }, [districtsData]);

  const {
    data: wardsData,
    isLoading: isLoadingWards,
    isError: isWardError,
  } = useQuery({
    queryKey: ["shipping-wards", addressData.districtId],
    queryFn: async () => {
      if (!addressData.districtId) return [];
      return getWardsByPath(addressData.districtId);
    },
    enabled: Boolean(addressData.districtId),
  });

  const wards = useMemo(() => {
    if (!wardsData) return [];
    return wardsData
      .filter((ward) => !shouldHideLocationName(ward.wardName))
      .sort((a, b) =>
        a.wardName.localeCompare(b.wardName, "vi", { sensitivity: "base" })
      );
  }, [wardsData]);

  useEffect(() => {
    if (
      provinces.length > 0 &&
      addressData.province &&
      !addressData.provinceId
    ) {
      const matchedProvince = provinces.find(
        (province) => province.provinceName === addressData.province
      );
      if (matchedProvince) {
        setAddressData((prev) => ({
          ...prev,
          provinceId: matchedProvince.provinceId,
        }));
      }
    }
  }, [provinces, addressData.province, addressData.provinceId]);

  useEffect(() => {
    if (
      districts.length > 0 &&
      addressData.district &&
      !addressData.districtId
    ) {
      const matchedDistrict = districts.find(
        (district) => district.districtName === addressData.district
      );
      if (matchedDistrict) {
        setAddressData((prev) => ({
          ...prev,
          districtId: matchedDistrict.districtId,
        }));
      }
    }
  }, [districts, addressData.district, addressData.districtId]);

  useEffect(() => {
    if (wards.length > 0 && addressData.ward && !addressData.wardCode) {
      const matchedWard = wards.find(
        (ward) => ward.wardName === addressData.ward
      );
      if (matchedWard) {
        setAddressData((prev) => ({
          ...prev,
          wardCode: matchedWard.wardCode,
        }));
      }
    }
  }, [wards, addressData.ward, addressData.wardCode]);

  const handleProvinceSelect = (province: ProvinceResponse) => {
    setAddressData((prev) => ({
      ...prev,
      province: province.provinceName,
      provinceId: province.provinceId,
      district: "",
      districtId: null,
      ward: "",
      wardCode: "",
    }));
  };

  const handleDistrictSelect = (district: DistrictResponse) => {
    setAddressData((prev) => ({
      ...prev,
      district: district.districtName,
      districtId: district.districtId,
      ward: "",
      wardCode: "",
    }));
  };

  const handleWardSelect = (ward: WardResponse) => {
    setAddressData((prev) => ({
      ...prev,
      ward: ward.wardName,
      wardCode: ward.wardCode,
    }));
  };

  const provinceLabel = useMemo(() => {
    if (isLoadingProvinces) return "Đang tải tỉnh/thành";
    if (isProvinceError) return "Không thể tải tỉnh/thành";
    return addressData.province || "Chọn tỉnh/thành phố";
  }, [addressData.province, isLoadingProvinces, isProvinceError]);

  const districtLabel = useMemo(() => {
    if (!addressData.provinceId) return "Chọn tỉnh trước";
    if (isLoadingDistricts) return "Đang tải quận/huyện";
    if (isDistrictError) return "Không thể tải quận/huyện";
    return addressData.district || "Chọn quận/huyện";
  }, [
    addressData.district,
    addressData.provinceId,
    isLoadingDistricts,
    isDistrictError,
  ]);

  const wardLabel = useMemo(() => {
    if (!addressData.districtId) return "Chọn quận/huyện trước";
    if (isLoadingWards) return "Đang tải phường/xã";
    if (isWardError) return "Không thể tải phường/xã";
    return addressData.ward || "Chọn phường/xã";
  }, [addressData.ward, addressData.districtId, isLoadingWards, isWardError]);

  const renderMenuContent = <T extends { [key: string]: any }>(
    list: T[] | null | undefined,
    onSelect: (item: T) => void,
    labelKey: keyof T
  ) => {
    if (!list || !Array.isArray(list) || list.length === 0) {
      return (
        <div className="px-3 py-2 text-[13px] text-[#888888]">
          Không có dữ liệu
        </div>
      );
    }

    return list.map((item) => (
      <DropdownMenuItem
        key={String(item[labelKey])}
        onClick={() => onSelect(item)}
        className="text-[14px]"
      >
        {item[labelKey]}
      </DropdownMenuItem>
    ));
  };

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
  const {
    data: addressesData,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["admin-customer-addresses", customerId],
    queryFn: () => getCustomerAddresses(Number(customerId)),
    enabled: !!customerId,
  });

  // Fetch customer orders (recent orders)
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
  } = useQuery({
    queryKey: ["admin-customer-orders", customerId],
    queryFn: () => getCustomerOrders({
      userId: Number(customerId),
      page: 0,
      size: 10, // Lấy 10 đơn hàng gần đây nhất
    }),
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
    mutationFn: (data: AddressCreationRequest) => createCustomerAddress(Number(customerId), data),
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
        gender: customer.gender?.toLowerCase() === "male" ? "Nam" : "Nữ",
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
          (addr) =>
            addr.isDefault === true ||
            addr.isDefault === "true" ||
            addr.isDefault === "Địa chỉ mặc định"
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
          <p className="text-[#272424] text-[16px]">Đang tải thông tin khách hàng...</p>
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
            {isError ? "Không thể tải thông tin khách hàng" : "Không tìm thấy khách hàng"}
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
      address: customer.address || "", // Keep existing address
      gender: formData.gender === "Nam" ? "MALE" : "FEMALE", // Convert to backend format
      birthday: formData.birthdate ? new Date(formData.birthdate).toISOString() : customer.birthday ? new Date(customer.birthday).toISOString() : undefined,
      // Note: address field is for contact address, not delivery address
      // Delivery address is managed separately via Address entity
    };

    console.log("Updating customer with data:", updateData);
    updateCustomerMutation.mutate(updateData);
  };

  const handleAddressEditClick = () => {
    if (defaultAddress) {
      // Edit existing address
      const provinceName = normalizeAddressPart(defaultAddress.provinceName) || normalizeAddressPart((defaultAddress as any).province);
      const districtName = normalizeAddressPart(defaultAddress.districtName) || normalizeAddressPart((defaultAddress as any).district);
      const wardName = normalizeAddressPart(defaultAddress.wardName) || normalizeAddressPart((defaultAddress as any).ward);
      const street = normalizeAddressPart(defaultAddress.street) || normalizeAddressPart((defaultAddress as any).location);
      setAddressData({
        id: defaultAddress.id,
        name: defaultAddress.receiverName || defaultAddress.name || customer.name,
        phone: defaultAddress.receiverPhone || defaultAddress.phone || customer.phone,
        province: provinceName,
        provinceId: null,
        district: districtName,
        ward: wardName,
        location: street,
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
        provinceId: null,
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
    if (!addressData.provinceId) {
      toast.error("Vui lòng chọn tỉnh/thành hợp lệ");
      return;
    }
    if (!addressData.districtId) {
      toast.error("Vui lòng chọn quận/huyện hợp lệ");
      return;
    }
    if (!addressData.wardCode.trim()) {
      toast.error("Vui lòng chọn phường/xã hợp lệ");
      return;
    }

    const finalWardCode = addressData.wardCode.trim();
    const finalDistrictId = addressData.districtId;

    const street = addressData.location.trim();
    const wardName = addressData.ward.trim();
    const districtName = addressData.district.trim();
    const provinceName = addressData.province.trim();
    const payloadCommon = {
      name: addressData.name.trim(),
      phone: addressData.phone.trim(),
      street,
      wardCode: finalWardCode,
      wardName,
      districtId: finalDistrictId,
      districtName,
      provinceName,
      fullAddress: [street, wardName, districtName, provinceName]
        .filter(Boolean)
        .join(", "),
    };

    if (addressData.id) {
      // Update existing address
      const updateData: AddressUpdateRequest = {
        id: addressData.id,
        ...payloadCommon,
      };
      console.log("Updating address with data:", updateData);
      updateAddressMutation.mutate(updateData);
    } else {
      // Create new address
      const createData: AddressCreationRequest = {
        ...payloadCommon,
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
                    <div className={`w-[6px] h-[6px] rounded-full ${customer.status?.toUpperCase() === "ACTIVE" ? "bg-[#28a745]" : "bg-[#dc3545]"}`}></div>
                    <span className={`font-medium text-[12px] leading-[1.4] ${customer.status?.toUpperCase() === "ACTIVE" ? "text-[#28a745]" : "text-[#dc3545]"}`}>
                      {customer.status?.toUpperCase() === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"}
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
                    {(() => {
                      // Tính từ ordersData nếu có
                      if (ordersData?.content && ordersData.content.length > 0) {
                        const total = ordersData.content.reduce((sum, order) => {
                          return sum + (order.totalAmount || 0);
                        }, 0);
                        return new Intl.NumberFormat('vi-VN', { 
                          style: 'currency', 
                          currency: 'VND' 
                        }).format(total);
                      }
                      // Nếu đang loading hoặc chưa có data
                      if (isLoadingOrders) {
                        return "...";
                      }
                      return "0 ₫";
                    })()}
                  </p>
                </div>
                <div className="w-[1px] h-[40px] bg-[#d1d1d1]"></div>
                <div className="flex flex-col items-center gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Đơn hàng
                  </p>
                  <p className="font-bold text-[#272424] text-[24px] leading-normal">
                    {(() => {
                      // Lấy từ ordersData totalElements (tổng số đơn hàng)
                      if (ordersData?.totalElements !== undefined) {
                        return ordersData.totalElements.toString();
                      }
                      // Nếu đang loading
                      if (isLoadingOrders) {
                        return "...";
                      }
                      return "0";
                    })()}
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
                  {isLoadingOrders ? (
                    <div className="px-[16px] py-[8px] text-[#737373] text-[14px]">
                      Đang tải đơn hàng...
                    </div>
                  ) : !ordersData?.content || ordersData.content.length === 0 ? (
                    <div className="px-[16px] py-[8px] text-[#737373] text-[14px]">
                      Khách hàng chưa có đơn hàng nào
                    </div>
                  ) : (
                    ordersData.content.map((order, index) => {
                      // Format date
                      const orderDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "";

                      // Map payment status
                      const getPaymentStatusLabel = (status?: string) => {
                        if (!status) return "Chưa thanh toán";
                        const statusLower = status.toLowerCase();
                        if (statusLower.includes("đã thanh toán") || statusLower.includes("paid")) {
                          return "Đã thanh toán";
                        }
                        if (statusLower.includes("hoàn tiền")) {
                          return "Đã hoàn tiền";
                        }
                        if (statusLower.includes("chờ") || statusLower.includes("pending")) {
                          return "Chờ thanh toán";
                        }
                        return status;
                      };

                      // Map order status
                      const getOrderStatusLabel = (status?: string) => {
                        if (!status) return "Đang xử lý";
                        const statusLower = status.toLowerCase();
                        if (statusLower.includes("hoàn thành") || statusLower.includes("completed")) {
                          return "Đã hoàn thành";
                        }
                        if (statusLower.includes("đã giao") || statusLower.includes("delivered")) {
                          return "Đã giao";
                        }
                        if (statusLower.includes("đang giao") || statusLower.includes("shipping")) {
                          return "Đang giao";
                        }
                        if (statusLower.includes("hủy") || statusLower.includes("cancelled")) {
                          return "Đã hủy";
                        }
                        return status;
                      };

                      // Map status to ChipStatus props
                      const getPaymentStatusChip = (status?: string) => {
                        if (!status) return "processing";
                        const statusLower = status.toLowerCase();
                        if (statusLower.includes("đã thanh toán") || statusLower.includes("paid")) {
                          return "paid";
                        }
                        if (statusLower.includes("hoàn tiền")) {
                          return "pending";
                        }
                        return "processing";
                      };

                      const getOrderStatusChip = (status?: string) => {
                        if (!status) return "processing";
                        const statusLower = status.toLowerCase();
                        if (statusLower.includes("hoàn thành") || statusLower.includes("completed") || statusLower.includes("đã giao")) {
                          return "completed";
                        }
                        if (statusLower.includes("hủy") || statusLower.includes("cancelled")) {
                          return "cancelled";
                        }
                        return "processing";
                      };

                      return (
                        <div
                          key={order.id}
                          className={`flex items-center justify-between px-[16px] py-[8px] ${
                            index < ordersData.content.length - 1
                              ? "border-b border-[#d1d1d1]"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col gap-[4px]">
                            <p className="font-semibold text-[#1a71f6] text-[12px] leading-[1.5] cursor-pointer hover:underline">
                              {order.code || `#${order.id}`}
                            </p>
                            <p className="font-normal text-[#737373] text-[12px] leading-[1.4]">
                              {order.source ? `Nguồn: ${order.source} • ` : ""}
                              {orderDate}
                            </p>
                          </div>
                          <div className="flex gap-[15px]">
                            <ChipStatus
                              status={getPaymentStatusChip(order.paymentStatus)}
                              labelOverride={getPaymentStatusLabel(order.paymentStatus)}
                              size="small"
                            />
                            <ChipStatus
                              status={getOrderStatusChip(order.status)}
                              labelOverride={getOrderStatusLabel(order.status)}
                              size="small"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
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
                    {customer.gender ? (customer.gender.toLowerCase() === "male" ? "Nam" : "Nữ") : "---"}
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
                    {defaultAddress?.receiverName || defaultAddress?.name || customer.name}
                  </p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                    Số điện thoại
                  </p>
                  <p className="font-semibold text-[#272424] text-[15px] leading-[1.4]">
                    {defaultAddress?.receiverPhone || defaultAddress?.phone || customer.phone}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[4px]">
                <p className="font-medium text-[#737373] text-[12px] leading-[1.4] uppercase tracking-wide">
                  Địa chỉ chi tiết
                </p>
                <p className="font-semibold text-[#272424] text-[15px] leading-[1.5] break-words">
                  {formattedDefaultAddress}
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
                  {updateCustomerMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`bg-white border ${isProvinceError ? "border-[#ff4d4f]" : "border-[#d1d1d1]"
                        } flex items-center justify-between h-[44px] px-[12px] rounded-[8px] cursor-pointer`}
                    >
                      <span
                        className={`text-[14px] ${
                          addressData.province ? "text-[#272424]" : "text-[#888888]"
                        }`}
                      >
                        {provinceLabel}
                      </span>
                      <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[280px]">
                    {isLoadingProvinces ? (
                      <div className="px-3 py-2 text-[13px] text-[#888888]">Đang tải...</div>
                    ) : (
                      renderMenuContent(provinces, handleProvinceSelect, "provinceName")
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* District */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Quận/Huyện <span className="text-[#e04d30]">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`bg-white border ${
                        isDistrictError ? "border-[#ff4d4f]" : "border-[#d1d1d1]"
                      } flex items-center justify-between h-[44px] px-[12px] rounded-[8px] ${
                        !addressData.provinceId ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
                      }`}
                    >
                      <span
                        className={`text-[14px] ${
                          addressData.district ? "text-[#272424]" : "text-[#888888]"
                        }`}
                      >
                        {districtLabel}
                      </span>
                      <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[280px]">
                    {!addressData.provinceId ? (
                      <div className="px-3 py-2 text-[13px] text-[#888888]">
                        Vui lòng chọn tỉnh/thành trước
                      </div>
                    ) : isLoadingDistricts ? (
                      <div className="px-3 py-2 text-[13px] text-[#888888]">
                        Đang tải...
                      </div>
                    ) : (
                      renderMenuContent(districts, handleDistrictSelect, "districtName")
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Ward */}
              <div className="flex flex-col gap-[6px]">
                <label className="font-medium text-[#272424] text-[14px]">
                  Phường/Xã <span className="text-[#e04d30]">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`bg-white border ${
                        isWardError ? "border-[#ff4d4f]" : "border-[#d1d1d1]"
                      } flex items-center justify-between h-[44px] px-[12px] rounded-[8px] ${
                        !addressData.districtId ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
                      }`}
                    >
                      <span
                        className={`text-[14px] ${
                          addressData.ward ? "text-[#272424]" : "text-[#888888]"
                        }`}
                      >
                        {wardLabel}
                      </span>
                      <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[280px]">
                    {!addressData.districtId ? (
                      <div className="px-3 py-2 text-[13px] text-[#888888]">
                        Vui lòng chọn quận/huyện trước
                      </div>
                    ) : isLoadingWards ? (
                      <div className="px-3 py-2 text-[13px] text-[#888888]">
                        Đang tải...
                      </div>
                    ) : (
                      renderMenuContent(wards, handleWardSelect, "wardName")
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  disabled={updateAddressMutation.isPending || createAddressMutation.isPending}
                >
                  {updateAddressMutation.isPending || createAddressMutation.isPending ? "Đang lưu..." : "Lưu địa chỉ"}
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
