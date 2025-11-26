import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
import { getAllProductsPrivate, getVariantDetailPrivate, getProductVariantsPrivate } from "@/api/endpoints/productApi";
import type { AdminProductResponse } from "@/types";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDiscount, getDiscountDetail, updateDiscount, applyDiscountToProducts, getProductDetailIdsByDiscountId, removeDiscountFromProducts } from "@/api/endpoints/discountApi";
import type { AdminDiscountCreateRequest, AdminDiscountResponse } from "@/types/discount";

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

const applyOnToDisplaySetting: Record<AdminDiscountCreateRequest["applyOn"], VoucherFormData["displaySetting"]> = {
  POS: "pos",
  WEBSITE: "website",
  BOTH: "pos-website",
};

const AdminCreateVoucherProduct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const discountIdQuery = searchParams.get("id");
  const discountIdFromQuery = discountIdQuery ? Number(discountIdQuery) : undefined;
  const { voucher } = (location.state as EditLocationState | undefined) || {};
  const editData = voucher?.editData;
  const stateDiscountId = voucher?.id ? Number(voucher.id) : undefined;
  const fetchDiscountId = useMemo(() => {
    if (discountIdFromQuery && !Number.isNaN(discountIdFromQuery)) {
      return discountIdFromQuery;
    }
    if (stateDiscountId && !Number.isNaN(stateDiscountId)) {
      return stateDiscountId;
    }
    return undefined;
  }, [discountIdFromQuery, stateDiscountId]);
  const isEditMode = Boolean(fetchDiscountId);
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
  const topElementRef = useRef<HTMLDivElement>(null);
  const [variantLoadingMap, setVariantLoadingMap] = useState<Record<string, boolean>>({});
  const [productVariantsMap, setProductVariantsMap] = useState<Record<string, Array<{ id: number; nameDetail?: string; sellingPrice?: number | string }>>>({});

  const numericFields: Array<keyof VoucherFormData> = [
    "discountValue",
    "maxDiscountValue",
    "minOrderAmount",
    "maxUsage",
    "maxUsagePerCustomer",
  ];

  const sanitizeNumericInput = (value: string) => value.replace(/[^0-9]/g, "");

  // Scroll to top when component mounts or route changes
  useEffect(() => {
    const scrollToTop = () => {
      // Method 1: Scroll window
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      
      // Method 2: Scroll document elements
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 3: Scroll using ref element
      if (topElementRef.current) {
        topElementRef.current.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
      }
      
      // Method 4: Scroll main container if it exists
      const mainContainer = document.querySelector('.w-full.overflow-x-auto.min-h-screen');
      if (mainContainer) {
        (mainContainer as HTMLElement).scrollTop = 0;
        (mainContainer as HTMLElement).scrollLeft = 0;
      }
      
      // Method 5: Scroll to header element
      const header = document.querySelector('h1.font-montserrat');
      if (header) {
        (header as HTMLElement).scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
      }
      
      // Method 6: Try to find and scroll any scrollable parent
      const scrollableParents = document.querySelectorAll('[style*="overflow"], [class*="overflow"]');
      scrollableParents.forEach((parent) => {
        const element = parent as HTMLElement;
        if (element.scrollTop > 0) {
          element.scrollTop = 0;
        }
      });
    };
    
    // Immediate scroll
    scrollToTop();
    // Try multiple times with delays to ensure it works
    const timeoutId1 = setTimeout(scrollToTop, 0);
    const timeoutId2 = setTimeout(scrollToTop, 10);
    const timeoutId3 = setTimeout(scrollToTop, 50);
    const timeoutId4 = setTimeout(scrollToTop, 100);
    const timeoutId5 = setTimeout(scrollToTop, 200);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
      clearTimeout(timeoutId5);
    };
  }, [location.pathname, location.search]);

  // Only use editData for products if discountDetail is not available yet (fallback)
  // Otherwise, always use discountDetail from API (similar to shop-wide voucher)
  useEffect(() => {
    // If we have discountDetail from API, it will be handled by the discountDetail useEffect
    // Only use editData as fallback if no fetchDiscountId (shouldn't happen in edit mode)
    if (!fetchDiscountId && isEditMode && editData) {
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
    } else if (!fetchDiscountId) {
      setFormData(createDefaultFormData());
      setConfirmedProducts([]);
      setSelectedProducts(new Set());
      setAppliedProductsPage(1);
    }
  }, [fetchDiscountId, isEditMode, editData]);

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
      barcode: "---",
      price,
      available: product.availableQuantity ?? 0,
    };
  };

  const displayProducts = useMemo(() => {
    return products.map(mapProductToDisplay);
  }, [products]);

  const handleProductToggle = (productId: string) => {
    const shouldSelect = !selectedProducts.has(productId);
    const variants = productVariantsMap[productId] ?? [];

    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (shouldSelect) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });

    // Also select/deselect all variants if loaded
    if (variants.length > 0) {
      setSelectedVariants((prev) => {
        const newSet = new Set(prev);
        variants.forEach((variant) => {
          const variantId = String(variant.id);
          if (shouldSelect) {
            newSet.add(variantId);
          } else {
            newSet.delete(variantId);
          }
        });
        return newSet;
      });
    }
  };

  const handleVariantToggle = (variantId: string, productId: string) => {
    const variants = productVariantsMap[productId] ?? [];
    const variantIds = variants.map((variant) => String(variant.id));

    setSelectedVariants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) {
        newSet.delete(variantId);
      } else {
        newSet.add(variantId);
      }

      setSelectedProducts((prevProducts) => {
        const productSet = new Set(prevProducts);
        if (variantIds.length > 0 && variantIds.every((id) => newSet.has(id))) {
          productSet.add(productId);
        } else {
          productSet.delete(productId);
        }
        return productSet;
      });

      return newSet;
    });
  };

  const loadProductVariants = useCallback(async (productId: string) => {
    if (variantLoadingMap[productId] || productVariantsMap[productId]) {
      return;
    }
    
    setVariantLoadingMap((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await getProductVariantsPrivate(Number(productId), {
        page: 0,
        size: 50,
      });
      const variants = response?.variants?.map((v) => ({
        id: v.id,
        nameDetail: v.nameDetail,
        sellingPrice: v.sellingPrice,
      })) ?? [];
      setProductVariantsMap((prev) => ({ ...prev, [productId]: variants }));
    } catch (error) {
      console.error("Không thể tải biến thể sản phẩm", error);
    } finally {
      setVariantLoadingMap((prev) => ({ ...prev, [productId]: false }));
    }
  }, [variantLoadingMap, productVariantsMap]);

  const toggleProductExpanded = (productId: string) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
        // Load variants when expanding
        loadProductVariants(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (displayProducts.length === 0) return;

    const allProductIds = new Set(displayProducts.map((p) => p.id));
    const allVariantIds = new Set<string>();

    displayProducts.forEach((product) => {
      const variants = productVariantsMap[product.id] ?? [];
      variants.forEach((variant) => {
        allVariantIds.add(String(variant.id));
      });
    });

    const shouldDeselectAll =
      displayProducts.every((product) => selectedProducts.has(product.id));

    if (shouldDeselectAll) {
      setSelectedProducts(new Set());
      setSelectedVariants(new Set());
      return;
    }

    setSelectedProducts(allProductIds);
    setSelectedVariants(allVariantIds);
  };

  const isAllSelected = useMemo(() => {
    if (displayProducts.length === 0) return false;
    return displayProducts.every((product) => selectedProducts.has(product.id));
  }, [displayProducts, selectedProducts]);

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

  // Fetch discount detail if edit mode (similar to shop-wide voucher)
  const {
    data: discountDetail,
    error: discountDetailError,
  } = useQuery<AdminDiscountResponse, Error>({
    queryKey: ["admin-discount-detail", fetchDiscountId ?? "new"] as const,
    queryFn: () => getDiscountDetail(fetchDiscountId!),
    enabled: Boolean(fetchDiscountId),
    staleTime: 30000,
  });

  // Fetch product detail IDs when editing
  // Only fetch if discount is PRODUCT_DISCOUNT category
  const shouldFetchProductDetails = useMemo(() => {
    const should = Boolean(fetchDiscountId) && discountDetail?.category === "PRODUCT_DISCOUNT";
    console.log("shouldFetchProductDetails computed:", should, "fetchDiscountId:", fetchDiscountId, "category:", discountDetail?.category);
    return should;
  }, [fetchDiscountId, discountDetail?.category]);
  
  const { data: productDetailIds, isLoading: isLoadingProductDetailIds, error: productDetailIdsError } = useQuery({
    queryKey: ["admin-discount-product-details", fetchDiscountId],
    queryFn: async () => {
      console.log("Fetching product detail IDs for discount:", fetchDiscountId);
      const ids = await getProductDetailIdsByDiscountId(fetchDiscountId!);
      console.log("Received product detail IDs:", ids);
      return ids;
    },
    enabled: shouldFetchProductDetails,
    staleTime: 30000,
    // Refetch when discountDetail changes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log("=== Query State Debug ===");
    console.log("fetchDiscountId:", fetchDiscountId);
    console.log("discountDetail:", discountDetail);
    console.log("discountDetail?.category:", discountDetail?.category);
    console.log("shouldFetchProductDetails:", shouldFetchProductDetails);
    console.log("productDetailIds:", productDetailIds);
    console.log("isLoadingProductDetailIds:", isLoadingProductDetailIds);
    console.log("productDetailIdsError:", productDetailIdsError);
    console.log("=========================");
  }, [fetchDiscountId, discountDetail, shouldFetchProductDetails, productDetailIds, isLoadingProductDetailIds, productDetailIdsError]);

  useEffect(() => {
    if (productDetailIdsError) {
      console.error("Error fetching product detail IDs:", productDetailIdsError);
      toast.error("Không thể tải danh sách sản phẩm đã áp dụng discount");
    }
  }, [productDetailIdsError]);

  // Load product details when product detail IDs are available
  useEffect(() => {
    const loadProductDetails = async () => {
      if (!fetchDiscountId) {
        console.log("No fetchDiscountId, skipping load");
        return;
      }
      
      if (isLoadingProductDetailIds) {
        console.log("Still loading product detail IDs, waiting...");
        return;
      }
      
      console.log("=== Loading product details ===");
      console.log("productDetailIds:", productDetailIds);
      console.log("discountDetail category:", discountDetail?.category);
      console.log("isLoadingProductDetailIds:", isLoadingProductDetailIds);
      
      // Check if we have product detail IDs
      console.log("Checking productDetailIds:", productDetailIds);
      console.log("Type of productDetailIds:", typeof productDetailIds);
      console.log("Is array?", Array.isArray(productDetailIds));
      console.log("Length:", productDetailIds?.length);
      
      if (productDetailIds && Array.isArray(productDetailIds) && productDetailIds.length > 0) {
        try {
          console.log(`Loading ${productDetailIds.length} product details...`);
          const productDetails: VoucherProduct[] = [];
          
          // Load all products once to avoid multiple API calls
          let allProductsCache: AdminProductResponse[] | null = null;
          
          for (const productDetailId of productDetailIds) {
            try {
              const variantDetail = await getVariantDetailPrivate(productDetailId);
              if (variantDetail) {
                // Load all products only once
                if (!allProductsCache) {
                  const allProductsResponse = await getAllProductsPrivate({ page: 0, size: 1000 });
                  allProductsCache = allProductsResponse?.productResponseList ?? [];
                  console.log(`Loaded ${allProductsCache.length} products for searching`);
                }
                
                // Find the product that contains this variant
                const product = allProductsCache.find(p => 
                  p.productDetails?.some(pd => pd.id === productDetailId)
                );
                
                if (product) {
                  const variant = product.productDetails?.find(pd => pd.id === productDetailId);
                  if (variant) {
                    productDetails.push({
                      id: `${product.id}-${variant.id}`,
                      name: `${product.name}${variant.nameDetail ? ` - ${variant.nameDetail}` : ''}`,
                      image: variant.imageUrl || product.imageUrl || "",
                      barcode: variant.barcode || "",
                      price: typeof variant.sellingPrice === 'number' ? variant.sellingPrice : Number(variant.sellingPrice) || 0,
                      available: variant.availableQuantity || 0,
                      variantId: String(variant.id),
                    });
                    console.log(`Loaded product: ${product.name} - ${variant.nameDetail || variant.id}`);
                  }
                } else {
                  // If product not found, use variant detail directly
                  productDetails.push({
                    id: String(productDetailId),
                    name: variantDetail.nameDetail || `Product Detail ${productDetailId}`,
                    image: variantDetail.imageUrl || "",
                    barcode: variantDetail.barcode || "",
                    price: typeof variantDetail.sellingPrice === 'number' ? variantDetail.sellingPrice : Number(variantDetail.sellingPrice) || 0,
                    available: variantDetail.availableQuantity || 0,
                    variantId: String(productDetailId),
                  });
                  console.log(`Loaded variant directly: ${variantDetail.nameDetail || productDetailId}`);
                }
              }
            } catch (error) {
              console.error(`Error loading product detail ${productDetailId}:`, error);
            }
          }
          
          console.log(`Successfully loaded ${productDetails.length} product details`);
          console.log("Product details:", productDetails);
          setConfirmedProducts(productDetails);
        } catch (error) {
          console.error("Error loading product details:", error);
          toast.error("Không thể tải danh sách sản phẩm đã áp dụng discount");
        }
      } else if (productDetailIds && productDetailIds.length === 0) {
        console.log("No product details found for this discount");
        setConfirmedProducts([]);
      } else if (!isLoadingProductDetailIds && !productDetailIds && shouldFetchProductDetails) {
        // Query completed but returned no data (or error)
        console.log("Query completed but no product detail IDs returned");
        // Don't clear here - might be an error, keep existing products if any
      } else if (isLoadingProductDetailIds) {
        console.log("Still loading product detail IDs...");
        // Don't do anything while loading
      } else if (!shouldFetchProductDetails) {
        console.log("Should not fetch product details - category:", discountDetail?.category);
        // Only clear if we're sure this is not a product discount
        if (discountDetail && discountDetail.category !== "PRODUCT_DISCOUNT") {
          setConfirmedProducts([]);
        }
      }
    };

    // Only run loadProductDetails if we have all required conditions
    if (fetchDiscountId && discountDetail?.category === "PRODUCT_DISCOUNT" && !isLoadingProductDetailIds) {
      loadProductDetails();
    } else {
      console.log("Skipping load - fetchDiscountId:", fetchDiscountId, "category:", discountDetail?.category, "isLoading:", isLoadingProductDetailIds);
    }
  }, [productDetailIds, fetchDiscountId, discountDetail, isLoadingProductDetailIds, shouldFetchProductDetails]);

  // Map discount detail to form data (similar to shop-wide voucher)
  const mapDetailToFormData = (detail: AdminDiscountResponse): VoucherFormData => ({
    voucherName: detail.name ?? "",
    voucherCode: detail.code ?? "",
    description: detail.description ?? "",
    startDate: detail.startDate ? formatDateTimeForInput(detail.startDate) : "",
    endDate: detail.endDate ? formatDateTimeForInput(detail.endDate) : "",
    discountType: detail.type === "PERCENT" ? "percentage" : "fixed",
    discountValue: detail.value != null ? detail.value.toString() : "",
    maxDiscountLimit: detail.maxOrderValue != null ? "limited" : "unlimited",
    maxDiscountValue: detail.maxOrderValue != null ? detail.maxOrderValue.toString() : "",
    minOrderAmount: detail.minOrderValue != null ? detail.minOrderValue.toString() : "",
    maxUsage: detail.quantity != null ? detail.quantity.toString() : "",
    maxUsagePerCustomer: detail.discountUsage != null ? detail.discountUsage.toString() : "",
    displaySetting: applyOnToDisplaySetting[detail.applyOn] ?? "website",
  });

  // Update form data when discount detail is fetched (similar to shop-wide voucher)
  useEffect(() => {
    if (discountDetail) {
      setFormData(mapDetailToFormData(discountDetail));
    }
  }, [discountDetail]);

  useEffect(() => {
    if (discountDetailError) {
      handleApiError(discountDetailError);
    }
  }, [discountDetailError]);

  const handleApiError = (error: unknown) => {
    const message =
      (error as any)?.response?.data?.message ?? "Đã xảy ra lỗi. Vui lòng thử lại.";
    toast.error(message);
  };

  const createDiscountMutation = useMutation({
    mutationFn: (payload: AdminDiscountCreateRequest) => createDiscount(payload),
    onSuccess: async (response) => {
      const discountId = response.data;
      if (discountId && confirmedProducts.length > 0) {
        // Extract product detail IDs from confirmed products
        const productDetailIds = confirmedProducts
          .map((product) => {
            // If product has variantId, use it (this is the product detail ID)
            if (product.variantId) {
              return Number(product.variantId);
            }
            // If product.id contains variant info (format: "productId-variantId")
            const parts = product.id.split("-");
            if (parts.length > 1) {
              return Number(parts[parts.length - 1]);
            }
            // If no variantId and no variant info in id, this product doesn't have a valid product detail ID
            console.warn("Product without valid product detail ID:", product);
            return null;
          })
          .filter((id): id is number => id !== null && !Number.isNaN(id));

        console.log("Extracted product detail IDs:", productDetailIds);
        
        if (productDetailIds.length > 0) {
          try {
            await applyDiscountToProducts(discountId, productDetailIds);
          } catch (error) {
            console.error("Error applying discount to products:", error);
            handleApiError(error);
            return;
          }
        } else {
          console.warn("No valid product detail IDs found to apply discount");
        }
      }
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      toast.success("Tạo mã giảm giá thành công");
      navigate("/admin/discounts");
    },
    onError: handleApiError,
  });

  const updateDiscountMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminDiscountCreateRequest }) =>
      updateDiscount(id, payload),
    onSuccess: async (_, variables) => {
      const discountId = variables.id;
      
      // Get old product detail IDs
      let oldProductDetailIds: number[] = [];
      try {
        oldProductDetailIds = await getProductDetailIdsByDiscountId(discountId);
      } catch (error) {
        console.error("Error getting old product detail IDs:", error);
      }

      // Extract new product detail IDs from confirmed products
      const newProductDetailIds = confirmedProducts
        .map((product) => {
          if (product.variantId) {
            return Number(product.variantId);
          }
          const parts = product.id.split("-");
          if (parts.length > 1) {
            return Number(parts[parts.length - 1]);
          }
          console.warn("Product without valid product detail ID:", product);
          return null;
        })
        .filter((id): id is number => id !== null && !Number.isNaN(id));

      console.log("Old product detail IDs:", oldProductDetailIds);
      console.log("New product detail IDs:", newProductDetailIds);

      // Find product details to remove discount from (in old but not in new)
      const productDetailIdsToRemove = oldProductDetailIds.filter(
        id => !newProductDetailIds.includes(id)
      );

      // Find product details to apply discount to (in new but not in old)
      const productDetailIdsToApply = newProductDetailIds.filter(
        id => !oldProductDetailIds.includes(id)
      );

      try {
        // Remove discount from old product details
        if (productDetailIdsToRemove.length > 0) {
          await removeDiscountFromProducts(discountId, productDetailIdsToRemove);
        }

        // Apply discount to new product details
        if (productDetailIdsToApply.length > 0) {
          await applyDiscountToProducts(discountId, productDetailIdsToApply);
        }
      } catch (error) {
        console.error("Error updating product discount assignments:", error);
        handleApiError(error);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-discount-product-details"] });
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
    const quantity = formData.maxUsage ? Number(formData.maxUsage) : 1;
    
    // Parse discountUsage - send null if empty to ensure backend updates the field
    const discountUsageValue = formData.maxUsagePerCustomer?.trim();
    let discountUsage: number | null = null;
    if (discountUsageValue) {
      const parsed = Number(discountUsageValue);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        discountUsage = parsed;
      }
    }
    // If empty, keep as null (not undefined) so backend knows to clear/update the field
    
    console.log("Building payload:");
    console.log("  - maxUsagePerCustomer (raw):", formData.maxUsagePerCustomer);
    console.log("  - discountUsage (parsed):", discountUsage);
    console.log("  - quantity:", quantity);
    
    const payload: AdminDiscountCreateRequest = {
      name: formData.voucherName.trim(),
      code: formData.voucherCode.trim().toUpperCase(),
      category: "PRODUCT_DISCOUNT",
      type: discountTypeToEnum[formData.discountType],
      applyTo: "PRODUCT",
      applyOn: displaySettingToApplyOn[formData.displaySetting],
      value: Number(formData.discountValue),
      minOrderValue: parseOptionalNumber(formData.minOrderAmount) ?? null,
      maxOrderValue:
        formData.maxDiscountLimit === "limited"
          ? (parseOptionalNumber(formData.maxDiscountValue) ?? null)
          : null,
      discountUsage: discountUsage, // Send null if empty, number if has value
      contextAllowed: "OTHER",
      startDate: normalizeDateValue(formData.startDate),
      endDate: normalizeDateValue(formData.endDate),
      quantity: quantity,
      status: "ENABLE",
      description: formData.description?.trim() || null,
    };
    
    console.log("Final payload:", JSON.stringify(payload, null, 2));
    
    return payload;
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
    <div className="w-full overflow-x-auto min-h-screen" ref={topElementRef}>
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
                  <div className="bg-white border border-[#e7e7e7] rounded-[12px] overflow-hidden ml-[231px] w-[873px] mt-[4px]">
                    <table className="w-full">
                      <thead className="bg-[#f5f5f5]">
                        <tr>
                          <th className="px-[16px] py-[12px] text-left font-semibold text-[14px] text-[#272424] w-[70%]">
                            Sản phẩm
                          </th>
                          <th className="px-[16px] py-[12px] text-right font-semibold text-[14px] text-[#272424] w-[20%]">
                            Đơn giá
                          </th>
                          <th className="px-[16px] py-[12px] text-center font-semibold text-[14px] text-[#272424] w-[10%]">
                            TT
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
                              <td className="px-[16px] py-[12px] w-[70%]">
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
                                  <span className="font-medium text-[14px] text-[#272424] truncate max-w-[500px]">
                                    {product.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-[16px] py-[12px] text-right w-[20%]">
                                <span className="font-semibold text-[14px] text-[#272424]">
                                  {formatPriceDisplay(product.price)}
                                </span>
                              </td>
                              <td className="px-[16px] py-[12px] text-center w-[10%]">
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
                        const isExpanded = expandedProducts.has(product.id);
                        const variants = productVariantsMap[product.id] ?? [];
                        const isLoadingVariants = variantLoadingMap[product.id] ?? false;
                        
                        return (
                          <React.Fragment key={product.id}>
                            {/* Main Product Row */}
                            <tr className="border-b border-[#e7e7e7] hover:bg-gray-50">
                              <td className="pl-[10px] pr-[2px] py-[8px]">
                                <div className="flex items-center gap-[8px]">
                                  <button
                                    type="button"
                                    onClick={() => toggleProductExpanded(product.id)}
                                    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                                    title={isExpanded ? "Thu gọn biến thể" : "Xem biến thể"}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-3 h-3 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3 text-gray-500" />
                                    )}
                                  </button>
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
                            
                            {/* Loading Variants */}
                            {isExpanded && isLoadingVariants && (
                              <tr className="bg-[#f6f6f6] border-b border-[#e7e7e7]">
                                <td colSpan={2} className="px-[16px] py-[12px] text-center text-gray-500 text-[12px]">
                                  Đang tải biến thể...
                                </td>
                              </tr>
                            )}
                            
                            {/* No Variants */}
                            {isExpanded && !isLoadingVariants && variants.length === 0 && (
                              <tr className="bg-[#f6f6f6] border-b border-[#e7e7e7]">
                                <td colSpan={2} className="px-[16px] py-[12px] text-center text-gray-500 text-[12px]">
                                  Sản phẩm này chưa có biến thể
                                </td>
                              </tr>
                            )}
                            
                            {/* Variant Rows */}
                            {isExpanded && !isLoadingVariants && variants.map((variant) => {
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
                                          <span className="font-medium text-[12px] text-gray-600">
                                            {variant.nameDetail || `Biến thể ${variant.id}`}
                                          </span>
                                        </div>
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
                      
                      // Add selected products (only those without variants)
                      // Add selected variants from productVariantsMap
                      displayProducts.forEach((product) => {
                        const variants = productVariantsMap[product.id] ?? [];
                        variants.forEach((variant) => {
                          if (selectedVariants.has(String(variant.id))) {
                            const variantPrice = formatPrice(variant.sellingPrice);
                            newProducts.push({
                              id: `${product.id}-${variant.id}`,
                              name: `${product.name} - ${variant.nameDetail || `Biến thể ${variant.id}`}`,
                              image: product.image,
                              barcode: product.barcode,
                              price: variantPrice,
                              available: 0,
                              variantId: String(variant.id),
                            });
                          }
                        });
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
