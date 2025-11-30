import React from "react";
import { formatCurrencyVND } from "../../../features/shop/pages/Checkout/utils/formatCurrency";

type CheckoutItem = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variant?: string;
  cartId?: number;
};

interface ProductsTableProps {
  items: CheckoutItem[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ items }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Sản phẩm đã chọn
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {items.length} {items.length === 1 ? 'sản phẩm' : 'sản phẩm'}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/50 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg border-2 border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      {item.variant && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                            {item.variant}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrencyVND(item.price)}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex items-center justify-center min-w-[40px] px-3 py-1.5 bg-gray-100 rounded-lg">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-base font-bold text-[#E04D30]">
                    {formatCurrencyVND(item.price * item.quantity)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
