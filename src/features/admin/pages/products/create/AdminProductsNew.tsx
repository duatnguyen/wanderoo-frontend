import React, { useState, useRef, useCallback, useEffect } from "react";
import { Select, Spin, Pagination } from "antd";
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
  ProductVersion,
  EditingVersion,
  ProductImage,
  FormErrors,
} from "@/types/product";
import type { ProductCreateRequest } from "@/types";
import { validateForm, validateField } from "@/utils/productValidation";
import {
  createProductPrivate,
  getCategoryChildOptions,
  getProductVariantsPrivate,
} from "@/api/endpoints/productApi";
import {
  getBrandList,
  createBrand as createBrandApi,
  deleteBrand as deleteBrandApi,
} from "@/api/endpoints/attributeApi";
import { toast } from "sonner";
import "@/styles/animations.css";

const formatCurrencyDisplay = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === "") {
    return "0đ";
  }
  const numeric =
    typeof value === "number"
      ? value
      : Number(value.toString().replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric)) {
    return "0đ";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(numeric);
};

const CATEGORY_PAGE_SIZE = 20;
const BRAND_PAGE_SIZE = 20;
const MAX_ATTRIBUTES = 5;
const VARIANT_PAGE_SIZE = 20;

const INITIAL_FORM_DATA: ProductFormData = {
  productName: "",
  barcode: "",
  category: "",
  categoryId: null,
  brand: "",
  brandId: null,
  description: "",
  costPrice: "",
  sellingPrice: "",
  inventory: "",
  available: "",
  weight: "",
  length: "",
  width: "",
  height: "",
};

