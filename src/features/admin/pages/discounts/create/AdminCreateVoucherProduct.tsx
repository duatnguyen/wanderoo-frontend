import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCardPercentIcon } from "@/components/icons/discount";
import Icon from "@/components/icons/Icon";
import CustomRadio from "@/components/ui/custom-radio";
import type { VoucherEditData, VoucherProduct } from "@/types/voucher";
import { getAllProductsPrivate } from "@/api/endpoints/productApi";
import type { AdminProductResponse } from "@/types";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDiscount, getDiscountDetail, updateDiscount } from "@/api/endpoints/discountApi";
import type { AdminDiscountCreateRequest } from "@/types/discount";

// Date formatting utilities
const formatDateTimeForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

interface VoucherFormData {
  // Basic Information
  voucherName: string;
  voucherCode: string;
  description: string;
  startDate: string;
  endDate: string;

  // Voucher Settings
  discountType: "percentage" | "fixed";
  discountValue: string;
  maxDiscountLimit: "limited" | "unlimited";
  maxDiscountValue: string;
  minOrderAmount: string;
  maxUsage: string;
  maxUsagePerCustomer: string;

  // Display Settings
  displaySetting: "pos" | "website" | "pos-website";
}

interface EditLocationState {
  mode?: "edit";
  voucher?: {
    id?: string | number;
    editData?: VoucherEditData;
  };
}

const createDefaultFormData = (): VoucherFormData => ({
  voucherName: "",
  voucherCode: "",
  description: "",
  startDate: "",
  endDate: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscountLimit: "unlimited",
  maxDiscountValue: "",
  minOrderAmount: "",
  maxUsage: "",
  maxUsagePerCustomer: "",
  displaySetting: "website",
});

const discountTypeToEnum = {
  percentage: "PERCENT" as const,
  fixed: "FIXED" as const,
};

const displaySettingToApplyOn = {
  pos: "POS" as const,
  website: "WEBSITE" as const,
  "pos-website": "BOTH" as const,
};

