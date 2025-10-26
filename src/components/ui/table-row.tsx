import React from "react";

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  stock: string;
  sellable: string;
  websiteSales: string;
  posSales: string;
  sellingPrice: string;
  costPrice: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  stock: string;
  sellable: string;
  websiteSales: string;
  posSales: string;
  sellingPrice: string;
  costPrice: string;
  image: string;
  variants: ProductVariant[];
}

interface TableRowProps {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: string, checked: boolean) => void;
  onSelectVariant: (variantId: string, checked: boolean) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  product,
  isSelected,
  onSelect,
  onSelectVariant,
}) => {
  return (
    <div className="w-full pb-3 flex flex-col items-start justify-start">
      {/* Main Product Row */}
      <div className="self-stretch h-[98px] flex items-center justify-start">
        {/* Checkbox column */}
        <div className="self-stretch px-3 py-[14px] overflow-hidden flex items-center justify-start gap-[10px]">
          <div className="w-6 h-6 relative overflow-hidden">
            <input
              type="checkbox"
              className="w-6 h-6"
              checked={isSelected}
              onChange={(e) => onSelect(product.id, e.target.checked)}
            />
          </div>
        </div>

        {/* Product name column */}
        <div className="w-[500px] self-stretch px-3 py-[14px] overflow-hidden rounded-tl-[12px] flex items-center justify-start gap-2">
          <img
            className="w-[70px] h-[70px] relative rounded-lg border border-[var(--Neutral-200,#D1D1D1)]"
            src={product.image}
            alt=""
          />
          <div className="flex-1 self-stretch text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
            {product.name}
          </div>
        </div>

        {/* SKU column */}
        <div className="flex-1 self-stretch px-[6px] py-3 flex flex-col items-center justify-center gap-[10px]">
          <div className="flex items-center justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.sku}
            </div>
          </div>
        </div>

        {/* Barcode column */}
        <div className="flex-1 self-stretch p-3 flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.barcode}
            </div>
          </div>
        </div>

        {/* Stock column */}
        <div className="flex-1 self-stretch p-3 flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.stock}
            </div>
          </div>
        </div>

        {/* Sellable column */}
        <div className="flex-1 self-stretch p-3 flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.sellable}
            </div>
          </div>
        </div>

        {/* Website sales column */}
        <div className="flex-1 self-stretch p-3 flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.websiteSales}
            </div>
          </div>
        </div>

        {/* POS sales column */}
        <div className="flex-1 self-stretch p-3 flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.posSales}
            </div>
          </div>
        </div>

        {/* Selling price column */}
        <div className="flex-1 self-stretch p-3 flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.sellingPrice}
            </div>
          </div>
        </div>

        {/* Cost price column */}
        <div className="flex-1 self-stretch p-3 flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-start gap-[10px]">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              {product.costPrice}
            </div>
          </div>
        </div>

        {/* Actions column */}
        <div className="flex-1 self-stretch px-2 py-3 flex flex-col items-center justify-center gap-2">
          <div className="self-stretch flex flex-col items-center justify-center gap-4">
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              Xem thêm
            </div>
            <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
              Cập nhật
            </div>
          </div>
        </div>
      </div>

      {/* Product Variants */}
      {product.variants.map((variant, variantIndex) => (
        <div
          key={variant.id}
          className="self-stretch h-[98px] flex items-center justify-center"
        >
          {/* Variant content with background */}
          <div
            className={`w-[1480px] bg-[var(--Neutral-50,#F6F6F6)] flex items-center justify-start ${
              variantIndex === 0 ? "rounded-tl-[12px] rounded-tr-[12px]" : ""
            } ${
              variantIndex === product.variants.length - 1
                ? "rounded-bl-[12px] rounded-br-[12px]"
                : ""
            }`}
          >
            {/* Product name column */}
            <div className="w-[500px] h-[98px] px-3 py-[14px] overflow-hidden rounded-tl-[12px] flex items-center justify-start gap-2">
              <img
                className="w-[70px] h-[70px] relative rounded-lg border border-[var(--Neutral-200,#D1D1D1)]"
                src={variant.image}
                alt=""
              />
              <div className="flex-1 self-stretch text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                {variant.name}
              </div>
            </div>

            {/* SKU column */}
            <div className="w-[115px] h-[98px] px-[6px] py-3 flex flex-col items-center justify-center gap-[10px]">
              <div className="flex items-center justify-start gap-[10px]">
                <div className="text-center text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  SKU phân loại:
                  <br />
                  {variant.sku}
                </div>
              </div>
            </div>

            {/* Barcode column */}
            <div className="w-[114.89px] h-[98px] p-3 flex flex-col items-center justify-center gap-2">
              <div className="flex items-start justify-start gap-[10px]">
                <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  {variant.barcode}
                </div>
              </div>
            </div>

            {/* Stock column */}
            <div className="w-[114.89px] h-[98px] p-3 flex flex-col items-center justify-center gap-2">
              <div className="flex items-start justify-start gap-[10px]">
                <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  {variant.stock}
                </div>
              </div>
            </div>

            {/* Sellable column */}
            <div className="w-[114.89px] h-[98px] p-3 flex flex-col items-center justify-center gap-2">
              <div className="flex items-start justify-start gap-[10px]">
                <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  {variant.sellable}
                </div>
              </div>
            </div>

            {/* Website sales column */}
            <div className="w-[114.89px] h-[98px] p-3 flex flex-col items-center justify-center gap-2">
              <div className="flex items-start justify-start gap-[10px]">
                <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  {variant.websiteSales}
                </div>
              </div>
            </div>

            {/* POS sales column */}
            <div className="w-[114.89px] h-[98px] p-3 flex flex-col items-center justify-center gap-2">
              <div className="flex items-start justify-start gap-[10px]">
                <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  {variant.posSales}
                </div>
              </div>
            </div>

            {/* Selling price column */}
            <div className="w-[114.89px] h-[98px] p-3 flex flex-col items-center justify-center gap-2">
              <div className="flex items-start justify-start gap-[10px]">
                <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  {variant.sellingPrice}
                </div>
              </div>
            </div>

            {/* Cost price column */}
            <div className="w-[114.89px] h-[98px] p-3 flex flex-col items-center justify-center gap-2">
              <div className="flex items-start justify-start gap-[10px]">
                <div className="text-[#272424] text-[10px] font-medium font-['Montserrat'] leading-[14px] break-words">
                  {variant.costPrice}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableRow;
