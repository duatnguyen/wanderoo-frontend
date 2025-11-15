import React, { useMemo } from "react";
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

const AdminProductsEdit: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const productDetail = useMemo<AdminProductDetail | undefined>(
    () => adminMockProducts.find((product) => product.id === productId),
    [productId]
  );

  const stripCurrency = (value: string) =>
    value.replace(/[^\d]/g, "");

  const initialFormData: Partial<ProductFormData> | undefined =
    productDetail && {
      productName: productDetail.name,
      barcode: productDetail.barcode,
      category: productDetail.categoryName,
      brand: productDetail.brandName,
      description: productDetail.description,
      costPrice: stripCurrency(productDetail.costPrice),
      sellingPrice: stripCurrency(productDetail.sellingPrice),
      inventory: productDetail.inventory.toString(),
      available: productDetail.availableToSell.toString(),
      weight: productDetail.weight,
      length: productDetail.length,
      width: productDetail.width,
      height: productDetail.height,
    };

  const initialImages: ProductImage[] =
    productDetail?.images?.length
      ? productDetail.images
      : productDetail?.image
      ? [
          {
            id: `cover-${productDetail.id}`,
            url: productDetail.image,
          },
        ]
      : [];

  const initialAttributes: ProductAttribute[] = productDetail?.attributes ?? [];

  const initialVersions: ProductVersion[] = productDetail?.versions ?? [];

  return (
    <AdminProductsNew
      key={productId}
      mode="edit"
      initialFormData={initialFormData}
      initialImages={initialImages}
      initialAttributes={initialAttributes}
      initialVersions={initialVersions}
      onBack={() => navigate(-1)}
    />
  );
};

export default AdminProductsEdit;

