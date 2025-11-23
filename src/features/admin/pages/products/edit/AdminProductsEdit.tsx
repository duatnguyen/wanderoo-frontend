import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminProductsNew from "../create/AdminProductsNew";
import type {
  ProductAttribute,
  ProductFormData,
  ProductImage,
  ProductVersion,
} from "@/types/product";
import { PageContainer, ContentCard } from "@/components/common";
import {
  getProductDetailPrivate,
  getProductVariantsPrivate,
} from "@/api/endpoints/productApi";
import type { ProductDetailsResponse } from "@/types";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const VARIANT_PAGE_SIZE = 20;

const AdminProductsEdit: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetailsResponse | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [variantPagination, setVariantPagination] = useState({
    page: 0,
    pageSize: VARIANT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) {
        setError("Product ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const productIdNum = parseInt(productId, 10);
        if (isNaN(productIdNum)) {
          setError("Invalid product ID");
          setIsLoading(false);
          return;
        }

        // Load product detail
        const productData = await getProductDetailPrivate(productIdNum);
        setProductDetail(productData);

        // Load variants
        const variantResponse = await getProductVariantsPrivate(productIdNum, {
          page: 0,
          size: VARIANT_PAGE_SIZE,
        });
        setVariants(variantResponse.variants || []);
        setVariantPagination({
          page: variantResponse.pageNumber ?? 0,
          pageSize: variantResponse.pageSize ?? VARIANT_PAGE_SIZE,
          total: variantResponse.totalElements ?? 0,
          totalPages: variantResponse.totalPages ?? 1,
        });
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  const stripCurrency = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value.toString();
    return value.toString().replace(/[^\d]/g, "");
  };

  const initialFormData: Partial<ProductFormData> | undefined = useMemo(() => {
    if (!productDetail) return undefined;

    return {
      productName: productDetail.name || "",
      barcode: "",
      category: productDetail.categoryResponse?.name || "",
      categoryId: productDetail.categoryResponse?.id || null,
      brand: productDetail.brandResponse?.name || "",
      brandId: productDetail.brandResponse?.id || null,
      description: productDetail.description || "",
      costPrice: "",
      sellingPrice: "",
      inventory: "",
      available: "",
      weight: productDetail.packagedWeight
        ? productDetail.packagedWeight.toString()
        : "",
      length: productDetail.length ? productDetail.length.toString() : "",
      width: productDetail.width ? productDetail.width.toString() : "",
      height: productDetail.height ? productDetail.height.toString() : "",
    };
  }, [productDetail]);

  const initialImages: ProductImage[] = useMemo(() => {
    if (!productDetail) return [];

    if (productDetail.images && productDetail.images.length > 0) {
      return productDetail.images.map((img, index) => ({
        id: `img-${index}-${Date.now()}`,
        url: img,
      }));
    }

    // Note: ProductDetailsResponse doesn't have imageUrl, only images array

    return [];
  }, [productDetail]);

  const initialAttributes: ProductAttribute[] = useMemo(() => {
    if (!productDetail || !productDetail.attributes) return [];
    return productDetail.attributes.map((attr) => ({
      name: attr.name,
      values: attr.values?.map((v) => v.value) || [],
    }));
  }, [productDetail]);

  const initialVersions: ProductVersion[] = useMemo(() => {
    if (!variants || variants.length === 0) return [];

    return variants.map((variant) => ({
      id: String(variant.id),
      name: variant.nameDetail || variant.skuDetail || `Phiên bản #${variant.id}`,
      price:
        variant.sellingPrice !== undefined && variant.sellingPrice !== null
          ? String(variant.sellingPrice)
          : "",
      costPrice:
        variant.importPrice !== undefined && variant.importPrice !== null
          ? String(variant.importPrice)
          : "",
      inventory:
        variant.totalQuantity !== undefined && variant.totalQuantity !== null
          ? String(variant.totalQuantity)
          : "",
      available:
        variant.availableQuantity !== undefined &&
        variant.availableQuantity !== null
          ? String(variant.availableQuantity)
          : "",
      image: variant.imageUrl ?? null,
      sku: variant.skuDetail ?? "",
      barcode: variant.barcode ?? "",
    }));
  }, [variants]);

  const handleBack = () => {
    navigate("/admin/products/all");
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-[16px] font-['Montserrat'] font-medium text-[#6b7280] mt-4">
              Đang tải thông tin sản phẩm...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error || !productDetail || !initialFormData) {
    return (
      <PageContainer>
        <ContentCard>
          <div className="text-center py-[60px]">
            <div className="w-20 h-20 bg-[#fef2f2] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-[#dc2626]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#1f2937] mb-4">
              {error || "Không tìm thấy sản phẩm"}
            </h2>
            <p className="text-[16px] text-[#6b7280] mb-6 max-w-md mx-auto">
              {error
                ? "Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau."
                : `Sản phẩm với ID "${productId}" không tồn tại trong hệ thống.`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleBack}
                className="bg-[#e04d30] hover:bg-[#c74429] text-white px-[20px] py-[12px] rounded-[10px] text-[14px] font-['Montserrat'] font-semibold transition-colors"
              >
                Quay lại danh sách
              </button>
              {error && (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white hover:bg-[#f9fafb] text-[#374151] border border-[#d1d5db] px-[20px] py-[12px] rounded-[10px] text-[14px] font-['Montserrat'] font-semibold transition-colors"
                >
                  Thử lại
                </button>
              )}
            </div>
          </div>
        </ContentCard>
      </PageContainer>
    );
  }

  // Success state - render form
  return (
    <AdminProductsNew
      key={productId}
      mode="edit"
      productId={productId ? parseInt(productId, 10) : null}
      initialFormData={initialFormData}
      initialImages={initialImages}
      initialAttributes={initialAttributes}
      initialVersions={initialVersions}
      initialVariantPagination={variantPagination}
      onBack={handleBack}
      title="Chỉnh sửa sản phẩm"
    />
  );
};

export default AdminProductsEdit;
