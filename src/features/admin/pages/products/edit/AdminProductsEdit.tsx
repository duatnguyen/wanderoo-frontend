import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminProductsNew from "../create/AdminProductsNew";
import {
  adminMockProducts,
  type AdminProductDetail,
} from "../data/mockProducts";
import type {
  ProductAttribute,
  ProductFormData,
  ProductImage,
  ProductVersion,
} from "@/types/product";
import { PageContainer, ContentCard } from "@/components/common";

const AdminProductsEdit: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!productId) {
        setError("Product ID is required");
      } else if (!productDetail) {
        setError("Product not found");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [productId]);

  const productDetail = useMemo<AdminProductDetail | undefined>(
    () => adminMockProducts.find((product) => product.id === productId),
    [productId]
  );

  const stripCurrency = (value: string): string => {
    if (!value) return "";
    return value.replace(/[^\d]/g, "");
  };

  const initialFormData: Partial<ProductFormData> | undefined = useMemo(() => {
    if (!productDetail) return undefined;

    return {
      productName: productDetail.name || "",
      barcode: productDetail.barcode || "",
      category: productDetail.categoryName || "",
      brand: productDetail.brandName || "",
      description: productDetail.description || "",
      costPrice: stripCurrency(productDetail.costPrice || "0"),
      sellingPrice: stripCurrency(productDetail.sellingPrice || "0"),
      inventory: (productDetail.inventory || 0).toString(),
      available: (productDetail.availableToSell || 0).toString(),
      weight: productDetail.weight || "",
      length: productDetail.length || "",
      width: productDetail.width || "",
      height: productDetail.height || "",
    };
  }, [productDetail]);

  const initialImages: ProductImage[] = useMemo(() => {
    if (!productDetail) return [];

    if (productDetail.images?.length) {
      return productDetail.images;
    }

    if (productDetail.image) {
      return [
        {
          id: `cover-${productDetail.id}`,
          url: productDetail.image,
        },
      ];
    }

    return [];
  }, [productDetail]);

  const initialAttributes: ProductAttribute[] = useMemo(
    () => productDetail?.attributes ?? [],
    [productDetail]
  );

  const initialVersions: ProductVersion[] = useMemo(
    () => productDetail?.versions ?? [],
    [productDetail]
  );

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
      initialFormData={initialFormData}
      initialImages={initialImages}
      initialAttributes={initialAttributes}
      initialVersions={initialVersions}
      onBack={handleBack}
    />
  );
};

export default AdminProductsEdit;
