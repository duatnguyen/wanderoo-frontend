// src/pages/admin/AdminDiscounts.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Store, Receipt, Ticket, Coins, Gift } from 'lucide-react';

// Mock data cho vouchers
const mockVouchers = [
  {
    id: 'KJAJHSS',
    name: 'KHACH MOI',
    type: 'Voucher khách hàng mới',
    productCount: 'Tất cả sản phẩm',
    discountValue: '5.000đ',
    usageLimit: 50,
    used: 1,
    status: 'Đang diễn ra',
    displayChannel: 'Website',
    expiry: '12:00 17/3/2023 - 12:00 17/3/2024',
    actions: ['Chỉnh sửa', 'Đơn hàng', 'Kết thúc']
  },
  {
    id: 'KJAJHSS',
    name: 'KHACH MOI',
    type: 'Voucher khách hàng mới',
    productCount: 'Tất cả sản phẩm',
    discountValue: '5.000đ',
    usageLimit: 50,
    used: 1,
    status: 'Đang diễn ra',
    displayChannel: 'Website',
    expiry: '12:00 17/3/2023 - 12:00 17/3/2024',
    actions: ['Chỉnh sửa', 'Đơn hàng', 'Kết thúc']
  },
  {
    id: 'KJAJHSS',
    name: 'KHACH MOI',
    type: 'Voucher khách hàng mới',
    productCount: 'Tất cả sản phẩm',
    discountValue: '5.000đ',
    usageLimit: 50,
    used: 1,
    status: 'Đang diễn ra',
    displayChannel: 'Website',
    expiry: '12:00 17/3/2023 - 12:00 17/3/2024',
    actions: ['Chỉnh sửa', 'Đơn hàng', 'Kết thúc']
  }
];

const AdminDiscounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7f7f7] min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#272424] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Danh sách mã giảm giá
          </h1>
        </div>

        {/* Create Voucher Section */}
        <div className="bg-white border border-[#d1d1d1] rounded-3xl p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#272424] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Tạo voucher
            </h2>
            <p className="text-xs text-[#e04d30]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Tạo Mã giảm giá toàn shop hoặc Mã giảm giá sản phẩm ngay bây giờ để thu hút người mua.
            </p>
          </div>

          {/* Cải thiện tỉ lệ chuyển đổi */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#2a2a2a] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Cải thiện tỉ lệ chuyển đổi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voucher toàn shop */}
              <div className="bg-white border border-[#b0b0b0] rounded-3xl p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <Store className="w-6 h-6 text-[#2a2a2a] mt-1" />
                  <div>
                    <h4 className="text-base font-semibold text-[#2a2a2a] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher toàn shop
                    </h4>
                    <p className="text-xs text-[#322f30] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher áp dụng cho tất cả sản phẩm toàn shop của bạn
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-[#e04d30] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#d43d2a] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onClick={() => navigate('/admin/discounts/shop-wide-voucher')}
                  >
                    Tạo
                  </button>
                </div>
              </div>

              {/* Voucher sản phẩm */}
              <div className="bg-white border border-[#b0b0b0] rounded-3xl p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <Receipt className="w-6 h-6 text-[#2a2a2a] mt-1" />
                  <div>
                    <h4 className="text-base font-semibold text-[#2a2a2a] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher sản phẩm
                    </h4>
                    <p className="text-xs text-[#322f30] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher áp dụng cho những sản phẩm áp dụng tại shop
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-[#e04d30] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#d43d2a] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onClick={() => navigate('/admin/discounts/product-voucher')}
                  >
                    Tạo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tập trung vào nhóm khách hàng mục tiêu */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#2a2a2a] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Tập trung vào nhóm khách hàng mục tiêu
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voucher khách hàng mới */}
              <div className="bg-white border border-[#b0b0b0] rounded-3xl p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <Ticket className="w-6 h-6 text-[#2a2a2a] mt-1" />
                  <div>
                    <h4 className="text-base font-semibold text-[#2a2a2a] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher khách hàng mới
                    </h4>
                    <p className="text-xs text-[#322f30] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher nhằm áp dụng cho khách hàng mới và khách hàng tiềm năng
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-[#e04d30] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#d43d2a] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onClick={() => navigate('/admin/discounts/new-customer-voucher')}
                  >
                    Tạo
                  </button>
                </div>
              </div>

              {/* Voucher khách hàng mua lại */}
              <div className="bg-white border border-[#b0b0b0] rounded-3xl p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <Coins className="w-6 h-6 text-[#2a2a2a] mt-1" />
                  <div>
                    <h4 className="text-base font-semibold text-[#2a2a2a] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher khách hàng mua lại
                    </h4>
                    <p className="text-xs text-[#322f30] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Voucher nhằm áp dụng cho khách hàng đã mua hàng tại shop
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-[#e04d30] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#d43d2a] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    onClick={() => navigate('/admin/discounts/returning-customer-voucher')}
                  >
                    Tạo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tập trung vào kênh hiển thị riêng tư */}
          <div>
            <h3 className="text-xl font-bold text-[#2a2a2a] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Tập trung vào kênh hiển thị riêng tư
            </h3>
            <div className="bg-white border border-[#b0b0b0] rounded-3xl p-6 cursor-pointer hover:shadow-md transition-shadow max-w-md">
              <div className="flex items-start gap-3 mb-4">
                <Gift className="w-7 h-7 text-[#2a2a2a] mt-1" />
                <div>
                  <h4 className="text-base font-semibold text-[#2a2a2a] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Voucher riêng tư
                  </h4>
                  <p className="text-xs text-[#322f30] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Voucher nhằm áp dụng cho nhóm khách hàng shop muốn thông qua mã voucher
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-[#e04d30] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#d43d2a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  onClick={() => navigate('/admin/discounts/shop-wide-voucher')}
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="bg-white border border-[#d1d1d1] rounded-xl p-2 mb-6 flex items-center justify-start gap-0">
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'all'
                ? 'bg-[#ffcdc3] text-[#e04d30]'
                : 'text-[#737373] hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'ongoing'
                ? 'bg-[#ffcdc3] text-[#e04d30]'
                : 'text-[#737373] hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            onClick={() => setActiveTab('ongoing')}
          >
            Đang diễn ra
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-[#ffcdc3] text-[#e04d30]'
                : 'text-[#737373] hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            onClick={() => setActiveTab('upcoming')}
          >
            Sắp diễn ra
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'ended'
                ? 'bg-[#ffcdc3] text-[#e04d30]'
                : 'text-[#737373] hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            onClick={() => setActiveTab('ended')}
          >
            Đã kết thúc
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="bg-white border border-[#e04d30] rounded-xl p-4 max-w-md">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-[#888888]" />
              <input
                type="text"
                placeholder="Tìm kiếm mã giảm giá"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-xs text-[#888888] placeholder-[#888888] border-none outline-none"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>
          </div>
        </div>

        {/* Voucher Table */}
        <div className="bg-white border border-[#d1d1d1] rounded-3xl p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e7e7e7]">
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Tên voucher|Mã voucher
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Loại mã
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Sản phẩm áp dụng
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Giảm giá
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Tổng lượt sử dụng tối đa
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Đã dùng
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Hiển thị
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Thời gian lưu
                    </span>
                  </th>
                  <th className="text-left py-4 px-3">
                    <span className="font-semibold text-sm text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Thao tác
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockVouchers.map((voucher, index) => (
                  <tr key={index} className="border-b border-[#e7e7e7] hover:bg-gray-50">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[#e04d30] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">%</span>
                        </div>
                        <div>
                          <div className="bg-[#b2ffb4] px-2 py-1 rounded-md mb-1">
                            <span className="text-xs font-bold text-[#04910c]" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Đang diễn ra
                            </span>
                          </div>
                          <p className="text-xs text-[#272424] font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {voucher.name}
                          </p>
                          <p className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Mã voucher: {voucher.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {voucher.type}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {voucher.productCount}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {voucher.discountValue}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {voucher.usageLimit}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {voucher.used}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {voucher.displayChannel}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="text-xs text-[#272424]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <p className="mb-0">{voucher.expiry.split(' - ')[0]}</p>
                        <p className="mb-0">{voucher.expiry.split(' - ')[1]}</p>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="text-xs text-[#1a71f6] font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {voucher.actions.map((action, actionIndex) => (
                          <p key={actionIndex} className="mb-0 cursor-pointer hover:underline">
                            {action}
                          </p>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;