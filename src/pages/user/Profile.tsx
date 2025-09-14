import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile } from '../../types/user';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    email: user?.email || '',
    name: user?.name || '',
    avatar: user?.avatar || '',
    bio: 'Yêu thích du lịch và khám phá những điều mới mẻ',
    phone: '+84 123 456 789',
    address: 'Hà Nội, Việt Nam',
    preferences: {
      language: 'vi',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
  });

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="mt-2 text-gray-600">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Thông tin cơ bản
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {isEditing && (
                <div>
                  <button className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Thay đổi ảnh
                  </button>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                <p className="text-xs text-gray-500">Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.phone || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.address || 'Chưa cập nhật'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Giới thiệu bản thân
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Viết một chút về bản thân..."
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{profile.bio || 'Chưa có thông tin'}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white shadow rounded-lg mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Tùy chỉnh cá nhân
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Thông báo qua Email</h3>
                <p className="text-sm text-gray-500">Nhận thông báo về đặt chỗ và ưu đãi</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profile.preferences.notifications.email}
                  onChange={(e) => handleChange('preferences', {
                    ...profile.preferences,
                    notifications: {
                      ...profile.preferences.notifications,
                      email: e.target.checked
                    }
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Thông báo Push</h3>
                <p className="text-sm text-gray-500">Nhận thông báo trực tiếp trên thiết bị</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profile.preferences.notifications.push}
                  onChange={(e) => handleChange('preferences', {
                    ...profile.preferences,
                    notifications: {
                      ...profile.preferences.notifications,
                      push: e.target.checked
                    }
                  })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;