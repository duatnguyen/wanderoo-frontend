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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          Sản phẩm ({items.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-700">
                Sản phẩm
              </th>
              <th className="px-5 py-3 text-right text-sm font-medium text-gray-700">
                Đơn giá
              </th>
              <th className="px-5 py-3 text-center text-sm font-medium text-gray-700">
                S. lượng
              </th>
              <th className="px-5 py-3 text-right text-sm font-medium text-gray-700">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.variant}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm text-gray-900">
                    {formatCurrencyVND(item.price)}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-sm text-gray-900">{item.quantity}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm font-semibold text-[#E04D30]">
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
