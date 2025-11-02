import React from "react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <path d="M14 9h3V6h-3a3 3 0 00-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9a1 1 0 011-1z" fill="currentColor"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <path d="M4 6h16v12H4z" /><path d="M22 6l-10 7L2 6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.3 1.78.54 2.64a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.44-1.11a2 2 0 0 1 2.11-.45c.86.24 1.74.42 2.64.54A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#18345c] text-white mt-10" aria-label="Site footer">
      <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-[16px] font-semibold mb-4">Về Chúng Tôi</h3>
          <ul className="space-y-2 text-[14px] font-medium text-white/90">
            <li>SDT: 0963069400</li>
            <li>Mail: wanderoo@gmail.com</li>
            <li>
              Địa chỉ: Số 6 ngõ 15 Vương Thừa Vũ,
              <br />Thanh Xuân, Hà Nội
            </li>
            <li>Thời gian mở: 9h - 20h</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[16px] font-semibold mb-4">Chính Sách Hỗ Trợ</h3>
          <ul className="space-y-2 text-[14px] font-medium text-white/90">
            <li>Chính sách bảo hành</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách giao hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[16px] font-semibold mb-4">Tại Sao Nên Chọn Chúng Tôi</h3>
          <ul className="space-y-2 text-[14px] font-medium text-white/90">
            <li>Hệ thống phân phối phụ kiện du lịch</li>
            <li>Chính hãng trên toàn quốc</li>
            <li>Dịch vụ chăm sóc khách hàng 24/7</li>
            <li>Không ngừng nâng cao chất lượng</li>
            <li>Sản phẩm và dịch vụ</li>
          </ul>
        </div>
        <div>
          <h3 className="text-[16px] font-semibold mb-4">Kết Nối Với Chúng Tôi</h3>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="p-2 rounded-md hover:bg-white/10"><FacebookIcon /></a>
            <a href="#" aria-label="Email" className="p-2 rounded-md hover:bg-white/10"><MailIcon /></a>
            <a href="#" aria-label="Phone" className="p-2 rounded-md hover:bg-white/10"><PhoneIcon /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/25" />
      <div className="max-w-[1200px] mx-auto px-4 py-4 text-center text-[14px] font-medium text-white/90">
        WANDEROO chuyên cung cấp đồ cắm trại outdoor camping thể thao ngoài trời chính hãng tại Hà Nội
      </div>
    </footer>
  );
};

export default Footer;
