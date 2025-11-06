import React from "react";

const WarrantyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen sm:py-12">
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#18345c]">
            CHÍNH SÁCH BẢO HÀNH – WANDEROO
          </h1>
        </div>

        {/* Introductory Paragraph */}
        <div className="rounded-lg sm:p-8 mb-2">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Wanderoo cam kết cung cấp sản phẩm chất lượng, chính hãng và đúng
            như mô tả. Chính sách bảo hành được áp dụng để bảo vệ quyền lợi
            khách hàng khi mua các sản phẩm đồ leo núi tại cửa hàng chúng tôi.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-2">
          {/* Section 1 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              1. Định nghĩa bảo hành
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Bảo hành sản phẩm là việc Wanderoo khắc phục các lỗi, sự cố do lỗi
              của nhà sản xuất trong thời hạn quy định, nhằm đảm bảo khách hàng
              nhận được sản phẩm tốt nhất.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              2. Quy định về bảo hành
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
              Wanderoo chấp nhận bảo hành trong các trường hợp sau:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Sản phẩm không đạt chất lượng hoặc hiệu quả như cam kết của nhà
                sản xuất.
              </li>
              <li>Sản phẩm không chính hãng.</li>
              <li>
                Sản phẩm bị bể/vỡ hoặc hư hỏng trong quá trình vận chuyển và
                khách hàng thông báo ngay khi nhận hàng.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              3. Những trường hợp không được bảo hành
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Sản phẩm đã hết thời hạn bảo hành hoặc mất phiếu bảo hành (nếu
                có).
              </li>
              <li>
                Sản phẩm bị rách, bẩn, hư hỏng do khách hàng sử dụng sai cách,
                va đập mạnh hoặc do các nguyên nhân không thuộc lỗi nhà sản
                xuất.
              </li>
              <li>
                Sản phẩm đã qua chỉnh sửa, thay đổi cấu trúc gốc mà không được
                sự đồng ý của Wanderoo.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              4. Thời hạn bảo hành
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Tùy theo từng loại sản phẩm, thời gian bảo hành sẽ được ghi rõ
                trong phiếu bảo hành hoặc thông tin sản phẩm trên website.
              </li>
              <li>
                Thông thường, thời gian bảo hành là 7 – 30 ngày kể từ ngày nhận
                hàng.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="rounded-lg sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#18345c] mb-2">
              5. Quy trình bảo hành
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>
                Liên hệ với Wanderoo qua hotline hoặc zalo trong vòng 24 giờ kể
                từ khi phát hiện lỗi.
              </li>
              <li>
                Cung cấp hình ảnh hoặc video sản phẩm bị lỗi để Wanderoo kiểm
                tra.
              </li>
              <li>
                Sau khi xác nhận, Wanderoo sẽ hướng dẫn đổi/trả hoặc sửa chữa
                sản phẩm theo chính sách.
              </li>
            </ul>
          </div>
        </div>

        {/* Important Note */}
        <div className="rounded-lg sm:p-8 mt-2">
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-bold text-red-600">
              Lưu ý quan trọng:
            </p>
            <p className="text-xs sm:text-sm text-red-600 leading-relaxed">
              Wanderoo không chịu trách nhiệm bảo hành cho hàng hóa không mua từ
              hệ thống chính thức của chúng tôi.
            </p>
            <p className="text-xs sm:text-sm text-red-600 leading-relaxed">
              Vui lòng giữ lại hóa đơn và phiếu bảo hành (nếu có) để được hỗ trợ
              tốt nhất.
            </p>
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

export default WarrantyPolicy;
