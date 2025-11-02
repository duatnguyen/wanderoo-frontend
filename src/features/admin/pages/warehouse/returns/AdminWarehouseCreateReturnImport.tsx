import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/icons/Icon";

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

// Mock import data - would normally fetch from API
const mockImportData: { [key: string]: { supplier: string; items: Product[] } } = {
  "1": {
    supplier: "Công ty TNHH ABC",
    items: [
      { id: "p1", name: "Áo thun thoáng khí Rockbros LKW008", quantity: 100, price: 120000, image: "/placeholder-product.jpg" },
      { id: "p2", name: "Áo thun dài tay Northshengwolf", quantity: 50, price: 150000, image: "/placeholder-product.jpg" },
    ],
  },
  "2": {
    supplier: "Công ty XYZ",
    items: [
      { id: "p3", name: "Giày Thể Thao Nam", quantity: 30, price: 500000, image: "/placeholder-product.jpg" },
    ],
  },
};

const AdminWarehouseCreateReturnImport = () => {
  document.title = "Tạo đơn trả hàng nhập | Wanderoo";

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const importId = searchParams.get("importId");
  
  const [supplierSearch, setSupplierSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productFormSearch, setProductFormSearch] = useState("");
  const [note, setNote] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Load import data when importId is provided
  useEffect(() => {
    if (importId && mockImportData[importId]) {
      const importData = mockImportData[importId];
      setSupplierSearch(importData.supplier);
      // Set initial products with their original quantities from import order
      setProducts(importData.items.map(item => ({ ...item })));
    }
  }, [importId]);

  const totalProducts = products.length;
  const totalAmount = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace(/\s/g, "")
      .replace(/₫/g, "đ");
  };

  const handleCancel = () => {
    navigate("/admin/warehouse/returnsimport");
  };

  const handleConfirm = () => {
    // Generate a new return ID (in real app, this would come from the API)
    const newReturnId = `return-${Date.now()}`;
    // Save default status to localStorage so the list page can reflect the new return
    // Default status: processing (Đang giao dịch), returned (Đã hoàn trả), pending_refund (Chưa thanh toán)
    if (typeof window !== "undefined") {
      const storedStatus = JSON.parse(localStorage.getItem("returnImportStatuses") || "{}");
      storedStatus[newReturnId] = {
        status: "processing",
        returnStatus: "returned",
        refundStatus: "pending_refund",
      };
      localStorage.setItem("returnImportStatuses", JSON.stringify(storedStatus));
      // Dispatch custom event to notify the list page
      window.dispatchEvent(new Event("returnImportStatusUpdated"));
    }
    // Navigate to the return detail page
    navigate(`/admin/warehouse/returns/${newReturnId}`);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddProducts = () => {
    const newProducts = mockProducts
      .filter((product) => selectedProductIds.includes(product.id))
      .map((product) => ({
        id: product.id,
        name: product.name,
        quantity: 1,
        price: 0,
        image: product.image,
        availableStock: product.availableStock,
      }))
      .filter((product) => !products.some((p) => p.id === product.id));
    
    setProducts((prev) => [...prev, ...newProducts]);
    setIsProductFormOpen(false);
    setSelectedProductIds([]);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, quantity: Math.max(1, quantity) } : product
      )
    );
  };

  const handleUpdatePrice = (productId: string, price: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, price: Math.max(0, price) } : product
      )
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const filteredMockProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(productFormSearch.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isProductFormOpen) {
        setIsProductFormOpen(false);
        setSelectedProductIds([]);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isProductFormOpen]);

  return (
    <div className="box-border flex flex-col gap-[10px] items-start px-4 pt-0 pb-[32px] relative w-full max-w-[1130px] mx-auto overflow-x-auto overflow-y-auto table-scroll-container">
      {/* Header */}
      <div className="box-border flex flex-col gap-[8px] items-start justify-center px-0 pb-[10px] relative shrink-0 w-full min-w-[1000px]">
        <div className="flex items-center gap-[8px] relative shrink-0 w-full">
          <button
            onClick={() => navigate("/admin/warehouse/returnsimport")}
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
          <h1 className="font-['Montserrat'] font-bold text-[24px] text-[#272424] leading-normal">
            Tạo đơn trả hàng nhập
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-[12px] h-[700px] items-start relative rounded-lg flex-shrink-0 w-full -mt-[10px] min-w-[1000px]">
        {/* Left Column */}
        <div className="flex flex-col gap-[12px] h-full items-start relative flex-shrink-0 w-full lg:w-[695px] min-w-[650px]">
          {/* Products Section */}
          <div className="basis-0 bg-white border border-[#d1d1d1] box-border flex flex-col gap-[8px] grow items-start min-h-px min-w-px px-[24px] py-[16px] relative rounded-lg flex-shrink-0 w-full min-w-[600px]">
            <div className="flex gap-[10px] items-start relative shrink-0 w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                Sản phẩm hoàn trả
              </p>
            </div>
            {!importId && (
              <div className="flex items-center gap-2 relative shrink-0 w-full">
                <SearchBar
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Tìm kiếm"
                  className="flex-1 h-[36px] [&_input]:text-[14px]"
                />
                <Button
                  variant="secondary"
                  onClick={() => setIsProductFormOpen(true)}
                  className="bg-white text-[#e04d30] border border-[#e04d30] hover:bg-white hover:text-[#e04d30] h-[36px] w-[36px] p-0 flex items-center justify-center flex-shrink-0"
                >
                  <Icon name="plus" size={16} color="#e04d30" strokeWidth={3} />
                </Button>
              </div>
            )}
            
            {/* Products Table */}
            {products.length > 0 && (
              <div className="w-[calc(100%+48px)] mt-0 -mx-[24px]">
                {/* Table Header */}
                <div className="bg-[#f6f6f6] border-b border-[#d1d1d1] flex items-center py-[14px] pl-[24px] pr-0">
                  <div className="flex-[2] min-w-0 font-['Montserrat'] font-semibold text-[14px] text-[#272424]">
                    Sản phẩm
                  </div>
                  <div className="flex-1 font-['Montserrat'] font-semibold text-[14px] text-[#272424] text-center">
                    Số lượng
                  </div>
                  <div className="flex-1 font-['Montserrat'] font-semibold text-[14px] text-[#272424] text-center">
                    Đơn giá
                  </div>
                  <div className="flex-1 font-['Montserrat'] font-semibold text-[14px] text-[#272424] text-center">
                    Thành tiền
                  </div>
                  <div className="w-[40px] flex-shrink-0 flex justify-center pr-[8px]"></div>
                </div>
                
                {/* Products List */}
                <div className="flex flex-col">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border-b border-[#e7e7e7] flex items-center py-[14px] pl-[24px] pr-0 hover:bg-gray-50"
                    >
                      {/* Product Info */}
                      <div className="flex-[2] min-w-0 flex items-start gap-3">
                        <div className="h-[38px] w-[38px] bg-gray-200 rounded flex items-center justify-center shrink-0 border border-gray-300">
                        </div>
                        <span className="font-['Montserrat'] font-normal text-[14px] text-[#272424] truncate min-w-0">
                          {product.name}
                        </span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="flex-1 flex justify-center">
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 1)}
                          className="w-20 text-center border border-[#d1d1d1] rounded px-2 py-1 text-[12px] font-['Montserrat'] focus:border-[#e04d30] focus:outline-none"
                          min="1"
                        />
                      </div>
                      
                      {/* Unit Price */}
                      <div className="flex-1 flex justify-center">
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleUpdatePrice(product.id, parseFloat(e.target.value) || 0)}
                          className="w-20 text-center border border-[#d1d1d1] rounded px-2 py-1 text-[12px] font-['Montserrat'] focus:border-[#e04d30] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          min="0"
                          step="1000"
                        />
                      </div>
                      
                      {/* Total Amount */}
                      <div className="flex-1 flex justify-center">
                        <span className="font-['Montserrat'] font-semibold text-[14px] text-[#272424]">
                          {formatCurrency(product.quantity * product.price)}
                        </span>
                      </div>
                      
                      {/* Remove Button */}
                      <div className="w-[40px] flex-shrink-0 flex justify-center pr-[8px]">
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-[#737373] hover:text-[#4a4a4a] cursor-pointer text-[28px] font-normal leading-none"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className="bg-white border border-[#d1d1d1] box-border flex flex-col items-start px-0 py-0 relative rounded-lg flex-shrink-0 w-full min-w-[600px]">
            {/* Header */}
            <div className="border-b border-[#d1d1d1] box-border flex gap-[20px] items-center p-[14px] relative rounded-tl-lg rounded-tr-lg shrink-0 w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[20px]">
                Thanh toán
              </p>
            </div>

            {/* Summary Row */}
            <div className="bg-[#f6f6f6] border-b border-[#d1d1d1] box-border flex h-[50px] items-start relative shrink-0 w-full">
              <div className="basis-0 border-r border-[#d1d1d1] grow h-full min-h-px min-w-px relative shrink-0">
                <div className="box-border flex items-center overflow-clip pl-[15px] pr-[14px] py-[14px] relative rounded-[inherit] size-full">
                  <p className="font-['Montserrat'] font-normal leading-[1.4] relative shrink-0 text-[#272424] text-[14px]">
                    Tổng tiền
                  </p>
                </div>
              </div>
              <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0">
                <p className="absolute font-['Montserrat'] font-normal leading-[1.4] left-[50%] text-[#272424] text-[14px] text-center top-[15px] translate-x-[-50%]">
                  {totalProducts} sản phẩm
                </p>
              </div>
              <div className="basis-0 border-l border-[#d1d1d1] box-border flex gap-[4px] grow h-full items-center justify-end min-h-px min-w-px pl-[14px] pr-[15px] py-[14px] relative shrink-0">
                <p className="font-['Montserrat'] font-normal leading-[1.4] relative shrink-0 text-[#272424] text-[14px]">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            {/* Total to Pay Supplier */}
            <div className="border-b border-[#d1d1d1] box-border flex items-start justify-between px-0 py-[6px] relative rounded-bl-lg rounded-br-lg shrink-0 w-full">
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
        <div className="flex flex-col gap-[12px] items-start relative flex-shrink-0 w-full lg:w-[341px] min-w-[320px]">
          {/* Supplier Section */}
          <div className="bg-white border border-[#d1d1d1] relative rounded-lg flex-shrink-0 w-full min-w-[300px]">
            <div className="box-border flex flex-col gap-[8px] items-start justify-center overflow-clip px-[24px] py-[16px] relative rounded-[inherit] w-full">
              <p className="font-['Montserrat'] font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[16px]">
                Nhà cung cấp
              </p>
              {supplierSearch ? (
                <div className="flex items-start gap-3 w-full">
                  <div className="w-[60px] h-[60px] bg-[#e7e7e7] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#9a9a9a] text-[12px]">60 x 60</span>
                  </div>
                  <p className="font-['Montserrat'] text-[#272424] text-[14px] leading-normal">
                    {supplierSearch}
                  </p>
                </div>
              ) : (
                <SearchBar
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  placeholder="Tìm kiếm"
                  className="w-full h-[36px] [&_input]:text-[14px]"
                />
              )}
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-white border border-[#d1d1d1] relative rounded-lg flex-shrink-0 w-full min-w-[300px]">
            <div className="box-border flex flex-col gap-[8px] items-start justify-center overflow-clip px-[24px] py-[16px] relative rounded-[inherit] w-full">
              <div className="flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <div className="flex gap-[4px] items-start leading-[1.4] relative shrink-0">
                    <p className="font-['Montserrat'] relative shrink-0 text-[#272424] font-semibold text-[16px]">
                      Ghi chú
                    </p>
                  </div>
                </div>
                <div className="border-2 border-[#e04d30] box-border flex gap-[4px] h-[100px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full bg-white">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú"
                    className="font-['Montserrat'] font-normal grow leading-[1.5] min-h-px min-w-px relative shrink-0 text-[14px] placeholder:text-[#737373] placeholder:text-[14px] text-[#272424] resize-none outline-none w-full h-full bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[10px] items-center justify-end shrink-0 w-full mt-2">
            <Button onClick={handleCancel} variant="secondary" className="flex-shrink-0 h-[36px] text-[14px]">
              Huỷ
            </Button>
            <Button onClick={handleConfirm} variant="default" className="flex-shrink-0 h-[36px] text-[14px]">
              Xác nhận
            </Button>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {isProductFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsProductFormOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-[700px] max-h-[90vh] bg-white flex flex-col rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white flex flex-col rounded-lg overflow-hidden">
              {/* Search Header */}
              <div className="border-b border-[#e7e7e7] flex gap-2 items-center px-[16px] py-[30px] shrink-0 bg-white">
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
                <button 
                  onClick={() => navigate("/admin/products/new")}
                  className="bg-[#e04d30] flex items-center justify-center h-[40px] w-[40px] rounded-[12px] shrink-0"
                >
                  <span className="font-['Montserrat'] font-light text-[32px] text-white leading-[1.5]">
                    +
                  </span>
                </button>
              </div>

              {/* Table Header */}
              <div className="box-border flex items-center px-[15px] py-0 shrink-0 bg-white">
                <div className="bg-white box-border flex gap-[8px] h-[50px] items-center overflow-clip px-[5px] py-[14px] w-[450px]">
                  <Checkbox
                    checked={selectedProductIds.length === filteredMockProducts.length && filteredMockProducts.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProductIds(filteredMockProducts.map(p => p.id));
                      } else {
                        setSelectedProductIds([]);
                      }
                    }}
                  />
                  <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-[#454545]">
                    Sản phẩm
                  </p>
                </div>
                <div className="bg-white box-border flex gap-[4px] grow h-[50px] items-center justify-center p-[14px]">
                  <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545] text-center">
                    Có thể bán
                  </p>
                </div>
              </div>

              {/* Product List */}
              <div className="box-border flex flex-col max-h-[400px] items-start px-[15px] py-0 overflow-y-auto bg-white">
                {filteredMockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border-b border-[#e7e7e7] box-border flex items-center w-full bg-white"
                  >
                    <div className="bg-white box-border flex gap-[8px] h-full items-start overflow-clip px-[5px] py-[14px] w-[450px]">
                      <Checkbox
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                      <div className="h-[38px] w-[38px] bg-gray-200 rounded flex items-center justify-center shrink-0 border border-gray-300">
                      </div>
                      <p className="font-['Montserrat'] font-semibold leading-[1.5] text-[14px] text-black">
                        {product.name}
                      </p>
                    </div>
                    <div className="bg-white box-border flex gap-[4px] grow h-full items-center justify-center p-[14px]">
                      <p className="font-['Montserrat'] font-semibold grow leading-[1.5] text-[14px] text-[#454545] text-center">
                        {product.availableStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="box-border flex gap-[10px] items-center justify-end px-[16px] py-[12px] shrink-0 bg-white rounded-b-lg">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsProductFormOpen(false);
                    setSelectedProductIds([]);
                  }}
                  className="h-[36px] text-[14px]"
                >
                  Huỷ
                </Button>
                <Button variant="default" onClick={handleAddProducts} className="h-[36px] text-[14px]">
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWarehouseCreateReturnImport;

