import React from "react";
import { formatCurrencyVND } from "../../../features/shop/pages/Checkout/utils/formatCurrency";
import type {
  CheckoutItem,
} from "../../../types/checkout";
interface ProductsTableProps {
  items: CheckoutItem[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ items }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Sản phẩm đã chọn
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
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
              <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                SL
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">
                Giảm giá
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">
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
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {item.name}
                      </p>
                      {item.variant && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {item.variant}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-right">
                    {item.originalPrice !== item.productPrice ? (
                      <>
                        <div className="text-xs text-gray-500 line-through">
                          {formatCurrencyVND(item.originalPrice)}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrencyVND(item.productPrice)}
                        </div>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrencyVND(item.productPrice)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-gray-100 rounded">
                    <span className="text-xs font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.discountValue && item.originalPrice !== item.productPrice ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs font-medium text-red-600">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {item.discountValue}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-[#E04D30]">
                    {formatCurrencyVND(item.totalPrice)}
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
