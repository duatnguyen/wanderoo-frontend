// src/pages/admin/AdminStaffNew.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import FormInput from "@/components/ui/form-input";
import { ArrowLeft, HelpCircle } from "lucide-react";
import RoleDropdown from "@/components/ui/role-dropdown";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createEmployee, type AllowedRole } from "@/api/endpoints/userApi";
import type { EmployeeCreationRequest } from "@/types";

type StaffFormData = {
  fullName: string;
  username: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
  gender: "male" | "female";
  role: string;
};

type FormErrors = Partial<Record<keyof StaffFormData, string>>;

const ROLE_TO_USER_TYPE: Record<string, AllowedRole> = {
  "Quản lý": "MANAGER",
  "Quản lý hệ thống": "ADMIN",
  "Nhân viên": "EMPLOYEE",
  "Nhân viên thu ngân": "EMPLOYEE",
};

const AdminStaffNew: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StaffFormData>({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    password: "",
    gender: "female",
    role: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    
    // Real-time validation for phone number
    if (field === "phone" && value.trim()) {
      const phoneValue = value.trim();
      const phoneDigits = phoneValue.replace(/\D/g, ""); // Remove non-digits
      
      // Check if phone contains only digits
      if (!/^\d+$/.test(phoneValue)) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Số điện thoại chỉ được chứa chữ số.",
        }));
      } else if (phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 13)) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Số điện thoại phải có từ 10 đến 13 chữ số.",
        }));
      }
    }
  };

  const createEmployeeMutation = useMutation({
    mutationFn: async ({
      payload,
      userType,
    }: {
      payload: EmployeeCreationRequest;
      userType?: AllowedRole;
    }) => {
      return await createEmployee(payload, userType);
    },
    onSuccess: () => {
      toast.success("Thêm nhân viên thành công");
      navigate("/admin/staff");
    },
    onError: (error: unknown) => {
      const errorResponse = (error as any)?.response?.data;
      let message = errorResponse?.message || "Không thể tạo nhân viên. Vui lòng thử lại.";
      
      // Translate phone number errors to Vietnamese
      const phoneErrorMessages: Record<string, string> = {
        "phone number must contain only digits": "Số điện thoại chỉ được chứa chữ số.",
        "phone number must be between 10 and 13 digits": "Số điện thoại phải có từ 10 đến 13 chữ số.",
        "phone number must contain only digits.": "Số điện thoại chỉ được chứa chữ số.",
        "phone number must be between 10 and 13 digits.": "Số điện thoại phải có từ 10 đến 13 chữ số.",
      };
      
      const lowerMessage = message.toLowerCase();
      let translatedMessage = message;
      
      // Check for phone number error messages
      for (const [key, value] of Object.entries(phoneErrorMessages)) {
        if (lowerMessage.includes(key.toLowerCase())) {
          translatedMessage = value;
          break;
        }
      }
      
      // Check if error is related to phone number
      if (lowerMessage.includes("phone") || lowerMessage.includes("số điện thoại") || lowerMessage.includes("digits")) {
        setFormErrors((prev) => ({ ...prev, phone: translatedMessage }));
        toast.error(translatedMessage);
      } else {
        setApiError(translatedMessage);
        toast.error(translatedMessage);
      }
    },
  });

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ tên.";
    }
    if (!formData.username.trim()) {
      errors.username = "Vui lòng nhập tên đăng nhập.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại.";
    } else {
      // Validate phone number: must contain only digits
      const phoneDigits = formData.phone.trim().replace(/\D/g, ""); // Remove non-digits
      const originalPhone = formData.phone.trim();
      
      // Check if phone contains only digits
      if (!/^\d+$/.test(originalPhone)) {
        errors.phone = "Số điện thoại chỉ được chứa chữ số.";
      } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
        errors.phone = "Số điện thoại phải có từ 10 đến 13 chữ số.";
      }
    }
    if (!formData.password.trim()) {
      errors.password = "Vui lòng nhập mật khẩu.";
    }
    if (!formData.role) {
      errors.role = "Vui lòng chọn vai trò.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    const genderEnum =
      formData.gender === "male"
        ? "MALE"
        : ("FEMALE" as EmployeeCreationRequest["gender"]);
    const payload: EmployeeCreationRequest = {
      name: formData.fullName.trim(),
      username: formData.username.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      email: formData.email.trim() || undefined,
      gender: genderEnum,
      birthday: formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString()
        : undefined,
    };
    const userType = ROLE_TO_USER_TYPE[formData.role] ?? "EMPLOYEE";

    await createEmployeeMutation.mutateAsync({
      payload,
      userType,
    });
  };

  const handleCancel = () => {
    navigate("/admin/staff");
  };

  return (
    <div className="flex flex-col gap-[10px] w-full">
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
            {/* First Row: Full Name and Username */}
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
                {formErrors.fullName && (
                  <p className="text-sm text-red-500">{formErrors.fullName}</p>
                )}
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Tên đăng nhập
                </label>
                <FormInput
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Nhập tên đăng nhập"
                  containerClassName="h-[36px] px-[12px] py-0"
                />
                {formErrors.username && (
                  <p className="text-sm text-red-500">{formErrors.username}</p>
                )}
              </div>
            </div>

            {/* Second Row: Phone and Email */}
            <div className="grid grid-cols-2 gap-[16px]">
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
                {formErrors.phone && (
                  <p className="text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>

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
            </div>

            {/* Third Row: Date of Birth and Password */}
            <div className="grid grid-cols-2 gap-[16px]">
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

              <div className="flex flex-col gap-[8px]">
                <label className="font-semibold text-[#272424] text-[14px]">
                  Mật khẩu
                </label>
                <FormInput
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu của bạn"
                  containerClassName="h-[36px] px-[12px] py-0"
                />
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>
            </div>

            {/* Fourth Row: Gender */}
            <div className="grid grid-cols-2 gap-[16px]">
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

              <div />
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
              error={Boolean(formErrors.role)}
              onValueChange={(v) => handleInputChange("role", v)}
            />
            {formErrors.role && (
              <p className="text-sm text-red-500">{formErrors.role}</p>
            )}
          </div>
        </div>

        {apiError && (
          <div className="w-full rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-[10px] items-center justify-end w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={createEmployeeMutation.isPending}
          >
            Huỷ
          </Button>
          <Button type="submit" disabled={createEmployeeMutation.isPending}>
            {createEmployeeMutation.isPending ? "Đang xử lý..." : "Thêm mới"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminStaffNew;
