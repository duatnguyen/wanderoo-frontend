import React from "react";

const PaymentPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen sm:py-12">
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18345c]">
            CHÍNH SÁCH THANH TOÁN WANDEROO
          </h1>
        </div>

        {/* Introductory Paragraph */}
        <div className="rounded-lg sm:p-8 mb-2">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Wanderoo cam kết cung cấp các phương thức thanh toán an toàn, linh hoạt và
            thuận tiện nhất cho khách hàng. Vui lòng đọc kỹ chính sách dưới đây trước
            khi đặt hàng để đảm bảo trải nghiệm tốt nhất.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-2">
          {/* Section 1 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              1. Thanh toán trực tiếp tại cửa hàng
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Sản phẩm chưa qua sử dụng, còn nguyên tem, mác, bao bì và hóa đơn mua
                hàng.
              </li>
              <li>
                Hàng giao không đúng về chủng loại, kích thước, màu sắc so với đơn
                đặt hàng.
              </li>
              <li>
                Sản phẩm bị lỗi kỹ thuật do nhà sản xuất hoặc hư hỏng trong quá trình
                vận chuyển.
              </li>
              <li>
                Thiếu phụ kiện hoặc số lượng sản phẩm so với đơn hàng ban đầu.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              2. Thanh toán khi nhận hàng (COD)
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Áp dụng cho khu vực nội thành Hà Nội.
              </li>
              <li>
                Quý khách chỉ thanh toán sau khi kiểm tra đầy đủ sản phẩm và đảm bảo
                sản phẩm đúng như cam kết.
              </li>
              <li>
                Với các đơn hàng giao ngoài Hà Nội, Wanderoo yêu cầu thanh toán 100%
                giá trị đơn hàng + phí vận chuyển trước khi giao hàng.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              3. Thanh toán chuyển khoản ngân hàng
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
              Quý khách có thể chuyển khoản vào tài khoản sau:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                <strong>Ngân hàng:</strong> NGÂN HÀNG SÀI GÒN THƯƠNG TÍN (SACOMBANK)
              </li>
              <li>
                <strong>Số tài khoản:</strong> 0200 7118 4855
              </li>
              <li>
                <strong>Chủ tài khoản:</strong> CÔNG TY TNHH WANDEROO
              </li>
              <li>
                <strong>Nội dung chuyển khoản:</strong> Tên khách + SĐT (Ví dụ: Nam
                0912345678)
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              4. Lưu ý quan trọng
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Quý khách không chia sẻ mã OTP cho bất kỳ ai.
              </li>
              <li>
                Kiểm tra hàng hóa kỹ trước khi thanh toán COD.
              </li>
              <li>
                Với các đơn hàng ngoại thành hoặc tỉnh, bắt buộc chuyển khoản trước khi
                giao hàng.
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

export default PaymentPolicy;
