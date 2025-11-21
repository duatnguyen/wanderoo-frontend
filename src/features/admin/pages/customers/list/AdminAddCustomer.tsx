import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import FormInput from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";
import { createCustomer, createCustomerAddress } from "@/api/endpoints/userApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CaretDown from "@/components/ui/caret-down";
import { getProvinces, getDistrictsByPath, getWardsByPath } from "@/api/endpoints/shippingApi";
import { toast } from "sonner";
import type { CustomerCreationRequest } from "@/types/api";
import type {
  AddressCreationRequest,
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "@/types";

const AdminAddCustomer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthdate: "",
    gender: "Nữ",
    email: "",
    username: "",
    password: "",
    addressName: "",
    addressPhone: "",
    province: "",
    provinceId: null as number | null,
    district: "",
    districtId: null as number | null,
    ward: "",
    location: "",
    wardCode: "",
  });

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
    queryKey: ["shipping-districts", formData.provinceId],
    queryFn: async () => {
      if (!formData.provinceId) return [];
      return getDistrictsByPath(formData.provinceId);
    },
    enabled: Boolean(formData.provinceId),
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
    queryKey: ["shipping-wards", formData.districtId],
    queryFn: async () => {
      if (!formData.districtId) return [];
      return getWardsByPath(formData.districtId);
    },
    enabled: Boolean(formData.districtId),
  });

  const wards = useMemo(() => {
    if (!wardsData) return [];
    return wardsData
      .filter((ward) => !shouldHideLocationName(ward.wardName))
      .sort((a, b) =>
        a.wardName.localeCompare(b.wardName, "vi", { sensitivity: "base" })
      );
  }, [wardsData]);

  const handleProvinceSelect = (province: ProvinceResponse) => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      district: district.districtName,
      districtId: district.districtId,
      ward: "",
      wardCode: "",
    }));
  };

  const handleWardSelect = (ward: WardResponse) => {
    setFormData((prev) => ({
      ...prev,
      ward: ward.wardName,
      wardCode: ward.wardCode,
    }));
  };

  const provinceLabel = useMemo(() => {
    if (isLoadingProvinces) return "Đang tải tỉnh/thành";
    if (isProvinceError) return "Không thể tải tỉnh/thành";
    return formData.province || "Chọn tỉnh/thành phố";
  }, [formData.province, isLoadingProvinces, isProvinceError]);

  const districtLabel = useMemo(() => {
    if (!formData.provinceId) return "Chọn tỉnh trước";
    if (isLoadingDistricts) return "Đang tải quận/huyện";
    if (isDistrictError) return "Không thể tải quận/huyện";
    return formData.district || "Chọn quận/huyện";
  }, [
    formData.district,
    formData.provinceId,
    isLoadingDistricts,
    isDistrictError,
  ]);

  const wardLabel = useMemo(() => {
    if (!formData.districtId) return "Chọn quận/huyện trước";
    if (isLoadingWards) return "Đang tải phường/xã";
    if (isWardError) return "Không thể tải phường/xã";
    return formData.ward || "Chọn phường/xã";
  }, [formData.ward, formData.districtId, isLoadingWards, isWardError]);

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

  const createCustomerMutation = useMutation({
    mutationFn: (data: CustomerCreationRequest) => createCustomer(data),
    onSuccess: async (response) => {
      const customerId = response.data;
      console.log("Customer created with ID:", customerId);
      
      // Create address if provided
      if (
        formData.province &&
        formData.district &&
        formData.ward &&
        formData.location
      ) {
        if (!formData.provinceId || !formData.districtId || !formData.wardCode.trim()) {
          toast.warning("Không thể tạo địa chỉ vì thiếu thông tin tỉnh/thành hợp lệ");
        } else {
          try {
            const addressData: AddressCreationRequest = {
              name: formData.addressName.trim() || formData.name.trim(),
              phone: formData.addressPhone.trim() || formData.phone.trim(),
              province: formData.province.trim(),
              district: formData.district.trim(),
              ward: formData.ward.trim(),
              location: formData.location.trim(),
              wardCode: formData.wardCode.trim(),
              districtId: formData.districtId,
            };
            await createCustomerAddress(customerId, addressData);
            console.log("Address created for customer:", customerId);
          } catch (error) {
            console.error("Error creating address:", error);
            // Don't fail the whole operation if address creation fails
            toast.warning("Khách hàng đã được tạo nhưng không thể tạo địa chỉ giao hàng");
          }
        }
      }
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-customers"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-customers-all"] }),
      ]);
      toast.success("Thêm khách hàng thành công");
      navigate("/admin/customers", { state: { shouldFocusLastPage: true } });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tạo khách hàng";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = () => {
    // Validation - Only name and phone are required
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    // Validate email format if provided
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Convert gender to backend format
    const gender = formData.gender === "Nam" ? "MALE" : formData.gender === "Nữ" ? "FEMALE" : undefined;

    const customerData: CustomerCreationRequest = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      username: formData.username.trim() || undefined, // Optional - backend will auto-generate
      password: formData.password.trim() || undefined, // Optional - backend will auto-generate
      gender: gender as any,
      birthday: formData.birthdate ? new Date(formData.birthdate).toISOString() : undefined,
      // Note: Address is managed separately via Address entity, not in customer creation
    };

    console.log("Creating customer with data:", customerData);
    createCustomerMutation.mutate(customerData);
  };

  return (
    <div className="flex flex-col gap-[10px] w-full">
      {/* Header */}
      <div className="flex items-center h-[24px] -mt-[5px]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[24px] h-[24px] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-[16px] h-[16px] text-[#272424]" />
        </button>
        <h1 className="ml-[8px] font-bold text-[#272424] text-[20px] leading-[1]">
          Thêm mới khách hàng
        </h1>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
        <h2 className="font-bold text-[#272424] text-[16px] leading-[1.4] mb-[10px]">
          Thông tin liên hệ
        </h2>

        <div className="flex flex-col gap-[16px]">
          {/* Name and Phone */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Họ và tên <span className="text-[#e04d30]">*</span>
              </label>
              <FormInput
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập họ và tên"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Số điện thoại <span className="text-[#e04d30]">*</span>
              </label>
              <FormInput
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Nhập số điện thoại"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
          </div>

          {/* Birthdate and Gender */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Ngày sinh
              </label>
              <div className="bg-white border-2 border-[#e04d30] flex items-center h-[36px] px-[12px] py-0 rounded-[12px] w-full relative">
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                  placeholder="20 / 10 / 1997"
                  className={`hide-native-picker border-0 outline-none bg-transparent text-[14px] font-semibold placeholder:text-[#888888] ${formData.birthdate ? "text-[#272424]" : "text-[#888888]"} flex-1 w-full`}
                />
                <svg
                  className="w-5 h-5 text-[#272424] opacity-40 absolute right-3 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Giới tính
              </label>
              <div className="flex gap-[16px] items-center h-[36px]">
                <CustomRadio
                  label="Nữ"
                  checked={formData.gender === "Nữ"}
                  onChange={() => setFormData({ ...formData, gender: "Nữ" })}
                />
                <CustomRadio
                  label="Nam"
                  checked={formData.gender === "Nam"}
                  onChange={() => setFormData({ ...formData, gender: "Nam" })}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Email
            </label>
            <FormInput
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Nhập email (không bắt buộc)"
              containerClassName="h-[36px] px-[12px] py-0"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Tên đăng nhập
            </label>
            <FormInput
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Nhập tên đăng nhập (không bắt buộc - tự động tạo nếu để trống)"
              containerClassName="h-[36px] px-[12px] py-0"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Mật khẩu
            </label>
            <FormInput
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Nhập mật khẩu (không bắt buộc - mặc định là số điện thoại)"
              containerClassName="h-[36px] px-[12px] py-0"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
        <h2 className="font-bold text-[#272424] text-[16px] leading-[1.4] mb-[10px]">
          Địa chỉ giao hàng
        </h2>

        <div className="flex flex-col gap-[16px]">
          {/* Name and Phone */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Họ và tên người nhận
              </label>
              <FormInput
                value={formData.addressName}
                onChange={(e) =>
                  setFormData({ ...formData, addressName: e.target.value })
                }
                placeholder="Nhập họ và tên (mặc định là tên khách hàng)"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Số điện thoại người nhận
              </label>
              <FormInput
                value={formData.addressPhone}
                onChange={(e) =>
                  setFormData({ ...formData, addressPhone: e.target.value })
                }
                placeholder="Nhập số điện thoại (mặc định là số điện thoại khách hàng)"
                containerClassName="h-[36px] px-[12px] py-0"
              />
            </div>
          </div>

          {/* Province, District, Ward - 3 combobox on same line */}
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Tỉnh/Thành phố
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border ${isProvinceError ? "border-[#ff4d4f]" : "border-[#d1d1d1]"} flex items-center justify-between h-[40px] px-[10px] rounded-[10px] cursor-pointer`}
                  >
                    <span
                      className={`text-[14px] font-semibold ${
                        formData.province ? "text-[#272424]" : "text-[#888888]"
                      }`}
                    >
                      {provinceLabel}
                    </span>
                    <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[220px]">
                  {isLoadingProvinces ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Đang tải...
                    </div>
                  ) : (
                    renderMenuContent(provinces, handleProvinceSelect, "provinceName")
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Quận/Huyện
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border ${isDistrictError ? "border-[#ff4d4f]" : "border-[#d1d1d1]"} flex items-center justify-between h-[40px] px-[10px] rounded-[10px] ${
                      !formData.provinceId ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`text-[14px] font-semibold ${
                        formData.district ? "text-[#272424]" : "text-[#888888]"
                      }`}
                    >
                      {districtLabel}
                    </span>
                    <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[220px]">
                  {!formData.provinceId ? (
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

            <div className="flex flex-col gap-[8px]">
              <label className="font-semibold text-[#272424] text-[14px]">
                Phường/Xã
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border ${isWardError ? "border-[#ff4d4f]" : "border-[#d1d1d1]"} flex items-center justify-between h-[40px] px-[10px] rounded-[10px] ${
                      !formData.districtId ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`text-[14px] font-semibold ${
                        formData.ward ? "text-[#272424]" : "text-[#888888]"
                      }`}
                    >
                      {wardLabel}
                    </span>
                    <CaretDown className="w-4 h-4 text-[#1a1a1a]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[240px] overflow-auto min-w-[220px]">
                  {!formData.districtId ? (
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
          </div>

          {/* Detail Address */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-semibold text-[#272424] text-[14px]">
              Địa chỉ cụ thể
            </label>
            <FormInput
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Nhập số nhà, tên đường..."
              containerClassName="h-[36px] px-[12px] py-0"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[12px] justify-end py-[16px] w-full">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="text-[14px]"
        >
          Huỷ
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
          className="text-[14px]"
          disabled={createCustomerMutation.isPending}
        >
          {createCustomerMutation.isPending ? "Đang thêm..." : "Thêm mới"}
        </Button>
      </div>
    </div>
  );
};

export default AdminAddCustomer;
