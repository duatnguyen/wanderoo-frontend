import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

// Mock data for dropdowns
const wardOptions = [
  "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5",
  "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10",
  "Đinh Tiên Hoàng"
];

const districtOptions = [
  "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5",
  "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10",
  "Quận 11", "Quận 12", "Quận Bình Thạnh", "Quận Tân Bình",
  "Quận Tân Phú", "Quận Phú Nhuận", "Quận Gò Vấp", "Hoàn Kiếm"
];

const cityOptions = [
  "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu"
];

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
    ward: "Đinh Tiên Hoàng",
    district: "Hoàn Kiếm",
    city: "Hà Nội"
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      supplierName: supplierData.name,
      phone: supplierData.phone,
      email: supplierData.email,
      street: "số 40 Đinh Tiên Hoàng, Hà Nội",
      ward: "Đinh Tiên Hoàng",
      district: "Hoàn Kiếm",
      city: "Hà Nội"
    });
    setErrors({});
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[600px] sm:max-w-[600px] p-0">
        <div className="bg-white flex flex-col items-start overflow-hidden rounded-[24px] h-full">
          {/* Header */}
          <div className="flex gap-[9px] items-center p-[15px] w-full">
            <SheetTitle className="font-bold text-[#272424] text-[24px] leading-[1.5]">
              Sửa nhà cung cấp
            </SheetTitle>
          </div>

          {/* Form Content */}
          <div className="flex flex-col gap-[10px] items-start px-[15px] py-0 w-full flex-1 overflow-y-auto">
            {/* Tên nhà cung cấp */}
            <div className="flex flex-col gap-[6px] items-start w-full">
              <div className="flex gap-[4px] items-start">
                <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Tên nhà cung cấp
                </p>
              </div>
              <FormInput
                value={formData.supplierName}
                onChange={(e) => handleInputChange("supplierName", e.target.value)}
                placeholder="Kho Nhật Quang"
                className="text-[#272424] placeholder:text-[#737373]"
              />
              {errors.supplierName && (
                <span className="text-red-500 text-[12px]">{errors.supplierName}</span>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-[6px] items-start w-full">
              <div className="flex gap-[4px] items-start">
                <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Số điện thoại
                </p>
              </div>
              <FormInput
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="038482428234"
                className="text-[#272424] placeholder:text-[#737373]"
              />
              {errors.phone && (
                <span className="text-red-500 text-[12px]">{errors.phone}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-[6px] items-start w-full">
              <div className="flex gap-[4px] items-start">
                <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Email
                </p>
              </div>
              <FormInput
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="khonhatquang12348@gmail.com"
                className="text-[#272424] placeholder:text-[#737373]"
              />
              {errors.email && (
                <span className="text-red-500 text-[12px]">{errors.email}</span>
              )}
            </div>

            {/* Address Section */}
            <div className="flex gap-[20px] items-center w-full">
              <p className="font-bold text-[#272424] text-[20px] leading-normal">
                Địa chỉ
              </p>
            </div>

            {/* Address Fields */}
            <div className="flex flex-col gap-[6px] items-start w-full">
              {/* Tỉnh/Thành phố */}
              <div className="flex flex-col gap-[6px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Tỉnh/Thành phố
                  </p>
                </div>
                <Select
                  value={formData.city}
                  onValueChange={(value) => handleInputChange("city", value)}
                >
                  <SelectTrigger className="bg-white border-[1.6px] border-[#e04d30] h-[52px] px-[16px] rounded-[12px] w-full">
                    <SelectValue className="text-[10px] font-medium text-[#272424]" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#e04d30] rounded-[12px] shadow-lg">
                    {cityOptions.map((city) => (
                      <SelectItem key={city} value={city} className="text-[10px] font-medium text-[#272424] hover:bg-[#f5f5f5] cursor-pointer">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phường/Xã */}
              <div className="flex flex-col gap-[6px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Phường/Xã
                  </p>
                </div>
                <Select
                  value={formData.ward}
                  onValueChange={(value) => handleInputChange("ward", value)}
                >
                  <SelectTrigger className="bg-white border-[1.6px] border-[#e04d30] h-[52px] px-[16px] rounded-[12px] w-full">
                    <SelectValue className="text-[10px] font-medium text-[#272424]" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#e04d30] rounded-[12px] shadow-lg">
                    {wardOptions.map((ward) => (
                      <SelectItem key={ward} value={ward} className="text-[10px] font-medium text-[#272424] hover:bg-[#f5f5f5] cursor-pointer">
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quận/Huyện */}
              <div className="flex flex-col gap-[6px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <p className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Quận/Huyện
                  </p>
                </div>
                <Select
                  value={formData.district}
                  onValueChange={(value) => handleInputChange("district", value)}
                >
                  <SelectTrigger className="bg-white border-[1.6px] border-[#e04d30] h-[52px] px-[16px] rounded-[12px] w-full">
                    <SelectValue className="text-[10px] font-medium text-[#272424]" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[#e04d30] rounded-[12px] shadow-lg">
                    {districtOptions.map((district) => (
                      <SelectItem key={district} value={district} className="text-[10px] font-medium text-[#272424] hover:bg-[#f5f5f5] cursor-pointer">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Địa chỉ cụ thể */}
            <div className="flex flex-col gap-[6px] items-start w-full">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex font-semibold gap-[4px] items-start leading-[1.4] text-[16px]">
                  <p className="text-[#272424]">
                    Địa chỉ cụ thể
                  </p>
                  <p className="text-[#eb2b0b]">
                    *
                  </p>
                </div>
              </div>
              <div className="border-2 border-[#e04d30] rounded-[12px] w-full">
                <textarea
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  placeholder="số 40 Đinh Tiên Hoàng, Hà Nội"
                  className="w-full h-[100px] p-[16px] border-0 outline-none bg-transparent text-[12px] font-normal text-[#737373] placeholder:text-[#737373] resize-none"
                  rows={3}
                />
              </div>
              {errors.street && (
                <span className="text-red-500 text-[12px]">{errors.street}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[10px] items-center justify-end px-0 py-[12px] w-full">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="bg-white border-2 border-[#e04d30] text-[#e04d30] hover:bg-[#e04d30] hover:text-white px-[24px] py-[12px] rounded-[12px]"
                >
                  <span className="font-bold text-[12px] leading-normal">
                    Huỷ
                  </span>
                </Button>
              </div>
              <div className="flex items-center">
                <Button
                  onClick={handleSave}
                  className="bg-[#e04d30] hover:bg-[#c03d26] text-white px-[24px] py-[12px] rounded-[12px]"
                >
                  <span className="font-bold text-[12px] leading-normal">
                    Xác nhận
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditSupplierModal;
