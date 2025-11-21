import React, { useEffect, useState } from "react";
import Button from "../../../../components/shop/Button";
import { Input } from "../../../../components/shop/Input";
import { useAuth } from "../../../../context/AuthContext";
import type { ChangePasswordRequest } from "../../../../types";
import { changePassword } from "../../../../api/endpoints/userApi";

const PasswordTab: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = {
    hasLength: formData.newPassword.length >= 8,
    hasLetter: /[A-Za-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword),
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof typeof errors];
        return next;
      });
    }
  };

  useEffect(() => {
    if (user?.phone) {
      setFormData((prev) => ({ ...prev, phone: user.phone ?? "" }));
    }
  }, [user?.phone]);

  const handleCancel = () => {
    // Reset form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      phone: user?.phone ?? "",
    });
    setErrors({});
    setFeedback(null);
  };

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!formData.currentPassword.trim()) {
      nextErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (!formData.newPassword.trim()) {
      nextErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 8) {
      nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
    } else if (
      !/[0-9]/.test(formData.newPassword) ||
      !/[A-Za-z]/.test(formData.newPassword) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
    ) {
      nextErrors.newPassword =
        "Mật khẩu mới phải chứa chữ, số và ký tự đặc biệt";
    }
    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Vui lòng nhập lại mật khẩu mới";
    } else if (formData.confirmPassword !== formData.newPassword) {
      nextErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    try {
      setIsSubmitting(true);
      const payload: ChangePasswordRequest = {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      };
      await changePassword(payload);
      handleCancel();
      await refreshProfile();
      setFeedback({
        type: "success",
        message: "Đổi mật khẩu thành công",
      });
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        currentPassword:
          error?.response?.data?.message || "Đổi mật khẩu thất bại",
      }));
      setFeedback({
        type: "error",
        message: error?.response?.data?.message || "Đổi mật khẩu thất bại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm min-h-[507px]">
      {/* Form Content */}
      <div className="px-4 sm:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-[20px] font-semibold text-gray-900 mb-1">
            Đổi mật khẩu
          </h2>
          <p className="text-gray-500 text-sm">
            Hãy đặt mật khẩu mạnh để bảo vệ tài khoản Wanderoo của bạn
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Left Column */}
          <div className="space-y-6 bg-gray-50/60 rounded-2xl p-5">
            {/* Current Password */}
            <Input
              label="Mật khẩu tài khoản đang đăng nhập"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              placeholder="Nhập mật khẩu hiện tại"
              required
              showPasswordToggle
              showPassword={showCurrentPassword}
              onTogglePassword={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
              className={`text-gray-900 hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] !h-[42px] ${
                errors.currentPassword ? "!border-red-500" : ""
              }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">{errors.currentPassword}</p>
            )}

            {/* New Password */}
            <div>
              <Input
                label="Mật khẩu mới"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="Nhập mật khẩu mới"
                required
                showPasswordToggle
                showPassword={showNewPassword}
                onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                className={`text-gray-900 hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] !h-[42px] ${
                  errors.newPassword ? "!border-red-500" : ""
                }`}
              />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}

              {/* Password Requirements */}
              <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-700 mb-3 font-medium">
                  Mật khẩu cần thoả các điều kiện:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li
                    className={`flex items-center gap-2 ${
                      passwordChecks.hasLength ? "text-green-600" : ""
                    }`}
                  >
                    <span className="text-lg">
                      {passwordChecks.hasLength ? "✔" : "•"}
                    </span>
                    Tối thiểu 8 ký tự
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      passwordChecks.hasLetter ? "text-green-600" : ""
                    }`}
                  >
                    <span className="text-lg">
                      {passwordChecks.hasLetter ? "✔" : "•"}
                    </span>
                    Có chữ cái (hoa hoặc thường)
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      passwordChecks.hasNumber ? "text-green-600" : ""
                    }`}
                  >
                    <span className="text-lg">
                      {passwordChecks.hasNumber ? "✔" : "•"}
                    </span>
                    Có ít nhất 1 chữ số
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      passwordChecks.hasSpecial ? "text-green-600" : ""
                    }`}
                  >
                    <span className="text-lg">
                      {passwordChecks.hasSpecial ? "✔" : "•"}
                    </span>
                    Có ký tự đặc biệt ( ! @ # ... )
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)]">
            {/* Phone Number */}
            <Input
              label="Số điện thoại"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled
              className="text-gray-500 bg-gray-50 !cursor-not-allowed !h-[42px]"
            />

            {/* Confirm New Password */}
            <Input
              label="Nhập lại mật khẩu mới"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Nhập lại mật khẩu mới"
              required
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
                className={`text-gray-900 hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] !h-[42px] ${
                  errors.confirmPassword ? "!border-red-500" : ""
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Divider above actions (inset, not full card width) */}
        <div className="px-6 mt-6">
          <div className="border-t border-gray-200" />
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 py-4 px-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleCancel}
            className="!bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-white hover:!text-[#E04D30] !h-[42px]"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-6 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24] !h-[42px]"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordTab;
