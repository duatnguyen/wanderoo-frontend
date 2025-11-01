import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import ToggleSwitch from "@/components/ui/toggle-switch";
import { Icon } from "@/components/icons";

interface Category {
  id: string;
  name: string;
  image: string;
  subcategoryCount: number;
  isActive: boolean;
}

const AdminProductsCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Trang phục",
      image: "",
      subcategoryCount: 5,
      isActive: true,
    },
    {
      id: "2",
      name: "Ba lô & Túi",
      image: "",
      subcategoryCount: 5,
      isActive: true,
    },
    {
      id: "3",
      name: "Giày & Dép",
      image: "",
      subcategoryCount: 5,
      isActive: true,
    },
    {
      id: "4",
      name: "Lều & Ngủ",
      image: "",
      subcategoryCount: 5,
      isActive: true,
    },
    {
      id: "5",
      name: "Dụng cụ nấu ăn & ăn uống",
      image: "",
      subcategoryCount: 5,
      isActive: true,
    },
  ]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [uploadingImageFor, setUploadingImageFor] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map((cat) => cat.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  const handleToggleActive = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const handleEditName = (categoryId: string, currentName: string) => {
    setEditingId(categoryId);
    setEditingName(currentName);
  };

  const handleSaveName = (categoryId: string) => {
    if (editingName.trim()) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, name: editingName.trim() } : cat
        )
      );
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleAddCategory = () => {
    setShowAddCategoryModal(true);
    setNewCategoryName("");
  };

  const handleCloseAddModal = () => {
    setShowAddCategoryModal(false);
    setNewCategoryName("");
  };

  const handleConfirmAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        image: "",
        subcategoryCount: 0,
        isActive: true,
      };
      setCategories((prev) => [...prev, newCategory]);
      setShowAddCategoryModal(false);
      setNewCategoryName("");
    }
  };

  const handleViewDetails = (categoryId: string) => {
    navigate(`/admin/products/categories/${categoryId}`);
  };

  const handleDeleteSelected = () => {
    if (selectedCategories.length > 0) {
      console.log("Deleting categories:", selectedCategories);
      setCategories((prev) =>
        prev.filter((cat) => !selectedCategories.includes(cat.id))
      );
      setSelectedCategories([]);
    }
  };

  const handleImageClick = (categoryId: string) => {
    setUploadingImageFor(categoryId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingImageFor) return;

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
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === uploadingImageFor ? { ...cat, image: result } : cat
          )
        );
        setUploadingImageFor(null);
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = "";
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(categories.length / 10);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-[22px] items-center w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
          Danh mục lớn
        </h1>
        <Button onClick={handleAddCategory}>Thêm danh mục lớn</Button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[24px] py-[24px] rounded-[24px] w-full">
        {/* Table */}
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full min-h-[60px]">
            <div className="flex flex-row items-center w-full">
              <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-[500px]">
                <CustomCheckbox
                  checked={
                    categories.length > 0 &&
                    selectedCategories.length === categories.length
                  }
                  onChange={handleSelectAll}
                />
                <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                  {selectedCategories.length > 0
                    ? `Đã chọn ${selectedCategories.length} danh mục`
                    : "Tên danh mục lớn"}
                </span>
                {selectedCategories.length > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handleDeleteSelected}
                    className="h-[36px] ml-2"
                  >
                    Xóa
                  </Button>
                )}
              </div>
              <div className="flex gap-[8px] h-full items-center justify-center px-[5px] py-[14px] w-[150px]">
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] ${
                    selectedCategories.length > 0 ? "invisible" : ""
                  }`}
                >
                  SL danh mục con
                </span>
              </div>
              <div className="flex gap-[8px] h-full items-center justify-center px-[5px] py-[14px] w-[150px]">
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] ${
                    selectedCategories.length > 0 ? "invisible" : ""
                  }`}
                >
                  Bật/Tắt
                </span>
              </div>
              <div className="flex gap-[4px] h-full items-center justify-end p-[14px] flex-1">
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] ${
                    selectedCategories.length > 0 ? "invisible" : ""
                  }`}
                >
                  Thao tác
                </span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[15px] py-0 w-full ${
                index === categories.length - 1
                  ? "border-transparent"
                  : "border-[#e7e7e7]"
              } ${
                selectedCategories.includes(category.id)
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="flex flex-row items-center w-full">
                  {/* Category Name with Image */}
                  <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-[500px]">
                    <CustomCheckbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={(checked) =>
                        handleSelectCategory(category.id, checked)
                      }
                    />
                    <div
                      className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden bg-gray-100 flex-shrink-0 group cursor-pointer"
                      onClick={() => handleImageClick(category.id)}
                    >
                      {category.image ? (
                        <>
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon name="image" size={24} color="white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#ffeeea] border-2 border-dashed border-[#e04d30]">
                          <Icon name="image" size={24} color="#e04d30" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      {editingId === category.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-[#e04d30] rounded-[8px] text-[14px] font-semibold text-[#272424] font-montserrat outline-none focus:border-[#c43d20]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveName(category.id);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                          />
                          {/* Save Button */}
                          <button
                            onClick={() => handleSaveName(category.id)}
                            className="w-8 h-8 flex items-center justify-center bg-[#e04d30] hover:bg-[#c43d20] rounded-[6px] transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M13.3334 4L6.00002 11.3333L2.66669 8"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {/* Cancel Button */}
                          <button
                            onClick={handleCancelEdit}
                            className="w-8 h-8 flex items-center justify-center bg-[#d1d1d1] hover:bg-[#b8b8bd] rounded-[6px] transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
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
                          <span className="font-semibold text-[14px] text-[#272424] leading-[1.5]">
                            {category.name}
                          </span>
                          <button
                            onClick={() =>
                              handleEditName(category.id, category.name)
                            }
                            className="cursor-pointer hover:opacity-70 transition-opacity"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M11.3334 2.00004C11.5085 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9143 1.44775 13.1595 1.49653 13.3883 1.59129C13.6171 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38289 14.4088 2.61171C14.5036 2.84053 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5036 3.82622 14.4088 4.05504C14.314 4.28386 14.1751 4.49161 14 4.66671L5.00004 13.6667L1.33337 14.6667L2.33337 11L11.3334 2.00004Z"
                                stroke="#1a71f6"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Subcategory Count */}
                  <div className="flex gap-[8px] h-full items-center justify-center px-[5px] py-[14px] w-[150px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                      {category.subcategoryCount}
                    </span>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex gap-[8px] h-full items-center justify-center px-[5px] py-[14px] w-[150px]">
                    <ToggleSwitch
                      checked={category.isActive}
                      onChange={() => handleToggleActive(category.id)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex h-full items-center justify-end p-[14px] flex-1 flex-row">
                    <button
                      onClick={() => handleViewDetails(category.id)}
                      className="font-bold text-[14px] text-[#1a71f6] leading-[1.5] hover:opacity-70 transition-opacity"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-white border border-[#e7e7e7] flex h-[48px] items-center justify-between px-[30px] py-[10px] rounded-[12px] w-full">
          <div className="flex gap-[3px] items-start">
            <div className="flex flex-col font-normal justify-center leading-[0] text-[12px] text-[#737373]">
              <p className="leading-[1.5]">
                Đang hiển thị{" "}
                {Math.min((currentPage - 1) * 10 + 1, categories.length)} -{" "}
                {Math.min(currentPage * 10, categories.length)} trong tổng{" "}
                {Math.ceil(categories.length / 10)} trang
              </p>
            </div>
          </div>
          <div className="flex gap-[16px] items-start">
            <div className="flex gap-[13px] items-center">
              <div className="flex flex-col font-normal justify-center leading-[0] text-[12px] text-[#454545]">
                <p className="leading-[1.5]">Trang số</p>
              </div>
              <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                <div className="flex flex-col font-normal justify-center leading-[0] text-[12px] text-[#454545]">
                  <p className="leading-[1.5]">{currentPage}</p>
                </div>
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
                  currentPage >= Math.ceil(categories.length / 10)
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

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur and dark overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseAddModal}
          />
          {/* Modal Content */}
          <div
            className="relative z-50 bg-white rounded-[24px] p-[10px] w-full max-w-[400px] shadow-2xl animate-scaleIn flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-col items-start justify-center px-3 py-2">
              <h2 className="text-[20px] font-bold text-[#272424] font-montserrat leading-normal text-center w-full">
                Thêm danh mục
              </h2>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-1 items-start justify-center px-3">
              <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Tên danh mục
              </label>
              <FormInput
                placeholder="Nhập tên danh mục"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmAddCategory();
                  } else if (e.key === "Escape") {
                    handleCloseAddModal();
                  }
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-[10px] items-center justify-end px-3">
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Huỷ
              </Button>
              <Button onClick={handleConfirmAddCategory}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsCategories;
