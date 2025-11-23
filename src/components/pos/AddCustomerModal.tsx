import React, { useState } from "react";
import { X } from "lucide-react";

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
        className="relative z-50 bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl animate-scaleIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
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
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200"></div>

        {/* Form Content */}
        <div className="px-6 pt-6 pb-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Full Name */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#272424] min-w-[120px]">
              Họ và tên
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Nhập họ và tên"
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#272424] placeholder:text-gray-400 focus:outline-none focus:border-[#E04D30] transition-colors"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#272424] min-w-[120px]">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="Nhập số điện thoại"
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#272424] placeholder:text-gray-400 focus:outline-none focus:border-[#E04D30] transition-colors"
              required
            />
          </div>

          {/* Gender */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#272424] min-w-[120px]">
              Giới tính
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as "male" | "female",
                    })
                  }
                  className="w-4 h-4 text-[#E04D30] border-gray-300 focus:ring-[#E04D30] focus:ring-2 cursor-pointer"
                  style={{ accentColor: "#E04D30" }}
                />
                <span className="text-sm text-[#272424]">Nam</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as "male" | "female",
                    })
                  }
                  className="w-4 h-4 text-[#E04D30] border-gray-300 focus:ring-[#E04D30] focus:ring-2 cursor-pointer"
                  style={{ accentColor: "#E04D30" }}
                />
                <span className="text-sm text-[#272424]">Nữ</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-0">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 bg-white border border-[#E04D30] text-[#E04D30] rounded-lg font-medium hover:bg-[#E04D30]/5 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E04D30] text-white rounded-lg font-medium hover:bg-[#d0442a] transition-colors"
            >
              Thêm
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
