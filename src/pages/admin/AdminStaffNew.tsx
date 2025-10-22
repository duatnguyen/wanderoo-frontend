// src/pages/admin/AdminStaffNew.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import FormInput from "@/components/ui/form-input";
import { ArrowLeft, Calendar, HelpCircle } from "lucide-react";
import CaretDown from "@/components/ui/caret-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    <div className="flex flex-col items-center px-[50px] py-0 w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px] h-[104px] items-start justify-center px-0 py-[10px] w-full">
        <div className="flex gap-[30px] items-center px-0 py-[10px] w-full">
          <div className="flex gap-[8px] items-center">
            <button
              onClick={() => navigate("/admin/staff")}
              className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded"
            >
              <ArrowLeft className="w-[18px] h-[10px] text-[#737373]" />
            </button>
            <div className="flex gap-[4px] items-center justify-center">
              <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
                Thêm mới nhân viên
              </h1>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] items-start w-full">
        {/* Account Information Section */}
        <div className="bg-white border border-[#d1d1d1] flex flex-col gap-[12px] items-start justify-center px-[40px] py-[20px] rounded-[24px] w-full">
          <div className="flex items-center w-full">
            <h2 className="font-bold text-[#272424] text-[20px] leading-normal">
              Thông tin tài khoản
            </h2>
          </div>

          {/* First Row: Full Name and Phone */}
          <div className="flex gap-[50px] items-start w-full">
            <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Họ và tên
                  </label>
                </div>
              </div>
              <FormInput
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Số điện thoại
                  </label>
                </div>
              </div>
              <FormInput
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>
          </div>

          {/* Second Row: Email and Date of Birth */}
          <div className="flex gap-[50px] items-start w-full">
            <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Email
                  </label>
                </div>
              </div>
              <FormInput
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Ngày sinh
                  </label>
                </div>
              </div>
              <FormInput
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="text-[10px] font-medium text-[#737373]"
                right={<Calendar className="w-[24px] h-[24px] text-[#454545]" />}
              />
            </div>
          </div>

          {/* Third Row: Password and Gender */}
          <div className="flex gap-[55px] items-center w-full">
            <div className="flex flex-col gap-[6px] h-[78px] items-start flex-1">
              <div className="flex flex-col gap-[4px] items-start w-full">
                <div className="flex gap-[4px] items-start">
                  <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                    Mật khẩu
                  </label>
                </div>
              </div>
              <FormInput
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            <div className="flex flex-col gap-[10px] h-[54px] items-start justify-center flex-1">
              <label className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                Giới tính
              </label>
              <div className="flex gap-[10px] items-center w-[209px]">
                <label className="flex items-center gap-[8px] cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-[24px] h-[24px]"
                  />
                  <span className="font-bold text-[#272424] text-[12px] leading-[1.5]">
                    Nữ
                  </span>
                </label>
                <label className="flex items-center gap-[8px] cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-[24px] h-[24px]"
                  />
                  <span className="font-bold text-[#272424] text-[12px] leading-[1.5]">
                    Nam
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection Section */}
        <div className="bg-white border border-[#d1d1d1] flex flex-col gap-[10px] items-start justify-center px-[40px] py-[20px] rounded-[24px] w-full">
          <div className="flex gap-[50px] items-start w-full">
            <div className="flex flex-col gap-[6px] items-start flex-1">
              <div className="flex flex-col gap-[4px] h-[24px] items-start w-full">
                <div className="flex gap-[4px] items-start flex-1">
                  <label className="font-semibold text-[#272424] text-[16px] leading-[1.4]">
                    Vai trò nhân viên
                  </label>
                  <HelpCircle className="w-[24px] h-[24px] text-[#888888]" />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-white border-2 border-[#e04d30] flex gap-[6px] h-[50px] items-center px-[24px] py-[12px] rounded-[12px] w-full cursor-pointer">
                    <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4]">
                      {formData.role || "Chọn vai trò của nhân viên"}
                    </span>
                    <CaretDown className="text-[#e04d30]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleInputChange("role", "Quản lý")}>
                    Quản lý
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("role", "Quản lý hệ thống")}>
                    Quản lý hệ thống
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("role", "Nhân viên")}>
                    Nhân viên
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[10px] items-center justify-end w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
          >
            Xác nhận
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminStaffNew;
