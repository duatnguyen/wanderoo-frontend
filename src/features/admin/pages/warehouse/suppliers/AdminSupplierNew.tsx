import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ArrowLeft } from "lucide-react";
import CityDropdown from "@/components/ui/city-dropdown";
import DistrictDropdown from "@/components/ui/district-dropdown";
import WardDropdown from "@/components/ui/ward-dropdown";
import { createProvider } from "@/api/endpoints/warehouseApi";
import { toast } from "sonner";
import type { ApiResponse } from "@/types";
import {
  TabMenuWithBadge,
  PageContainer,
  ContentCard,
  type TabItemWithBadge,
} from "@/components/common";
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
    district: "",
    ward: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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

    if (!formData.ward.trim()) {
      newErrors.ward = "Phường/Xã là bắt buộc";
    }

    if (!formData.district.trim()) {
      newErrors.district = "Quận/Huyện là bắt buộc";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Tỉnh/Thành phố là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await createProvider({
          name: formData.supplierName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          note: formData.note?.trim() || "",
          province: formData.city.trim(),
          ward: formData.ward.trim(),
          district: formData.district.trim(),
          location: formData.street.trim(),
        });
        toast.success("Thêm nhà cung cấp thành công");
        navigate("/admin/warehouse/supplier");
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
              <CityDropdown
                value={formData.city}
                onValueChange={(value) => handleInputChange("city", value)}
                error={!!errors.city}
              />
              {errors.city && (
                <span className="text-red-500 text-[12px]">{errors.city}</span>
              )}
            </div>

            {/* Quận/Huyện */}
            <div className="flex flex-col gap-[4px]">
              <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <DistrictDropdown
                value={formData.district}
                onValueChange={(value) => handleInputChange("district", value)}
                error={!!errors.district}
              />
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
              <WardDropdown
                value={formData.ward}
                onValueChange={(value) => handleInputChange("ward", value)}
                error={!!errors.ward}
              />
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
