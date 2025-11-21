import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer, ContentCard } from "@/components/common";
import AdminProductsNew from "../create/AdminProductsNew";
import {
  getProductDetailPrivate,
  getProductVariantsPrivate,
} from "@/api/endpoints/productApi";
import type {
  ProductFormData,
  ProductAttribute,
  ProductImage,
  ProductVersion,
} from "@/types/product";
import type { ProductDetailsResponse, ProductVariantListResponse } from "@/types";

type VariantPaginationState = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const mapDetailToFormData = (
  detail: ProductDetailsResponse
): ProductFormData => ({
  productName: detail.name ?? "",
  barcode: "",
  category: detail.categoryResponse?.name ?? "",
  categoryId: detail.categoryResponse?.id ?? null,
  brand: detail.brandResponse?.name ?? "",
  brandId: detail.brandResponse?.id ?? null,
  description: detail.description ?? "",
  costPrice: detail.price ? String(detail.price) : "",
  sellingPrice: detail.discountPrice ? String(detail.discountPrice) : "",
  inventory: detail.quantity !== undefined ? String(detail.quantity) : "",
  available: detail.quantity !== undefined ? String(detail.quantity) : "",
  weight:
    detail.packagedWeight !== undefined ? String(detail.packagedWeight) : "",
  length: detail.length !== undefined ? String(detail.length) : "",
  width: detail.width !== undefined ? String(detail.width) : "",
  height: detail.height !== undefined ? String(detail.height) : "",
});

const mapImages = (images?: string[]): ProductImage[] =>
  images?.map((url, index) => ({
    id: `img-${index}`,
    url,
  })) ?? [];

const mapAttributes = (
  attributes?: ProductDetailsResponse["attributes"]
): ProductAttribute[] =>
  attributes?.map((attr) => ({
    name: attr.name ?? "",
    values: attr.values?.map((value) => value.value ?? "") ?? [],
  })) ?? [];

const mapVariants = (
  response: ProductVariantListResponse
): { versions: ProductVersion[]; pagination: VariantPaginationState } => {
  const variantsArray =
    response.variants ?? response.content ?? [];

  const versions: ProductVersion[] = variantsArray.map((variant) => ({
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
      variant.availableQuantity !== undefined &&
      variant.availableQuantity !== null
        ? String(variant.availableQuantity)
        : "",
    image: variant.imageUrl ?? null,
    sku: variant.skuDetail ?? "",
    barcode: variant.barcode ?? "",
  }));

  return {
    versions,
    pagination: {
      page: response.pageNumber ?? 0,
      pageSize: response.pageSize ?? 50,
      total:
        response.totalElements ??
        variantsArray.length,
      totalPages: response.totalPages ?? 1,
    },
  };
};

const AdminProductsView: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const numericProductId = Number(productId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [versions, setVersions] = useState<ProductVersion[]>([]);
  const [variantPagination, setVariantPagination] = useState<VariantPaginationState>({
    page: 0,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchDetail = useCallback(async () => {
    if (!numericProductId || Number.isNaN(numericProductId)) {
      setError("Product ID không hợp lệ");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [detailResponse, variantResponse] = await Promise.all([
        getProductDetailPrivate(numericProductId),
        getProductVariantsPrivate(numericProductId, {
          page: 0,
          size: 50,
          sort: "asc",
        }),
      ]);

      setFormData(mapDetailToFormData(detailResponse));
      setImages(mapImages(detailResponse.images));
      setAttributes(mapAttributes(detailResponse.attributes));

      const variantData = mapVariants(variantResponse);
      setVersions(variantData.versions);
      setVariantPagination(variantData.pagination);
    } catch (err) {
      console.error("Không thể tải chi tiết sản phẩm", err);
      setError("Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [numericProductId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

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

  if (error || !formData) {
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
              {error ??
                `Sản phẩm với ID "${productId}" không tồn tại trong hệ thống.`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate("/admin/products/all")}
                className="bg-[#e04d30] hover:bg-[#c74429] text-white px-[20px] py-[12px] rounded-[10px] text-[14px] font-['Montserrat'] font-semibold transition-colors"
              >
                Quay lại danh sách
              </button>
              {error && (
                <button
                  onClick={fetchDetail}
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

  return (
    <AdminProductsNew
      mode="view"
      initialFormData={formData}
      initialImages={images}
      initialAttributes={attributes}
      initialVersions={versions}
      initialVariantPagination={variantPagination}
      productId={numericProductId}
      onBack={() => navigate(-1)}
      title="Chi tiết sản phẩm"
    />
  );
};

export default AdminProductsView;