const AdminCreateVoucherProduct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fetchDiscountId = searchParams.get("id") ? Number(searchParams.get("id")) : null;
  const { mode, voucher } = (location.state as EditLocationState | undefined) || {};
  const editData = voucher?.editData;
  const isEditMode = mode === "edit" && !!editData;
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmedProducts, setConfirmedProducts] = useState<VoucherProduct[]>([]);
  const [appliedProductsPage, setAppliedProductsPage] = useState(1);
  const [formData, setFormData] = useState<VoucherFormData>(createDefaultFormData);
  const [minDateTime] = useState(() => formatDateTimeForInput(new Date().toISOString()));
  const [products, setProducts] = useState<AdminProductResponse[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const numericFields: Array<keyof VoucherFormData> = [
    "discountValue",
    "maxDiscountValue",
    "minOrderAmount",
    "maxUsage",
    "maxUsagePerCustomer",
  ];

  const sanitizeNumericInput = (value: string) => value.replace(/[^0-9]/g, "");

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        voucherName: editData.voucherName ?? "",
        voucherCode: editData.voucherCode ?? "",
        description: editData.description ?? "",
        startDate: editData.startDate ?? "",
        endDate: editData.endDate ?? "",
        discountType: editData.discountType ?? "percentage",
        discountValue: editData.discountValue ?? "",
        maxDiscountLimit: editData.maxDiscountLimit ?? "unlimited",
        maxDiscountValue: editData.maxDiscountValue ?? "",
        minOrderAmount: editData.minOrderAmount ?? "",
        maxUsage: editData.maxUsage ?? "",
        maxUsagePerCustomer: editData.maxUsagePerCustomer ?? "",
        displaySetting: editData.displaySetting ?? "website",
      });
      const applied = (editData.appliedProducts ?? []).map((product) => ({
        ...product,
      }));
      setConfirmedProducts(applied);
      setSelectedProducts(new Set(applied.map((product) => product.id)));
      setAppliedProductsPage(1);
    } else {
      setFormData(createDefaultFormData());
      setConfirmedProducts([]);
      setSelectedProducts(new Set());
      setAppliedProductsPage(1);
    }
  }, [isEditMode, editData]);

  const pageTitle = isEditMode ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới";

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!isProductModalOpen) return;
    
    setIsLoadingProducts(true);
    try {
      const params = {
        keyword: debouncedSearch || undefined,
        page: Math.max(currentPage - 1, 0),
        size: itemsPerPage,
      };
      const response = await getAllProductsPrivate(params);
      setProducts(response?.productResponseList ?? []);
      setTotalPages(
        response?.totalPages ??
          response?.totalPage ??
          Math.max(1, Math.ceil((response?.totalProducts ?? 1) / itemsPerPage))
      );
    } catch (error) {
      console.error("Không thể tải danh sách sản phẩm", error);
      toast.error("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [isProductModalOpen, debouncedSearch, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (isProductModalOpen) {
      setSelectedProducts(new Set());
      setSelectedVariants(new Set());
      setExpandedProducts(new Set());
      setCurrentPage(1);
      setSearchValue("");
    }
  }, [isProductModalOpen]);

  // Format price helper
  const formatPrice = (price?: number | string | null): number => {
    if (price === null || price === undefined) return 0;
    if (typeof price === "number") return price;
    const numeric = Number(price.toString().replace(/[^\d.-]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const formatPriceDisplay = (price?: number | string | null): string => {
    const numPrice = formatPrice(price);
    return new Intl.NumberFormat("vi-VN").format(numPrice) + "đ";
  };

  // Map product to display format
  const mapProductToDisplay = (product: AdminProductResponse) => {
    const price = formatPrice(product.sellingPrice);
    return {
      id: String(product.id),
      name: product.name,
      image: product.imageUrl || "",
      barcode: "---", // Products don't have barcode at product level, only variants do
      price,
      available: product.availableQuantity ?? 0,
      variants: product.productDetails ?? [],
    };
  };

  const displayProducts = useMemo(() => {
    return products.map(mapProductToDisplay);
  }, [products]);

  const handleProductToggle = (productId: string) => {
    const product = displayProducts.find((p) => p.id === productId);
    const hasVariants = product && product.variants && product.variants.length > 0;
    
    // If product has variants, don't allow selecting the product directly
    // User must select individual variants
    if (hasVariants) {
      return;
    }
    
    // Only allow selecting products without variants
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
    } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleVariantToggle = (variantId: string, productId: string) => {
    setSelectedVariants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) {
        newSet.delete(variantId);
      } else {
        newSet.add(variantId);
        // If variant is selected, also select the product
        setSelectedProducts((p) => new Set(p).add(productId));
      }
      return newSet;
    });
  };

  const toggleProductExpanded = (productId: string) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const productsWithoutVariants = displayProducts.filter((p) => !p.variants || p.variants.length === 0);
    const productsWithVariants = displayProducts.filter((p) => p.variants && p.variants.length > 0);
    
    const allProductIds = new Set(productsWithoutVariants.map((p) => p.id));
    const allVariantIds = new Set<string>();
    
    productsWithVariants.forEach((product) => {
      product.variants.forEach((variant) => {
        allVariantIds.add(String(variant.id));
      });
    });

  const isAllSelected =
      selectedProducts.size === productsWithoutVariants.length &&
      selectedVariants.size === allVariantIds.size &&
      productsWithoutVariants.every((p) => selectedProducts.has(p.id)) &&
      Array.from(allVariantIds).every((id) => selectedVariants.has(id));
    
    if (isAllSelected) {
      setSelectedProducts(new Set());
      setSelectedVariants(new Set());
    } else {
      setSelectedProducts(allProductIds);
      setSelectedVariants(allVariantIds);
    }
  };

  const isAllSelected = useMemo(() => {
    if (displayProducts.length === 0) return false;
    
    const productsWithoutVariants = displayProducts.filter((p) => !p.variants || p.variants.length === 0);
    const productsWithVariants = displayProducts.filter((p) => p.variants && p.variants.length > 0);
    
    const allVariantIds = new Set<string>();
    productsWithVariants.forEach((product) => {
      product.variants.forEach((variant) => {
        allVariantIds.add(String(variant.id));
      });
    });
    
    return (
      selectedProducts.size === productsWithoutVariants.length &&
      selectedVariants.size === allVariantIds.size &&
      productsWithoutVariants.every((p) => selectedProducts.has(p.id)) &&
      Array.from(allVariantIds).every((id) => selectedVariants.has(id))
    );
  }, [displayProducts, selectedProducts, selectedVariants]);

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Show first pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        // Show last pages
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      }
    }
    return pages;
  };

  // Custom Checkbox Component
  const CustomCheckbox = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => {
    return (
      <div
        onClick={onChange}
        className={`w-[16px] h-[16px] border-2 rounded cursor-pointer flex items-center justify-center transition-colors ${
          checked
            ? "bg-[#e04d30] border-[#e04d30]"
            : "bg-white border-[#d1d5db]"
        }`}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    );
  };


  const handleInputChange = (field: keyof VoucherFormData, value: string) => {
    const processedValue = numericFields.includes(field) ? sanitizeNumericInput(value) : value;
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleBackClick = () => {
    navigate("/admin/discounts");
  };

  // Fetch discount detail if edit mode
  const { data: discountDetail } = useQuery({
    queryKey: ["admin-discount-detail", fetchDiscountId],
    queryFn: () => getDiscountDetail(fetchDiscountId!),
    enabled: !!fetchDiscountId && !editData,
  });

  // Update form data when discount detail is fetched
  useEffect(() => {
    if (discountDetail && !editData) {
      setFormData({
        voucherName: discountDetail.name ?? "",
        voucherCode: discountDetail.code ?? "",
        description: discountDetail.description ?? "",
        startDate: discountDetail.startDate ? formatDateTimeForInput(discountDetail.startDate) : "",
        endDate: discountDetail.endDate ? formatDateTimeForInput(discountDetail.endDate) : "",
        discountType: discountDetail.type === "PERCENT" ? "percentage" : "fixed",
        discountValue: discountDetail.value?.toString() ?? "",
        maxDiscountLimit: discountDetail.maxOrderValue ? "limited" : "unlimited",
        maxDiscountValue: discountDetail.maxOrderValue?.toString() ?? "",
        minOrderAmount: discountDetail.minOrderValue?.toString() ?? "",
        maxUsage: discountDetail.discountUsage?.toString() ?? discountDetail.quantity?.toString() ?? "",
        maxUsagePerCustomer: "",
        displaySetting: discountDetail.applyOn === "POS" ? "pos" : discountDetail.applyOn === "BOTH" ? "pos-website" : "website",
      });
    }
  }, [discountDetail, editData]);

  const handleApiError = (error: unknown) => {
    const message =
      (error as any)?.response?.data?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.";
    toast.error(message);
  };

  const createDiscountMutation = useMutation({
    mutationFn: (payload: AdminDiscountCreateRequest) => createDiscount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      toast.success("Tạo mã giảm giá thành công");
      navigate("/admin/discounts");
    },
    onError: handleApiError,
  });

  const updateDiscountMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminDiscountCreateRequest }) =>
      updateDiscount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      toast.success("Cập nhật mã giảm giá thành công");
      navigate("/admin/discounts");
    },
    onError: handleApiError,
  });

  const isSubmitting = createDiscountMutation.isPending || updateDiscountMutation.isPending;

  const normalizeDateValue = (value: string) => {
    if (!value) return "";
    if (value.endsWith("Z") || value.length > 16) {
      return value;
    }
    return value.length === 16 ? `${value}:00` : value;
  };

  const validateForm = () => {
    if (!formData.voucherName.trim()) {
      return "Vui lòng nhập tên chương trình giảm giá.";
    }
    if (!formData.voucherCode.trim()) {
      return "Vui lòng nhập mã voucher.";
    }
    const discountValue = Number(formData.discountValue);
    if (!formData.discountValue || Number.isNaN(discountValue) || discountValue <= 0) {
      return "Mức giảm phải lớn hơn 0.";
    }
    if (!formData.startDate || !formData.endDate) {
      return "Vui lòng chọn thời gian áp dụng.";
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return "Thời gian bắt đầu phải trước thời gian kết thúc.";
    }
    if (formData.maxDiscountLimit === "limited") {
      const maxDiscount = Number(formData.maxDiscountValue);
      if (!formData.maxDiscountValue || Number.isNaN(maxDiscount) || maxDiscount <= 0) {
        return "Vui lòng nhập mức giảm tối đa hợp lệ.";
      }
    }
    if (formData.minOrderAmount && Number.isNaN(Number(formData.minOrderAmount))) {
      return "Giá trị đơn hàng tối thiểu không hợp lệ.";
    }
    if (formData.maxUsage && (Number.isNaN(Number(formData.maxUsage)) || Number(formData.maxUsage) <= 0)) {
      return "Tổng lượt sử dụng tối đa phải lớn hơn 0.";
    }
    if (confirmedProducts.length === 0) {
      return "Vui lòng chọn ít nhất một sản phẩm.";
    }
    return null;
  };

  const parseOptionalNumber = (value: string) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const buildPayload = (): AdminDiscountCreateRequest => {
    const usageLimit = formData.maxUsage ? Number(formData.maxUsage) : 1;
    return {
      name: formData.voucherName.trim(),
      code: formData.voucherCode.trim().toUpperCase(),
      category: "PRODUCT_DISCOUNT",
      type: discountTypeToEnum[formData.discountType],
      applyTo: "PRODUCT",
      applyOn: displaySettingToApplyOn[formData.displaySetting],
      value: Number(formData.discountValue),
      minOrderValue: parseOptionalNumber(formData.minOrderAmount),
      maxOrderValue:
        formData.maxDiscountLimit === "limited"
          ? parseOptionalNumber(formData.maxDiscountValue)
          : undefined,
      discountUsage: formData.maxUsage ? usageLimit : undefined,
      contextAllowed: "OTHER",
      startDate: normalizeDateValue(formData.startDate),
      endDate: normalizeDateValue(formData.endDate),
      quantity: usageLimit,
      status: "ENABLE",
      description: formData.description?.trim() || undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = buildPayload();

    if (isEditMode || fetchDiscountId) {
      const discountId = fetchDiscountId || (voucher?.id ? Number(voucher.id) : null);
      if (!discountId) {
        toast.error("Không xác định được mã giảm giá cần chỉnh sửa.");
        return;
      }
      await updateDiscountMutation.mutateAsync({ id: discountId, payload });
      return;
    }

    await createDiscountMutation.mutateAsync(payload);
  };

  return (
    <div className="w-full overflow-x-auto min-h-screen">
      <div className="flex flex-col gap-[10px] items-start w-full">
        {/* Header with Back Button */}
        <div className="flex flex-col gap-[8px] items-start justify-center w-full">
          <div className="flex gap-[4px] items-center">
            <button
              onClick={handleBackClick}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373]" />
            </button>
            <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5] whitespace-nowrap">
              {pageTitle}
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[16px] w-full flex-shrink-0"
        >
          {/* Basic Information Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[18px] text-[#272424] leading-[normal]">
                Thông tin cơ bản
              </h2>
            </div>

            {/* Voucher Type Indicator */}
            <div className="w-full flex justify-center">
              <div className="bg-[#e04d30] border border-white rounded-[12px] h-[52px] px-[16px] flex items-center gap-[4px]">
                <CreditCardPercentIcon size={24} color="#FFFFFF" />
                <span className="font-semibold text-[20px] text-white leading-[1.4]">
                  Voucher sản phẩm
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-[16px]">
              {/* Voucher Name Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Tên chương trình giảm giá
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="Nhập tên chương trình giảm giá"
                    value={formData.voucherName}
                    onChange={(e) =>
                      handleInputChange("voucherName", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                    required
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4]">
                    Tên voucher sẽ không được hiển thị cho người mua
                  </p>
                </div>
              </div>

              {/* Voucher Code Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Mã voucher
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="Nhập mã voucher"
                    value={formData.voucherCode}
                    onChange={(e) =>
                      handleInputChange("voucherCode", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                    required
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4]">
                    Vui lòng nhập các kí tự chữ cái A - Z, số 0 - 9, tối đa 5 kí
                    tự
                  </p>
                </div>
              </div>

              {/* Date Range Field */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Thời gian sử dụng mã
                </label>
                <div className="flex-1 w-full flex flex-row gap-[4px] items-center flex-shrink-0">
                  {/* Start DateTime */}
                  <div className="flex-shrink-0">
                    <FormInput
                      type="datetime-local"
                      value={formatDateTimeForInput(formData.startDate)}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      min={minDateTime}
                      containerClassName="h-[36px] w-[240px]"
                      className={!formData.startDate ? "opacity-50" : ""}
                    />
                  </div>

                  {/* Dash Separator - hidden on mobile */}
                  <div className="hidden sm:flex items-center justify-center text-[#272424] px-[4px]">
                    -
                  </div>

                  {/* End DateTime */}
                  <div className="flex-shrink-0">
                    <FormInput
                      type="datetime-local"
                      value={formatDateTimeForInput(formData.endDate)}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      min={
                        formatDateTimeForInput(formData.startDate) || minDateTime
                      }
                      containerClassName="h-[36px] w-[240px]"
                      className={!formData.endDate ? "opacity-50" : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voucher Settings Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[18px] text-[#272424] leading-[normal]">
                Thiết lập mã giảm giá
              </h2>
            </div>

            {/* Form Fields */}
            <div className="px-0 py-[12px] flex flex-col gap-[16px]">
              {/* Discount Type and Value Row */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Loại giảm giá | Mức giảm
                </label>
                <div className="flex-1 flex flex-row gap-[16px] items-center flex-shrink-0 w-[873px]">
                  {/* Discount Type Dropdown */}
                  <div className="w-[164px] flex-shrink-0">
                    <DropdownMenu
                      open={isDropdownOpen}
                      onOpenChange={setIsDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[164px] justify-between h-[36px] border-[#e04d30] border-[1.6px] rounded-[12px] px-[16px] whitespace-nowrap hover:bg-[#e04d30]/5 "
                        >
                          <span className="font-medium text-[13px] text-[#272424]">
                            {formData.discountType === "percentage"
                              ? "Theo phần trăm"
                              : "Theo số tiền"}
                          </span>
                          <Icon
                            name="chevron-down"
                            size={11}
                            color="#272424"
                            className="ml-2"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto min-w-fit">
                        <DropdownMenuItem
                          onClick={() => {
                            handleInputChange("discountType", "percentage");
                            setIsDropdownOpen(false);
                          }}
                        >
                          Theo phần trăm
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleInputChange("discountType", "fixed");
                            setIsDropdownOpen(false);
                          }}
                        >
                          Theo số tiền
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Discount Value Input */}
                  <div className="flex-1">
                    <FormInput
                      placeholder={
                        formData.discountType === "percentage" ? "%" : "đ"
                      }
                      value={formData.discountValue}
                      onChange={(e) =>
                        handleInputChange("discountValue", e.target.value)
                      }
                      containerClassName="h-[36px] w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Maximum Discount (only for percentage) */}
              {formData.discountType === "percentage" && (
                <div className="flex flex-row items-start gap-[16px]">
                  <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                    Mức giảm tối đa
                  </label>
                  <div className="flex-1 flex flex-col gap-[12px] flex-shrink-0">
                    <div className="flex flex-row gap-[12px]">
                      <CustomRadio
                        name="maxDiscountLimit"
                        value="limited"
                        checked={formData.maxDiscountLimit === "limited"}
                        onChange={(e) =>
                          handleInputChange("maxDiscountLimit", e.target.value)
                        }
                        label="Giới hạn"
                      />
                      <CustomRadio
                        name="maxDiscountLimit"
                        value="unlimited"
                        checked={formData.maxDiscountLimit === "unlimited"}
                        onChange={(e) =>
                          handleInputChange("maxDiscountLimit", e.target.value)
                        }
                        label="Không giới hạn"
                      />
                    </div>
                    {formData.maxDiscountLimit === "limited" && (
                      <div>
                        <FormInput
                          placeholder="đ"
                          value={formData.maxDiscountValue}
                          onChange={(e) =>
                            handleInputChange(
                              "maxDiscountValue",
                              e.target.value
                            )
                          }
                          containerClassName="h-[36px] w-[873px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Minimum Order Amount */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Giá trị đơn hàng tối thiểu
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="đ"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      handleInputChange("minOrderAmount", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                </div>
              </div>

              {/* Maximum Usage */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Tổng lượt sử dụng tối đa
                </label>
                <div className="flex-1 flex flex-col flex-shrink-0">
                  <FormInput
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.maxUsage}
                    onChange={(e) =>
                      handleInputChange("maxUsage", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                  <p className="mt-[6px] font-medium text-[12px] text-[#737373] leading-[1.4] text-left">
                    Tổng số mã giảm giá tối đa có thể sử dụng
                  </p>
                </div>
              </div>

              {/* Maximum Usage Per Customer */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Lượt sử dụng tối đa/người
                </label>
                <div className="flex-1">
                  <FormInput
                    placeholder="Nhập số lượt sử dụng"
                    value={formData.maxUsagePerCustomer}
                    onChange={(e) =>
                      handleInputChange("maxUsagePerCustomer", e.target.value)
                    }
                    containerClassName="h-[36px] w-[873px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Display Settings Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[24px] relative rounded-[8px] w-full overflow-hidden flex-shrink-0">
            {/* Title Section */}
            <div className="flex flex-col gap-[8px]">
              <h2 className="font-montserrat font-bold text-[16px] text-[#272424] leading-[normal]">
                Hiển thị mã giảm giá và sản phẩm áp dụng
              </h2>
            </div>

            {/* Form Fields */}
            <div className="px-0 py-[12px] flex flex-col gap-[16px]">
              {/* Display Setting */}
              <div className="flex flex-row items-start gap-[16px]">
                <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                  Thiết lập hiển thị
                </label>
                <div className="flex-1 flex flex-col gap-[20px] flex-shrink-0">
                  <CustomRadio
                    name="displaySetting"
                    value="pos"
                    checked={formData.displaySetting === "pos"}
                    onChange={(e) =>
                      handleInputChange("displaySetting", e.target.value)
                    }
                    label="POS"
                  />
                  <CustomRadio
                    name="displaySetting"
                    value="website"
                    checked={formData.displaySetting === "website"}
                    onChange={(e) =>
                      handleInputChange("displaySetting", e.target.value)
                    }
                    label="Website"
                  />
                  <CustomRadio
                    name="displaySetting"
                    value="pos-website"
                    checked={formData.displaySetting === "pos-website"}
                    onChange={(e) =>
                      handleInputChange("displaySetting", e.target.value)
                    }
                    label="POS + Website"
                  />
                </div>
              </div>

              {/* Applied Products */}
              <div className="flex flex-col gap-[14px]">
                <div
                  className={`flex flex-row items-center gap-[16px] ${confirmedProducts.length > 0 ? "justify-between" : ""}`}
                >
                  <div className="flex flex-row items-center gap-[8px]">
                    <label className="font-semibold text-[14px] text-[#272424] leading-[1.4] w-[215px] flex-shrink-0 text-right">
                      Sản phẩm được áp dụng
                    </label>
                    {confirmedProducts.length > 0 && (
                      <span className="font-medium text-[14px] text-[#272424]">
                        {confirmedProducts.length} Sản phẩm được chọn
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(true)}
                      className="bg-white border border-[#e04d30] rounded-[8px] px-[12px] py-[8px] flex items-center gap-[8px] hover:bg-[#e04d30]/5 transition-colors"
                    >
                      <Icon name="plus" size={16} color="#e04d30" />
                      <span className="font-semibold text-[14px] text-[#e04d30] leading-[1.4]">
                        Thêm sản phẩm
                      </span>
                    </button>
                  </div>
                </div>

                {/* Products Table */}
                {confirmedProducts.length > 0 && (
                  <div className="bg-white border border-[#e7e7e7] rounded-[12px] overflow-hidden ml-[200px] sm:ml-[215px] max-w-[calc(100%-200px)] sm:max-w-[calc(100%-215px)] mt-[4px]">
                    <table className="w-full">
                      <thead className="bg-[#f5f5f5]">
                        <tr>
                          <th className="px-[16px] py-[12px] text-left font-semibold text-[14px] text-[#272424]">
                            Sản phẩm
                          </th>
                          <th className="px-[16px] py-[12px] text-left font-semibold text-[14px] text-[#272424]">
                            Đơn giá
                          </th>
                          <th className="px-[16px] py-[12px] text-center font-semibold text-[14px] text-[#272424]">
                            Hoạt động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {confirmedProducts
                          .slice(
                            (appliedProductsPage - 1) * 5,
                            appliedProductsPage * 5
                          )
                          .map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-[#e7e7e7] last:border-b-0"
                            >
                              <td className="px-[16px] py-[12px]">
                                <div className="flex items-center gap-[8px]">
                                  <div className="w-[32px] h-[32px] bg-[#f5f5f5] rounded-[6px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
                                      }}
                                    />
                                  </div>
                                  <span className="font-medium text-[14px] text-[#272424] truncate max-w-[300px]">
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-[16px] py-[12px]">
                                <span className="font-semibold text-[14px] text-[#272424]">
                                  {formatPriceDisplay(product.price)}
                                </span>
                              </td>
                              <td className="px-[16px] py-[12px] text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmedProducts((prev) =>
                                      prev.filter((p) => p.id !== product.id)
                                    );
                                  }}
                                  className="p-[8px] hover:bg-[#f5f5f5] rounded-[6px] transition-colors inline-flex items-center justify-center"
                                >
                                  <Icon
                                    name="trash"
                                    size={18}
                                    color="#e04d30"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {/* Pagination for Applied Products */}
                    {confirmedProducts.length > 5 && (
                      <div className="px-[16px] py-[12px] border-t border-[#e7e7e7] flex justify-end">
                        <div className="flex items-center gap-[8px]">
                          <button
                            onClick={() =>
                              setAppliedProductsPage((p) => Math.max(1, p - 1))
                            }
                            disabled={appliedProductsPage === 1}
                            className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                          >
                            <Icon name="arrow-left" size={14} color="#272424" />
                          </button>
                          {Array.from(
                            {
                              length: Math.ceil(confirmedProducts.length / 5),
                            },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setAppliedProductsPage(page)}
                              className={`w-[28px] h-[28px] flex items-center justify-center text-[13px] font-semibold rounded-[6px] transition-colors ${
                                appliedProductsPage === page
                                  ? "bg-[#e04d30] text-white"
                                  : "text-[#272424] hover:bg-[#f5f5f5]"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setAppliedProductsPage((p) =>
                                Math.min(
                                  Math.ceil(confirmedProducts.length / 5),
                                  p + 1
                                )
                              )
                            }
                            disabled={
                              appliedProductsPage >=
                              Math.ceil(confirmedProducts.length / 5)
                            }
                            className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                          >
                            <Icon
                              name="arrow-left"
                              size={14}
                              color="#272424"
                              className="rotate-180"
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[16px] justify-end w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBackClick}
              className="text-[14px]"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              className="text-[14px]"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Đang xử lý..." 
                : isEditMode 
                  ? "Lưu thay đổi" 
                  : "Xác nhận"}
            </Button>
          </div>
        </form>

        {/* Product Selection Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsProductModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[20px] w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col z-50">
              {/* Header */}
              <div className="px-[16px] py-[12px] border-b border-[#e7e7e7]">
                <h2 className="font-bold text-[16px] text-[#272424]">
                  Chọn sản phẩm
                </h2>
              </div>

              {/* Search Bar */}
              <div className="px-[16px] py-[12px] border-b border-[#e7e7e7]">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-[12px] py-[8px] border border-[#d1d1d1] rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#e04d30] focus:border-transparent"
                />
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                    Đang tải danh sách sản phẩm...
                  </div>
                ) : (
                <table className="w-full">
                  <thead className="bg-[#f5f5f5] sticky top-0">
                    <tr>
                      <th className="pl-[10px] pr-[2px] py-[8px] text-left font-semibold text-[12px] text-[#272424]">
                        <div className="flex items-center gap-[8px]">
                          <CustomCheckbox
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                          />
                          <span>Sản phẩm</span>
                        </div>
                      </th>
                        <th className="pl-[2px] pr-[10px] py-[8px] text-left font-semibold text-[12px] text-[#272424]">
                        Đơn giá
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                      {displayProducts.map((product) => {
                        const hasVariants = product.variants && product.variants.length > 0;
                        const isExpanded = expandedProducts.has(product.id);
                        const isProductSelected = selectedProducts.has(product.id);
                        
                        return (
                          <React.Fragment key={product.id}>
                            {/* Main Product Row */}
                            <tr className="border-b border-[#e7e7e7] hover:bg-gray-50">
                        <td className="pl-[10px] pr-[2px] py-[8px]">
                          <div className="flex items-center gap-[8px]">
                            <CustomCheckbox
                                    checked={isProductSelected && !hasVariants}
                              onChange={() => handleProductToggle(product.id)}
                            />
                                  {hasVariants && (
                                    <button
                                      onClick={() => toggleProductExpanded(product.id)}
                                      className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                                      title={isExpanded ? "Thu gọn variants" : "Mở rộng variants"}
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-3 h-3 text-gray-500" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 text-gray-500" />
                                      )}
                                    </button>
                                  )}
                                  {!hasVariants && <div className="w-5 h-5 flex-shrink-0"></div>}
                                  <div className="w-[40px] h-[40px] bg-[#f5f5f5] rounded-[4px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-[4px]"
                                onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-gray-400 text-xs">No Image</span>
                                      </div>
                                    )}
                            </div>
                            <div className="flex flex-col gap-[2px] min-w-0">
                              <span className="font-medium text-[12px] text-[#272424] truncate">
                                {product.name}
                              </span>
                            </div>
                          </div>
                        </td>
                              <td className="pl-[2px] pr-[10px] py-[8px]">
                          <span className="font-semibold text-[12px] text-[#272424]">
                                  {formatPriceDisplay(product.price)}
                          </span>
                        </td>
                            </tr>
                            
                            {/* Variant Rows */}
                            {hasVariants && isExpanded && product.variants.map((variant) => {
                              const isVariantSelected = selectedVariants.has(String(variant.id));
                              const variantPrice = formatPrice(variant.sellingPrice);
                              
                              return (
                                <tr
                                  key={variant.id}
                                  className="bg-[#f6f6f6] border-b border-[#e7e7e7] hover:bg-gray-100"
                                >
                                  <td className="pl-[10px] pr-[2px] py-[8px]">
                                    <div className="flex items-center gap-[8px]">
                                      <div className="w-[16px] h-[16px] flex-shrink-0"></div>
                                      <div className="w-5 h-5 flex-shrink-0"></div>
                                      <CustomCheckbox
                                        checked={isVariantSelected}
                                        onChange={() => handleVariantToggle(String(variant.id), product.id)}
                                      />
                                      <div className="w-[40px] h-[40px] flex-shrink-0 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                                          <span className="text-xs text-gray-500 font-medium">V</span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-[2px] min-w-0">
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-0.5 bg-gray-300"></div>
                                          <span className="font-medium text-[12px] text-[#272424] text-gray-600">
                                            {variant.nameDetail || `Biến thể ${variant.id}`}
                                          </span>
                                        </div>
                                        {variant.barcode && (
                                          <span className="font-normal text-[10px] text-[#737373] truncate ml-5">
                                            Mã barcode: {variant.barcode}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="pl-[2px] pr-[10px] py-[8px]">
                          <span className="font-semibold text-[12px] text-[#272424]">
                                      {formatPriceDisplay(variantPrice)}
                          </span>
                        </td>
                      </tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                      {displayProducts.length === 0 && !isLoadingProducts && (
                        <tr>
                          <td colSpan={2} className="px-[16px] py-[24px] text-center text-gray-500">
                            Không tìm thấy sản phẩm
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
                )}
              </div>

              {/* Footer with Pagination and Buttons */}
              <div className="px-[16px] py-[10px] border-t border-[#e7e7e7] flex flex-col gap-[10px]">
                {/* Pagination Section */}
                <div className="flex items-center justify-center gap-[4px]">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                  >
                    <Icon name="arrow-left" size={14} color="#272424" />
                  </button>

                  <div className="flex items-center gap-[4px]">
                    {getPageNumbers().map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-[6px] text-[12px] text-[#272424]"
                          >
                            ...
                          </span>
                        );
                      }
                      const pageNum = page as number;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-[24px] h-[24px] flex items-center justify-center text-[12px] font-semibold rounded-[4px] transition-colors ${
                            isActive
                              ? "bg-[#e04d30] text-white"
                              : "text-[#272424] hover:bg-[#f5f5f5]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-[6px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5] transition-colors rounded-[6px]"
                  >
                    <Icon
                      name="arrow-left"
                      size={14}
                      color="#272424"
                      className="rotate-180"
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-[8px] justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsProductModalOpen(false)}
                    className="text-[12px] px-[14px] py-[6px] border border-[#d1d5db] text-[#272424] bg-white hover:bg-[#f5f5f5]"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      const newProducts: VoucherProduct[] = [];
                      
                      // Add selected products (without variants)
                      displayProducts.forEach((product) => {
                        if (selectedProducts.has(product.id)) {
                          const hasVariants = product.variants && product.variants.length > 0;
                          // Only add product if it has no variants or no variants are selected
                          if (!hasVariants || !product.variants.some((v) => selectedVariants.has(String(v.id)))) {
                            newProducts.push({
                              id: product.id,
                              name: product.name,
                              image: product.image,
                              barcode: product.barcode,
                              price: product.price,
                              available: product.available,
                              variantId: undefined,
                            });
                          }
                        }
                      });
                      
                      // Add selected variants
                      displayProducts.forEach((product) => {
                        if (product.variants) {
                          product.variants.forEach((variant) => {
                            if (selectedVariants.has(String(variant.id))) {
                              const variantPrice = formatPrice(variant.sellingPrice);
                              newProducts.push({
                                id: `${product.id}-${variant.id}`,
                                name: `${product.name} - ${variant.nameDetail || `Biến thể ${variant.id}`}`,
                                image: product.image,
                                barcode: variant.barcode || product.barcode,
                                price: variantPrice,
                                available: variant.availableQuantity ?? 0,
                                variantId: String(variant.id),
                              });
                            }
                          });
                        }
                      });
                      
                      setConfirmedProducts((prev) => {
                        // Merge với danh sách hiện tại, tránh trùng lặp
                        const existingIds = new Set(prev.map((p) => p.id));
                        const uniqueNewProducts = newProducts.filter(
                          (p) => !existingIds.has(p.id)
                        );
                        return [...prev, ...uniqueNewProducts];
                      });
                      setSelectedProducts(new Set());
                      setSelectedVariants(new Set());
                      setIsProductModalOpen(false);
                      // Reset pagination về trang 1 sau khi thêm sản phẩm mới
                      setAppliedProductsPage(1);
                    }}
                    className="text-[12px] px-[14px] py-[6px] bg-[#e04d30] hover:bg-[#e04d30]/90 text-white"
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-[calc(100vh-100px)]"></div>
    </div>
  );
};

export default AdminCreateVoucherProduct;
