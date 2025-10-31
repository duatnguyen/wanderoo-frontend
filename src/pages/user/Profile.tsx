import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin tài khoản
          </h2>
          <p className="text-gray-600">
            Đây là trang hồ sơ cá nhân của bạn. Bạn có thể chỉnh sửa thông tin
            và cài đặt tại đây.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
