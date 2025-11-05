import React, { useState, useEffect } from "react";
import { POSProductList, type POSProduct } from "../../../../components/pos/POSProductList";
import { POSOrderSummary } from "../../../../components/pos/POSOrderSummary";
import { POSFooter } from "../../../../components/pos/POSFooter";
import { usePOSContext } from "../../../../context/POSContext";

const POSPage: React.FC = () => {
  const { currentOrderId } = usePOSContext();

  // Mock sample products - different products for different orders
  const getInitialProductsForOrder = (orderId: string): POSProduct[] => {
    if (orderId === "1") {
      return [
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        }, {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "3",
          name: "Túi ngoài trời lưu trữ leo núi Rucksack 30L",
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop",
          variant: "Nâu",
          price: 100000,
          quantity: 2,
        },
      ];
    }
    // Different products for other orders (for demonstration)
    return [];
  };

  // Store products for each order
  const [ordersProducts, setOrdersProducts] = useState<
    Record<string, POSProduct[]>
  >(() => {
    const initial: Record<string, POSProduct[]> = {};
    // Initialize with default order
    initial["1"] = getInitialProductsForOrder("1");
    return initial;
  });

  // Get current order's products
  const products = ordersProducts[currentOrderId] || [];

  // Update products when order changes
  useEffect(() => {
    setOrdersProducts((prev) => {
      if (!prev[currentOrderId]) {
        return {
          ...prev,
          [currentOrderId]: getInitialProductsForOrder(currentOrderId),
        };
      }
      return prev;
    });
  }, [currentOrderId]);

  const [customerSearch, setCustomerSearch] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [employee] = useState("Vũ Hữu Quân");

  const note = notes[currentOrderId] || "";

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemove(productId);
      return;
    }
    setOrdersProducts((prev) => ({
      ...prev,
      [currentOrderId]: (prev[currentOrderId] || []).map((p) =>
        p.id === productId ? { ...p, quantity } : p
      ),
    }));
  };

  const handleRemove = (productId: string) => {
    setOrdersProducts((prev) => ({
      ...prev,
      [currentOrderId]: (prev[currentOrderId] || []).filter(
        (p) => p.id !== productId
      ),
    }));
  };

  const handleNoteChange = (value: string) => {
    setNotes((prev) => ({
      ...prev,
      [currentOrderId]: value,
    }));
  };

  const calculateTotals = () => {
    const totalAmount = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const discount = 0; // Can be calculated based on discount rules
    const finalAmount = totalAmount - discount;
    return { totalAmount, discount, finalAmount };
  };

  const handleCheckout = () => {
    // Handle checkout logic
    console.log("Checkout", {
      orderId: currentOrderId,
      products,
      note,
      employee,
    });
  };

  const { totalAmount, discount, finalAmount } = calculateTotals();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Product List with Footer - Left Side */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <POSProductList
            products={products}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            className="flex-1"
          />
          {/* Footer */}
          <POSFooter
            note={note}
            onNoteChange={handleNoteChange}
            employee={employee}
            className="flex-shrink-0"
          />
        </div>

        {/* Order Summary - Fixed on Right Side */}
        <div className="hidden lg:flex flex-shrink-0">
          <POSOrderSummary
            customerSearch={customerSearch}
            onCustomerSearchChange={setCustomerSearch}
            totalAmount={totalAmount}
            discount={discount}
            finalAmount={finalAmount}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default POSPage;
