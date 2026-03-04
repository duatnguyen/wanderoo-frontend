import React, { useState, useEffect } from "react";
import { Button } from "./button";

interface EditCategoryModalProps {
  isOpen: boolean;
  categoryName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  categoryName,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(categoryName);

  useEffect(() => {
    setName(categoryName);
  }, [categoryName]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-[24px] p-6 w-[500px] shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-[#272424] font-montserrat">
            Chỉnh sửa danh mục
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="#737373"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[#272424] font-montserrat">
              Tên danh mục
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border-2 border-[#e04d30] rounded-[12px] text-[14px] font-medium text-[#272424] font-montserrat outline-none focus:border-[#c43d20] transition-colors"
              placeholder="Nhập tên danh mục"
              autoFocus
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
