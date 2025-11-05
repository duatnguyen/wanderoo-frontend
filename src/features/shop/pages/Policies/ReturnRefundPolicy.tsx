import React from "react";

const ReturnRefundPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen sm:py-12">
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18345c]">
            CHÍNH SÁCH ĐỔI TRẢ HÀNG – WANDEROO
          </h1>
        </div>

        {/* Introductory Paragraph */}
        <div className="rounded-lg sm:p-8 mb-2">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Chính sách đổi trả của Wanderoo được thiết kế để đảm bảo quyền lợi
            và sự hài lòng của khách hàng khi mua sắm tại cửa hàng chúng tôi.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-2">
          {/* Section 1 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              1. Điều kiện đổi trả
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Sản phẩm chưa qua sử dụng, còn nguyên tem, mác, bao bì và hóa
                đơn mua hàng.
              </li>
              <li>
                Hàng giao không đúng về chủng loại, kích thước, màu sắc so với
                đơn đặt hàng.
              </li>
              <li>
                Sản phẩm bị lỗi kỹ thuật do nhà sản xuất hoặc hư hỏng trong quá
                trình vận chuyển.
              </li>
              <li>
                Thiếu phụ kiện hoặc số lượng sản phẩm so với đơn hàng ban đầu.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              2. Trường Hợp Không Được Đổi Trả
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Sản phẩm đã qua sử dụng hoặc không còn nguyên trạng như ban đầu.
              </li>
              <li>Hết thời gian đổi trả theo quy định.</li>
              <li>
                Sản phẩm bị hư hỏng do khách hàng sử dụng sai cách hoặc không
                bảo quản đúng hướng dẫn.
              </li>
              <li>Hàng bị mất, thất lạc trong quá trình gửi trả về shop.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              3. Thời Gian Đổi Trả
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Mua tại cửa hàng: Đổi trả trong vòng 03 ngày kể từ ngày mua hàng
                (theo hóa đơn).
              </li>
              <li>
                Đơn hàng online (COD): Đổi trả trong vòng 03 ngày kể từ khi đơn
                hàng được xác nhận giao thành công.
              </li>
              <li>
                Hàng mua làm quà tặng: Thời gian đổi trả tối đa 05 ngày kể từ
                ngày nhận hàng.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              4. Quy Trình Đổi Trả Hàng
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Bước 1: Liên hệ ngay với Hotline/Zalo: 0123 456 789 để thông báo
                yêu cầu đổi trả.
              </li>
              <li>
                Bước 2: Đóng gói sản phẩm đầy đủ (bao gồm phụ kiện và quà tặng
                nếu có) trong bao bì hoặc hộp hàng ban đầu.
              </li>
              <li>
                Bước 3: Gửi sản phẩm về địa chỉ do nhân viên tư vấn cung cấp.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              5. Cam Kết Của Wanderoo
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Tất cả sản phẩm tại Wanderoo là hàng chính hãng 100%, đảm bảo
                chất lượng và đúng mô tả.
              </li>
              <li>
                Quý khách vui lòng kiểm tra kỹ sản phẩm trước khi ký nhận. Shop
                không chịu trách nhiệm đối với các lỗi phát sinh sau khi khách
                hàng đã ký nhận.
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

export default ReturnRefundPolicy;
