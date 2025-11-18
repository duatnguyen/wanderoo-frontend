import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import CaretDown from "@/components/ui/caret-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import {
  getProvinces,
  getDistrictsByPath,
  getWardsByPath,
} from "@/api/endpoints/shippingApi";
import type {
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "@/types";

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  provinceId?: number;
  district: string;
  districtId?: number;
  ward: string;
  wardCode?: string;
  detailAddress: string;
  isDefault: boolean;
}

interface AddressFormProps {
  title: string;
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  title,
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: initialData.fullName || "",
    phone: initialData.phone || "",
    province: initialData.province || "",
    provinceId: initialData.provinceId,
    district: initialData.district || "",
    districtId: initialData.districtId,
    ward: initialData.ward || "",
    wardCode: initialData.wardCode,
    detailAddress: initialData.detailAddress || "",
    isDefault: initialData.isDefault || false,
  });

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceSelect = (province: ProvinceResponse) => {
    setFormData((prev) => ({
      ...prev,
      province: province.provinceName,
      provinceId: province.provinceId,
      district: "",
      districtId: undefined,
      ward: "",
      wardCode: undefined,
    }));
  };

  const handleDistrictSelect = (district: DistrictResponse) => {
    setFormData((prev) => ({
      ...prev,
      district: district.districtName,
      districtId: district.districtId,
      ward: "",
      wardCode: undefined,
    }));
  };

  const handleWardSelect = (ward: WardResponse) => {
    setFormData((prev) => ({
      ...prev,
      ward: ward.wardName,
      wardCode: ward.wardCode,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const {
    data: provinces = [],
    isLoading: isLoadingProvinces,
    isError: isProvinceError,
  } = useQuery({
    queryKey: ["shipping-provinces"],
    queryFn: getProvinces,
  });

  const {
    data: districts = [],
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

  const {
    data: wards = [],
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

  useEffect(() => {
    if (!formData.province && initialData.province) {
      setFormData((prev) => ({ ...prev, province: initialData.province || "" }));
    }
  }, [initialData.province, formData.province]);

  useEffect(() => {
    if (
      provinces.length > 0 &&
      formData.province &&
      !formData.provinceId
    ) {
      const matchedProvince = provinces.find(
        (province) => province.provinceName === formData.province
      );
      if (matchedProvince) {
        setFormData((prev) => ({
          ...prev,
          provinceId: matchedProvince.provinceId,
        }));
      }
    }
  }, [provinces, formData.province, formData.provinceId]);

  useEffect(() => {
    if (
      districts.length > 0 &&
      formData.district &&
      !formData.districtId
    ) {
      const matchedDistrict = districts.find(
        (district) => district.districtName === formData.district
      );
      if (matchedDistrict) {
        setFormData((prev) => ({
          ...prev,
          districtId: matchedDistrict.districtId,
        }));
      }
    }
  }, [districts, formData.district, formData.districtId]);

  useEffect(() => {
    if (wards.length > 0 && formData.ward && !formData.wardCode) {
      const matchedWard = wards.find(
        (ward) => ward.wardName === formData.ward
      );
      if (matchedWard) {
        setFormData((prev) => ({
          ...prev,
          wardCode: matchedWard.wardCode,
        }));
      }
    }
  }, [wards, formData.ward, formData.wardCode]);

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
    list: T[],
    onSelect: (item: T) => void,
    labelKey: keyof T
  ) => {
    if (!list.length) {
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
      >
        {item[labelKey]}
      </DropdownMenuItem>
    ));
  };

  return (
    <div className="bg-white border-[#e04d30] border-2 flex flex-col items-start rounded-[24px] w-full">
      {/* Header */}
      <div className="flex gap-[9px] items-center p-[15px] w-full">
        <h2 className="font-bold text-[#272424] text-[16px] leading-[1.5]">
          {title}
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[10px] items-start px-[15px] pb-[15px] w-full"
      >
        {/* Full Name */}
        <FormInput
          label="Họ và tên"
          placeholder="Nhập họ và tên của bạn"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          containerClassName="h-[36px] px-[12px] py-0"
        />

        {/* Phone */}
        <FormInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại của bạn"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          containerClassName="h-[36px] px-[12px] py-0"
        />

        {/* Address Section */}
        <div className="flex gap-[20px] items-center w-full">
          <h3 className="font-bold text-[#272424] text-[16px] leading-normal">
            Địa chỉ
          </h3>
        </div>

        {/* Province Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Tỉnh/Thành phố
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`bg-white border-[1.6px] ${
                  isProvinceError ? "border-[#ff4d4f]" : "border-[#e04d30]"
                } flex gap-[4px] h-[36px] items-center px-[12px] py-0 rounded-[12px] w-full cursor-pointer`}
              >
                <span
                  className={`text-[14px] font-semibold leading-[1.4] flex-1 ${
                    formData.province ? "text-black" : "text-[#888888]"
                  }`}
                >
                  {provinceLabel}
                </span>
                <CaretDown className="text-[#e04d30]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[240px] overflow-auto">
              {isLoadingProvinces
                ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Đang tải...
                    </div>
                  )
                : renderMenuContent(provinces, handleProvinceSelect, "provinceName")}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* District Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Quận/Huyện
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`bg-white border-[1.6px] ${
                  isDistrictError ? "border-[#ff4d4f]" : "border-[#e04d30]"
                } flex gap-[4px] h-[36px] items-center px-[12px] py-0 rounded-[12px] w-full cursor-pointer ${
                  !formData.provinceId ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <span
                  className={`text-[14px] font-semibold leading-[1.4] flex-1 ${
                    formData.district ? "text-black" : "text-[#888888]"
                  }`}
                >
                  {districtLabel}
                </span>
                <CaretDown className="text-[#e04d30]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[240px] overflow-auto">
              {!formData.provinceId ? (
                <div className="px-3 py-2 text-[13px] text-[#888888]">
                  Vui lòng chọn tỉnh/thành trước
                </div>
              ) : isLoadingDistricts ? (
                <div className="px-3 py-2 text-[13px] text-[#888888]">
                  Đang tải...
                </div>
              ) : (
                renderMenuContent(
                  districts,
                  handleDistrictSelect,
                  "districtName"
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ward Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Phường/Xã
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`bg-white border-[1.6px] ${
                  isWardError ? "border-[#ff4d4f]" : "border-[#e04d30]"
                } flex gap-[4px] h-[36px] items-center px-[12px] py-0 rounded-[12px] w-full cursor-pointer ${
                  !formData.districtId ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <span
                  className={`text-[14px] font-semibold leading-[1.4] flex-1 ${
                    formData.ward ? "text-black" : "text-[#888888]"
                  }`}
                >
                  {wardLabel}
                </span>
                <CaretDown className="text-[#e04d30]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[240px] overflow-auto">
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

        {/* Detail Address */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4] flex gap-[4px] items-center">
            Địa chỉ chi tiết
            <span className="text-[#eb2b0b] text-[16px]">*</span>
          </label>
          <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] h-[36px] items-center px-[12px] py-0 rounded-[12px] w-full">
            <input
              type="text"
              value={formData.detailAddress}
              onChange={(e) =>
                handleInputChange("detailAddress", e.target.value)
              }
              placeholder="Nhập địa chỉ chi tiết của bạn"
              className="border-0 outline-none text-[14px] font-semibold text-black placeholder:text-[#888888] bg-transparent flex-1"
            />
          </div>
        </div>

        {/* Default Address Checkbox */}
        <div className="flex gap-[5px] items-start w-full">
          <input
            type="checkbox"
            checked={formData.isDefault}
            onChange={(e) => handleInputChange("isDefault", e.target.checked)}
            className="w-[24px] h-[24px] border"
          />
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[10px] items-center justify-end px-0 py-[12px] w-full">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Huỷ
          </Button>
          <Button type="submit">Xác nhận</Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
