import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import CityDropdown from "@/components/ui/city-dropdown";
import DistrictDropdown from "@/components/ui/district-dropdown";
import WardDropdown from "@/components/ui/ward-dropdown";

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierData: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    note: string;
  };
  onSave: (data: {
    supplierName: string;
    phone: string;
    email: string;
    street: string;
    ward: string;
    district: string;
    city: string;
  }) => void;
}

const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  isOpen,
  onClose,
  supplierData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    supplierName: supplierData.name,
    phone: supplierData.phone,
    email: supplierData.email,
    street: "số 40 Đinh Tiên Hoàng, Hà Nội",
    city: "Hà Nội",
    district: "Hoàn Kiếm",
    ward: "Đinh Tiên Hoàng"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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

    if (!formData.street.trim()) {
      newErrors.street = "Địa chỉ cụ thể là bắt buộc";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Tỉnh/Thành phố là bắt buộc";
    }

    if (!formData.district.trim()) {
      newErrors.district = "Quận/Huyện là bắt buộc";
    }

    if (!formData.ward.trim()) {
      newErrors.ward = "Phường/Xã là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        supplierName: formData.supplierName,
        phone: formData.phone,
        email: formData.email,
        street: formData.street,
        ward: formData.ward,
        district: formData.district,
        city: formData.city
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      supplierName: supplierData.name,
      phone: supplierData.phone,
      email: supplierData.email,
      street: "số 40 Đinh Tiên Hoàng, Hà Nội",
      city: "Hà Nội",
      district: "Hoàn Kiếm",
      ward: "Đinh Tiên Hoàng"
    });
    setErrors({});
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
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] p-[32px] w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-[20px] font-bold text-[#272424] mb-[24px]">
          Sửa nhà cung cấp
        </h2>

        {/* Form Content */}
        <div className="flex flex-col gap-[16px]">
          {/* Tên nhà cung cấp */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Tên nhà cung cấp
            </label>
            <FormInput
              value={formData.supplierName}
              onChange={(e) => handleInputChange("supplierName", e.target.value)}
              placeholder="Kho Nhật Quang"
            />
            {errors.supplierName && (
              <span className="text-red-500 text-[12px]">{errors.supplierName}</span>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Số điện thoại
            </label>
            <FormInput
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="038482428234"
            />
            {errors.phone && (
              <span className="text-red-500 text-[12px]">{errors.phone}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Email
            </label>
            <FormInput
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="khonhatquang12348@gmail.com"
            />
            {errors.email && (
              <span className="text-red-500 text-[12px]">{errors.email}</span>
            )}
          </div>

          {/* Address Section */}
          <div className="font-bold text-[#272424] text-[16px] leading-normal mt-[8px]">
            Địa chỉ
          </div>

          {/* Tỉnh/Thành phố */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Tỉnh/Thành phố
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

          {/* Phường/Xã */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Phường/Xã
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

          {/* Quận/Huyện */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Quận/Huyện
            </label>
            <DistrictDropdown
              value={formData.district}
              onValueChange={(value) => handleInputChange("district", value)}
              error={!!errors.district}
            />
            {errors.district && (
              <span className="text-red-500 text-[12px]">{errors.district}</span>
            )}
          </div>

          {/* Địa chỉ cụ thể */}
          <div className="flex flex-col gap-[8px]">
            <label className="font-medium text-[#272424] text-[14px]">
              Địa chỉ cụ thể <span className="text-[#e04d30]">*</span>
            </label>
            <div className="border-2 border-[#e04d30] rounded-[12px] w-full">
              <textarea
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                placeholder="số 40 Đinh Tiên Hoàng, Hà Nội"
                className="w-full h-[100px] p-[16px] border-0 outline-none bg-transparent text-[12px] font-semibold text-[#272424] placeholder:text-[#888888] resize-none"
                rows={3}
              />
            </div>
            {errors.street && (
              <span className="text-red-500 text-[12px]">{errors.street}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[12px] justify-end mt-[8px]">
            <Button variant="secondary" onClick={handleCancel}>
              Huỷ
            </Button>
            <Button variant="default" onClick={handleSave}>
              Xác nhận
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSupplierModal;
