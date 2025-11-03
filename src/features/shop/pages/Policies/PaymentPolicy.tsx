import React from "react";

const PaymentPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18345c] mb-4">
            CHÍNH SÁCH THANH TOÁN – WANDEROO
          </h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Wanderoo cung cấp nhiều phương thức thanh toán linh hoạt và an toàn để
            khách hàng có thể mua sắm một cách thuận tiện nhất.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              1. Phương thức thanh toán
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>Thanh toán khi nhận hàng (COD).</li>
              <li>Chuyển khoản ngân hàng.</li>
              <li>Ví điện tử.</li>
              <li>Thẻ tín dụng/Ghi nợ.</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              2. Bảo mật thanh toán
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Tất cả thông tin thanh toán của khách hàng đều được mã hóa và bảo mật
              theo tiêu chuẩn quốc tế.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPolicy;

