import React, { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageContainer, ContentCard } from "@/components/common";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import FormField from "@/components/ui/FormField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/components/icons";
import ImageUpload from "@/components/ui/image-upload";
import type {
  ProductFormData,
  ProductAttribute,
  CurrentAttribute,
  ProductVersion,
  EditingVersion,
  ProductImage,
  FormErrors,
} from "@/types/product";
import { validateForm, validateField } from "@/utils/productValidation";
import "@/styles/animations.css";

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
  const [formData, setFormData] = useState<ProductFormData>({
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
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [currentAttributes, setCurrentAttributes] = useState<
    CurrentAttribute[]
  >([{ name: "", value: "" }]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [versions, setVersions] = useState<ProductVersion[]>([]);
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
  const [showEditVersionModal, setShowEditVersionModal] = useState(false);
  const [editingVersion, setEditingVersion] = useState<EditingVersion | null>(
    null
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const editVersionFileInputRef = useRef<HTMLInputElement>(null);
  const [isComposingMap, setIsComposingMap] = useState<Record<number, boolean>>(
    {}
  );
  const [brandOptions, setBrandOptions] = useState<string[]>([
    "Nike",
    "Adidas",
    "Puma",
    "New Balance",
  ]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  // Form steps for progress indicator
  const formSteps = [
    "Thông tin cơ bản",
    "Thuộc tính & Phiên bản",
    "Thông tin vận chuyển",
    "Hoàn thành",
  ];

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }

      // Real-time validation for specific fields
      const fieldError = validateField(field, value);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [field]: fieldError,
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      const formErrors = validateForm(formData);

      // Check if images are required and missing
      if (images.length === 0) {
        formErrors.images = "Vui lòng tải lên ít nhất một hình ảnh sản phẩm";
      }

      setErrors(formErrors);

      if (Object.keys(formErrors).length > 0) {
        console.log("Form has errors:", formErrors);
        return;
      }

      setIsSubmitting(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Form submitted successfully:", formData);

        // Reset form or navigate to products list
        // navigate('/admin/products');
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors({
          submit: "Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, images]
  );

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  const handleBrandModalClose = () => {
    setShowBrandModal(false);
    setNewBrandName("");
  };

  const handleBrandSubmit = () => {
    const trimmed = newBrandName.trim();
    if (!trimmed) {
      return;
    }

    const existing = brandOptions.find(
      (brand) => brand.toLowerCase() === trimmed.toLowerCase()
    );

    const finalName = existing ?? trimmed;

    if (!existing) {
      setBrandOptions((prev) => [...prev, finalName]);
    }

    handleInputChange("brand", finalName);
    handleBrandModalClose();
  };

  const handleAddAttribute = () => {
    setShowAttributes(true);
    // Ensure there is at least one empty row ready for input
    setCurrentAttributes((prev) =>
      prev && prev.length > 0 ? prev : [{ name: "", value: "" }]
    );
  };

  const handleAttributeNameChange = (index: number, value: string) => {
    setCurrentAttributes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: value };
      return updated;
    });
  };

  const handleAttributeValueChange = (index: number, value: string) => {
    setCurrentAttributes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], value };
      return updated;
    });
  };

  const handleAddAttributeValue = (index: number) => {
    const currentAttribute = currentAttributes[index];
    const rawValue = currentAttribute?.value ?? "";
    const newValue = rawValue.trim();
    if (currentAttribute && currentAttribute.name && newValue) {
      // Check if attribute name already exists
      const existingAttrIndex = attributes.findIndex(
        (attr) => attr.name === currentAttribute.name
      );

      if (existingAttrIndex !== -1) {
        // Add value to existing attribute
        setAttributes((prev) => {
          const updated = [...prev];
          const existingValues = updated[existingAttrIndex].values;
          // Prevent duplicates (case-sensitive to keep exactly what user typed)
          if (!existingValues.includes(newValue)) {
            updated[existingAttrIndex] = {
              ...updated[existingAttrIndex],
              values: [...existingValues, newValue],
            };
          }
          return updated;
        });
      } else {
        // Create new attribute with value
        setAttributes((prev) => [
          ...prev,
          { name: currentAttribute.name, values: [newValue] },
        ]);
      }

      // Clear the input after adding so user sees chip and can type tiếp
      setCurrentAttributes((prev) => {
        const updated = [...prev];
        updated[index] = { name: currentAttribute.name, value: "" };
        return updated;
      });
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
      setCurrentAttributes([{ name: "", value: "" }]);
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
          setCurrentAttributes([{ name: "", value: "" }]);
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
    setCurrentAttributes((prev) => [...prev, { name: "", value: "" }]);
  };

  const handleRemoveCurrentAttributeRow = (index: number) => {
    setCurrentAttributes((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // If no rows left, revert UI to sales information section
      if (updated.length === 0) {
        setShowAttributes(false);
        setAttributes([]);
        setVersions([]);
        setSelectedVersions(new Set());
      }
      return updated;
    });
  };

  // Removed: handleCancelAttributes (no longer used after multi-row input support)

  // Memoized version calculation
  const generatedVersions = useMemo(() => {
    if (
      attributes.length === 0 ||
      attributes.some((attr) => attr.values.length === 0)
    ) {
      return FAKE_VERSIONS;
    }

    const valueArrays = attributes.map((attr) => attr.values);
    const combinations = generateCombinations(valueArrays);

    const newVersions = combinations.map((combination, index) => {
      const name = combination.join(" / ");
      const versionId = `version-${index}`;

      return {
        id: versionId,
        combination,
        name,
        price: "",
        inventory: "",
        available: "",
      };
    });

    return [...newVersions, ...FAKE_VERSIONS];
  }, [attributes]);

  // Update versions when attributes change
  React.useEffect(() => {
    setVersions(generatedVersions);
  }, [generatedVersions]);

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

  const handleVersionRowClick = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setEditingVersion({
        id: version.id,
        name: version.name,
        barcode: "", // You can add barcode to version state if needed
        costPrice: "",
        sellingPrice: version.price || "",
        inventory: version.inventory || "",
        available: version.available || "",
        image: "",
      });
      setShowEditVersionModal(true);
    }
  };

  const handleEditVersionChange = (field: string, value: string) => {
    if (editingVersion) {
      setEditingVersion({
        ...editingVersion,
        [field]: value,
      });
    }
  };

  const handleEditVersionImageClick = () => {
    editVersionFileInputRef.current?.click();
  };

  const handleEditVersionImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editingVersion) return;

    if (file.size > 2 * 1024 * 1024) {
      alert(`${file.name} vượt quá dung lượng 2MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(`${file.name} không phải là file hình ảnh`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result && typeof result === "string" && editingVersion) {
        setEditingVersion({
          ...editingVersion,
          image: result,
        });
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleEditVersionCancel = () => {
    setShowEditVersionModal(false);
    setEditingVersion(null);
  };

  const handleEditVersionConfirm = () => {
    if (editingVersion) {
      // TODO: Save version data
      console.log("Version data:", editingVersion);
      setVersions((prev) =>
        prev.map((v) =>
          v.id === editingVersion.id
            ? {
                ...v,
                price: editingVersion.sellingPrice,
                inventory: editingVersion.inventory,
                available: editingVersion.available,
              }
            : v
        )
      );
      setShowEditVersionModal(false);
      setEditingVersion(null);
    }
  };

  const selectedCount = selectedVersions.size;

  // Update current step based on form progress
  React.useEffect(() => {
    if (formData.productName && formData.brand && formData.description) {
      setCurrentStep(1);
      if (showAttributes && attributes.length > 0) {
        setCurrentStep(2);
      }
      if (formData.weight) {
        setCurrentStep(3);
      }
    } else {
      setCurrentStep(0);
    }
  }, [formData, showAttributes, attributes]);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="flex items-center">
          <h1 className="text-[28px] font-bold text-[#272424] font-montserrat leading-[120%]">
            Thêm sản phẩm mới
          </h1>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          steps={formSteps}
          className="animate-fadeIn"
        />
      </div>

      <ContentCard>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[22px] w-full"
        >
          {/* Image Upload Section */}
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={9}
            maxSizeInMB={2}
            required={true}
          />

          {/* Basic Information Section */}
          <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-6 card-hover animate-slideIn">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#272424] font-montserrat">
                Thông tin cơ bản
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Product Name and Barcode */}
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  label="Tên sản phẩm"
                  required
                  error={errors.productName}
                  success={
                    !errors.productName && formData.productName.length > 2
                  }
                  hint="Tên sản phẩm nên ngắn gọn và dễ hiểu"
                  className="flex-1"
                >
                  <FormInput
                    placeholder="Nhập tên sản phẩm"
                    value={formData.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                    containerClassName={`h-[40px] px-4 transition-all duration-200 hover-lift input-focus-ring ${
                      errors.productName
                        ? "error-border"
                        : !errors.productName && formData.productName.length > 2
                          ? "success-border"
                          : ""
                    }`}
                  />
                </FormField>

                <FormField
                  label="Mã vạch/barcode"
                  error={errors.barcode}
                  hint="Có thể để trống, hệ thống sẽ tự tạo"
                  className="flex-1"
                >
                  <FormInput
                    placeholder="Nhập mã vạch"
                    value={formData.barcode}
                    onChange={(e) =>
                      handleInputChange("barcode", e.target.value)
                    }
                    containerClassName="h-[40px] px-4 transition-all duration-200 hover-lift input-focus-ring"
                  />
                </FormField>
              </div>

              {/* Category and Brand */}
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  label="Danh mục"
                  error={errors.category}
                  className="flex-1"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-white border-2 border-[#e04d30] flex items-center justify-between px-4 rounded-[12px] w-full h-[36px]">
                        <span className="text-[14px] font-semibold text-[#888888]">
                          {formData.category || "Chọn danh mục"}
                        </span>
                        <ChevronDown className="w-6 h-6 text-[#322f30]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          handleInputChange("category", "Thể thao")
                        }
                      >
                        Thể thao
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleInputChange("category", "Thời trang")
                        }
                      >
                        Thời trang
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleInputChange("category", "Điện tử")}
                      >
                        Điện tử
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormField>

                <FormField
                  label="Thương hiệu"
                  required
                  error={errors.brand}
                  className="flex-1"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-white border-2 border-[#e04d30] flex items-center justify-between px-4 rounded-[12px] w-full h-[36px]">
                        <span className="text-[14px] font-semibold text-[#888888]">
                          {formData.brand || "Chọn thương hiệu"}
                        </span>
                        <ChevronDown className="w-6 h-6 text-[#322f30]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      {brandOptions.map((brand) => (
                        <DropdownMenuItem
                          key={brand}
                          onClick={() => handleInputChange("brand", brand)}
                        >
                          {brand}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowBrandModal(true)}
                        className="text-[#E04D30] font-semibold flex items-center gap-2"
                      >
                        <Icon name="plus" size={16} color="#E04D30" />
                        Thêm thương hiệu mới
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormField>
              </div>

              {/* Description */}
              <FormField
                label="Mô tả sản phẩm"
                required
                error={errors.description}
              >
                <textarea
                  className="bg-white border-2 border-[#e04d30] p-4 rounded-[12px] w-full h-[141px] resize-none outline-none text-[14px] font-semibold placeholder:text-[#888888] text-[#888888]"
                  placeholder="Nhập mô tả sản phẩm"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </FormField>
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
                  </div>
                  <Button
                    variant="secondary"
                    className="w-fit flex items-center gap-2 text-[14px]"
                    type="button"
                    onClick={handleAddAttribute}
                  >
                    <Icon name="plus" size={16} color="#e04d30" />
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
                      containerClassName="h-[36px] px-4"
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
                      containerClassName="h-[36px] px-4"
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
                      containerClassName="h-[36px] px-4"
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
                      containerClassName="h-[36px] px-4"
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
              </div>

              {/* Column headers - keep labels close to inputs */}
              <div className="flex gap-4 items-center mb-0">
                <div className="w-[28%] min-w-[200px]">
                  <span className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                    Tên thuộc tính
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                    Giá trị
                  </span>
                </div>
              </div>

              {/* Attribute Name and Value Input - support multiple rows */}
              {currentAttributes.map((item, index) => (
                <div className="flex gap-4 items-start -mt-3" key={index}>
                  <div className="w-[28%] min-w-[200px] flex flex-col gap-0">
                    <FormInput
                      placeholder="Nhập tên thuộc tính"
                      value={item.name}
                      onChange={(e) =>
                        handleAttributeNameChange(index, e.target.value)
                      }
                      containerClassName="h-[36px] px-4"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-0">
                    <div className="flex gap-[9px] items-center">
                      {/* Chip input: show existing values for this attribute name */}
                      <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-2 py-[6px] flex flex-wrap items-center gap-2 w-full min-h-[36px]">
                        {(() => {
                          const attrIndex = attributes.findIndex(
                            (a) => a.name === item.name
                          );
                          const attr =
                            attrIndex >= 0 ? attributes[attrIndex] : null;
                          return attr
                            ? attr.values.map((value, valueIndex) => (
                                <div
                                  key={`${value}-${valueIndex}`}
                                  className="bg-[#eef3ff] rounded-[16px] px-3 py-1 flex items-center gap-2 border border-[#d1dbff]"
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
                              ))
                            : null;
                        })()}
                        <input
                          type="text"
                          placeholder="Nhập ký tự và ấn enter"
                          value={item.value}
                          onChange={(e) =>
                            handleAttributeValueChange(index, e.target.value)
                          }
                          onCompositionStart={() =>
                            setIsComposingMap((prev) => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                          onCompositionEnd={() =>
                            setIsComposingMap((prev) => ({
                              ...prev,
                              [index]: false,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !isComposingMap[index]) {
                              e.preventDefault();
                              handleAddAttributeValue(index);
                            }
                          }}
                          className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat min-w-[80px]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCurrentAttributeRow(index)}
                        className="p-2 -m-2 flex items-center justify-center shrink-0 cursor-pointer rounded transition-all text-[#737373] hover:text-[#1a71f6]"
                        style={{ minWidth: "32px", minHeight: "32px" }}
                        aria-label="Xoá dòng này"
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
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

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

              {/* Hidden list of added attributes as requested; values remain visible in inputs */}
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

              {/* Filter Section - removed per request */}

              {/* Versions Table */}
              <div className="bg-white rounded-[16px] flex flex-col px-6">
                {/* Header Row */}
                <div className="flex items-start border-b border-[#e7e7e7]">
                  <div className="w-[400px] flex gap-2 items-center px-3 py-[14px]">
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
                    <div className="flex-1 flex flex-col gap-2 items-end justify-center px-3 py-[14px]">
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
                    className={`flex items-start cursor-pointer hover:bg-gray-50 transition-colors ${
                      index < versions.length - 1
                        ? "border-b border-[#e7e7e7]"
                        : ""
                    }`}
                    onClick={() => handleVersionRowClick(version.id)}
                  >
                    <div className="w-[400px] flex gap-2 items-center px-3 py-[14px]">
                      <div onClick={(e) => e.stopPropagation()}>
                        <CustomCheckbox
                          checked={selectedVersions.has(version.id)}
                          onChange={() => handleVersionToggle(version.id)}
                        />
                      </div>
                      <p className="text-[14px] font-medium text-[#272424] font-montserrat leading-[140%]">
                        {version.name}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col gap-2 items-end justify-center px-3 py-[14px]">
                      <p className="text-[12px] font-medium text-[#272424] font-montserrat leading-[140%]">
                        Giá bán: {version.price || "0"}đ
                      </p>
                      <p className="text-[12px] font-medium text-[#272424] font-montserrat leading-[140%]">
                        Tồn kho: {version.inventory || "0"}, Có thể bán:{" "}
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
                <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[36px]">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Nhập vào"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat placeholder:text-[#b0b0b0]"
                  />
                  <div className="flex items-center gap-2.5 ml-2">
                    <div className="w-px h-6 bg-[#b0b0b0]"></div>
                    <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                      gram
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Dimensions */}
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                  Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu
                  bạn nhập sai kích thước)
                </p>

                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[36px]">
                      <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat mr-2">
                        R
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={formData.width}
                        onChange={(e) =>
                          handleInputChange("width", e.target.value)
                        }
                        className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat"
                      />
                      <div className="flex items-center gap-2.5 ml-2">
                        <div className="w-px h-6 bg-[#b0b0b0]"></div>
                        <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                          cm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[36px]">
                      <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat mr-2">
                        D
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={formData.length}
                        onChange={(e) =>
                          handleInputChange("length", e.target.value)
                        }
                        className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat"
                      />
                      <div className="flex items-center gap-2.5 ml-2">
                        <div className="w-px h-6 bg-[#b0b0b0]"></div>
                        <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat">
                          cm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[36px]">
                      <span className="text-[14px] font-semibold text-[#b0b0b0] font-montserrat mr-2">
                        C
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={formData.height}
                        onChange={(e) =>
                          handleInputChange("height", e.target.value)
                        }
                        className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat"
                      />
                      <div className="flex items-center gap-2.5 ml-2">
                        <div className="w-px h-6 bg-[#b0b0b0]"></div>
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

          {/* General Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-[12px] p-4">
              <p className="text-red-600 text-[14px] font-medium">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Images Error */}
          {errors.images && (
            <div className="bg-red-50 border border-red-200 rounded-[12px] p-4">
              <p className="text-red-600 text-[14px] font-medium">
                {errors.images}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {Object.keys(errors).length > 0 ? (
                <span className="text-red-500 animate-shake">
                  ⚠️ Vui lòng kiểm tra lại thông tin
                </span>
              ) : formData.productName &&
                formData.brand &&
                formData.description ? (
                <span className="text-green-600 animate-fadeIn">
                  ✅ Thông tin cơ bản đã đầy đủ
                </span>
              ) : (
                <span>Điền thông tin để tiếp tục</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="btn-secondary-enhanced"
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-enhanced px-8"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Đang lưu...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Thêm sản phẩm</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14m-7-7l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </ContentCard>

      {/* Add Brand Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleBrandModalClose}
          />
          <div
            className="relative z-50 bg-white rounded-[24px] w-full max-w-[420px] overflow-hidden shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4 border-b border-[#d1d1d1] flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#272424] font-montserrat">
                Thêm thương hiệu mới
              </h2>
              <button
                onClick={handleBrandModalClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
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
            <div className="px-6 py-6">
              <FormInput
                placeholder="Nhập tên thương hiệu"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleBrandSubmit();
                  }
                }}
                containerClassName="h-[40px] px-4"
              />
            </div>
            <div className="px-6 py-4 border-t border-[#d1d1d1] flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={handleBrandModalClose}>
                Hủy
              </Button>
              <Button onClick={handleBrandSubmit}>Thêm</Button>
            </div>
          </div>
        </div>
      )}

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
                        containerClassName="h-[36px] px-4"
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
                  <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[36px]">
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
              <Button onClick={handleApplyAllPrice} className="ml-4 h-[36px]">
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
                      <div className="bg-white border-2 border-[#e04d30] flex items-center px-4 rounded-[12px] h-[36px]">
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

      {/* Edit Version Modal */}
      {showEditVersionModal && editingVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur and dark overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleEditVersionCancel}
          />
          {/* Modal Content */}
          <div
            className="relative z-50 bg-[#f7f7f7] rounded-[24px] w-full max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center px-6 py-3 border-b border-[#e7e7e7]">
              <h2 className="text-[24px] font-bold text-[#1a1a1b] font-montserrat leading-[150%]">
                Chỉnh sửa {editingVersion.name}
              </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              <div className="flex gap-5 items-start">
                {/* Left Column - Form Fields */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* Barcode */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1">
                      <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[150%]">
                        Mã vạch/barcode
                      </label>
                    </div>
                    <FormInput
                      placeholder="Nhập mã vạch/barcode"
                      value={editingVersion.barcode}
                      onChange={(e) =>
                        handleEditVersionChange("barcode", e.target.value)
                      }
                      containerClassName="h-[36px] px-4"
                    />
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
                        value={editingVersion.costPrice}
                        onChange={(e) =>
                          handleEditVersionChange("costPrice", e.target.value)
                        }
                        containerClassName="h-[36px] px-4"
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
                        value={editingVersion.sellingPrice}
                        onChange={(e) =>
                          handleEditVersionChange(
                            "sellingPrice",
                            e.target.value
                          )
                        }
                        containerClassName="h-[36px] px-4"
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
                        value={editingVersion.inventory}
                        onChange={(e) =>
                          handleEditVersionChange("inventory", e.target.value)
                        }
                        containerClassName="h-[36px] px-4"
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
                        value={editingVersion.available}
                        onChange={(e) =>
                          handleEditVersionChange("available", e.target.value)
                        }
                        containerClassName="h-[36px] px-4"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="flex flex-col gap-6 items-center px-4 py-6">
                  <div
                    className={`bg-[#ffeeea] border border-[#e04d30] border-dashed flex flex-col gap-2 items-center justify-center rounded-[8px] w-[120px] h-[120px] ${editingVersion.image ? "" : "p-5"}`}
                  >
                    {editingVersion.image ? (
                      <img
                        src={editingVersion.image}
                        alt="Version"
                        className="w-full h-full object-cover rounded-[8px]"
                      />
                    ) : (
                      <>
                        <Icon name="image" size={32} color="#e04d30" />
                        <p className="text-[10px] font-medium text-[#737373] font-montserrat leading-[140%] text-center">
                          Thêm hình ảnh (0/9)
                        </p>
                      </>
                    )}
                  </div>
                  <Button onClick={handleEditVersionImageClick}>
                    Chọn ảnh
                  </Button>
                  <input
                    ref={editVersionFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditVersionImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-center gap-[10px] px-6 py-3 border-t border-[#e7e7e7]">
              <Button variant="secondary" onClick={handleEditVersionCancel}>
                Huỷ
              </Button>
              <Button onClick={handleEditVersionConfirm}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminProductsNew;
