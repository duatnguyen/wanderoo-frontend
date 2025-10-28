import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import FormInput from "../../components/ui/form-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Icon } from "../../components/icons";

const AdminProductsNew: React.FC = () => {
  const [formData, setFormData] = useState({
    productName: "",
    barcode: "",
    category: "",
    brand: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    inventory: "",
    available: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const [showAttributes, setShowAttributes] = useState(false);
  const [attributes, setAttributes] = useState<
    Array<{ name: string; values: string[] }>
  >([]);
  const [currentAttribute, setCurrentAttribute] = useState({
    name: "",
    value: "",
  });

  const [images, setImages] = useState<
    Array<{ id: string; url: string; file?: File }>
  >([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  const handleAddAttribute = () => {
    setShowAttributes(true);
  };

  const handleAttributeNameChange = (value: string) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleAttributeValueChange = (value: string) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      value: value,
    }));
  };

  const handleAddAttributeValue = () => {
    if (currentAttribute.name && currentAttribute.value) {
      // Check if attribute name already exists
      const existingAttrIndex = attributes.findIndex(
        (attr) => attr.name === currentAttribute.name
      );

      if (existingAttrIndex !== -1) {
        // Add value to existing attribute
        setAttributes((prev) => {
          const updated = [...prev];
          updated[existingAttrIndex] = {
            ...updated[existingAttrIndex],
            values: [
              ...updated[existingAttrIndex].values,
              currentAttribute.value,
            ],
          };
          return updated;
        });
      } else {
        // Create new attribute with value
        setAttributes((prev) => [
          ...prev,
          { name: currentAttribute.name, values: [currentAttribute.value] },
        ]);
      }

      setCurrentAttribute({ name: currentAttribute.name, value: "" });
    }
  };

  const handleRemoveAttribute = (index: number) => {
    console.log("Removing attribute at index:", index);
    console.log("Current attributes:", attributes);
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    console.log("Updated attributes:", updatedAttributes);
    setAttributes(updatedAttributes);

    // If no attributes left, go back to sales information form
    if (updatedAttributes.length === 0) {
      console.log("No attributes left, reverting to sales info");
      setShowAttributes(false);
      setCurrentAttribute({ name: "", value: "" });
    }
  };

  const handleRemoveAttributeValue = (
    attrIndex: number,
    valueIndex: number
  ) => {
    setAttributes((prev) => {
      const updated = [...prev];
      const newValues = updated[attrIndex].values.filter(
        (_, i) => i !== valueIndex
      );

      if (newValues.length === 0) {
        // If no values left, remove the entire attribute
        const filteredAttributes = updated.filter((_, i) => i !== attrIndex);

        // If no attributes left after removing this one, revert to sales info
        if (filteredAttributes.length === 0) {
          setShowAttributes(false);
          setCurrentAttribute({ name: "", value: "" });
        }

        return filteredAttributes;
      } else {
        updated[attrIndex] = {
          ...updated[attrIndex],
          values: newValues,
        };
        return updated;
      }
    });
  };

  const handleAddAnotherAttribute = () => {
    setCurrentAttribute({ name: "", value: "" });
  };

  const handleCancelAttributes = () => {
    console.log("Canceling attributes, reverting to sales info");
    setShowAttributes(false);
    setAttributes([]);
    setCurrentAttribute({ name: "", value: "" });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: Array<{ id: string; url: string; file: File }> = [];
    const remainingSlots = 9 - images.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} vượt quá dung lượng 2MB`);
        continue;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} không phải là file hình ảnh`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push({
            id: `${Date.now()}-${i}`,
            url: e.target.result as string,
            file: file,
          });

          if (newImages.length === Math.min(files.length, remainingSlots)) {
            setImages((prev) => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 px-[50px] py-8">
      {/* Header */}
      <div className="w-full flex items-center gap-2">
        <button className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity">
          <Icon name="arrow-left" size={24} />
        </button>
        <h1 className="text-[24px] font-bold text-[#272424] font-montserrat leading-[100%]">
          Thêm sản phẩm mới
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[22px] w-full">
        {/* Image Upload Section */}
        <div className="w-full">
          <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                  *
                </span>
                <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
                  Hình ảnh sản phẩm
                </h2>
              </div>
              <p className="text-[10px] font-medium text-[#272424] font-montserrat leading-[140%]">
                <span className="text-[#eb2b0b]">Note:</span>
                <span>
                  {" "}
                  Kéo thả hoặc thêm ảnh từ URL, tải ảnh lên từ thiết bị (Dung
                  lượng ảnh tối đa 2MB)
                </span>
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              {/* Display uploaded images */}
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative bg-white border-2 border-dashed border-[#e04d30] rounded-[8px] w-[120px] h-[120px] overflow-hidden group"
                >
                  <img
                    src={image.url}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Icon name="close" size={16} color="white" />
                  </button>
                </div>
              ))}

              {/* Add image button - only show if less than 9 images */}
              {images.length < 9 && (
                <div
                  onClick={handleImageClick}
                  className="bg-[#ffeeea] border-2 border-dashed border-[#e04d30] rounded-[8px] w-[120px] h-[120px] flex flex-col items-center justify-center gap-2 p-5 cursor-pointer hover:bg-[#ffe4dd] transition-colors"
                >
                  <Icon name="image" size={32} />
                  <p className="text-[10px] font-medium text-[#737373] font-montserrat text-center">
                    Thêm hình ảnh ({images.length}/9)
                  </p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
            Thông tin cơ bản
          </h2>

          <div className="flex flex-col gap-4">
            {/* Product Name and Barcode */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                    *
                  </span>
                  <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                    Tên sản phẩm
                  </label>
                </div>
                <FormInput
                  placeholder="Nhập tên sản phẩm"
                  value={formData.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Mã vạch/barcode
                </label>
                <FormInput
                  placeholder="Nhập mã vạch"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                />
              </div>
            </div>

            {/* Category and Brand */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Danh mục
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="bg-white border-2 border-[#e04d30] flex items-center justify-between p-4 rounded-[12px] w-full h-[52px]">
                      <span className="text-[12px] font-semibold text-[#888888]">
                        Chọn danh mục
                      </span>
                      <ChevronDown className="w-6 h-6 text-[#322f30]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem>Thể thao</DropdownMenuItem>
                    <DropdownMenuItem>Thời trang</DropdownMenuItem>
                    <DropdownMenuItem>Điện tử</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                    *
                  </span>
                  <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                    Thương hiệu
                  </label>
                </div>
                <FormInput
                  placeholder="Nhập thương hiệu"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                  *
                </span>
                <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Mô tả sản phẩm
                </label>
              </div>
              <textarea
                className="bg-white border-2 border-[#e04d30] p-4 rounded-[12px] w-full h-[141px] resize-none outline-none text-[12px] font-semibold placeholder:text-[#888888] text-[#888888]"
                placeholder="Nhập mô tả sản phẩm"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Sales Information Section - Conditionally render based on showAttributes */}
        {!showAttributes ? (
          <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
            <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
              Thông tin bán hàng
            </h2>

            <div className="flex flex-col gap-4">
              {/* Attributes Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <h3 className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                    Thuộc tính
                  </h3>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z"
                      fill="#322f30"
                    />
                  </svg>
                </div>
                <Button
                  variant="secondary"
                  className="w-fit"
                  type="button"
                  onClick={handleAddAttribute}
                >
                  Thêm thuộc tính
                </Button>
              </div>

              {/* Cost Price and Selling Price */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                      *
                    </span>
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Giá vốn
                    </label>
                  </div>
                  <FormInput
                    placeholder="Nhập giá vốn"
                    value={formData.costPrice}
                    onChange={(e) =>
                      handleInputChange("costPrice", e.target.value)
                    }
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                      *
                    </span>
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Giá bán
                    </label>
                  </div>
                  <FormInput
                    placeholder="Nhập giá bán"
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      handleInputChange("sellingPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Inventory and Available */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                      *
                    </span>
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Tồn kho
                    </label>
                  </div>
                  <FormInput
                    placeholder="Nhập số lượng tồn kho"
                    value={formData.inventory}
                    onChange={(e) =>
                      handleInputChange("inventory", e.target.value)
                    }
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                      *
                    </span>
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Có thể bán
                    </label>
                  </div>
                  <FormInput
                    placeholder="Nhập số lượng có thể bán"
                    value={formData.available}
                    onChange={(e) =>
                      handleInputChange("available", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Attributes Section - Replaces entire Sales Information when attributes are added */
          <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
                Thuộc tính
              </h2>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z"
                  fill="#322f30"
                />
              </svg>
            </div>

            {/* Attribute Name and Value Input */}
            <div className="flex gap-4 items-end">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Tên thuộc tính
                </label>
                <FormInput
                  placeholder="Nhập tên thuộc tính"
                  value={currentAttribute.name}
                  onChange={(e) => handleAttributeNameChange(e.target.value)}
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Giá trị
                </label>
                <div className="flex gap-[9px] items-center">
                  <FormInput
                    placeholder="Nhập kí tự và ấn enter"
                    value={currentAttribute.value}
                    onChange={(e) => handleAttributeValueChange(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAttributeValue();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCancelAttributes}
                    className="p-2 -m-2 flex items-center justify-center shrink-0 cursor-pointer hover:bg-red-50 rounded transition-all"
                    style={{ minWidth: "32px", minHeight: "32px" }}
                    title="Hủy thuộc tính"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ pointerEvents: "none" }}
                    >
                      <path
                        d="M3 6H5H21"
                        stroke="#322f30"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                        stroke="#322f30"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Add Another Attribute Button */}
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={handleAddAnotherAttribute}
                className="flex items-center gap-0 cursor-pointer hover:opacity-70 transition-opacity"
              >
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path
                    d="M12.5 5V20M5 12.5H20"
                    stroke="#1a71f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[14px] font-bold text-[#1a71f6] font-montserrat">
                  Thêm thuộc tính khác
                </span>
              </button>
            </div>

            {/* Display Added Attributes */}
            {attributes.length > 0 && (
              <div className="flex flex-col gap-4">
                {attributes.map((attr, attrIndex) => (
                  <div
                    key={attrIndex}
                    className="flex gap-4 items-center justify-between"
                  >
                    <div className="flex gap-4 items-center flex-1">
                      {/* Attribute Name */}
                      <div className="flex-shrink-0">
                        <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-4 py-3 min-w-[200px]">
                          <span className="text-[14px] font-semibold text-[#272424] font-montserrat">
                            {attr.name}
                          </span>
                        </div>
                      </div>

                      {/* Attribute Values as Chips */}
                      <div className="flex-1">
                        <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-4 py-3 flex flex-wrap gap-2 items-center min-h-[52px]">
                          {attr.values.map((value, valueIndex) => (
                            <div
                              key={valueIndex}
                              className="bg-[#f5f5f5] rounded-[8px] px-3 py-1 flex items-center gap-2 border border-[#e7e7e7]"
                            >
                              <span className="text-[14px] font-semibold text-[#272424] font-montserrat">
                                {value}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveAttributeValue(
                                    attrIndex,
                                    valueIndex
                                  )
                                }
                                className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path
                                    d="M9 3L3 9M3 3L9 9"
                                    stroke="#737373"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Delete Entire Attribute Button */}
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Button clicked! Index:", attrIndex);
                        handleRemoveAttribute(attrIndex);
                      }}
                      className="p-2 -m-2 flex items-center justify-center shrink-0 cursor-pointer hover:bg-red-50 rounded transition-all"
                      style={{ minWidth: "32px", minHeight: "32px" }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ pointerEvents: "none" }}
                      >
                        <path
                          d="M3 6H5H21"
                          stroke="#322f30"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                          stroke="#322f30"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shipping Section */}
        <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
            Vận chuyển
          </h2>

          <div className="flex flex-col gap-4">
            {/* Weight */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-bold text-[#ff0000] font-montserrat">
                  *
                </span>
                <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Cân nặng (Sau khi đóng gói)
                </label>
              </div>
              <FormInput
                placeholder="Nhập vào"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            {/* Package Dimensions */}
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu bạn
                nhập sai kích thước)
              </p>

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="bg-white border-2 border-[#e04d30] flex items-center justify-between p-4 rounded-[12px] h-[52px]">
                    <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                      R
                    </span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-px h-full bg-[#b0b0b0]"></div>
                      <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                        cm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="bg-white border-2 border-[#e04d30] flex items-center justify-between p-4 rounded-[12px] h-[52px]">
                    <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                      D
                    </span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-px h-full bg-[#b0b0b0]"></div>
                      <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                        cm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="bg-white border-2 border-[#e04d30] flex items-center justify-between p-4 rounded-[12px] h-[52px]">
                    <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                      C
                    </span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-px h-full bg-[#b0b0b0]"></div>
                      <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                        cm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <Button variant="secondary" onClick={handleCancel}>
            Huỷ
          </Button>
          <Button type="submit">Thêm sản phẩm</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductsNew;
