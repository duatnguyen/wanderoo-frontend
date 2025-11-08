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
};

interface ProductsTableProps {
  items: CheckoutItem[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ items }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Sản phẩm</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Đơn giá
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Số lượng
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded border border-gray-300 bg-transparent" />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          Phân loại hàng: {item.variant}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-gray-900 font-medium">
                    {formatCurrencyVND(item.price)}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-gray-900">{item.quantity}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-gray-900 font-semibold">
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

