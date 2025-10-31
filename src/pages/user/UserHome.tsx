import React from "react";

const UserHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Trang chủ người dùng
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Chào mừng bạn đến với Wanderoo!
          </h2>
          <p className="text-gray-600">
            Đây là trang chủ dành cho người dùng. Bạn có thể khám phá các tính
            năng và dịch vụ của chúng tôi tại đây.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
