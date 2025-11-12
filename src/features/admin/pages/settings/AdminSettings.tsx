// src/pages/admin/AdminSettings.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShopLogo from "@/assets/icons/ShopLogo.png";

const AdminSettings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Shop settings states
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [shopName, setShopName] = useState("Wanderoo");

  // Redirect to profile if on base settings route
  useEffect(() => {
    if (path === "/admin/settings") {
      navigate("/admin/settings/profile", { replace: true });
    }
  }, [path, navigate]);

  // Determine which page to show based on the path
  const getPageContent = () => {
    if (path.includes("/profile")) {
      return (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-0.5">
              Hồ sơ của tôi
            </h2>
            <p className="text-gray-500 text-sm">
              Quản lý thông tin hồ sơ để bảo mật
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left section - User information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tên đăng nhập */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Tên đăng nhập
                  </label>
                  <span className="text-gray-900 flex-1">Admin</span>
                </div>

                {/* Tên */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Tên
                  </label>
                  <input
                    type="text"
                    defaultValue="Admin ThanhNguyen"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Email
                  </label>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-gray-900">Quan*********@gmail.com</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Thay đổi
                    </button>
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Số điện thoại
                  </label>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-gray-900">09********</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Thay đổi
                    </button>
                  </div>
                </div>

                {/* Giới tính */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Giới tính
                  </label>
                  <div className="flex-1 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        defaultChecked
                        className="w-4 h-4 text-[#E04D30] focus:ring-[#E04D30] accent-[#E04D30]"
                      />
                      <span className="text-gray-900">Nữ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        className="w-4 h-4 text-[#E04D30] focus:ring-[#E04D30] accent-[#E04D30]"
                      />
                      <span className="text-gray-900">Nam</span>
                    </label>
                  </div>
                </div>

                {/* Ngày sinh */}
                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium min-w-[200px] text-right mr-8">
                    Ngày sinh
                  </label>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-gray-900">24/3/2003</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Thay đổi
                    </button>
                  </div>
                </div>
              </div>

              {/* Right section - Profile picture */}
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="w-full max-w-[200px] aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-red-500 flex items-center justify-center mb-4">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <button className="bg-[#E04D30] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[#d0442a] transition-colors">
                  Chọn ảnh
                </button>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button className="bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Hủy
              </button>
              <button className="bg-[#E04D30] text-white py-2.5 px-6 rounded-lg font-medium hover:bg-[#d0442a] transition-colors">
                Lưu
              </button>
            </div>
          </div>
        </div>
      );
    } else if (path.includes("/address")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Địa chỉ</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Trang quản lý địa chỉ</p>
          </div>
        </div>
      );
    } else if (path.includes("/password")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Đổi mật khẩu
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                {/* Mật khẩu tài khoản đang đăng nhập */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mật khẩu tài khoản đang đăng nhập<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nhập mật khẩu mới */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nhập mật khẩu mới<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lưu ý */}
                <div>
                  <p className="text-sm mb-2">
                    <span className="font-bold text-red-500">Lưu ý:</span>{" "}
                    <span className="text-gray-700">
                      Mật khẩu cần thoả mãn các điều kiện sau
                    </span>
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Có độ dài ít nhất 8 ký tự.</li>
                    <li>
                      Chứa ít nhất 01 ký tự số, 01 ký tự chữ và 01 ký tự đặc
                      biệt.
                    </li>
                    <li>Không được trùng với 4 mật khẩu gần nhất.</li>
                  </ul>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Số điện thoại */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value="0982841234"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Nhập lại mật khẩu */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nhập lại mật khẩu<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button className="bg-white text-[#E04D30] border border-[#E04D30] py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button className="bg-[#E04D30] text-white py-2.5 px-6 rounded-lg font-medium hover:bg-[#d0442a] transition-colors">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      );
    } else if (path.includes("/shop")) {
      if (isEditingShop) {
        return (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-0.5">
                Thông tin cơ bản
              </h2>
              <p className="text-gray-500 text-sm">
                Quản lý thông tin shop
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="space-y-6 ml-8">
                {/* Tên Shop */}
                <div className="flex items-start">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right pt-2">
                    Tên Shop
                  </label>
                  <div className="ml-8 flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        maxLength={30}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#E04D30] focus:border-[#E04D30] pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        {shopName.length}/30
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logo của Shop */}
                <div className="flex items-start">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right pt-2">
                    Logo của Shop
                  </label>
                  <div className="ml-8 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-24 h-24 bg-[#18345C] rounded-full flex items-center justify-center p-2">
                          <img
                            src={ShopLogo}
                            alt="Shop Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                          Sửa
                        </button>
                      </div>
                      <div className="flex-1">
                        <ul className="text-sm text-gray-600 space-y-1 list-disc ml-4">
                          <li>Dung lượng file tối đa: 2.0MB</li>
                          <li>
                            Định dạng file được hỗ trợ: JPG, JPEG, PNG
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsEditingShop(false)}
                  className="bg-white text-gray-700 border border-gray-300 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setIsEditingShop(false)}
                  className="bg-[#E04D30] text-white py-2.5 px-6 rounded-lg font-medium hover:bg-[#d0442a] transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-0.5">
              Thông tin cơ bản
          </h2>
            <p className="text-gray-500 text-sm">
              Quản lý thông tin shop
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col lg:flex-row gap-8 ml-8 items-start">
              {/* Left section - Shop information */}
              <div className="flex-1 space-y-6">
                {/* Tên shop */}
                <div className="flex items-center">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right">
                    Tên shop
                  </label>
                  <span className="text-gray-900 ml-8">{shopName}</span>
                </div>

                {/* Logo shop */}
                <div className="flex items-center">
                  <label className="text-gray-700 font-medium min-w-[140px] text-right">
                    Logo của shop
                  </label>
                  <div className="ml-8">
                    <div className="w-24 h-24 bg-[#18345C] rounded-full flex items-center justify-center p-2">
                      <img
                        src={ShopLogo}
                        alt="Shop Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right section - Action buttons */}
              <div className="flex flex-row gap-4">
                <button className="bg-white text-gray-700 border border-gray-300 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Xem shop của tôi
                </button>
                <button
                  onClick={() => setIsEditingShop(true)}
                  className="bg-white text-gray-700 border border-gray-300 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default to profile page if no match (shouldn't happen due to redirect)
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">Trang hồ sơ người dùng</p>
        </div>
      </div>
    );
  };

  return <div className="space-y-6">{getPageContent()}</div>;
};

export default AdminSettings;
