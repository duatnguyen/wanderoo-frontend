// src/pages/admin/AdminStaffNew.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  "Nhân viên": "EMPLOYEE",
  "Quản lý vận hành": "OPERATIONS_MANAGER",
};

const NAME_REGEX = /^[\p{L}\s'.-]+$/u;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,30}$/;
const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const getAge = (date: Date) => {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age;
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

  const setFieldError = (
    field: keyof StaffFormData,
    errorMessage?: string
  ) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      if (errorMessage) {
        next[field] = errorMessage;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const validateField = (field: keyof StaffFormData, value: string) => {
    let error: string | undefined;
    const trimmedValue = value.trim();

    switch (field) {
      case "fullName":
        if (!trimmedValue) {
          error = "Vui lòng nhập họ tên.";
        } else if (trimmedValue.length < 3) {
          error = "Họ tên phải có ít nhất 3 ký tự.";
        } else if (!NAME_REGEX.test(trimmedValue)) {
          error = "Họ tên không được chứa ký tự đặc biệt.";
        }
        break;
      case "username":
        if (!trimmedValue) {
          error = "Vui lòng nhập tên đăng nhập.";
        } else if (!USERNAME_REGEX.test(trimmedValue)) {
          error =
            "Tên đăng nhập phải từ 4-30 ký tự và chỉ gồm chữ, số, dấu gạch dưới.";
        }
        break;
      case "phone": {
        if (!trimmedValue) {
          error = "Vui lòng nhập số điện thoại.";
          break;
        }
        const phoneDigits = trimmedValue.replace(/\D/g, "");
        if (!/^\d+$/.test(trimmedValue)) {
          error = "Số điện thoại chỉ được chứa chữ số.";
        } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
          error = "Số điện thoại phải có từ 10 đến 13 chữ số.";
        }
        break;
      }
      case "email":
        if (trimmedValue && !EMAIL_REGEX.test(trimmedValue)) {
          error = "Định dạng email không đúng. Ví dụ: ten@gmail.com";
        }
        break;
      case "password":
        if (!trimmedValue) {
          error = "Vui lòng nhập mật khẩu.";
        } else if (!PASSWORD_COMPLEXITY_REGEX.test(trimmedValue)) {
          error =
            "Mật khẩu phải có tối thiểu 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
        }
        break;
      case "dateOfBirth":
        if (!trimmedValue) {
          error = "Vui lòng nhập ngày sinh.";
          break;
        }
        {
          const inputDate = new Date(trimmedValue);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (Number.isNaN(inputDate.getTime())) {
            error = "Ngày sinh không hợp lệ.";
          } else if (inputDate > today) {
            error = "Ngày sinh không được lớn hơn hiện tại.";
          } else if (getAge(inputDate) < 17) {
            // > 16 tuổi => tối thiểu 17 tuổi
            error = "Nhân viên phải trên 16 tuổi.";
          }
        }
        break;
      case "role":
        if (!trimmedValue) {
          error = "Vui lòng chọn vai trò.";
        }
        break;
      default:
        break;
    }

    setFieldError(field, error);
    return error;
  };

  const handleInputChange = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    validateField(field, value);
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
      
      type FieldKey = keyof StaffFormData;
      const lowerMessage = message.toLowerCase();
      const fieldErrorTranslations: Array<{
        field: FieldKey;
        keywords: string[];
        translatedMessage: string;
      }> = [
        {
          field: "phone",
          keywords: [
            "phone number must contain only digits",
            "phone number must be between 10 and 13 digits",
          ],
          translatedMessage: "Số điện thoại chỉ được chứa 10-13 chữ số.",
        },
        {
          field: "phone",
          keywords: ["constraint `phone`", "duplicate entry", "phone number already exists"],
          translatedMessage: "Số điện thoại đã tồn tại.",
        },
        {
          field: "username",
          keywords: ["username already exists"],
          translatedMessage: "Tên đăng nhập đã tồn tại.",
        },
        {
          field: "email",
          keywords: ["email already exists"],
          translatedMessage: "Email đã tồn tại.",
        },
      ];

      const matchedFieldError = fieldErrorTranslations.find(({ keywords }) =>
        keywords.some((keyword) => lowerMessage.includes(keyword.toLowerCase()))
      );

      if (matchedFieldError) {
        setFieldError(matchedFieldError.field, matchedFieldError.translatedMessage);
        toast.error(matchedFieldError.translatedMessage);
      } else {
        setApiError(message);
        toast.error(message);
      }
    },
  });

  const validateForm = () => {
    const errors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof StaffFormData>).forEach((key) => {
      const value = formData[key];
      const error = validateField(key, value);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
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
                {formErrors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {formErrors.dateOfBirth}
                  </p>
                )}
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
