import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/icons";
import ImageUpload from "@/components/ui/image-upload";

// Generate all combinations of attribute values (cartesian product)
const generateCombinations = (
  arrs: string[][],
  index: number = 0,
  current: string[] = []
): string[][] => {
  if (index === arrs.length) {
    return [current];
  }

  const result: string[][] = [];
  for (const value of arrs[index]) {
    result.push(...generateCombinations(arrs, index + 1, [...current, value]));
  }
  return result;
};

// Fake data for versions (6 rows as per Figma design)
const FAKE_VERSIONS = [
  {
    id: "fake-1",
    combination: ["40", "Xám"],
    name: "40 / Xám",
    price: "150000",
    inventory: "50",
    available: "45",
  },
  {
    id: "fake-2",
    combination: ["40", "Xanh đậm"],
    name: "40 / Xanh đậm",
    price: "150000",
    inventory: "30",
    available: "28",
  },
  {
    id: "fake-3",
    combination: ["41", "Xám"],
    name: "41 / Xám",
    price: "160000",
    inventory: "45",
    available: "40",
  },
  {
    id: "fake-4",
    combination: ["41", "Xanh đậm"],
    name: "41 / Xanh đậm",
    price: "160000",
    inventory: "35",
    available: "32",
  },
  {
    id: "fake-5",
    combination: ["42", "Xám"],
    name: "42 / Xám",
    price: "170000",
    inventory: "40",
    available: "38",
  },
  {
    id: "fake-6",
    combination: ["42", "Xanh đậm"],
    name: "42 / Xanh đậm",
    price: "170000",
    inventory: "25",
    available: "22",
  },
];

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

  const [versions, setVersions] = useState<
    Array<{
      id: string;
      combination: string[];
      name: string;
      price: string;
      inventory: string;
      available: string;
    }>
  >([]);
  const [selectedVersions, setSelectedVersions] = useState<Set<string>>(
    new Set()
  );
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeValues, setBarcodeValues] = useState<Record<string, string>>(
    {}
  );
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceValues, setPriceValues] = useState<Record<string, string>>({});
  const [applyAllPrice, setApplyAllPrice] = useState("");

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
    setVersions([]);
    setSelectedVersions(new Set());
  };

  // Update versions when attributes change
  React.useEffect(() => {
    if (
      attributes.length === 0 ||
      attributes.some((attr) => attr.values.length === 0)
    ) {
      // Show fake versions when no attributes
      setVersions(FAKE_VERSIONS);
      return;
    }

    const valueArrays = attributes.map((attr) => attr.values);
    const combinations = generateCombinations(valueArrays);

    setVersions((prevVersions) => {
      const newVersions = combinations.map((combination, index) => {
        const name = combination.join(" / ");
        const versionId = `version-${index}`;
        const existing = prevVersions.find((v) => v.name === name);

        return {
          id: versionId,
          combination,
          name,
          price: existing?.price || "",
          inventory: existing?.inventory || "",
          available: existing?.available || "",
        };
      });
      // Add fake versions to the generated ones
      return [...newVersions, ...FAKE_VERSIONS];
    });
  }, [attributes]);

  const handleVersionToggle = (versionId: string) => {
    setSelectedVersions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVersions(new Set(versions.map((v) => v.id)));
    } else {
      setSelectedVersions(new Set());
    }
  };

  const handleEditBarcode = () => {
    // Initialize barcode values for selected versions
    const initialValues: Record<string, string> = {};
    selectedVersions.forEach((versionId) => {
      const version = versions.find((v) => v.id === versionId);
      if (version) {
        initialValues[versionId] = ""; // You can set existing barcode here if available
      }
    });
    setBarcodeValues(initialValues);
    setShowBarcodeModal(true);
  };

  const handleBarcodeChange = (versionId: string, value: string) => {
    setBarcodeValues((prev) => ({
      ...prev,
      [versionId]: value,
    }));
  };

  const handleBarcodeCancel = () => {
    setShowBarcodeModal(false);
    setBarcodeValues({});
  };

  const handleBarcodeConfirm = () => {
    // TODO: Save barcode values
    console.log("Barcode values:", barcodeValues);
    setShowBarcodeModal(false);
    setBarcodeValues({});
  };

  const handleEditPrice = () => {
    // Initialize price values for selected versions
    const initialValues: Record<string, string> = {};
    selectedVersions.forEach((versionId) => {
      const version = versions.find((v) => v.id === versionId);
      if (version) {
        initialValues[versionId] = version.price || ""; // Use existing price if available
      }
    });
    setPriceValues(initialValues);
    setApplyAllPrice("");
    setShowPriceModal(true);
  };

  const handlePriceChange = (versionId: string, value: string) => {
    setPriceValues((prev) => ({
      ...prev,
      [versionId]: value,
    }));
  };

  const handleApplyAllPrice = () => {
    if (applyAllPrice) {
      const updatedValues: Record<string, string> = {};
      selectedVersions.forEach((versionId) => {
        updatedValues[versionId] = applyAllPrice;
      });
      setPriceValues(updatedValues);
    }
  };

  const handlePriceCancel = () => {
    setShowPriceModal(false);
    setPriceValues({});
    setApplyAllPrice("");
  };

  const handlePriceConfirm = () => {
    // TODO: Save price values
    console.log("Price values:", priceValues);
    setShowPriceModal(false);
    setPriceValues({});
    setApplyAllPrice("");
  };

  const selectedCount = selectedVersions.size;

  return (
    <div className="w-full h-full flex flex-col gap-3">
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
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={9}
          maxSizeInMB={2}
          required={true}
        />

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

        {/* Version Section - Show when attributes are added */}
        {showAttributes && attributes.length > 0 && versions.length > 0 && (
          <div className="bg-white border border-[#e7e7e7] rounded-[24px] py-6 flex flex-col gap-4">
            <div className="flex items-center gap-1 px-6">
              <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
                Phiên bản
              </h2>
            </div>

            {/* Filter Section */}
            <div className="flex gap-6 items-center px-6">
              <div className="flex items-center gap-[10px]">
                <span className="text-[10px] font-medium text-[#272424] font-montserrat leading-[140%]">
                  Bộ lọc:
                </span>
              </div>
              {attributes.map((attr, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity">
                      <span className="text-[10px] font-medium text-[#e04d30] font-montserrat leading-[140%]">
                        {attr.name}
                      </span>
                      <ChevronDown className="w-6 h-6 text-[#322f30]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {attr.values.map((value, valueIndex) => (
                      <DropdownMenuItem key={valueIndex}>
                        {value}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>

            {/* Versions Table */}
            <div className="bg-white rounded-[16px] flex flex-col">
              {/* Header Row */}
              <div className="flex items-start border-b border-[#e7e7e7]">
                <div className="flex-1 flex gap-2 items-center px-3 py-[14px]">
                  <CustomCheckbox
                    checked={
                      versions.length > 0 &&
                      selectedVersions.size === versions.length
                    }
                    onChange={handleSelectAll}
                  />
                  <p className="text-[14px] font-bold text-[#272424] font-montserrat">
                    {selectedCount > 0
                      ? `Đã chọn ${selectedCount} phiên bản`
                      : `${versions.length} phiên bản`}
                  </p>
                </div>
                {selectedCount > 0 && (
                  <div className="flex flex-col gap-2 items-end justify-center p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="border-2 border-[#e04d30] flex items-center gap-[4px] px-[24px] py-[12px] rounded-[12px] cursor-pointer hover:opacity-70 transition-opacity">
                          <span className="text-[14px] font-semibold text-[#e04d30] font-montserrat leading-[140%]">
                            Chỉnh sửa
                          </span>
                          <ChevronDown className="w-6 h-6 text-[#e04d30]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleEditBarcode}>
                          Chỉnh sửa mã vạch/barcode
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEditPrice}>
                          Chỉnh sửa giá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {/* Version Rows */}
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`flex items-start ${
                    index < versions.length - 1
                      ? "border-b border-[#e7e7e7]"
                      : ""
                  }`}
                >
                  <div className="w-[400px] flex gap-2 items-center px-3 py-[14px]">
                    <CustomCheckbox
                      checked={selectedVersions.has(version.id)}
                      onChange={() => handleVersionToggle(version.id)}
                    />
                    <p className="text-[14px] font-medium text-[#272424] font-montserrat leading-[140%]">
                      {version.name}
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 items-end justify-center px-3 py-[14px]">
                    <p className="text-[12px] font-medium text-[#272424] font-montserrat leading-[140%]">
                      Giá bán: {version.price || "0"}đ
                    </p>
                    <p className="text-[12px] font-medium text-[#272424] font-montserrat leading-[140%]">
                      Tồn kho : {version.inventory || "0"}, Có thể bán :{" "}
                      {version.available || "0"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Barcode Edit Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur and dark overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleBarcodeCancel}
          />
          {/* Modal Content */}
          <div
            className="relative z-50 bg-white rounded-[24px] w-full max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <h2 className="text-[24px] font-bold text-[#272424] font-montserrat">
                Chỉnh sửa mã vạch/barcode
              </h2>
              <button
                onClick={handleBarcodeCancel}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#322f30"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content - Scrollable list */}
            <div className="flex-1 overflow-y-auto">
              {Array.from(selectedVersions).map((versionId, index) => {
                const version = versions.find((v) => v.id === versionId);
                if (!version) return null;

                return (
                  <div
                    key={versionId}
                    className={`flex items-center justify-between px-6 py-6 ${
                      index > 0 ? "border-t border-[#d1d1d1]" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <p className="text-[16px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                        {version.name}
                      </p>
                    </div>
                    <div className="w-[315px]">
                      <FormInput
                        placeholder="Nhập mã vạch/barcode"
                        value={barcodeValues[versionId] || ""}
                        onChange={(e) =>
                          handleBarcodeChange(versionId, e.target.value)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-[10px] px-6 py-3 border-t border-[#d1d1d1]">
              <Button variant="secondary" onClick={handleBarcodeCancel}>
                Huỷ
              </Button>
              <Button onClick={handleBarcodeConfirm}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}

      {/* Price Edit Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur and dark overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handlePriceCancel}
          />
          {/* Modal Content */}
          <div
            className="relative z-50 bg-white rounded-[24px] w-full max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <h2 className="text-[24px] font-bold text-[#272424] font-montserrat">
                Chỉnh sửa giá bán
              </h2>
              <button
                onClick={handlePriceCancel}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#322f30"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Apply to All Section */}
            <div className="flex items-end justify-between px-6 py-3 border-t border-[#d1d1d1]">
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-[16px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Áp dụng 1 giá cho tất cả phiên bản
                </p>
                <div className="w-full">
                  <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[52px]">
                    <input
                      type="text"
                      placeholder="0"
                      value={applyAllPrice}
                      onChange={(e) => setApplyAllPrice(e.target.value)}
                      className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className="w-px h-6 bg-[#888888]"></div>
                      <span className="text-[14px] font-semibold text-[#888888] font-montserrat">
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleApplyAllPrice} className="ml-4 h-[52px]">
                Áp dụng cho tất cả
              </Button>
            </div>

            {/* Content - Scrollable list */}
            <div className="flex-1 overflow-y-auto">
              {Array.from(selectedVersions).map((versionId, index) => {
                const version = versions.find((v) => v.id === versionId);
                if (!version) return null;

                return (
                  <div
                    key={versionId}
                    className={`flex items-center justify-between px-6 py-6 ${
                      index > 0 ? "border-t border-[#d1d1d1]" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <p className="text-[16px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                        {version.name}
                      </p>
                    </div>
                    <div className="w-[315px]">
                      <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[52px]">
                        <input
                          type="text"
                          placeholder="0"
                          value={priceValues[versionId] || ""}
                          onChange={(e) =>
                            handlePriceChange(versionId, e.target.value)
                          }
                          className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat"
                        />
                        <div className="flex items-center gap-2.5">
                          <div className="w-px h-6 bg-[#888888]"></div>
                          <span className="text-[14px] font-semibold text-[#888888] font-montserrat">
                            đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-[10px] px-6 py-3 border-t border-[#d1d1d1]">
              <Button variant="secondary" onClick={handlePriceCancel}>
                Huỷ
              </Button>
              <Button onClick={handlePriceConfirm}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsNew;
