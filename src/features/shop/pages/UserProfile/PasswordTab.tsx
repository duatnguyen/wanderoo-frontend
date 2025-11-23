import React, { useState } from "react";
import Button from "../../../../components/shop/Button";
import { Input } from "../../../../components/shop/Input";

const PasswordTab: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    phone: "0868211760",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      phone: "0868211760",
    });
  };

  const handleSave = () => {
    // In a real app, this would validate and save the password
    console.log("Saving password change", formData);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 min-h-[507px]">
      {/* Form Content */}
      <div className="px-4 sm:px-6 py-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
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
              className="text-gray-900 hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] !h-[42px]"
            />

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
                className="text-gray-900 hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] !h-[42px]"
              />

              {/* Password Requirements */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-3">
                  <span className="text-[#E04D30] font-semibold">Lưu ý:</span>{" "}
                  <span className="text-gray-700">
                    Mật khẩu cần thoả mãn các điều kiện sau
                  </span>
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>Có độ dài ít nhất 8 ký tự.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>
                      Chứa ít nhất 01 ký tự số, 01 ký tự chữ và 01 ký tự đặc
                      biệt.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>Không được trùng với 4 mật khẩu gần nhất.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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
              className="text-gray-900 hover:!border-[#E04D30] focus:!border-[#E04D30] focus:!ring-[#E04D30] !h-[42px]"
            />
          </div>
        </div>

        {/* Divider above actions (inset, not full card width) */}
        <div className="px-6 mt-6">
          <div className="border-t border-gray-200" />
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 py-4 px-6">
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
            className="px-6 !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24] !h-[42px]"
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordTab;
