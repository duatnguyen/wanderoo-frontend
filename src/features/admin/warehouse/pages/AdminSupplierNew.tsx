import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ArrowLeft } from "lucide-react";
import CityDropdown from "@/components/ui/city-dropdown";
import DistrictDropdown from "@/components/ui/district-dropdown";
import WardDropdown from "@/components/ui/ward-dropdown";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // TODO: Implement API call to create supplier
      console.log("Creating supplier:", formData);
      // Navigate back to suppliers list
      navigate("/admin/warehouse/supplier");
    }
  };

  const handleCancel = () => {
    navigate("/admin/warehouse/supplier");
  };

  return (
    <div className="flex flex-col gap-[16px] items-center w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-[12px] w-full">
        <button
          onClick={() => navigate("/admin/warehouse/supplier")}
          className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-[20px] h-[20px] text-[#272424]" />
        </button>
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
          Thêm nhà cung cấp
        </h2>
      </div>

      {/* General Information Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-bold text-[#272424] text-[20px] leading-normal">
            Thông tin chung
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] w-full">
            {/* Tên nhà cung cấp */}
            <div className="flex flex-col gap-[8px]">
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
              />
              {errors.supplierName && (
                <span className="text-red-500 text-[12px]">
                  {errors.supplierName}
                </span>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <FormInput
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <span className="text-red-500 text-[12px]">{errors.phone}</span>
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
              />
              {errors.email && (
                <span className="text-red-500 text-[12px]">{errors.email}</span>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Address Information Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-bold text-[#272424] text-[20px] leading-normal">
            Thông tin địa chỉ
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] w-full">
          {/* Địa chỉ đường */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#272424] text-[14px] font-semibold leading-[1.4]">
              Địa chỉ đường <span className="text-red-500">*</span>
            </label>
            <FormInput
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="Nhập địa chỉ đường"
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && (
              <span className="text-red-500 text-[12px]">{errors.street}</span>
            )}
          </div>

          {/* Tỉnh/Thành phố */}
          <div className="flex flex-col gap-[8px]">
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
          <div className="flex flex-col gap-[8px]">
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
        </div>
      </div>

      {/* Note Field */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[16px] py-[16px] rounded-[16px] w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-bold text-[#272424] text-[20px] leading-normal">
            Ghi chú
          </h3>
        </div>

        <div className="w-full">
          <FormInput
            value={formData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
            placeholder="Nhập ghi chú (tùy chọn)"
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
        >
          Thêm nhà cung cấp
        </Button>
      </div>
    </div>
  );
};

export default AdminSupplierNew;
