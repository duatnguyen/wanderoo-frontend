import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  getProvinces,
  getDistrictsByPath,
  getWardsByPath,
} from "@/api/endpoints/shippingApi";
import type {
  ProviderDetailResponse,
  ProviderUpdateRequest,
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
} from "@/types";

interface SupplierFormState {
  supplierName: string;
  phone: string;
  email: string;
  note: string;
  provinceName: string;
  provinceId?: number;
  districtName: string;
  districtId?: number;
  wardName: string;
  wardCode?: string;
  street: string;
}

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierData?: ProviderDetailResponse;
  onSave: (data: ProviderUpdateRequest) => void;
  isSubmitting?: boolean;
}

const buildInitialState = (
  supplier?: ProviderDetailResponse
): SupplierFormState => ({
  supplierName: supplier?.name ?? "",
  phone: supplier?.phone ?? "",
  email: supplier?.email ?? "",
  note: supplier?.note ?? "",
  provinceName: supplier?.provinceName ?? "",
  provinceId: undefined,
  districtName: supplier?.districtName ?? "",
  districtId: supplier?.districtId ?? undefined,
  wardName: supplier?.wardName ?? "",
  wardCode: supplier?.wardCode ?? undefined,
  street: supplier?.street ?? "",
});

const renderMenuContent = <T extends Record<string, any>>(
  list: T[] | undefined,
  labelKey: keyof T,
  onSelect: (item: T) => void
) => {
  if (!list || list.length === 0) {
    return (
      <div className="px-3 py-2 text-[13px] text-[#888888]">Không có dữ liệu</div>
    );
  }

  return list.map((item) => (
    <DropdownMenuItem
      key={String(item[labelKey])}
      onClick={() => onSelect(item)}
      className="text-[14px]"
    >
      {item[labelKey] as string}
    </DropdownMenuItem>
  ));
};

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  isOpen,
  onClose,
  supplierData,
  onSave,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<SupplierFormState>(
    buildInitialState(supplierData)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialState(supplierData));
      setErrors({});
    }
  }, [isOpen, supplierData]);

  const {
    data: provincesData,
    isLoading: isLoadingProvinces,
    isError: isProvinceError,
  } = useQuery({
    queryKey: ["shipping-provinces"],
    queryFn: getProvinces,
    enabled: isOpen,
  });

  const provinces = useMemo(
    () =>
      (provincesData ?? []).sort((a, b) =>
        a.provinceName.localeCompare(b.provinceName, "vi", {
          sensitivity: "base",
        })
      ),
    [provincesData]
  );

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
    enabled: isOpen && Boolean(formData.provinceId),
  });

  const districts = useMemo(
    () =>
      (districtsData ?? []).sort((a, b) =>
        a.districtName.localeCompare(b.districtName, "vi", {
          sensitivity: "base",
        })
      ),
    [districtsData]
  );

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
    enabled: isOpen && Boolean(formData.districtId),
  });

  const wards = useMemo(
    () =>
      (wardsData ?? []).sort((a, b) =>
        a.wardName.localeCompare(b.wardName, "vi", { sensitivity: "base" })
      ),
    [wardsData]
  );

  useEffect(() => {
    if (!formData.provinceId && formData.provinceName && provinces.length > 0) {
      const matched = provinces.find(
        (province) => province.provinceName === formData.provinceName
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, provinceId: matched.provinceId }));
      }
    }
  }, [formData.provinceId, formData.provinceName, provinces]);

  useEffect(() => {
    if (!formData.districtId && formData.districtName && districts.length > 0) {
      const matched = districts.find(
        (district) => district.districtName === formData.districtName
      );
      if (matched) {
        setFormData((prev) => ({ ...prev, districtId: matched.districtId }));
      }
    }
  }, [formData.districtId, formData.districtName, districts]);

  useEffect(() => {
    if (!formData.wardCode && formData.wardName && wards.length > 0) {
      const matched = wards.find((ward) => ward.wardName === formData.wardName);
      if (matched) {
        setFormData((prev) => ({ ...prev, wardCode: matched.wardCode }));
      }
    }
  }, [formData.wardCode, formData.wardName, wards]);

  const handleInputChange = (field: keyof SupplierFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleProvinceSelect = (province: ProvinceResponse) => {
    setFormData((prev) => ({
      ...prev,
      provinceName: province.provinceName,
      provinceId: province.provinceId,
      districtName: "",
      districtId: undefined,
      wardName: "",
      wardCode: undefined,
    }));
    setErrors((prev) => ({ ...prev, provinceName: "" }));
  };

  const handleDistrictSelect = (district: DistrictResponse) => {
    setFormData((prev) => ({
      ...prev,
      districtName: district.districtName,
      districtId: district.districtId,
      wardName: "",
      wardCode: undefined,
    }));
    setErrors((prev) => ({ ...prev, districtName: "" }));
  };

  const handleWardSelect = (ward: WardResponse) => {
    setFormData((prev) => ({
      ...prev,
      wardName: ward.wardName,
      wardCode: ward.wardCode,
    }));
    setErrors((prev) => ({ ...prev, wardName: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Tên nhà cung cấp là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.provinceName.trim()) {
      newErrors.provinceName = "Vui lòng chọn tỉnh/thành phố";
    } else if (!formData.provinceId) {
      newErrors.provinceName = "Tỉnh/thành phố không hợp lệ";
    }

    if (!formData.districtName.trim()) {
      newErrors.districtName = "Vui lòng chọn quận/huyện";
    } else if (!formData.districtId) {
      newErrors.districtName = "Quận/huyện không hợp lệ";
    }

    if (!formData.wardName.trim()) {
      newErrors.wardName = "Vui lòng chọn phường/xã";
    } else if (!formData.wardCode) {
      newErrors.wardName = "Phường/xã không hợp lệ";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Địa chỉ cụ thể là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFullAddress = () => {
    return [formData.street, formData.wardName, formData.districtName, formData.provinceName]
      .filter((segment) => segment && segment.trim().length > 0)
      .join(", ");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!supplierData?.id) return;
    if (!validateForm()) return;

    const payload: ProviderUpdateRequest = {
      id: supplierData.id,
      name: formData.supplierName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      note: formData.note?.trim() ?? "",
      provinceName: formData.provinceName.trim(),
      districtName: formData.districtName.trim(),
      districtId: formData.districtId!,
      wardName: formData.wardName.trim(),
      wardCode: formData.wardCode!,
      street: formData.street.trim(),
      fullAddress: buildFullAddress(),
    };

    onSave(payload);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(8px)",
      }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[24px] w-[520px] max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-[24px] pb-[12px] border-b border-[#d1d1d1] px-[24px]">
          <h2 className="text-[20px] font-bold text-[#272424]">
            Sửa nhà cung cấp
          </h2>
          <p className="text-[13px] text-[#7d7d7d] mt-[4px]">
            Vui lòng cập nhật đầy đủ thông tin trước khi lưu
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[12px] px-[24px] pt-[16px] pb-[24px]"
        >
          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Tên nhà cung cấp
            </label>
            <FormInput
              value={formData.supplierName}
              onChange={(e) => handleInputChange("supplierName", e.target.value)}
              placeholder="Nhập tên nhà cung cấp"
            />
            {errors.supplierName && (
              <span className="text-red-500 text-[12px]">
                {errors.supplierName}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Số điện thoại
            </label>
            <FormInput
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && (
              <span className="text-red-500 text-[12px]">{errors.phone}</span>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Email
            </label>
            <FormInput
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Nhập email"
            />
            {errors.email && (
              <span className="text-red-500 text-[12px]">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Ghi chú
            </label>
            <div className="border-2 border-[#e04d30] rounded-[12px] w-full">
              <textarea
                value={formData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
                placeholder="Ví dụ: Nhà cung cấp ưu tiên giao sáng thứ 2"
                className="w-full h-[80px] p-[16px] border-0 outline-none bg-transparent text-[12px] font-semibold text-[#272424] placeholder:text-[#888888] resize-none"
              />
            </div>
          </div>

          <div className="font-bold text-[#272424] text-[16px] leading-normal mt-[4px]">
            Địa chỉ
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Tỉnh/Thành phố
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`bg-white border-2 ${
                    errors.provinceName || isProvinceError
                      ? "border-[#ff4d4f]"
                      : "border-[#e04d30]"
                  } rounded-[12px] h-[40px] px-[12px] flex items-center justify-between cursor-pointer`}
                >
                  <span
                    className={`text-[14px] font-semibold ${
                      formData.provinceName ? "text-[#272424]" : "text-[#888888]"
                    }`}
                  >
                    {isLoadingProvinces
                      ? "Đang tải..."
                      : formData.provinceName || "Chọn tỉnh/thành phố"}
                  </span>
                  <CaretDown className="text-[#e04d30]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[240px] overflow-auto">
                {renderMenuContent(provinces, "provinceName", handleProvinceSelect)}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.provinceName && (
              <span className="text-red-500 text-[12px]">
                {errors.provinceName}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Quận/Huyện
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`bg-white border-2 ${
                    errors.districtName || isDistrictError
                      ? "border-[#ff4d4f]"
                      : "border-[#e04d30]"
                  } rounded-[12px] h-[40px] px-[12px] flex items-center justify-between cursor-pointer ${
                    !formData.provinceId ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className={`text-[14px] font-semibold ${
                      formData.districtName ? "text-[#272424]" : "text-[#888888]"
                    }`}
                  >
                    {!formData.provinceId
                      ? "Chọn tỉnh trước"
                      : isLoadingDistricts
                        ? "Đang tải..."
                        : formData.districtName || "Chọn quận/huyện"}
                  </span>
                  <CaretDown className="text-[#e04d30]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[240px] overflow-auto">
                {!formData.provinceId
                  ? (
                      <div className="px-3 py-2 text-[13px] text-[#888888]">
                        Vui lòng chọn tỉnh/thành trước
                      </div>
                    )
                  : renderMenuContent(districts, "districtName", handleDistrictSelect)}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.districtName && (
              <span className="text-red-500 text-[12px]">
                {errors.districtName}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Phường/Xã
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`bg-white border-2 ${
                    errors.wardName || isWardError
                      ? "border-[#ff4d4f]"
                      : "border-[#e04d30]"
                  } rounded-[12px] h-[40px] px-[12px] flex items-center justify-between cursor-pointer ${
                    !formData.districtId ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <span
                    className={`text-[14px] font-semibold ${
                      formData.wardName ? "text-[#272424]" : "text-[#888888]"
                    }`}
                  >
                    {!formData.districtId
                      ? "Chọn quận/huyện trước"
                      : isLoadingWards
                        ? "Đang tải..."
                        : formData.wardName || "Chọn phường/xã"}
                  </span>
                  <CaretDown className="text-[#e04d30]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[240px] overflow-auto">
                {!formData.districtId
                  ? (
                      <div className="px-3 py-2 text-[13px] text-[#888888]">
                        Vui lòng chọn quận/huyện trước
                      </div>
                    )
                  : renderMenuContent(wards, "wardName", handleWardSelect)}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.wardName && (
              <span className="text-red-500 text-[12px]">{errors.wardName}</span>
            )}
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Địa chỉ cụ thể <span className="text-[#e04d30]">*</span>
            </label>
            <div className="border-2 border-[#e04d30] rounded-[12px] w-full">
              <textarea
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                placeholder="Nhập số nhà, tên đường..."
                className="w-full h-[100px] p-[16px] border-0 outline-none bg-transparent text-[12px] font-semibold text-[#272424] placeholder:text-[#888888] resize-none"
              />
            </div>
            {errors.street && (
              <span className="text-red-500 text-[12px]">{errors.street}</span>
            )}
          </div>

          <div className="flex gap-[12px] justify-end mt-[4px]">
            <Button variant="secondary" type="button" onClick={handleClose} disabled={isSubmitting}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Xác nhận"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplierModal;
