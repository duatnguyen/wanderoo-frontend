import React from "react";

const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18345c] mb-4">
            CHÍNH SÁCH VẬN CHUYỂN – WANDEROO
          </h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Wanderoo cam kết vận chuyển sản phẩm một cách an toàn và nhanh chóng đến
            tay khách hàng trên toàn quốc.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              1. Phạm vi giao hàng
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Chúng tôi giao hàng trên toàn quốc với nhiều phương thức vận chuyển linh
              hoạt.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              2. Thời gian giao hàng
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700 ml-4 sm:ml-6 list-disc">
              <li>Hà Nội: 1-2 ngày làm việc.</li>
              <li>Các tỉnh thành khác: 3-5 ngày làm việc.</li>
              <li>Vùng sâu, vùng xa: 5-7 ngày làm việc.</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#18345c] mb-4">
              3. Phí vận chuyển
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Phí vận chuyển được tính dựa trên trọng lượng và khoảng cách. Miễn phí
              ship cho đơn hàng trên một giá trị nhất định.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

