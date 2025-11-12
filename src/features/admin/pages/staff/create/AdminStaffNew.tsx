// src/pages/admin/AdminStaffNew.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import FormInput from "@/components/ui/form-input";
import { ArrowLeft, Calendar, HelpCircle } from "lucide-react";
import CaretDown from "@/components/ui/caret-down";
import RoleDropdown from "@/components/ui/role-dropdown";

type StaffFormData = {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
  gender: "male" | "female";
  role: string;
};

const AdminStaffNew: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StaffFormData>({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    password: "",
    gender: "female",
    role: "",
  });

  const handleInputChange = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
    // Navigate back to staff list
    navigate("/admin/staff");
  };

  const handleCancel = () => {
    navigate("/admin/staff");
  };

  return (
    <div className="flex flex-col gap-[10px] w-full max-w-[930px] mx-auto">
      {/* Header */}
      <div className="flex items-center h-[24px] -mt-[5px]">
        <button
          onClick={() => navigate("/admin/staff")}
          className="flex items-center justify-center w-[24px] h-[24px] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-[16px] h-[16px] text-[#272424]" />
        </button>
        <h1 className="ml-[8px] font-bold text-[#272424] text-[20px] leading-[1]">
          Thêm mới nhân viên
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[10px] items-start w-full"
      >
        {/* Account Information Section */}
        <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
          <h2 className="font-bold text-[#272424] text-[16px] leading-[1.4] mb-[10px]">
            Thông tin tài khoản
          </h2>

          <div className="flex flex-col gap-[16px]">
            {/* First Row: Full Name and Phone */}
            <div className="grid grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Họ và tên
                </label>
                <FormInput
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Nhập họ và tên của bạn"
                  containerClassName="h-[36px] px-[12px] py-0"
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Số điện thoại
                </label>
                <FormInput
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Nhập số điện thoại của bạn"
                  containerClassName="h-[36px] px-[12px] py-0"
                />
              </div>
            </div>

            {/* Second Row: Email and Date of Birth */}
            <div className="grid grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Email
                </label>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email của bạn"
                  containerClassName="h-[36px] px-[12px] py-0"
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Ngày sinh
                </label>
                <FormInput
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={`text-[14px] font-medium ${
                    formData.dateOfBirth ? "text-[#272424]" : "text-[#737373]"
                  } big-native-picker`}
                  containerClassName="h-[36px] px-[12px] py-0"
                />
              </div>
            </div>

            {/* Third Row: Password and Gender */}
            <div className="grid grid-cols-2 gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Mật khẩu
                </label>
                <FormInput
                  type="text"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu của bạn"
                  containerClassName="h-[36px] px-[12px] py-0"
                />
              </div>

              <div className="flex flex-col gap-[4px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Giới tính
                </label>
                <div className="flex gap-[16px] items-center h-[36px]">
                  <label className="flex items-center gap-[8px] cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-[24px] h-[24px]"
                    />
                    <span className="font-bold text-[#272424] text-[14px] leading-[1.5]">
                      Nữ
                    </span>
                  </label>
                  <label className="flex items-center gap-[8px] cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-[24px] h-[24px]"
                    />
                    <span className="font-bold text-[#272424] text-[14px] leading-[1.5]">
                      Nam
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection Section */}
        <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] w-full">
          <div className="flex flex-col gap-[8px]">
            <div className="flex gap-[4px] items-center">
              <label className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                Vai trò nhân viên
              </label>
              <HelpCircle className="w-[24px] h-[24px] text-[#888888]" />
            </div>
            <RoleDropdown
              value={formData.role}
              onValueChange={(v) => handleInputChange("role", v)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[10px] items-center justify-end w-full">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Huỷ
          </Button>
          <Button type="submit">Thêm mới</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminStaffNew;
