import React from "react";

const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen sm:py-12">
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18345c]">
            CHÍNH SÁCH VẬN CHUYỂN WANDEROO
          </h1>
        </div>

        {/* Introductory Paragraph */}
        <div className="rounded-lg sm:p-8 mb-2">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Wanderoo cam kết giao hàng nhanh chóng, an toàn và đúng hẹn cho mọi
            đơn hàng trên toàn quốc. Vui lòng tham khảo chi tiết chính sách dưới
            đây:
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-2">
          {/* Section 1 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              1. Phạm vi giao hàng
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              A. Giao hàng nội thành Hà Nội
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc mb-4">
              <li>
                Nhân viên Wanderoo sẽ giao hàng tận nơi theo địa chỉ quý khách
                cung cấp.
              </li>
              <li>
                Thời gian giao hàng được thỏa thuận trước với khách hàng để đảm
                bảo thuận tiện.
              </li>
            </ul>
            <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              B. Giao hàng toàn quốc
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Hàng hóa được gửi qua các đơn vị vận chuyển uy tín (Giao Hàng
                Nhanh, Viettel Post, J&T,...)
              </li>
              <li>
                Thời gian nhận hàng:
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc mt-2">
                  <li>Nội thành Hà Nội: Giao trong ngày hoặc trong 24h.</li>
                  <li>Các tỉnh thành khác: 1 – 4 ngày làm việc tùy khu vực.</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              2. Phí vận chuyển
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
              Phí vận chuyển được tính dựa trên biểu phí của đơn vị vận chuyển
              và trọng lượng thực tế hoặc quy đổi của đơn hàng:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc mb-4">
              <li>Nội thành Hà Nội: Từ 15.000₫</li>
              <li>Ngoại thành Hà Nội: Từ 25.000₫</li>
              <li>Các tỉnh thành khác: Từ 30.000₫</li>
            </ul>
            <p className="text-xs sm:text-sm font-bold text-[#18345c] mb-2">
              Lưu ý:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Phí có thể thay đổi tùy trọng lượng, kích thước hàng hóa, địa
                điểm giao hàng.
              </li>
              <li>
                Wanderoo sẽ thông báo chi phí vận chuyển cụ thể trước khi xác
                nhận đơn hàng.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              3. Quy định giao nhận hàng
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Quý khách vui lòng kiểm tra tình trạng sản phẩm trước khi thanh
                toán.
              </li>
              <li>
                Trường hợp hàng bị móp méo, ẩm ướt hoặc không còn nguyên vẹn,
                vui lòng từ chối nhận hàng và liên hệ ngay với Hotline Wanderoo
                để được hỗ trợ.
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

export default ShippingPolicy;
