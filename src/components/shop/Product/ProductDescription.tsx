import React from "react";
import type { Product } from "../../../features/shop/data/productsData";

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  // Parse description or use default structure
  const parseDescription = (desc: string | undefined) => {
    if (!desc) return null;

    // Try to extract sections from description
    const sections: {
      intro?: string;
      productInfo?: string[];
      features?: string[];
      suitableFor?: string[];
    } = {};

    const lines = desc.split("\n").filter((line) => line.trim());

    let currentSection = "";
    sections.productInfo = [];
    sections.features = [];
    sections.suitableFor = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (
        trimmed.includes("Đặc điểm nổi bật") ||
        trimmed.includes("đặc điểm")
      ) {
        currentSection = "features";
      } else if (trimmed.includes("Phù hợp") || trimmed.includes("phù hợp")) {
        currentSection = "suitableFor";
      } else if (
        trimmed.includes("Thông tin") ||
        trimmed.includes("thông tin")
      ) {
        currentSection = "productInfo";
      } else if (trimmed.startsWith("-") || trimmed.startsWith("✔")) {
        const content = trimmed.replace(/^[-✔]\s*/, "").trim();
        if (currentSection === "features") {
          sections.features?.push(content);
        } else if (currentSection === "suitableFor") {
          sections.suitableFor?.push(content);
        } else {
          sections.productInfo?.push(content);
        }
      } else if (!sections.intro && trimmed.length > 50) {
        sections.intro = trimmed;
      }
    });

    return sections;
  };

  const sections = parseDescription(product.description);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-[20px] font-bold text-gray-900 mb-6">
        Mô Tả Sản Phẩm
      </h2>

      {/* Intro Section */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-3">
          <span className="text-xl">🥾</span>
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
        </div>
        {sections?.intro && (
          <p className="text-sm text-gray-700 leading-relaxed ml-7">
            👉 {sections.intro}
          </p>
        )}
      </div>

      <div className="border-t border-gray-300 my-6"></div>

      {/* Product Information */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔹</span>
          <h3 className="text-base font-semibold text-gray-900">
            Thông tin sản phẩm
          </h3>
        </div>
        <div className="ml-7 space-y-2">
          {product.brand && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Thương hiệu:</span> {product.brand}
            </p>
          )}
          <p className="text-sm text-gray-700">
            <span className="font-medium">Mã sản phẩm:</span> {product.id}
          </p>
          {product.category && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Danh mục:</span> {product.category}
            </p>
          )}
          {sections?.productInfo?.map((info, index) => (
            <p key={index} className="text-sm text-gray-700">
              {info}
            </p>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-300 my-6"></div>

      {/* Key Features */}
      {sections?.features && sections.features.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔹</span>
            <h3 className="text-base font-semibold text-gray-900">
              Đặc điểm nổi bật
            </h3>
          </div>
          <div className="ml-7 space-y-2">
            {sections.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✔️</span>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suitable For */}
      {sections?.suitableFor && sections.suitableFor.length > 0 && (
        <>
          <div className="border-t border-gray-300 my-6"></div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🔹</span>
              <h3 className="text-base font-semibold text-gray-900">
                Phù hợp sử dụng
              </h3>
            </div>
            <div className="ml-7 space-y-2">
              {sections.suitableFor.map((item, index) => (
                <p key={index} className="text-sm text-gray-700">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fallback: Show raw description if parsing didn't work */}
      {!sections?.features && !sections?.productInfo && product.description && (
        <div className="mt-6">
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Commitment Statement */}
      <div className="border-t border-gray-300 my-6"></div>
      <div className="flex items-start gap-2">
        <span className="text-green-600 mt-0.5">✔️</span>
        <p className="text-sm text-gray-700 font-medium">
          Wanderoo cam kết chỉ bán giày và phụ kiện leo núi chính hãng – đồng
          hành cùng bạn trên mọi cung đường chinh phục thiên nhiên!
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;
