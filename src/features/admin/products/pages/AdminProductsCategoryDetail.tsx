import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/components/icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import ToggleSwitch from "@/components/ui/toggle-switch";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface Subcategory {
  id: string;
  name: string;
  image: string;
  productCount: number;
  isVisible: boolean;
  parentCategoryName: string;
}

const AdminProductsCategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock subcategory data - in real app, fetch based on categoryId
  const [subcategory, setSubcategory] = useState<Subcategory>({
    id: categoryId || "1",
    name: "Áo thun",
    image: "",
    productCount: 12,
    isVisible: true,
    parentCategoryName: "Áo leo núi",
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock products data
  const [products] = useState<Product[]>([
    {
      id: "P001",
      name: "Áo thun dài tay nam Gothiar Active",
      image: "",
      price: 5,
    },
    {
      id: "P002",
      name: "Áo thun ngắn tay Gothiar Active",
      image: "",
      price: 5,
    },
    {
      id: "P003",
      name: "Áo thun dài tay nữ Gothiar Active",
      image: "",
      price: 5,
    },
    {
      id: "P004",
      name: "Áo thun ngắn tay nữ Gothiar Active",
      image: "",
      price: 5,
    },
    {
      id: "P005",
      name: "Áo thun ngắn tay nam Gothiar Classic",
      image: "",
      price: 5,
    },
    {
      id: "P006",
      name: "Áo thun co giãn thoáng khí Rockbros LKW008",
      image: "",
      price: 5,
    },
    {
      id: "P007",
      name: "Áo T-shirt leo núi adidas TERREX hoạ tiết Nam - JI9166",
      image: "",
      price: 5,
    },
    {
      id: "P008",
      name: "Áo thun CLIMBING CHERUB",
      image: "",
      price: 5,
    },
    {
      id: "P009",
      name: "Áo phông nam VNXK MHW Way2Cool™",
      image: "",
      price: 5,
    },
    {
      id: "P010",
      name: "Áo thun ngắn tay nam Gothiar AT Dry",
      image: "",
      price: 5,
    },
    {
      id: "P011",
      name: "Áo thun ngắn tay nữ Gothiar Classic",
      image: "",
      price: 5,
    },
    {
      id: "P012",
      name: "Áo thun ngắn tay nam Gothiar Classic",
      image: "",
      price: 5,
    },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleToggleVisibility = () => {
    setSubcategory((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setEditingName(subcategory.name);
  };

  const handleSaveName = () => {
    if (editingName.trim()) {
      setSubcategory((prev) => ({ ...prev, name: editingName.trim() }));
    }
    setIsEditingName(false);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditingName("");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert(`${file.name} vượt quá dung lượng 2MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert(`${file.name} không phải là file hình ảnh`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result && typeof result === "string") {
        setSubcategory((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = "";
  };

  const handleDeleteProduct = (productId: string) => {
    console.log("Delete product:", productId);
    // Implement delete logic
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      console.log("Deleting products:", selectedProducts);
      // Implement bulk delete logic
      setSelectedProducts([]);
    }
  };

  const handleAddProduct = () => {
    console.log("Add product to category");
    // Navigate to add product page or open modal
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-[22px] items-center px-[32px] py-[32px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px] h-[29px] items-start justify-center w-full">
        <div className="flex gap-[30px] items-center w-full">
          <div className="flex gap-[8px] items-center">
            <button
              onClick={() => navigate("/admin/products/categories")}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <div className="w-[24px] h-[24px] flex items-center justify-center rotate-180 scale-y-[-100%]">
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5H17M17 5L13 1M17 5L13 9"
                    stroke="#737373"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
            <div className="flex gap-[4px] items-center justify-center">
              <h1 className="font-bold text-[24px] text-[#272424] leading-[normal]">
                {subcategory.parentCategoryName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Info Card */}
      <div className="bg-white border-2 border-[#e7e7e7] rounded-[24px] p-[24px] flex gap-[16px] items-start w-full">
        {/* Image Upload */}
        <div
          onClick={handleImageClick}
          className="bg-[#ffeeea] border-2 border-dashed border-[#e04d30] rounded-[8px] w-[100px] h-[100px] flex flex-col items-center justify-center gap-[8px] p-[20px] cursor-pointer hover:bg-[#ffe4dd] transition-colors flex-shrink-0"
        >
          {subcategory.image ? (
            <img
              src={subcategory.image}
              alt={subcategory.name}
              className="w-full h-full object-cover rounded-[8px]"
            />
          ) : (
            <>
              <Icon name="image" size={32} color="#e04d30" />
              <p className="text-[10px] font-medium text-[#737373] text-center leading-[1.4]">
                Thêm hình ảnh (0/9)
              </p>
            </>
          )}
        </div>

        {/* Subcategory Details */}
        <div className="flex flex-col items-start justify-between flex-1">
          <div className="flex gap-[8px] items-start w-[282px]">
            <div className="flex gap-[8px] items-center">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="px-3 py-1 border-2 border-[#e04d30] rounded-[8px] text-[20px] font-bold text-[#272424] outline-none focus:border-[#c43d20]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveName();
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="w-6 h-6 flex items-center justify-center bg-[#e04d30] hover:bg-[#c43d20] rounded-[4px] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3334 4L6.00002 11.3333L2.66669 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="w-6 h-6 flex items-center justify-center bg-[#d1d1d1] hover:bg-[#b8b8bd] rounded-[4px] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="#272424"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
                    {subcategory.name}
                  </h2>
                  <button
                    onClick={handleEditName}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                        stroke="#1a71f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="font-medium text-[14px] text-[#272424] leading-[1.4]">
            Sản phẩm: {subcategory.productCount}
          </p>
        </div>

        {/* Toggle Switch Section */}
        <div className="flex gap-[10px] items-center justify-end flex-1">
          <p className="font-medium text-[14px] text-[#272424] leading-[1.4]">
            Danh mục sẽ hiển thị trong trang Shop
          </p>
          <ToggleSwitch
            checked={subcategory.isVisible}
            onChange={handleToggleVisibility}
          />
        </div>
      </div>

      {/* Products List Section */}
      <div className="bg-white border-2 border-[#e7e7e7] rounded-[24px] p-[24px] flex flex-col gap-[16px] items-start w-full">
        <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
          Danh sách sản phẩm
        </h2>

        {/* Search and Add Button */}
        <div className="flex items-center justify-between w-full">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-[500px]"
          />
          <Button onClick={handleAddProduct}>Thêm sản phẩm</Button>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-[#e7e7e7] rounded-[16px] w-full overflow-hidden">
          {/* Table Header */}
          <div className="flex items-start w-full">
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[10px] items-center overflow-clip px-[12px] py-[15px] rounded-tl-[12px]">
              <CustomCheckbox
                checked={
                  products.length > 0 &&
                  selectedProducts.length === products.length
                }
                onChange={handleSelectAll}
              />
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[10px] items-center overflow-clip px-[12px] py-[15px] w-[400px]">
              {selectedProducts.length > 0 ? (
                <>
                  <span className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                    Đã chọn {selectedProducts.length} sản phẩm
                  </span>
                  <Button
                    variant="secondary"
                    onClick={handleDeleteSelected}
                    className="h-[36px] ml-2"
                  >
                    Xóa
                  </Button>
                </>
              ) : (
                <p className="font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Tên sản phẩm
                </p>
              )}
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] flex-1">
              <p
                className={`font-semibold text-[14px] text-[#272424] leading-[1.4] ${
                  selectedProducts.length > 0 ? "invisible" : ""
                }`}
              >
                Giá
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-end px-[14px] py-[15px] flex-1 rounded-tr-[12px]">
              <p
                className={`font-semibold text-[14px] text-[#272424] leading-[1.4] ${
                  selectedProducts.length > 0 ? "invisible" : ""
                }`}
              >
                Thao tác
              </p>
            </div>
          </div>

          {/* Table Body */}
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-start border-t border-[#d1d1d1] w-full"
            >
              <div className="flex flex-col gap-[8px] items-center justify-center p-[12px]">
                <CustomCheckbox
                  checked={selectedProducts.includes(product.id)}
                  onChange={(checked) =>
                    handleSelectProduct(product.id, checked)
                  }
                />
              </div>
              <div className="flex gap-[8px] items-center overflow-clip px-[12px] py-[14px] w-[400px]">
                <div className="border-[0.5px] border-[#d1d1d1] rounded-[8px] w-[70px] h-[70px] flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-[8px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f6f6f6] rounded-[8px]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                    {product.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-[8px] items-center justify-center p-[12px] flex-1">
                <p className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                  {product.price}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between px-[18px] py-[12px] flex-1">
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="font-bold text-[12px] text-[#1a71f6] leading-[normal] hover:opacity-70 transition-opacity"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-white border border-[#e7e7e7] flex h-[48px] items-center justify-between px-[30px] py-[10px] rounded-[12px] w-full">
          <div className="flex gap-[3px] items-start">
            <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
              Đang hiển thị 1 - 12 trong tổng 20 trang
            </p>
          </div>
          <div className="flex gap-[16px] items-start">
            <div className="flex gap-[13px] items-center">
              <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
                Trang số
              </p>
              <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
                  {currentPage}
                </p>
              </div>
            </div>
            <div className="flex gap-[6px] items-start">
              <div
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
              >
                <ChevronLeft className="w-[20px] h-[20px] text-[#d1d1d1]" />
              </div>
              <div
                className={`border border-[#b0b0b0] flex items-center justify-center px-[6px] py-[4px] rounded-[8px] cursor-pointer hover:bg-gray-50 ${
                  currentPage >= Math.ceil(products.length / itemsPerPage)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleNextPage}
              >
                <ChevronRight className="w-[20px] h-[20px] text-[#454545]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default AdminProductsCategoryDetail;
