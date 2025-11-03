import React from "react";

const ReturnRefundPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18345c] mb-4">
            CHÍNH SÁCH ĐỔI TRẢ – WANDEROO
          </h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Chính sách đổi trả của Wanderoo được thiết kế để đảm bảo quyền lợi và sự
            hài lòng của khách hàng khi mua sắm tại cửa hàng chúng tôi.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              1. Điều kiện đổi trả
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
              Khách hàng có thể yêu cầu đổi trả trong các trường hợp sau:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>Sản phẩm bị lỗi từ nhà sản xuất.</li>
              <li>Sản phẩm không đúng với mô tả trên website.</li>
              <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển.</li>
              <li>Yêu cầu đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              2. Quy trình đổi trả
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Liên hệ với Wanderoo qua hotline hoặc zalo trong vòng 24 giờ sau khi
                nhận hàng.
              </li>
              <li>
                Cung cấp hình ảnh hoặc video sản phẩm để chúng tôi xác nhận tình trạng.
              </li>
              <li>
                Sau khi được xác nhận, chúng tôi sẽ hướng dẫn bạn các bước tiếp theo.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundPolicy;

