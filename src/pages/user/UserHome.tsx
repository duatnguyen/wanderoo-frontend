import React from 'react';
import { useAuth } from '../../context/AuthContext';

const UserHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Xin chào, {user?.name}!
        </h1>
        <p className="text-blue-100 text-lg">
          Chào mừng bạn đến với Wanderoo - nền tảng du lịch hàng đầu
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">5</h3>
              <p className="text-sm text-gray-600">Chuyến đi đã đặt</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">12</h3>
              <p className="text-sm text-gray-600">Địa điểm yêu thích</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">2</h3>
              <p className="text-sm text-gray-600">Chuyến đi sắp tới</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Hoạt động gần đây
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Đã đặt chuyến đi đến Đà Lạt</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Đánh giá khách sạn Paradise Resort</p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Thêm Phú Quốc vào danh sách yêu thích</p>
                <p className="text-xs text-gray-500">3 ngày trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Gợi ý cho bạn
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <img 
                src="https://via.placeholder.com/300x200" 
                alt="Hạ Long Bay" 
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-gray-900 mb-1">Vịnh Hạ Long</h3>
              <p className="text-sm text-gray-600 mb-2">Khám phá kỳ quan thiên nhiên thế giới</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">Từ 2,500,000 VND</span>
                <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded">
                  Xem chi tiết
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <img 
                src="https://via.placeholder.com/300x200" 
                alt="Sapa" 
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-gray-900 mb-1">Sapa</h3>
              <p className="text-sm text-gray-600 mb-2">Ruộng bậc thang và núi non hùng vĩ</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">Từ 1,800,000 VND</span>
                <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded">
                  Xem chi tiết
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <img 
                src="https://via.placeholder.com/300x200" 
                alt="Hội An" 
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-gray-900 mb-1">Hội An</h3>
              <p className="text-sm text-gray-600 mb-2">Phố cổ đẹp nhất Việt Nam</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">Từ 2,200,000 VND</span>
                <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;