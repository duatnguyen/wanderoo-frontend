import React, { useState } from "react";
import { Search } from "lucide-react";
import InventoryProductTable, {
  type InventoryProduct,
} from "../components/InventoryProductTable";

const InventoryLookup: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Mock inventory products
  const mockProducts: InventoryProduct[] = [
    {
      id: "1",
      name: "Túi ngoài trời lưu trữ leo núi Rucksack 30L",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop",
      variant: "Vàng, Size L",
      available: 2000,
      price: 300000,
    },
    {
      id: "2",
      name: "Gậy leo núi Track Man Trekking Pole TM6705 – 7930",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop",
      available: 2000,
      price: 300000,
    },
    {
      id: "3",
      name: "Giày đi bộ dã ngoại nữ cổ lửng chống thấm - MH100",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop",
      variant: "Size 35",
      available: 2000,
      price: 300000,
    },
    {
      id: "4",
      name: "Giày đi bộ dã ngoại nữ cổ lửng chống thấm - MH100",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop",
      variant: "Size 36",
      available: 2000,
      price: 300000,
    },
    {
      id: "5",
      name: "Giày đi bộ dã ngoại nữ cổ lửng chống thấm - MH100",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop",
      variant: "Size 37",
      available: 2000,
      price: 300000,
    },
    {
      id: "6",
      name: "Giày đi bộ dã ngoại nữ cổ lửng chống thấm - MH100",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop",
      variant: "Size 38",
      available: 2000,
      price: 300000,
    },
    {
      id: "7",
      name: "Giày đi bộ dã ngoại nữ cổ lửng chống thấm - MH100",
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop",
      variant: "Size 39",
      available: 2000,
      price: 300000,
    },
  ];

  const [products] = useState<InventoryProduct[]>(mockProducts);
  const totalProducts = products.length;

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white p-10 border-2 border-[#e7e7e7]">
      {/* Search Bar */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm sản phẩm"
              className="w-full pl-4 pr-10 py-2 border border-[#e7e7e7] rounded-lg text-sm text-[#272424] placeholder:text-[#737373] focus:outline-none focus:border-[#e04d30]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-[#737373]" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <InventoryProductTable
            products={filteredProducts}
            totalProducts={totalProducts}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryLookup;