const AdminProductsNew: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);

  const [showAttributes, setShowAttributes] = useState(false);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeValueInput, setNewAttributeValueInput] = useState("");
  const [newAttributeValues, setNewAttributeValues] = useState<string[]>([]);
  const [attributeError, setAttributeError] = useState("");
  const [editingAttributeIndex, setEditingAttributeIndex] = useState<number | null>(null);
  const [isAttributeFormVisible, setIsAttributeFormVisible] = useState(true);
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
  const [currentStep, setCurrentStep] = useState(0);
  const editVersionFileInputRef = useRef<HTMLInputElement>(null);
  const [brandOptions, setBrandOptions] = useState<{ id: number; name: string }[]>([]);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [brandPage, setBrandPage] = useState(0);
  const [brandHasMore, setBrandHasMore] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);
  const [isBrandSubmitting, setIsBrandSubmitting] = useState(false);
  const [brandModalError, setBrandModalError] = useState("");
  const [brandToDelete, setBrandToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeletingBrand, setIsDeletingBrand] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ value: number; label: string }[]>([]);
  const [categoryPage, setCategoryPage] = useState(0);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);
  const [isVariantSectionVisible, setIsVariantSectionVisible] = useState(false);
  const [variantStatusMessage, setVariantStatusMessage] = useState<string | null>(null);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
  const [variantPagination, setVariantPagination] = useState({
    page: 0,
    pageSize: VARIANT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

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

  const fetchProductVariants = useCallback(
    async (productId: number, page = 0, size = VARIANT_PAGE_SIZE) => {
      setIsVariantLoading(true);
      setVariantError(null);
      try {
        const response = await getProductVariantsPrivate(productId, {
          page,
          size,
          sort: "asc",
        });

        const mappedVersions: ProductVersion[] =
          response.variants?.map((variant) => ({
            id: String(variant.id),
            name: variant.nameDetail || variant.skuDetail || `Phiên bản #${variant.id}`,
            price:
              variant.sellingPrice !== undefined && variant.sellingPrice !== null
                ? String(variant.sellingPrice)
                : "",
            inventory:
              variant.totalQuantity !== undefined && variant.totalQuantity !== null
                ? String(variant.totalQuantity)
                : "",
            available:
              variant.availableQuantity !== undefined && variant.availableQuantity !== null
                ? String(variant.availableQuantity)
                : "",
            image: variant.imageUrl ?? null,
            sku: variant.skuDetail ?? "",
            barcode: variant.barcode ?? "",
          })) ?? [];

        setVersions(mappedVersions);
        setSelectedVersions(new Set());
        setVariantPagination({
          page: response.pageNumber ?? page,
          pageSize: response.pageSize ?? size,
          total: response.totalElements ?? mappedVersions.length,
          totalPages: response.totalPages ?? 1,
        });
      } catch (error) {
        console.error("Không thể tải phiên bản sản phẩm", error);
        setVariantError("Không thể tải phiên bản. Vui lòng thử lại.");
      } finally {
        setIsVariantLoading(false);
      }
    },
    []
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

    setErrors(formErrors);

      setErrors(formErrors);

    setIsSubmitting(true);
    setVariantStatusMessage("Đang tạo sản phẩm và tải phiên bản...");
    setVariantError(null);
    setIsVariantSectionVisible(true);

    try {
      const toFloat = (value: string): number => parseFloat(value) || 0;
      const toOptionalFloat = (value: string): number | undefined => {
        const parsed = parseFloat(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      };
      const toOptionalInt = (value: string): number | undefined => {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? undefined : parsed;
      };

      const payload: ProductCreateRequest = {
        name: formData.productName.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId!,
        brandId: formData.brandId!,
        images: images.map((img) => img.url).filter(Boolean),
        attributes: attributes.length > 0 ? attributes : [],
        packagedWeight: toFloat(formData.weight),
        length: toFloat(formData.length),
        width: toFloat(formData.width),
        height: toFloat(formData.height),
        importPrice: toOptionalFloat(formData.costPrice),
        sellingPrice: toOptionalFloat(formData.sellingPrice),
        totalQuantity: toOptionalInt(formData.inventory),
        availableQuantity: toOptionalInt(formData.available),
      };

      const creationResponse = await createProductPrivate(payload);
      const newProductId = creationResponse?.data;

      if (typeof newProductId === "number") {
        setCreatedProductId(newProductId);
        await fetchProductVariants(newProductId, 0, VARIANT_PAGE_SIZE);
        setVariantStatusMessage(null);
        toast.success("Thêm sản phẩm thành công!");
      } else {
        setVariantStatusMessage(null);
        toast.success("Thêm sản phẩm thành công nhưng không lấy được dữ liệu phiên bản.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setVariantStatusMessage(null);
      toast.error("Không thể thêm sản phẩm. Vui lòng thử lại.");
      setErrors({ submit: "Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại." });
    } finally {
      setVariantStatusMessage(null);
      setIsSubmitting(false);
    }
  }, [attributes, fetchProductVariants, formData, images]);

  const handleCancel = () => {
    setFormData(INITIAL_FORM_DATA);
    setImages([]);
    setAttributes([]);
    setNewAttributeName("");
    setNewAttributeValueInput("");
    setNewAttributeValues([]);
    setAttributeError("");
    setEditingAttributeIndex(null);
    setIsAttributeFormVisible(true);
    setErrors({});
    setSelectedVersions(new Set());
    setVersions([]);
    setCreatedProductId(null);
    setIsVariantSectionVisible(false);
    setVariantStatusMessage(null);
    setVariantError(null);
    toast.success("Đã làm mới form. Bạn có thể nhập sản phẩm mới.");
  };

  const handleBrandModalClose = () => {
    if (isBrandSubmitting) return;
    setShowBrandModal(false);
    setNewBrandName("");
    setBrandModalError("");
  };

  const loadBrands = useCallback(async (page = 0, append = false) => {
    setBrandLoading(true);
    try {
      const response = await getBrandList({ page, size: BRAND_PAGE_SIZE });
      const mappedBrands =
        response.content?.map((brand) => ({
          id: brand.id,
          name: brand.name,
        })) ?? [];

      setBrandOptions((prev) => {
        const combined = append ? [...prev, ...mappedBrands] : mappedBrands;
        const unique = new Map<number, { id: number; name: string }>();
        combined.forEach((brand) => {
          unique.set(brand.id, brand);
        });
        return Array.from(unique.values());
      });

      const currentPage = response.pageNumber ?? page;
      const totalPages = response.totalPages ?? 1;
      const last = response.last ?? currentPage + 1 >= totalPages;
      setBrandPage(currentPage);
      setBrandHasMore(!last);
    } catch (error) {
      console.error("Không thể tải danh sách thương hiệu", error);
    } finally {
      setBrandLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadBrands(0, false);
  }, [loadBrands]);

  const handleBrandLoadMore = useCallback(() => {
    if (brandLoading || !brandHasMore) return;
    loadBrands(brandPage + 1, true);
  }, [brandLoading, brandHasMore, brandPage, loadBrands]);

  const handleBrandSelect = useCallback((brand?: { id: number; name: string }) => {
    setFormData((prev) => ({
      ...prev,
      brand: brand?.name ?? "",
      brandId: brand?.id ?? null,
    }));

    setErrors((prev) => ({
      ...prev,
      brand: brand ? "" : "Vui lòng chọn thương hiệu",
    }));
  }, []);

  const handleBrandSubmit = async () => {
    const trimmed = newBrandName.trim();
    if (!trimmed) {
      setBrandModalError("Vui lòng nhập tên thương hiệu");
      return;
    }

    setIsBrandSubmitting(true);
    setBrandModalError("");
    try {
      const response = await createBrandApi({ name: trimmed });
      const newBrandId = response.data ?? Date.now();
      const newBrand = { id: newBrandId, name: trimmed };
      setBrandOptions((prev) => {
        const filtered = prev.filter((brand) => brand.id !== newBrandId);
        return [newBrand, ...filtered];
      });
      handleBrandSelect(newBrand);
      toast.success("Thêm thương hiệu thành công");
      handleBrandModalClose();
    } catch (error) {
      console.error("Không thể thêm thương hiệu", error);
      setBrandModalError("Không thể thêm thương hiệu. Vui lòng thử lại.");
    } finally {
      setIsBrandSubmitting(false);
    }
  };

  const handleConfirmDeleteBrand = async () => {
    if (!brandToDelete) return;
    setIsDeletingBrand(true);
    try {
      await deleteBrandApi(brandToDelete.id);
      setBrandOptions((prev) =>
        prev.filter((brand) => brand.id !== brandToDelete.id)
      );
      if (formData.brandId === brandToDelete.id) {
        setFormData((prev) => ({
          ...prev,
          brandId: null,
          brand: "",
        }));
        setErrors((prev) => ({
          ...prev,
          brand: "Vui lòng chọn thương hiệu",
        }));
      }
      toast.success("Xóa thương hiệu thành công");
      setBrandToDelete(null);
    } catch (error) {
      console.error("Không thể xóa thương hiệu", error);
      toast.error("Xóa thương hiệu thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeletingBrand(false);
    }
  };

  const loadCategories = useCallback(async (page = 0, append = false) => {
    setCategoryLoading(true);
    try {
      const response = await getCategoryChildOptions({
        page,
        size: CATEGORY_PAGE_SIZE,
      });

      const mappedOptions =
        response.content?.map((item) => ({
          value: item.id,
          label: item.name,
        })) ?? [];

      setCategoryOptions((prev) => {
        const combined = append ? [...prev, ...mappedOptions] : mappedOptions;
        const unique = new Map<number, { value: number; label: string }>();
        combined.forEach((option) => {
          unique.set(option.value, option);
        });
        return Array.from(unique.values());
      });

      const currentPage = response.pageNumber ?? page;
      const totalPages = response.totalPages ?? 1;
      setCategoryPage(currentPage);
      setCategoryHasMore(currentPage + 1 < totalPages);
    } catch (error) {
      console.error("Không thể tải danh mục con", error);
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  const handleVariantPageChange = useCallback(
    (page: number, pageSize?: number) => {
      if (!createdProductId) return;
      fetchProductVariants(createdProductId, page - 1, pageSize ?? variantPagination.pageSize);
    },
    [createdProductId, fetchProductVariants, variantPagination.pageSize]
  );

  React.useEffect(() => {
    loadCategories(0, false);
  }, [loadCategories]);

  const handleCategoryLoadMore = useCallback(() => {
    if (categoryLoading || !categoryHasMore) return;
    loadCategories(categoryPage + 1, true);
  }, [categoryLoading, categoryHasMore, categoryPage, loadCategories]);

  const handleCategorySelect = useCallback(
    (value?: number) => {
      const selectedOption = categoryOptions.find(
        (option) => option.value === value
      );
      const label = selectedOption?.label ?? "";

      setFormData((prev) => ({
        ...prev,
        categoryId: typeof value === "number" ? value : null,
        category: label,
      }));

      const fieldError = validateField("category", label);
      setErrors((prev) => ({
        ...prev,
        category: fieldError,
      }));
    },
    [categoryOptions]
  );

  const normalizeAttributeName = (value: string) => value.trim().toLowerCase();

  const resetAttributeDraft = useCallback(() => {
    setNewAttributeName("");
    setNewAttributeValueInput("");
    setNewAttributeValues([]);
    setAttributeError("");
    setEditingAttributeIndex(null);
  }, []);

  const attributeNameExists = useCallback(
    (name: string, ignoreIndex: number | null = null) =>
      attributes.some(
        (attr, index) =>
          index !== ignoreIndex &&
          normalizeAttributeName(attr.name) === normalizeAttributeName(name)
      ),
    [attributes]
  );

  const handleAddAttribute = () => {
    setShowAttributes(true);
    setIsAttributeFormVisible(true);
    resetAttributeDraft();
  };

  const handleRemoveExistingAttributeValue = (
    attrIndex: number,
    valueIndex: number
  ) => {
    setAttributes((prev) => {
      const updated = [...prev];
      const newValues = updated[attrIndex].values.filter((_, i) => i !== valueIndex);

      if (newValues.length === 0) {
        const filtered = updated.filter((_, i) => i !== attrIndex);
        if (filtered.length === 0) {
          setShowAttributes(false);
          setIsAttributeFormVisible(true);
        }

        if (editingAttributeIndex === attrIndex) {
          resetAttributeDraft();
        } else if (editingAttributeIndex !== null && editingAttributeIndex > attrIndex) {
          setEditingAttributeIndex((prev) => (prev !== null ? prev - 1 : prev));
        }

        return filtered;
      }

      updated[attrIndex] = {
        ...updated[attrIndex],
        values: newValues,
      };
      return updated;
    });
  };

  const handleDeleteAttribute = (index: number) => {
    const isEditingDeletedAttribute = editingAttributeIndex === index;

    setAttributes((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setShowAttributes(false);
        setIsAttributeFormVisible(true);
      }
      return updated;
    });

    if (isEditingDeletedAttribute) {
      resetAttributeDraft();
    } else if (editingAttributeIndex !== null && editingAttributeIndex > index) {
      setEditingAttributeIndex((prev) => (prev !== null ? prev - 1 : prev));
    }
  };

  const handleRemoveNewAttributeValue = (index: number) => {
    setNewAttributeValues((prev) => prev.filter((_, i) => i !== index));
    setAttributeError("");
  };

  const handleEditAttribute = (index: number) => {
    const targetAttribute = attributes[index];
    if (!targetAttribute) return;

    setShowAttributes(true);
    setIsAttributeFormVisible(true);
    setEditingAttributeIndex(index);
    setNewAttributeName(targetAttribute.name);
    setNewAttributeValues(targetAttribute.values);
    setNewAttributeValueInput("");
    setAttributeError("");
  };

  const handleCancelEditingAttribute = () => {
    resetAttributeDraft();
    setIsAttributeFormVisible(false);
  };

  const handleSubmitNewAttribute = useCallback(() => {
    const trimmedName = newAttributeName.trim();
    if (!trimmedName) {
      setAttributeError("Tên thuộc tính không được để trống.");
      return;
    }

    const isEditing = editingAttributeIndex !== null;
    if (attributeNameExists(trimmedName, isEditing ? editingAttributeIndex : null)) {
      setAttributeError("Tên thuộc tính đã tồn tại.");
      return;
    }

    if (newAttributeValues.length === 0) {
      setAttributeError("Phải có ít nhất một giá trị cho thuộc tính.");
      return;
    }

    if (!isEditing && attributes.length >= MAX_ATTRIBUTES) {
      setAttributeError(`Chỉ được thêm tối đa ${MAX_ATTRIBUTES} thuộc tính.`);
      return;
    }

    if (isEditing) {
      setAttributes((prev) =>
        prev.map((attr, index) =>
          index === editingAttributeIndex ? { name: trimmedName, values: newAttributeValues } : attr
        )
      );
    } else {
      setAttributes((prev) => [...prev, { name: trimmedName, values: newAttributeValues }]);
      setShowAttributes(true);
    }

    resetAttributeDraft();
    setIsAttributeFormVisible(false);
  }, [attributeNameExists, attributes.length, editingAttributeIndex, newAttributeName, newAttributeValues, resetAttributeDraft]);

  const handleNewAttributeValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    if (e.nativeEvent.isComposing) {
      return;
    }

    e.preventDefault();
    const trimmedValue = newAttributeValueInput.trim();

    if (!trimmedValue) {
      if (newAttributeValues.length > 0) {
        handleSubmitNewAttribute();
      }
      return;
    }

    const exists = newAttributeValues.some(
      (value) => normalizeAttributeName(value) === normalizeAttributeName(trimmedValue)
    );

    if (exists) {
      setAttributeError("Giá trị thuộc tính đã tồn tại.");
      return;
    }

    setNewAttributeValues((prev) => [...prev, trimmedValue]);
    setNewAttributeValueInput("");
    setAttributeError("");
  };

  const canAddMoreAttributes = attributes.length < MAX_ATTRIBUTES;
  const shouldShowAttributeForm =
    editingAttributeIndex !== null || (isAttributeFormVisible && canAddMoreAttributes);
  const canSubmitAttribute =
    newAttributeName.trim() !== "" &&
    newAttributeValues.length > 0 &&
    !attributeNameExists(newAttributeName, editingAttributeIndex) &&
    (editingAttributeIndex !== null || canAddMoreAttributes);

  useEffect(() => {
    if (attributes.length === 0) {
      setIsAttributeFormVisible(true);
    }
  }, [attributes.length]);

  // Memoized version calculation
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
        barcode: version.barcode || "",
        costPrice: "",
        sellingPrice: version.price || "",
        inventory: version.inventory || "",
        available: version.available || "",
        image: version.image || "",
        sku: version.sku,
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
          />

          {/* Basic Information Section */}
          <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-6 card-hover animate-slideIn">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#272424] font-montserrat">
                Thông tin cơ bản
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Product Name */}
              <div className="flex flex-col gap-4">
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
              </div>

              {/* Category and Brand */}
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  label="Danh mục"
                  error={errors.category}
                  className="flex-1"
                >
                  <div
                    className={`bg-white rounded-[12px] border-2 ${
                      errors.category ? "border-[#ff4d4f]" : "border-[#e04d30]"
                    } flex items-center px-2 h-[40px]`}
                  >
                    <Select<number>
                      bordered={false}
                      placeholder="Chọn danh mục"
                      value={formData.categoryId ?? undefined}
                      onChange={(value) =>
                        handleCategorySelect(value as number | undefined)
                      }
                      onClear={() => handleCategorySelect(undefined)}
                      allowClear
                      suffixIcon={
                        <ChevronDown className="w-4 h-4 text-[#322f30]" />
                      }
                      style={{ width: "100%" }}
                      loading={categoryLoading && categoryOptions.length === 0}
                      notFoundContent={
                        categoryLoading ? (
                          <div className="py-2 text-center">
                            <Spin size="small" />
                          </div>
                        ) : (
                          "Không có danh mục"
                        )
                      }
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <div className="px-3 py-2 border-t border-gray-100">
                            {categoryHasMore ? (
                              <button
                                type="button"
                                onClick={handleCategoryLoadMore}
                                disabled={categoryLoading}
                                className="text-[#1a71f6] text-sm font-semibold flex items-center gap-2"
                              >
                                {categoryLoading ? (
                                  <Spin size="small" />
                                ) : (
                                  "Tải thêm danh mục..."
                                )}
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Đã tải tất cả danh mục
                              </span>
                            )}
                          </div>
                        </>
                      )}
                      options={categoryOptions}
                      popupClassName="category-select-dropdown"
                    />
                  </div>
                </FormField>

                <FormField
                  label="Thương hiệu"
                  required
                  error={errors.brand}
                  className="flex-1"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`bg-white border-2 ${
                          errors.brand ? "border-[#ff4d4f]" : "border-[#e04d30]"
                        } flex items-center justify-between px-4 rounded-[12px] w-full h-[40px]`}
                      >
                        <span
                          className={`text-[14px] font-semibold ${
                            formData.brand ? "text-[#272424]" : "text-[#888888]"
                          }`}
                        >
                          {formData.brand || "Chọn thương hiệu"}
                        </span>
                        <ChevronDown className="w-5 h-5 text-[#322f30]" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="min-w-[240px]"
                    >
                      <div className="max-h-64 overflow-y-auto">
                        {brandOptions.length === 0 && (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            {brandLoading ? "Đang tải thương hiệu..." : "Chưa có thương hiệu"}
                          </div>
                        )}
                        {brandOptions.map((brand) => (
                          <DropdownMenuItem
                            key={brand.id}
                            className="flex items-center justify-between gap-3 text-[14px] font-semibold text-[#272424]"
                            onClick={() => handleBrandSelect(brand)}
                          >
                            <span>{brand.name}</span>
                            <button
                              type="button"
                              className="text-[#f44336] hover:text-[#d32f2f]"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setBrandToDelete(brand);
                              }}
                              title={`Xóa ${brand.name}`}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
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
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <DropdownMenuSeparator />
                      <div className="px-4 py-2">
                        {brandHasMore ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBrandLoadMore();
                            }}
                            disabled={brandLoading}
                            className="text-[#1a71f6] text-sm font-semibold flex items-center gap-2"
                          >
                            {brandLoading ? <Spin size="small" /> : "Tải thêm thương hiệu..."}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Đã tải tất cả thương hiệu
                          </span>
                        )}
                      </div>
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
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Giá vốn
                    </label>
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
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Giá bán
                    </label>
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
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Tồn kho
                    </label>
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
                    <label className="text-[14px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                      Có thể bán
                    </label>
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
            <div className="bg-white border border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
                  Thuộc tính
                </h2>
                <span className="text-sm text-gray-500">
                  {attributes.length}/{MAX_ATTRIBUTES}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {attributes.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Chưa có thuộc tính nào. Hãy thêm thuộc tính đầu tiên bên dưới.
                  </p>
                ) : (
                  attributes.map((attribute, index) => {
                    const isEditingAttribute = editingAttributeIndex === index;
                    return (
                      <div
                        key={`${attribute.name}-${index}`}
                        className={`border rounded-[12px] px-4 py-3 flex flex-col gap-2 transition-all ${
                          isEditingAttribute ? "border-[#1a71f6] bg-[#f5f9ff]" : "border-[#e7e7e7]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-[28%] min-w-[200px]">
                            <p className="text-[14px] font-semibold text-[#272424] font-montserrat">
                              {attribute.name}
                              {isEditingAttribute && (
                                <span className="ml-2 text-xs text-[#1a71f6] font-medium">
                                  (Đang chỉnh sửa)
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex-1 flex flex-wrap gap-2">
                            {attribute.values.map((value, valueIndex) => (
                              <div
                                key={`${value}-${valueIndex}`}
                                className="bg-[#eef3ff] rounded-[16px] px-3 py-1 flex items-center gap-2 border border-[#d1dbff]"
                              >
                                <span className="text-[14px] font-semibold text-[#272424] font-montserrat">
                                  {value}
                                </span>
                                <button
                                  type="button"
                                  className="text-[#737373] hover:text-[#1a71f6]"
                                  onClick={() =>
                                    handleRemoveExistingAttributeValue(index, valueIndex)
                                  }
                                >
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path
                                      d="M9 3L3 9M3 3L9 9"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-[#1a71f6] hover:text-[#0f5ad8]"
                              onClick={() => handleEditAttribute(index)}
                              title="Chỉnh sửa thuộc tính này"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 20h9"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="text-[#f44336] hover:text-[#d32f2f]"
                              onClick={() => handleDeleteAttribute(index)}
                              title="Xóa thuộc tính này"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                    );
                  })
                )}
              </div>

              {shouldShowAttributeForm ? (
                <div className="flex flex-col gap-3 border-t border-dashed border-[#e7e7e7] pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-[#272424] font-montserrat">
                      {editingAttributeIndex !== null
                        ? "Chỉnh sửa thuộc tính"
                        : "Thêm thuộc tính mới"}
                    </p>
                    {editingAttributeIndex !== null && (
                      <button
                        type="button"
                        className="text-sm text-[#f44336] hover:text-[#d32f2f]"
                        onClick={handleCancelEditingAttribute}
                      >
                        Huỷ chỉnh sửa
                      </button>
                    )}
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-[28%] min-w-[200px]">
                      <FormInput
                        placeholder="Nhập tên thuộc tính"
                        value={newAttributeName}
                        onChange={(e) => {
                          setNewAttributeName(e.target.value);
                          setAttributeError("");
                        }}
                        containerClassName="h-[36px] px-4"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border-2 border-[#e04d30] rounded-[12px] px-2 py-[6px] flex flex-wrap items-center gap-2 min-h-[40px]">
                        {newAttributeValues.map((value, index) => (
                          <div
                            key={`${value}-${index}`}
                            className="bg-[#eef3ff] rounded-[16px] px-3 py-1 flex items-center gap-2 border border-[#d1dbff]"
                          >
                            <span className="text-[14px] font-semibold text-[#272424] font-montserrat">
                              {value}
                            </span>
                            <button
                              type="button"
                              className="text-[#737373] hover:text-[#1a71f6]"
                              onClick={() => handleRemoveNewAttributeValue(index)}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M9 3L3 9M3 3L9 9"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder="Nhập ký tự và ấn Enter"
                          value={newAttributeValueInput}
                          onChange={(e) => {
                            setNewAttributeValueInput(e.target.value);
                            setAttributeError("");
                          }}
                          onKeyDown={handleNewAttributeValueKeyDown}
                          className="flex-1 border-0 outline-none bg-transparent text-[14px] font-semibold text-[#272424] font-montserrat min-w-[120px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSubmitNewAttribute}
                      className={`flex items-center gap-1 text-[14px] font-bold ${
                        canSubmitAttribute
                          ? "text-[#1a71f6]"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!canSubmitAttribute}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {editingAttributeIndex !== null
                        ? "Cập nhật thuộc tính"
                        : "Thêm thuộc tính khác"}
                    </button>
                    {editingAttributeIndex !== null && (
                      <button
                        type="button"
                        onClick={handleCancelEditingAttribute}
                        className="text-[14px] font-semibold text-[#737373] hover:text-[#1a71f6]"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                  {attributeError && (
                    <p className="text-sm text-red-500 mt-1">{attributeError}</p>
                  )}
                </div>
              ) : canAddMoreAttributes ? (
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="flex items-center gap-1 text-[14px] font-bold text-[#1a71f6]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Thêm thuộc tính khác
                </button>
              ) : (
                <p className="text-sm text-gray-500 border-t border-dashed border-[#e7e7e7] pt-4">
                  Bạn đã thêm tối đa {MAX_ATTRIBUTES} thuộc tính.
                </p>
              )}
            </div>
          )}

          {/* Version Section */}
          {isVariantSectionVisible && (
            <div className="bg-white border border-[#e7e7e7] rounded-[24px] py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between px-6 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold text-[#272424] font-montserrat">
                    Phiên bản
                  </h2>
                  <span className="text-sm text-gray-500 font-montserrat">
                    {variantPagination.total.toLocaleString("vi-VN")} phiên bản
                  </span>
                </div>
                {createdProductId && (
                  <span className="text-sm text-gray-500 font-montserrat">
                    Mã sản phẩm: #{createdProductId}
                  </span>
                )}
              </div>

              {(variantStatusMessage || variantError) && (
                <div className="px-6 flex flex-col gap-3">
                  {variantStatusMessage && (
                    <div className="bg-[#f0f7ff] border border-[#d0e3ff] text-[#1a56db] px-4 py-2 rounded-[12px] text-sm font-medium">
                      {variantStatusMessage}
                    </div>
                  )}
                  {variantError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-[12px] text-sm flex items-center gap-3 flex-wrap">
                      <span>{variantError}</span>
                      <button
                        type="button"
                        className="text-[#e04d30] font-semibold hover:underline"
                        onClick={() => {
                          if (createdProductId) {
                            fetchProductVariants(
                              createdProductId,
                              variantPagination.page,
                              variantPagination.pageSize
                            );
                          }
                        }}
                      >
                        Thử lại
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white rounded-[16px] flex flex-col px-6">
                <div className="flex items-start border-b border-[#e7e7e7]">
                  <div className="w-[420px] flex gap-3 items-center px-3 py-[14px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={
                          versions.length > 0 &&
                          selectedVersions.size === versions.length
                        }
                        onChange={handleSelectAll}
                      />
                    </div>
                    <p className="text-[14px] font-bold text-[#272424] font-montserrat">
                      {selectedCount > 0
                        ? `Đã chọn ${selectedCount} phiên bản`
                        : `${variantPagination.total.toLocaleString("vi-VN")} phiên bản`}
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

                {isVariantLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Spin />
                  </div>
                ) : versions.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-500 font-montserrat">
                    Chưa có phiên bản nào. Hãy kiểm tra lại cấu hình thuộc tính hoặc tải lại dữ liệu.
                  </div>
                ) : (
                  versions.map((version, index) => (
                    <div
                      key={version.id}
                      className={`flex items-center cursor-pointer hover:bg-gray-50 transition-colors ${index < versions.length - 1 ? "border-b border-[#e7e7e7]" : ""
                        }`}
                      onClick={() => handleVersionRowClick(version.id)}
                    >
                      <div className="w-[420px] flex gap-3 items-center px-3 py-[14px]">
                        <div onClick={(e) => e.stopPropagation()}>
                          <CustomCheckbox
                            checked={selectedVersions.has(version.id)}
                            onChange={() => handleVersionToggle(version.id)}
                          />
                        </div>
                        <div className="w-[44px] h-[44px] rounded-[12px] bg-[#f5f5f5] overflow-hidden flex items-center justify-center">
                          {version.image ? (
                            <img
                              src={version.image}
                              alt={version.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon name="image" size={20} color="#a1a1aa" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[14px] font-semibold text-[#272424] font-montserrat">
                            {version.name}
                          </p>
                          {(version.sku || version.barcode) && (
                            <p className="text-xs text-gray-500 font-montserrat">
                              {version.sku && `SKU: ${version.sku}`}
                              {version.sku && version.barcode ? " • " : ""}
                              {version.barcode && `Barcode: ${version.barcode}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-4 items-center px-3 py-[14px]">
                        <div className="text-right">
                          <p className="text-[14px] font-semibold text-[#272424] font-montserrat">
                            {formatCurrencyDisplay(version.price)}
                          </p>
                          <p className="text-xs text-gray-500">Giá bán</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-semibold text-[#272424] font-montserrat">
                            {version.inventory || "0"}
                          </p>
                          <p className="text-xs text-gray-500">Tồn kho</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-semibold text-[#272424] font-montserrat">
                            {version.available || "0"}
                          </p>
                          <p className="text-xs text-gray-500">Có thể bán</p>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            className="text-[#1a71f6] hover:text-[#0f5ad8]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVersionRowClick(version.id);
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M12 20h9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="text-[#f44336] hover:text-[#d32f2f]"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Hook up delete logic when API is available
                              console.log("Delete variant", version.id);
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                  ))
                )}
              </div>

              {variantPagination.total > variantPagination.pageSize && (
                <div className="flex items-center justify-between px-6">
                  <span className="text-sm text-gray-500">
                    Trang {variantPagination.page + 1}/{Math.max(variantPagination.totalPages, 1)} • Tổng{" "}
                    {variantPagination.total.toLocaleString("vi-VN")} phiên bản
                  </span>
                  <Pagination
                    current={variantPagination.page + 1}
                    pageSize={variantPagination.pageSize}
                    total={variantPagination.total}
                    showSizeChanger={false}
                    onChange={handleVariantPageChange}
                  />
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
                onChange={(e) => {
                  setNewBrandName(e.target.value);
                  setBrandModalError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleBrandSubmit();
                  }
                }}
                containerClassName="h-[40px] px-4"
              />
              {brandModalError && (
                <p className="text-sm text-red-500 mt-2">{brandModalError}</p>
              )}
            </div>
            <div className="px-6 py-4 border-t border-[#d1d1d1] flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={handleBrandModalClose}
                disabled={isBrandSubmitting}
              >
                Hủy
              </Button>
              <Button onClick={handleBrandSubmit} disabled={isBrandSubmitting}>
                {isBrandSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Đang thêm...
                  </div>
                ) : (
                  "Thêm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {brandToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => (!isDeletingBrand ? setBrandToDelete(null) : undefined)}
          />
          <div
            className="relative z-50 bg-white rounded-[24px] w-full max-w-[420px] overflow-hidden shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-3 border-b border-[#d1d1d1]">
              <h2 className="text-[20px] font-bold text-[#272424] font-montserrat">
                Xóa thương hiệu
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="text-[14px] text-[#272424] leading-[150%]">
                Bạn có chắc chắn muốn xóa thương hiệu{" "}
                <span className="font-semibold">{brandToDelete.name}</span> không?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#d1d1d1] flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => (!isDeletingBrand ? setBrandToDelete(null) : undefined)}
                disabled={isDeletingBrand}
              >
                Hủy
              </Button>
              <Button onClick={handleConfirmDeleteBrand} disabled={isDeletingBrand}>
                {isDeletingBrand ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Đang xóa...
                  </div>
                ) : (
                  "Xác nhận"
                )}
              </Button>
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
