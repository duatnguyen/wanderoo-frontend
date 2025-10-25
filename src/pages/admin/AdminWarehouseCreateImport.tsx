import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  availableStock?: number;
}

interface MockProduct {
  id: string;
  name: string;
  image: string;
  availableStock: number;
}

// Mock products data
const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Áo Thun Nam Basic",
    image: "/placeholder-product.jpg",
    availableStock: 500,
  },
  {
    id: "2",
    name: "Quần Jean Nữ Skinny",
    image: "/placeholder-product.jpg",
    availableStock: 350,
  },
  {
    id: "3",
    name: "Giày Thể Thao Nam",
    image: "/placeholder-product.jpg",
    availableStock: 200,
  },
  {
    id: "4",
    name: "Túi Xách Nữ Mini",
    image: "/placeholder-product.jpg",
    availableStock: 150,
  },
];

const AdminWarehouseCreateImport = () => {
  document.title = "Tạo đơn nhập hàng | Wanderoo";

  const navigate = useNavigate();
  const [supplierSearch, setSupplierSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productFormSearch, setProductFormSearch] = useState("");
  const [note, setNote] = useState("");
  const [products] = useState<Product[]>([]);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const totalProducts = products.length;
  const totalAmount = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleCancel = () => {
    navigate("/admin/warehouse/imports");
  };

  const handleConfirm = () => {
    // Handle confirm logic here
    console.log("Confirm import order");
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddProducts = () => {
    // Handle adding selected products to the import
    console.log("Selected products:", selectedProductIds);
    setIsProductFormOpen(false);
    setSelectedProductIds([]);
  };

  const filteredMockProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(productFormSearch.toLowerCase())
  );

  return (
    <div className="box-border flex flex-col gap-[10px] items-center px-[50px] py-[32px] relative size-full">
      {/* Header */}
      <div className="box-border flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] relative shrink-0 w-full">
        <div className="flex items-center justify-between relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center relative shrink-0">
            <button
              onClick={() => navigate("/admin/warehouse/imports")}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
            >
              <div className="flex items-center justify-center">
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rotate-180"
                >
                  <path
                    d="M1 5H17M17 5L13 1M17 5L13 9"
                    stroke="#737373"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
            <div className="flex gap-[4px] items-center justify-center relative shrink-0">
              <h1 className="font-['Montserrat'] font-bold text-[24px] text-[#272424] leading-normal">
                Tạo đơn nhập hàng
              </h1>
            </div>
          </div>
          <div className="flex gap-[10px] items-center relative shrink-0">
            <Button onClick={handleCancel} variant="secondary">
              Huỷ
            </Button>
            <Button onClick={handleConfirm} variant="default">
              Xác nhận
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-[12px] h-[700px] items-start relative rounded-[24px] shrink-0 w-full">
        {/* Left Column */}
        <div className="basis-0 flex flex-col gap-[12px] grow h-full items-start justify-center min-h-px min-w-px relative shrink-0">
          {/* Products Section */}
          <div className="basis-0 bg-white border border-[#d1d1d1] box-border flex flex-col gap-[8px] grow items-start min-h-px min-w-px px-[24px] py-[16px] relative rounded-[20px] shrink-0 w-full">
            <div className="flex gap-[10px] items-start relative shrink-0 w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                Sản phẩm
              </p>
            </div>
            <div className="flex items-center justify-between relative shrink-0 w-full">
              <SearchBar
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-[500px]"
              />
              <Button
                variant="default"
                onClick={() => setIsProductFormOpen(true)}
              >
                Thêm sản phẩm
              </Button>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white border border-[#d1d1d1] box-border flex flex-col items-start px-0 py-0 relative rounded-[24px] shrink-0 w-full">
            {/* Header */}
            <div className="border-b border-[#d1d1d1] box-border flex gap-[20px] items-center p-[14px] relative rounded-tl-[24px] rounded-tr-[24px] shrink-0 w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[20px]">
                Thanh toán
              </p>
            </div>

            {/* Summary Row */}
            <div className="bg-[#f6f6f6] border-b border-[#d1d1d1] box-border flex h-[50px] items-start relative shrink-0 w-full">
              <div className="basis-0 border-r border-[#d1d1d1] grow h-full min-h-px min-w-px relative shrink-0">
                <div className="box-border flex items-center overflow-clip pl-[15px] pr-[14px] py-[14px] relative rounded-[inherit] size-full">
                  <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[14px]">
                    Tổng tiền
                  </p>
                </div>
              </div>
              <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0">
                <p className="absolute font-['Montserrat'] font-semibold leading-[1.4] left-[50%] text-[#272424] text-[14px] text-center top-[15px] translate-x-[-50%]">
                  {totalProducts} sản phẩm
                </p>
              </div>
              <div className="basis-0 border-l border-[#d1d1d1] box-border flex gap-[4px] grow h-full items-center justify-end min-h-px min-w-px pl-[14px] pr-[15px] py-[14px] relative shrink-0">
                <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[14px]">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            {/* Total to Pay Supplier */}
            <div className="border-b border-[#d1d1d1] box-border flex items-start justify-between px-0 py-[6px] relative rounded-bl-[24px] rounded-br-[24px] shrink-0 w-full">
              <div className="basis-0 box-border flex flex-col gap-[10px] grow items-start justify-center min-h-px min-w-px p-[12px] relative self-stretch shrink-0">
                <div className="flex gap-[10px] items-start relative shrink-0">
                  <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                    Tiền cần trả nhà cung cấp
                  </p>
                </div>
              </div>
              <div className="basis-0 box-border flex flex-col gap-[8px] grow items-end justify-center min-h-px min-w-px p-[12px] relative self-stretch shrink-0">
                <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[12px] items-start relative shrink-0 w-[341px]">
          {/* Supplier Section */}
          <div className="bg-white border border-[#d1d1d1] relative rounded-[20px] shrink-0 w-full">
            <div className="box-border flex flex-col gap-[8px] items-start justify-center overflow-clip px-[24px] py-[16px] relative rounded-[inherit] w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                Nhà cung cấp
              </p>
              <SearchBar
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="w-full"
              />
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-white border border-[#d1d1d1] relative rounded-[20px] shrink-0 w-full">
            <div className="box-border flex flex-col gap-[8px] items-start justify-center overflow-clip px-[24px] py-[16px] relative rounded-[inherit] w-full">
              <div className="flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <div className="flex gap-[4px] items-start leading-[1.4] relative shrink-0">
                    <p className="font-['Montserrat'] relative shrink-0 text-[#272424] font-semibold text-[16px]">
                      Ghi chú
                    </p>
                    <p className="font-['Montserrat'] relative shrink-0 text-[#eb2b0b] font-semibold text-[16px]">
                      *
                    </p>
                  </div>
                </div>
                <div className="border-2 border-[#e04d30] box-border flex gap-[4px] h-[100px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full bg-white">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú"
                    className="font-['Montserrat'] font-normal grow leading-[1.5] min-h-px min-w-px relative shrink-0 text-[12px] placeholder:text-[#737373] text-[#272424] resize-none outline-none w-full h-full bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      <Sheet open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <SheetContent className="w-[700px] bg-[#f7f7f7] flex flex-col rounded-[24px]">
          {/* Search Header */}
          <div className="border-b border-[#e7e7e7] flex gap-[20px] items-center px-[16px] py-[30px] shrink-0">
            <div className="border-[1.6px] border-[#e04d30] border-solid box-border flex gap-[4px] grow items-center px-[16px] py-[8px] rounded-[12px] bg-white">
              <input
                type="text"
                value={productFormSearch}
                onChange={(e) => setProductFormSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="font-['Montserrat'] font-normal leading-[1.5] text-[12px] text-[#949494] grow outline-none bg-transparent"
              />
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="#454545"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="#454545"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <button className="bg-[#e04d30] flex items-center justify-center h-[40px] px-[12px] py-[8px] rounded-[12px] shrink-0">
              <span className="font-['Montserrat'] font-light text-[32px] text-white leading-[1.5]">
                +
              </span>
            </button>
          </div>

          {/* Table Header */}
          <div className="box-border flex items-center px-[15px] py-0 shrink-0">
            <div className="bg-[#f7f7f7] box-border flex gap-[8px] h-[50px] items-center overflow-clip px-[5px] py-[14px] w-[450px]">
              <div className="w-[24px] h-[24px]" />
              <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-[#454545]">
                Sản phẩm
              </p>
            </div>
            <div className="bg-[#f7f7f7] box-border flex gap-[4px] grow h-[50px] items-center p-[14px]">
              <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545]">
                Có thể bán
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="box-border flex flex-col h-[350px] items-start px-[15px] py-0 overflow-y-auto">
            {filteredMockProducts.map((product) => (
              <div
                key={product.id}
                className="border-b border-[#e7e7e7] box-border flex items-center w-full"
              >
                <div className="bg-[#f6f6f6] box-border flex gap-[8px] h-full items-center overflow-clip px-[5px] py-[14px] w-[450px]">
                  <Checkbox
                    checked={selectedProductIds.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                  <div className="h-[70px] w-[97px] bg-gray-200 rounded flex items-center justify-center shrink-0">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                  <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-black">
                    {product.name}
                  </p>
                </div>
                <div className="bg-[#f6f6f6] box-border flex gap-[4px] grow h-full items-center p-[14px]">
                  <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545]">
                    {product.availableStock}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="box-border flex gap-[10px] items-center justify-end px-[16px] py-[12px] shrink-0 mt-auto">
            <Button
              variant="secondary"
              onClick={() => {
                setIsProductFormOpen(false);
                setSelectedProductIds([]);
              }}
            >
              Huỷ
            </Button>
            <Button variant="default" onClick={handleAddProducts}>
              Xác nhận
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminWarehouseCreateImport;
