import React from "react";
import Button from "../../../features/shop/components/Button";

const PrivacyTab: React.FC = () => {
  const handleDeleteAccount = () => {
    // In a real app, this would trigger account deletion process
    // You might want to show a confirmation modal here
    console.log("Request account deletion");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Thiết lập quyền riêng tư
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Privacy Settings</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-gray-50 rounded-lg px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Yêu cầu xoá tài khoản
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleDeleteAccount}
              className="whitespace-nowrap bg-[#ea5b0c] hover:bg-[#d5510b] text-white font-bold"
            >
              Xoá bỏ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTab;
