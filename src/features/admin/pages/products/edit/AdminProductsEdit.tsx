import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminProductsNew from "../create/AdminProductsNew";
import type {
  ProductAttribute,
  ProductFormData,
  ProductImage,
  ProductVersion,
} from "@/types/product";
import { PageContainer, ContentCard } from "@/components/common";
import { getProductDetailPrivate, getProductVariantsPrivate } from "@/api/endpoints/productApi";
import type { ProductDetailsResponse, ProductVariantListResponse } from "@/types";

const VARIANT_PAGE_SIZE = 20;

const AdminProductsEdit: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetailsResponse | null>(null);
  const [variants, setVariants] = useState<ProductVariantListResponse | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setError("Product ID is required");
        setIsLoading(false);
        return;
      }

      const numericId = parseInt(productId, 10);
      if (isNaN(numericId)) {
        setError("Invalid Product ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch product detail and variants in parallel
        const [detailResponse, variantsResponse] = await Promise.all([
          getProductDetailPrivate(numericId),
          getProductVariantsPrivate(numericId, { page: 0, size: VARIANT_PAGE_SIZE, sort: "asc" }),
        ]);

        setProductDetail(detailResponse);
        setVariants(variantsResponse);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const stripCurrency = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return "";
    return String(value).replace(/[^\d]/g, "");
  };

  // Transform API response to form data
  const initialFormData: Partial<ProductFormData> | undefined = productDetail
    ? {
        productName: productDetail.name || "",
        barcode: productDetail.barcode || "",
        category: productDetail.categoryResponse?.name || "",
        categoryId: productDetail.categoryResponse?.id || null,
        brand: productDetail.brandResponse?.name || "",
        brandId: productDetail.brandResponse?.id || null,
        description: productDetail.description || "",
        costPrice: stripCurrency(productDetail.importPrice),
        sellingPrice: stripCurrency(productDetail.sellingPrice ?? productDetail.price),
        inventory: String(productDetail.totalQuantity ?? ""),
        available: String(productDetail.availableQuantity ?? ""),
        weight: String(productDetail.packagedWeight ?? ""),
        length: String(productDetail.length ?? ""),
        width: String(productDetail.width ?? ""),
        height: String(productDetail.height ?? ""),
      }
    : undefined;

  // Transform images
  const initialImages: ProductImage[] = productDetail?.images?.length
    ? productDetail.images.map((url, index) => ({
        id: `img-${index}`,
        url,
      }))
    : [];

  // Transform attributes - values từ API là object {id, value}, cần chuyển thành string[]
  const initialAttributes: ProductAttribute[] = productDetail?.attributes?.map((attr) => ({
    name: attr.name || "",
    values: Array.isArray(attr.values) 
      ? attr.values.map((v: { value?: string } | string) => typeof v === 'string' ? v : (v.value || ''))
      : [],
  })) || [];

  // Transform variants to versions
  const initialVersions: ProductVersion[] = variants?.content?.map((variant) => ({
    id: String(variant.id),
    variantId: variant.id,
    name: variant.nameDetail || "",
    sku: variant.skuDetail || "",
    barcode: variant.barcode || "",
    image: variant.imageUrl || "",
    costPrice: String(variant.importPrice || 0),
    sellingPrice: String(variant.sellingPrice || 0),
    inventory: variant.totalQuantity || 0,
    available: variant.availableQuantity || 0,
  })) || [];

  // Variant pagination
  const initialVariantPagination = variants
    ? {
        page: variants.number || 0,
        pageSize: variants.size || VARIANT_PAGE_SIZE,
        total: variants.totalElements || 0,
        totalPages: variants.totalPages || 0,
      }
    : undefined;

  const handleBack = () => {
    navigate("/admin/products");
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#e04d30] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[16px] font-['Montserrat'] font-medium text-[#6b7280]">
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
              <svg className="w-10 h-10 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-[24px] font-['Montserrat'] font-bold text-[#1f2937] mb-4">
              Product not found
            </h2>
            <p className="text-[16px] text-[#6b7280] mb-6 max-w-md mx-auto">
              {error || "Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleBack}
                className="bg-[#e04d30] hover:bg-[#c74429] text-white px-[20px] py-[12px] rounded-[10px] text-[14px] font-['Montserrat'] font-semibold transition-colors"
              >
                Quay lại danh sách
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-white hover:bg-[#f9fafb] text-[#374151] border border-[#d1d5db] px-[20px] py-[12px] rounded-[10px] text-[14px] font-['Montserrat'] font-semibold transition-colors"
              >
                Thử lại
              </button>
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
      initialFormData={initialFormData}
      initialImages={initialImages}
      initialAttributes={initialAttributes}
      initialVersions={initialVersions}
      initialVariantPagination={initialVariantPagination}
      productId={parseInt(productId!, 10)}
      onBack={handleBack}
    />
  );
};

export default AdminProductsEdit;
