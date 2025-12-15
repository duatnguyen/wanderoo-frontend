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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { toast } from "sonner";

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
  totalAddresses?: number; // Tổng số địa chỉ hiện tại
  isEditingDefaultOnly?: boolean; // Có phải đang edit địa chỉ mặc định duy nhất không
  isEditingDefault?: boolean; // Có phải đang edit địa chỉ mặc định không (khi có nhiều địa chỉ)
}

type AddressField =
  | "fullName"
  | "phone"
  | "province"
  | "district"
  | "ward"
  | "detailAddress";

type AddressFormErrors = Partial<Record<AddressField, string>>;

const NAME_REGEX = /^[\p{L}\s'.-]+$/u;

const AddressForm: React.FC<AddressFormProps> = ({
  title,
  initialData = {},
  onSubmit,
  onCancel,
  totalAddresses = 0,
  isEditingDefaultOnly = false,
  isEditingDefault = false,
}) => {
  // Nếu chỉ có 1 địa chỉ (đang edit), luôn force isDefault = true
  const isOnlyAddress = totalAddresses === 1 && isEditingDefaultOnly;
  // Nếu đang edit địa chỉ mặc định (và có nhiều hơn 1 địa chỉ), không cho phép uncheck
  const isDefaultAddress = isEditingDefault && totalAddresses > 1;
  
  const [errors, setErrors] = useState<AddressFormErrors>({});
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
    isDefault: (isOnlyAddress || isDefaultAddress) ? true : (initialData.isDefault || false),
  });

  // Đảm bảo isDefault luôn là true nếu chỉ có 1 địa chỉ hoặc đang edit địa chỉ mặc định
  useEffect(() => {
    if ((isOnlyAddress || isDefaultAddress) && !formData.isDefault) {
      setFormData((prev) => ({ ...prev, isDefault: true }));
    }
  }, [isOnlyAddress, isDefaultAddress, formData.isDefault]);

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    // Nếu chỉ có 1 địa chỉ hoặc đang edit địa chỉ mặc định, không cho phép tắt isDefault
    if (field === "isDefault" && (isOnlyAddress || isDefaultAddress)) {
      return; // Không cho phép thay đổi
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user edits
    if (
      field === "fullName" ||
      field === "phone" ||
      field === "province" ||
      field === "district" ||
      field === "ward" ||
      field === "detailAddress"
    ) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleProvinceSelect = (province: ProvinceResponse) => {
    const nextData: AddressFormData = {
      ...formData,
      province: province.provinceName,
      provinceId: province.provinceId,
      district: "",
      districtId: undefined,
      ward: "",
      wardCode: undefined,
    };
    setFormData(nextData);
    // Clear related errors and revalidate
    setErrors((prev) => {
      const next = { ...prev };
      delete next.province;
      delete next.district;
      delete next.ward;
      return next;
    });
    validateField("province", nextData.province);
  };

  const handleDistrictSelect = (district: DistrictResponse) => {
    console.log("Selected district:", district);
    const districtId = district.districtId;
    if (!districtId) {
      console.error("District missing districtId:", district);
    }
    const nextData: AddressFormData = {
      ...formData,
      district: district.districtName,
      districtId: districtId,
      ward: "",
      wardCode: undefined,
    };
    setFormData(nextData);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.district;
      delete next.ward;
      return next;
    });
    validateField("district", nextData.district);
  };

  const handleWardSelect = (ward: WardResponse) => {
    console.log("Selected ward:", ward);
    const wardCode = ward.wardCode;
    if (!wardCode) {
      console.error("Ward missing wardCode:", ward);
    }
    const nextData: AddressFormData = {
      ...formData,
      ward: ward.wardName,
      wardCode: wardCode,
    };
    setFormData(nextData);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.ward;
      return next;
    });
    validateField("ward", nextData.ward);
  };

  const validateField = (field: AddressField, value: string) => {
    let error: string | undefined;
    const trimmed = value.trim();

    switch (field) {
      case "fullName":
        if (!trimmed) {
          error = "Vui lòng nhập họ và tên.";
        } else if (trimmed.length < 3) {
          error = "Họ và tên phải có ít nhất 3 ký tự.";
        } else if (!NAME_REGEX.test(trimmed)) {
          error = "Họ và tên không được chứa ký tự đặc biệt.";
        }
        break;
      case "phone": {
        if (!trimmed) {
          error = "Vui lòng nhập số điện thoại.";
          break;
        }
        const digits = trimmed.replace(/\D/g, "");
        if (!/^\d+$/.test(trimmed)) {
          error = "Số điện thoại chỉ được chứa chữ số.";
        } else if (digits.length < 10 || digits.length > 13) {
          error = "Số điện thoại phải có từ 10 đến 13 chữ số.";
        }
        break;
      }
      case "province":
        if (!trimmed) {
          error = "Vui lòng chọn tỉnh/thành phố.";
        }
        break;
      case "district":
        if (formData.province && !trimmed) {
          error = "Vui lòng chọn quận/huyện.";
        }
        break;
      case "ward":
        if (formData.district && !trimmed) {
          error = "Vui lòng chọn phường/xã.";
        }
        break;
      case "detailAddress":
        if (!trimmed) {
          error = "Vui lòng nhập địa chỉ chi tiết.";
        } else if (trimmed.length < 5) {
          error = "Địa chỉ chi tiết phải có ít nhất 5 ký tự.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      ...(error ? { [field]: error } : (() => {
        const next = { ...prev };
        delete next[field];
        return next;
      })()),
    }));

    return error;
  };

  const validateForm = () => {
    let isValid = true;

    (["fullName", "phone", "province", "district", "ward", "detailAddress"] as AddressField[]).forEach(
      (field) => {
        const value = formData[field] as string;
        const error = validateField(field, value || "");
        if (error) {
          isValid = false;
        }
      }
    );

    // Ensure IDs/codes are present when selectors are chosen
    if (formData.province && !formData.provinceId) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        province: prev.province || "Vui lòng chọn tỉnh/thành phố hợp lệ.",
      }));
    }
    if (formData.district && !formData.districtId) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        district: prev.district || "Vui lòng chọn quận/huyện hợp lệ.",
      }));
    }
    if (formData.ward && !formData.wardCode) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        ward: prev.ward || "Vui lòng chọn phường/xã hợp lệ.",
      }));
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    // Đảm bảo isDefault luôn là true nếu chỉ có 1 địa chỉ hoặc đang edit địa chỉ mặc định
    const finalFormData = (isOnlyAddress || isDefaultAddress)
      ? { ...formData, isDefault: true }
      : formData;
    onSubmit(finalFormData);
  };

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

  // Filter out test data (case-insensitive) and specific invalid entries
  const provinces = useMemo(() => {
    if (!provincesData) return [];
    return provincesData
      .filter((province) => !shouldHideLocationName(province.provinceName))
      .sort((a, b) =>
        a.provinceName.localeCompare(b.provinceName, "vi", {
          sensitivity: "base",
        })
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

  // Filter out test data (case-insensitive) and specific invalid entries
  const districts = useMemo(() => {
    if (!districtsData) return [];
    return districtsData
      .filter((district) => !shouldHideLocationName(district.districtName))
      .sort((a, b) =>
        a.districtName.localeCompare(b.districtName, "vi", {
          sensitivity: "base",
        })
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

  // Filter out test data (case-insensitive) and specific invalid entries
  const wards = useMemo(() => {
    if (!wardsData) return [];
    return wardsData
      .filter((ward) => !shouldHideLocationName(ward.wardName))
      .sort((a, b) =>
        a.wardName.localeCompare(b.wardName, "vi", {
          sensitivity: "base",
        })
      );
  }, [wardsData]);

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
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName}</p>
        )}

        {/* Phone */}
        <FormInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại của bạn"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          containerClassName="h-[36px] px-[12px] py-0"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}

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
                className={`bg-white border ${
                  isProvinceError || errors.province
                    ? "border-[#ff4d4f]"
                    : "border-[#d1d1d1]"
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
          {errors.province && (
            <p className="text-sm text-red-500">{errors.province}</p>
          )}
        </div>

        {/* District Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Quận/Huyện
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`bg-white border ${
                  isDistrictError || errors.district
                    ? "border-[#ff4d4f]"
                    : "border-[#d1d1d1]"
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
          {errors.district && (
            <p className="text-sm text-red-500">{errors.district}</p>
          )}
        </div>

        {/* Ward Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Phường/Xã
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={`bg-white border ${
                  isWardError || errors.ward
                    ? "border-[#ff4d4f]"
                    : "border-[#d1d1d1]"
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
          {errors.ward && (
            <p className="text-sm text-red-500">{errors.ward}</p>
          )}
        </div>

        {/* Detail Address */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4] flex gap-[4px] items-center">
            Địa chỉ chi tiết
            <span className="text-[#eb2b0b] text-[16px]">*</span>
          </label>
          <div
            className={`bg-white border ${
              errors.detailAddress ? "border-[#ff4d4f]" : "border-[#d1d1d1]"
            } flex gap-[4px] h-[36px] items-center px-[12px] py-0 rounded-[12px] w-full`}
          >
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
          {errors.detailAddress && (
            <p className="text-sm text-red-500">{errors.detailAddress}</p>
          )}
        </div>

        {/* Default Address Checkbox */}
        <div className="flex gap-[5px] items-start w-full">
          {isDefaultAddress ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-[5px] items-start">
                  <div className="relative w-[24px] h-[24px] flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                      disabled={true}
                      className="w-full h-full border-2 border-[#e04d30] rounded-[4px] bg-white opacity-50 cursor-not-allowed appearance-none"
                    />
                    {formData.isDefault && (
                      <>
                        <div className="absolute inset-0 bg-[#e04d30] rounded-[4px] pointer-events-none" />
                        <svg
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] pointer-events-none z-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4] opacity-50">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px]">
                <p className="text-sm">
                  Bạn không thể xoá nhãn Địa chỉ mặc định. Hãy đặt địa chỉ khác làm Địa chỉ mặc định của bạn nhé.
                </p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="relative w-[24px] h-[24px] flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                  disabled={isOnlyAddress}
                  className={`w-full h-full border-2 border-[#e04d30] rounded-[4px] bg-white appearance-none ${
                    isOnlyAddress ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                />
                {formData.isDefault && (
                  <>
                    <div className="absolute inset-0 bg-[#e04d30] rounded-[4px] pointer-events-none" />
                    <svg
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] pointer-events-none z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </div>
              <label
                className={`font-semibold text-[#272424] text-[14px] leading-[1.4] ${
                  isOnlyAddress ? "opacity-50" : ""
                } cursor-pointer`}
                onClick={() => !isOnlyAddress && handleInputChange("isDefault", !formData.isDefault)}
              >
                Đặt làm địa chỉ mặc định
                {isOnlyAddress && (
                  <span className="text-[12px] text-[#888888] ml-2">
                    (Bắt buộc khi chỉ có 1 địa chỉ)
                  </span>
                )}
              </label>
            </>
          )}
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
