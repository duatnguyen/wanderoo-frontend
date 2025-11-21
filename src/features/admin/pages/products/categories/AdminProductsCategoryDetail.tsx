import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import ToggleSwitch from "@/components/ui/toggle-switch";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";

interface Subcategory {
  id: string;
  name: string;
  image: string;
  productCount: number;
  isActive: boolean;
}

const CATEGORY_NAMES: Record<string, string> = {
  "1": "Trang phục",
  "2": "Ba lô & Túi",
  "3": "Giày & Dép",
  "4": "Lều & Ngủ",
  "5": "Dụng cụ nấu ăn & ăn uống",
};

const DEFAULT_SUBCATEGORIES: Subcategory[] = [
  {
    id: "sub-1",
    name: "Áo thun",
    image: "",
    productCount: 12,
    isActive: true,
  },
  {
    id: "sub-2",
    name: "Quần leo núi",
    image: "",
    productCount: 8,
    isActive: true,
  },
  {
    id: "sub-3",
    name: "Áo khoác chống nước / gió",
    image: "",
    productCount: 6,
    isActive: true,
  },
  {
    id: "sub-4",
    name: "Áo giữ nhiệt",
    image: "",
    productCount: 5,
    isActive: true,
  },
  {
    id: "sub-5",
    name: "Tất leo núi",
    image: "",
    productCount: 4,
    isActive: false,
  },
];

const AdminProductsCategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const [subcategories, setSubcategories] = useState<Subcategory[]>(
    DEFAULT_SUBCATEGORIES
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const categoryName =
    CATEGORY_NAMES[categoryId || ""] || "Danh mục chưa xác định";

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubcategories(subcategories.map((sub) => sub.id));
    } else {
      setSelectedSubcategories([]);
    }
  };

  const handleSelectSubcategory = (subcategoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubcategories((prev) => [...prev, subcategoryId]);
    } else {
      setSelectedSubcategories((prev) =>
        prev.filter((id) => id !== subcategoryId)
      );
    }
  };

  const handleToggleActive = (subcategoryId: string) => {
    setSubcategories((prev) =>
      prev.map((sub) =>
        sub.id === subcategoryId ? { ...sub, isActive: !sub.isActive } : sub
      )
    );
  };

  const handleViewDetails = (subcategoryId: string) => {
    navigate(
      `/admin/products/categories/${categoryId}/subcategories/${subcategoryId}`
    );
  };

  const handleDeleteSelected = () => {
    if (selectedSubcategories.length > 0) {
      console.log("Deleting subcategories:", selectedSubcategories);
      setSubcategories((prev) =>
        prev.filter((sub) => !selectedSubcategories.includes(sub.id))
      );
      setSelectedSubcategories([]);
    }
  };

  const handleAddSubcategory = () => {
    setShowAddSubcategoryModal(true);
    setNewSubcategoryName("");
  };

  const handleCloseAddModal = () => {
    setShowAddSubcategoryModal(false);
    setNewSubcategoryName("");
  };

  const handleConfirmAddSubcategory = () => {
    if (newSubcategoryName.trim()) {
      const newSubcategory: Subcategory = {
        id: `sub-${Date.now()}`,
        name: newSubcategoryName.trim(),
        image: "",
        productCount: 0,
        isActive: true,
      };
      setSubcategories((prev) => [...prev, newSubcategory]);
      setShowAddSubcategoryModal(false);
      setNewSubcategoryName("");
    }
  };

  const handleEditName = (subcategoryId: string, currentName: string) => {
    setEditingId(subcategoryId);
    setEditingName(currentName);
  };

  const handleSaveName = (subcategoryId: string) => {
    if (editingName.trim()) {
      setSubcategories((prev) =>
        prev.map((sub) =>
          sub.id === subcategoryId ? { ...sub, name: editingName.trim() } : sub
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

  return (
    <div className="flex flex-col gap-[8px] items-center px-0 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
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
          <h1 className="font-bold text-[#272424] text-[24px] leading-normal">
            {categoryName}
          </h1>
        </div>
        <Button
          onClick={handleAddSubcategory}
          className="h-[36px] px-4 flex items-center gap-2"
        >
          <span className="text-[18px] leading-none font-light">+</span>
          Thêm danh mục con
        </Button>
      </div>

      {/* Subcategory Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[24px] py-[24px] rounded-[24px] w-full">
        <div className="border border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full">
          {/* Header */}
          <div className="bg-[#f6f6f6] flex items-center px-[15px] rounded-tl-[24px] rounded-tr-[24px] w-full min-h-[60px]">
            <div className="flex flex-row items-center w-full">
              <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] flex-1 min-w-[260px]">
                <CustomCheckbox
                  checked={
                    subcategories.length > 0 &&
                    selectedSubcategories.length === subcategories.length
                  }
                  onChange={handleSelectAll}
                />
                <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                  {selectedSubcategories.length > 0
                    ? `Đã chọn ${selectedSubcategories.length} danh mục`
                    : "Tên danh mục con"}
                </span>
                {selectedSubcategories.length > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handleDeleteSelected}
                    className="h-[36px] ml-2"
                  >
                    Xóa
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-[80px_80px_auto] gap-[30px] items-center px-[5px] py-[14px] min-w-[320px]">
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] text-center ${
                    selectedSubcategories.length > 0 ? "invisible" : ""
                  }`}
                >
                  SL sản phẩm
                </span>
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] text-center ${
                    selectedSubcategories.length > 0 ? "invisible" : ""
                  }`}
                >
                  Bật/Tắt
                </span>
                <span
                  className={`font-semibold text-[#272424] text-[14px] leading-[1.5] ${
                    selectedSubcategories.length > 0 ? "invisible" : ""
                  } justify-self-end`}
                >
                  Thao tác
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          {subcategories.map((subcategory, index) => (
            <div
              key={subcategory.id}
              className={`border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[15px] py-0 w-full ${
                index === subcategories.length - 1
                  ? "border-transparent"
                  : "border-[#e7e7e7]"
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-center w-full">
                <div className="flex flex-row items-center w-full">
                  <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] flex-1 min-w-[260px]">
                    <CustomCheckbox
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onChange={(checked) =>
                        handleSelectSubcategory(subcategory.id, checked)
                      }
                    />
                    <div className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden bg-gray-100 flex-shrink-0">
                      {subcategory.image ? (
                        <img
                          src={subcategory.image}
                          alt={subcategory.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#ffeeea] border-2 border-dashed border-[#e04d30]">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19Z"
                              stroke="#e04d30"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 16L8 11L13 16M11 14L13.5 11.5L21 19"
                              stroke="#e04d30"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.5 8C9.32843 8 10 7.32843 10 6.5C10 5.67157 9.32843 5 8.5 5C7.67157 5 7 5.67157 7 6.5C7 7.32843 7.67157 8 8.5 8Z"
                              stroke="#e04d30"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      {editingId === subcategory.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 p-2 border-2 border-[#e04d30] rounded-[8px] text-[12px] font-semibold text-[#272424] font-montserrat outline-none focus:border-[#c43d20]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveName(subcategory.id);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                          />
                          {/* Save Button */}
                          <button
                            onClick={() => handleSaveName(subcategory.id)}
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
                            {subcategory.name}
                          </span>
                          <button
                            onClick={() =>
                              handleEditName(subcategory.id, subcategory.name)
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
                  <div className="grid grid-cols-[80px_80px_auto] gap-[30px] justify-items-center items-center px-[5px] py-[14px] min-w-[320px]">
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.5]">
                      {subcategory.productCount}
                    </span>
                    <ToggleSwitch
                      checked={subcategory.isActive}
                      onChange={() => handleToggleActive(subcategory.id)}
                    />
                    <button
                      onClick={() => handleViewDetails(subcategory.id)}
                      className="font-bold text-[14px] text-[#1a71f6] leading-[1.5] hover:opacity-70 transition-opacity whitespace-nowrap justify-self-end"
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
            <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
              Đang hiển thị 1 - {subcategories.length} trong tổng 1 trang
            </p>
          </div>
          <div className="flex gap-[16px] items-start">
            <div className="flex gap-[13px] items-center">
              <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
                Trang số
              </p>
              <div className="flex gap-[2px] items-center pl-[8px] pr-[6px] py-[4px] rounded-[8px]">
                <p className="font-normal text-[12px] text-[#272424] leading-[1.5]">
                  1
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subcategory Modal */}
      {showAddSubcategoryModal && (
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
                Thêm danh mục con
              </h2>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-1 items-start justify-center px-3">
              <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Tên danh mục con
              </label>
              <FormInput
                placeholder="Nhập tên danh mục con"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmAddSubcategory();
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
              <Button onClick={handleConfirmAddSubcategory}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsCategoryDetail;
