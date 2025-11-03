import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen sm:py-12">
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18345c]">
            CHÍNH SÁCH BẢO MẬT THÔNG TIN – WANDEROO
          </h1>
        </div>

        {/* Introductory Paragraph */}
        <div className="rounded-lg sm:p-8 mb-2">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Wanderoo cam kết bảo vệ thông tin cá nhân của khách hàng khi truy cập và
            mua sắm tại website. Chính sách này nhằm đảm bảo quyền lợi và sự tin tưởng
            của khách hàng đối với dịch vụ của Wanderoo.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-2">
          {/* Section 1 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              1. Mục Đích Và Phạm Vi Thu Thập Thông Tin
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
              Chúng tôi thu thập thông tin cá nhân để:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc mb-4">
              <li>Hỗ trợ khách hàng trong mua sắm</li>
              <li>Giải đáp thắc mắc, tư vấn sản phẩm</li>
              <li>
                Cung cấp thông tin mới nhất về sản phẩm, khuyến mãi
              </li>
              <li>Nâng cấp dịch vụ và tối ưu trải nghiệm</li>
              <li>Thực hiện quảng bá sản phẩm Wanderoo</li>
            </ul>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
              Thông tin có thể thu thập:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc mb-2">
              <li>
                Họ và tên, số điện thoại liên hệ, địa chỉ nhận hàng, email (nếu có)
              </li>
            </ul>
            <p className="text-xs sm:text-sm font-bold text-[#18345c]">
              Lưu ý: Thông tin phải chính xác và hợp pháp
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              2. Phạm Vi Sử Dụng Thông Tin
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Xác nhận đơn hàng, giao hàng, chăm sóc sau bán hàng.
              </li>
              <li>
                Gửi thông tin sản phẩm, chương trình khuyến mãi.
              </li>
              <li>
                Liên hệ trực tiếp qua email, điện thoại khi cần thiết.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              3. Thời Gian Lưu Trữ Thông Tin
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Thông tin được lưu trữ trong suốt quá trình mua sắm hoặc cho đến khi
              khách hàng yêu cầu xóa.
            </p>
          </div>

          {/* Section 4 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              4. Quyền Của Khách Hàng
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Truy cập và chỉnh sửa thông tin cá nhân bất kỳ lúc nào.
              </li>
              <li>
                Yêu cầu xóa thông tin khỏi hệ thống.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              5. Cam Kết Bảo Mật Thông Tin
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Bảo mật tuyệt đối thông tin cá nhân.
              </li>
              <li>
                Không tiết lộ cho bên thứ ba nếu không có sự đồng ý hoặc yêu cầu pháp
                luật.
              </li>
              <li>
                Sử dụng biện pháp bảo mật hiện đại để ngăn chặn truy cập trái phép.
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-lg sm:p-8 mt-2">
          <div className="pt-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">
              Thông tin liên hệ:
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <span>
                  <strong>Hotline/Zalo:</strong> 0123 456 789
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">✉️</span>
                <span>
                  <strong>Email:</strong> support@wanderoo.com
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🏠</span>
                <span>
                  <strong>Địa chỉ:</strong> 123 Nguyễn Trãi, Thanh Xuân, Hà Nội
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
