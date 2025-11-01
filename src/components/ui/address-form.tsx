import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
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
    district: initialData.district || "",
    ward: initialData.ward || "",
    detailAddress: initialData.detailAddress || "",
    isDefault: initialData.isDefault || false,
  });

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const provinces = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"];
  const districts = ["Quận Hoàn Kiếm", "Quận Ba Đình", "Quận Đống Đa"];
  const wards = ["Phường Phúc Xá", "Phường Trúc Bạch", "Phường Vĩnh Phú"];

  return (
    <div className="bg-white flex flex-col items-start rounded-[24px] w-full">
      {/* Header */}
      <div className="flex gap-[9px] items-center p-[15px] w-full">
        <h2 className="font-bold text-[#272424] text-[24px] leading-[1.5]">
          {title}
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[10px] items-start px-[15px] pb-[15px] w-full"
      >
        {/* Full Name */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Họ và tên
          </label>
          <FormInput
            placeholder="Nhập họ và tên của bạn"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Số điện thoại
          </label>
          <FormInput
            placeholder="Nhập số điện thoại của bạn"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </div>

        {/* Address Section */}
        <div className="flex gap-[20px] items-center w-full">
          <h3 className="font-bold text-[#272424] text-[20px] leading-normal">
            Địa chỉ
          </h3>
        </div>

        {/* Province Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Tỉnh/Thành phố
          </label>
          <SimpleDropdown
            value={formData.province}
            options={provinces}
            onValueChange={(value) => handleInputChange("province", value)}
            placeholder="Chọn tỉnh thành phố"
          />
        </div>

        {/* District Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Quận/Huyện
          </label>
          <SimpleDropdown
            value={formData.district}
            options={districts}
            onValueChange={(value) => handleInputChange("district", value)}
            placeholder="Chọn Quận/Huyện"
          />
        </div>

        {/* Ward Dropdown */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Phường/Xã
          </label>
          <SimpleDropdown
            value={formData.ward}
            options={wards}
            onValueChange={(value) => handleInputChange("ward", value)}
            placeholder="Chọn Phường/Xã"
          />
        </div>

        {/* Detail Address */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <label className="font-semibold text-[#272424] text-[14px] leading-[1.4] flex gap-[4px] items-center">
            Địa chỉ chi tiết
            <span className="text-[#eb2b0b] text-[16px]">*</span>
          </label>
          <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] h-[52px] items-center px-[16px] py-[12px] rounded-[12px] w-full">
            <input
              type="text"
              value={formData.detailAddress}
              onChange={(e) =>
                handleInputChange("detailAddress", e.target.value)
              }
              placeholder="Nhập địa chỉ chi tiết của bạn"
              className="border-0 outline-none text-[12px] font-semibold text-[#272424] placeholder:text-[#888888] bg-transparent flex-1"
            />
          </div>
        </div>

        {/* Default Address Checkbox */}
        <div className="flex gap-[5px] items-start w-full">
          <CustomCheckbox
            checked={formData.isDefault}
            onChange={(checked) => handleInputChange("isDefault", checked)}
          />
          <label className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
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
