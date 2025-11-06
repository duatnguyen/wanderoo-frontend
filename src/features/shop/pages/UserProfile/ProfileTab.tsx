import React, { useState } from "react";
import Button from "../../../../components/shop/Button";
import { EditPencilIcon } from "../../../../components/shop/ProfileIcons";

const ProfileTab: React.FC = () => {
  const [userData, setUserData] = useState({
    fullName: "Thanh",
    email: "th***********@gmail.com",
    phone: "08********",
    gender: "male",
    dateOfBirth: "**/**/2003",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving user data:", userData);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Hồ sơ của tôi
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      {/* User Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
        <img
          src={userData.avatar}
          alt="Avatar"
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
            {userData.fullName}
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors text-sm"
          >
            <EditPencilIcon />
            <span className="font-medium">Sửa hồ sơ</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                value={userData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none text-sm sm:text-base"
              />
            ) : (
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base">
                {userData.fullName}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base break-all">
                {userData.email}
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap">
                Thay đổi
              </button>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base">
                {userData.phone}
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap">
                Thay đổi
              </button>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            <div className="flex items-center gap-4 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={userData.gender === "male"}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm sm:text-base text-gray-700">Nam</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={userData.gender === "female"}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm sm:text-base text-gray-700">NỮ</span>
              </label>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base">
                {userData.dateOfBirth}
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap">
                Thay đổi
              </button>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="pt-2 sm:pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                className="w-full sm:w-auto px-6 sm:px-8"
              >
                Lưu
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Profile Picture Upload */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => console.log("Choose photo")}
              className="w-full sm:w-auto"
            >
              Chọn ảnh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
