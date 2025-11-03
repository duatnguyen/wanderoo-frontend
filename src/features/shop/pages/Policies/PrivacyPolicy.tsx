import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18345c] mb-4">
            CHÍNH SÁCH BẢO MẬT – WANDEROO
          </h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Wanderoo cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng
            theo các tiêu chuẩn bảo mật cao nhất.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              1. Thu thập thông tin
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
              Chúng tôi chỉ thu thập thông tin cần thiết để phục vụ bạn:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>Thông tin cá nhân (tên, số điện thoại, email).</li>
              <li>Địa chỉ giao hàng.</li>
              <li>Thông tin thanh toán (được mã hóa an toàn).</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              2. Sử dụng thông tin
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Thông tin của bạn chỉ được sử dụng để xử lý đơn hàng, giao hàng và cải
              thiện dịch vụ. Chúng tôi không chia sẻ thông tin với bên thứ ba mà không
              có sự đồng ý của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

