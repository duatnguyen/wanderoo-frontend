import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ArrowLeft } from "lucide-react";
import CaretDown from "@/components/ui/caret-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { createProvider } from "@/api/endpoints/warehouseApi";
import {
  getProvinces,
  getDistrictsByPath,
  getWardsByPath,
} from "@/api/endpoints/shippingApi";
import { toast } from "sonner";
import type { ApiResponse } from "@/types";
import type {
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "@/types";
import { PageContainer, ContentCard } from "@/components/common";
const AdminSupplierNew = () => {
  document.title = "Thêm nhà cung cấp | Wanderoo";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplierName: "",
    phone: "",
    email: "",
    note: "",
    // Address fields
    street: "",
    city: "",
    provinceId: undefined as number | undefined,
    district: "",
    districtId: undefined as number | undefined,
    ward: "",
    wardCode: undefined as string | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleProvinceSelect = (province: ProvinceResponse) => {
    setFormData((prev) => ({
      ...prev,
      city: province.provinceName,
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
    if (
      provinces.length > 0 &&
      formData.city &&
      !formData.provinceId
    ) {
      const matchedProvince = provinces.find(
        (province) => province.provinceName === formData.city
      );
      if (matchedProvince) {
        setFormData((prev) => ({
          ...prev,
          provinceId: matchedProvince.provinceId,
        }));
      }
    }
  }, [provinces, formData.city, formData.provinceId]);

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
    return formData.city || "Chọn tỉnh/thành phố";
  }, [formData.city, isLoadingProvinces, isProvinceError]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // General information validation
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Tên nhà cung cấp là bắt buộc";
    }

    const normalizedPhone = formData.phone.trim();
    if (!normalizedPhone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10,13}$/.test(normalizedPhone)) {
      newErrors.phone = "Số điện thoại phải gồm 10-13 chữ số";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Address validation
    if (!formData.street.trim()) {
      newErrors.street = "Địa chỉ đường là bắt buộc";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Tỉnh/Thành phố là bắt buộc";
    }

    if (!formData.district.trim()) {
      newErrors.district = "Quận/Huyện là bắt buộc";
    }

    if (!formData.districtId) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }

    if (!formData.ward.trim()) {
      newErrors.ward = "Phường/Xã là bắt buộc";
    }

    if (!formData.wardCode) {
      newErrors.ward = "Vui lòng chọn phường/xã";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Validate required fields that backend needs
      if (!formData.districtId) {
        setErrors((prev) => ({
          ...prev,
          district: "Vui lòng chọn quận/huyện",
        }));
        return;
      }
      if (!formData.wardCode) {
        setErrors((prev) => ({
          ...prev,
          ward: "Vui lòng chọn phường/xã",
        }));
        return;
      }

      try {
        setIsSubmitting(true);
        await createProvider({
          name: formData.supplierName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          note: formData.note?.trim() || "",
          provinceName: formData.city.trim(),
          districtName: formData.district.trim(),
          districtId: formData.districtId,
          wardName: formData.ward.trim(),
          wardCode: formData.wardCode,
          street: formData.street.trim(),
        });
        toast.success("Thêm nhà cung cấp thành công");
        navigate("/admin/warehouse/supplier", {
          state: { shouldFocusLastPage: true },
        });
      } catch (err) {
        const message = getErrorMessage(err);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/warehouse/supplier");
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-[12px] w-full">
        <button
          onClick={() => navigate("/admin/warehouse/supplier")}
          className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-[20px] h-[20px] text-[#272424]" />
        </button>
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
          Thêm mới nhà cung cấp
        </h2>
      </div>
      <ContentCard>
        {/* General Information Table */}
        <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[10px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-[#272424] text-[20px] leading-normal mb-[2px]">
              Thông tin chung
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] w-full">
              {/* Tên nhà cung cấp */}
              <div className="flex flex-col gap-[4px]">
                <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                  Tên nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <FormInput
                  value={formData.supplierName}
                  onChange={(e) =>
                    handleInputChange("supplierName", e.target.value)
                  }
                  placeholder="Nhập tên nhà cung cấp"
                  className={errors.supplierName ? "border-red-500" : ""}
                  containerClassName="h-[36px] px-[12px] py-0"
                />
                {errors.supplierName && (
                  <span className="text-red-500 text-[12px]">
                    {errors.supplierName}
                  </span>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col gap-[4px]">
                <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <FormInput
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={errors.phone ? "border-red-500" : ""}
                  containerClassName="h-[36px] px-[12px] py-0"
                />
                {errors.phone && (
                  <span className="text-red-500 text-[12px]">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                  Email <span className="text-red-500">*</span>
                </label>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email"
                  className={errors.email ? "border-red-500" : ""}
                  containerClassName="h-[36px] px-[12px] py-0"
                />
                {errors.email && (
                  <span className="text-red-500 text-[12px]">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Address Information Table */}
        <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[10px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-[#272424] text-[20px] leading-normal mb-[2px]">
              Thông tin địa chỉ
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] w-full">
            {/* Tỉnh/Thành phố */}
            <div className="flex flex-col gap-[4px]">
              <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border-2 ${
                      errors.city || isProvinceError
                        ? "border-red-500"
                        : "border-[#e04d30]"
                    } flex gap-[4px] h-[36px] items-center px-[12px] py-0 rounded-[12px] w-full cursor-pointer`}
                  >
                    <span
                      className={`text-[14px] font-semibold leading-[1.4] flex-1 ${
                        formData.city ? "text-black" : "text-[#888888]"
                      }`}
                    >
                      {provinceLabel}
                    </span>
                    <CaretDown className="text-[#e04d30]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[240px] overflow-auto">
                  {isLoadingProvinces ? (
                    <div className="px-3 py-2 text-[13px] text-[#888888]">
                      Đang tải...
                    </div>
                  ) : (
                    renderMenuContent(provinces, handleProvinceSelect, "provinceName")
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.city && (
                <span className="text-red-500 text-[12px]">{errors.city}</span>
              )}
            </div>

            {/* Quận/Huyện */}
            <div className="flex flex-col gap-[4px]">
              <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border-2 ${
                      errors.district || isDistrictError
                        ? "border-red-500"
                        : "border-[#e04d30]"
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
                    renderMenuContent(districts, handleDistrictSelect, "districtName")
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.district && (
                <span className="text-red-500 text-[12px]">
                  {errors.district}
                </span>
              )}
            </div>

            {/* Phường/Xã */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`bg-white border-2 ${
                      errors.ward || isWardError
                        ? "border-red-500"
                        : "border-[#e04d30]"
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
                <span className="text-red-500 text-[12px]">{errors.ward}</span>
              )}
            </div>

            {/* Địa chỉ chi tiết - moved to the last (bottom-right) position */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <FormInput
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                placeholder="Nhập địa chỉ chi tiết"
                className={errors.street ? "border-red-500" : ""}
                containerClassName="h-[36px] px-[12px] py-0"
              />
              {errors.street && (
                <span className="text-red-500 text-[12px]">
                  {errors.street}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Note Field */}
        <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[10px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="font-bold text-[#272424] text-[20px] leading-normal mb-[2px]">
              Ghi chú
            </h3>
          </div>

          <div className="w-full">
            <FormInput
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="Nhập ghi chú (nếu có)"
              containerClassName="h-[50px] px-[12px] py-0"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[12px] items-center justify-end w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="px-[24px] py-[12px]"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="px-[24px] py-[12px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Thêm mới"}
          </Button>
        </div>
      </ContentCard>
    </PageContainer>
  );
};

const getErrorMessage = (error: unknown) => {
  const defaultMessage = "Không thể tạo nhà cung cấp, vui lòng thử lại.";
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? defaultMessage;
  }
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  return defaultMessage;
};

export default AdminSupplierNew;
