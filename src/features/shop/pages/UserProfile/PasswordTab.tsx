import React, { useState } from "react";
import Button from "../../components/Button";

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

  const EyeIcon = ({ show }: { show: boolean }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-gray-400"
    >
      {show ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
          <path d="M7.5 7.56C5.37 8.72 3.86 10.42 3 12c1.73 3.18 5.28 6 9 6 1.38 0 2.69-.28 3.9-.8" />
          <path d="M14.12 9.88A3 3 0 0 0 9.88 14.12" />
        </>
      ) : (
        <>
          <path d="M1.5 12C3.23 8.82 6.78 6 10.5 6c3.72 0 7.27 2.82 9 6-1.73 3.18-5.28 6-9 6-3.72 0-7.27-2.82-9-6Z" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </>
      )}
    </svg>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Form Content */}
      <div className="px-4 sm:px-6 py-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Mật khẩu tài khoản đang đăng nhập
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    showCurrentPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                  }
                >
                  <EyeIcon show={showCurrentPassword} />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Mật khẩu mới
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    showNewPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                  }
                >
                  <EyeIcon show={showNewPassword} />
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-3">
                  <span className="text-red-500 font-semibold">Lưu ý:</span>{" "}
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
                    <span>
                      Không được trùng với 4 mật khẩu gần nhất.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Số điện thoại
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base text-gray-900 bg-white"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Nhập lại mật khẩu mới
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                  }
                >
                  <EyeIcon show={showConfirmPassword} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            size="md"
            onClick={handleCancel}
            className="border-[#ea5b0c] text-[#ea5b0c] hover:bg-[#ea5b0c] hover:text-white"
          >
            Hủy
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} className="px-6">
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordTab;
