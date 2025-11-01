import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import CustomRadio from "@/components/ui/custom-radio";

export type CustomerFormData = {
  fullName: string;
  phoneNumber: string;
  gender: "male" | "female";
};

export type AddCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CustomerFormData) => void;
};

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    fullName: "",
    phoneNumber: "",
    gender: "male",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName.trim() && formData.phoneNumber.trim()) {
      onAdd(formData);
      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        gender: "male",
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      gender: "male",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal Content */}
      <div
        className="relative z-50 bg-white rounded-[24px] p-6 w-full max-w-[500px] shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-bold text-[#272424] font-montserrat">
            Thêm mới khách hàng
          </h2>
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#737373]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Full Name */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#272424] min-w-[120px]">
              Họ và tên
            </label>
            <FormInput
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Nhập họ và tên"
              containerClassName="flex-1"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#272424] min-w-[120px]">
              Số điện thoại
            </label>
            <FormInput
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="Nhập số điện thoại"
              containerClassName="flex-1"
              required
            />
          </div>

          {/* Gender */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#272424] min-w-[120px]">
              Giới tính
            </label>
            <div className="flex items-center gap-6">
              <CustomRadio
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                label="Nam"
              />
              <CustomRadio
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "male" | "female",
                  })
                }
                label="Nữ"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="px-6 py-2"
            >
              Hủy
            </Button>
            <Button type="submit" className="px-6 py-2">
              Thêm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
