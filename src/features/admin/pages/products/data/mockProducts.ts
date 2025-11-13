import type { Product } from "@/types/types";
import type { ProductAttribute, ProductImage, ProductVersion } from "@/types/product";

export type AdminProductStatus = "active" | "inactive";

export interface AdminProductDetail extends Product {
  status: AdminProductStatus;
  categoryName: string;
  brandName: string;
  description: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  images: ProductImage[];
  attributes?: ProductAttribute[];
  versions?: ProductVersion[];
}

const formatCurrencyNumber = (value: number) =>
  `${value.toLocaleString("vi-VN")}đ`;

const baseImage = (url: string, index = 0): ProductImage => ({
  id: `preset-${index}`,
  url,
});

export const adminMockProducts: AdminProductDetail[] = [
  {
    id: "1",
    name: "Giày leo núi nữ cổ thấp Humtto Hiking Shoes 140134B-4",
    image:
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop&crop=center",
    sku: "SKU01",
    barcode: "880000000001",
    inventory: 0,
    availableToSell: 0,
    webQuantity: 400000,
    posQuantity: 0,
    sellingPrice: formatCurrencyNumber(600000),
    costPrice: formatCurrencyNumber(400000),
    status: "inactive",
    categoryName: "Giày leo núi",
    brandName: "Humtto",
    description:
      "Mẫu giày leo núi nữ cổ thấp với thiết kế thoáng khí, chống trượt và ôm chân phù hợp cho các chuyến trekking.",
    weight: "850",
    length: "32",
    width: "21",
    height: "12",
    images: [
      baseImage(
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop&crop=center"
      ),
      baseImage(
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center",
        1
      ),
    ],
    attributes: [
      {
        name: "Size",
        values: ["36", "37", "38", "39"],
      },
      {
        name: "Màu sắc",
        values: ["Xám", "Xanh đậm"],
      },
    ],
    versions: [
      {
        id: "v1-1",
        combination: ["36", "Xám"],
        name: "Size 36 / Xám",
        price: "600000",
        inventory: "0",
        available: "0",
      },
      {
        id: "v1-2",
        combination: ["37", "Xanh đậm"],
        name: "Size 37 / Xanh đậm",
        price: "600000",
        inventory: "0",
        available: "0",
      },
    ],
    variants: [
      {
        id: "v1-1",
        name: "Size 36 / Xám",
        sku: "SKU01-36X",
        barcode: "880000000011",
        inventory: 0,
        availableToSell: 0,
        webQuantity: 0,
        posQuantity: 0,
        sellingPrice: formatCurrencyNumber(600000),
        costPrice: formatCurrencyNumber(400000),
      },
      {
        id: "v1-2",
        name: "Size 37 / Xanh đậm",
        sku: "SKU01-37N",
        barcode: "880000000012",
        inventory: 0,
        availableToSell: 0,
        webQuantity: 0,
        posQuantity: 0,
        sellingPrice: formatCurrencyNumber(600000),
        costPrice: formatCurrencyNumber(400000),
      },
    ],
  },
  {
    id: "2",
    name: "Giày thể thao nam Nike Air Max",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center",
    sku: "SKU02",
    barcode: "1234567890123",
    inventory: 15,
    availableToSell: 15,
    webQuantity: 10,
    posQuantity: 5,
    sellingPrice: formatCurrencyNumber(2500000),
    costPrice: formatCurrencyNumber(1800000),
    status: "active",
    categoryName: "Giày thể thao",
    brandName: "Nike",
    description:
      "Giày thể thao nam Nike Air Max với đệm khí toàn phần, hỗ trợ di chuyển linh hoạt và êm ái.",
    weight: "720",
    length: "31",
    width: "20",
    height: "11",
    images: [
      baseImage(
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center"
      ),
    ],
    attributes: [
      {
        name: "Size",
        values: ["41", "42"],
      },
    ],
    versions: [
      {
        id: "v2-1",
        combination: ["41"],
        name: "Size 41",
        price: "2500000",
        inventory: "8",
        available: "7",
      },
      {
        id: "v2-2",
        combination: ["42"],
        name: "Size 42",
        price: "2500000",
        inventory: "7",
        available: "6",
      },
    ],
    variants: [
      {
        id: "v2-1",
        name: "Size 41",
        sku: "SKU02-41",
        barcode: "12345678901231",
        inventory: 8,
        availableToSell: 7,
        webQuantity: 5,
        posQuantity: 3,
        sellingPrice: formatCurrencyNumber(2500000),
        costPrice: formatCurrencyNumber(1800000),
      },
      {
        id: "v2-2",
        name: "Size 42",
        sku: "SKU02-42",
        barcode: "12345678901232",
        inventory: 7,
        availableToSell: 6,
        webQuantity: 5,
        posQuantity: 2,
        sellingPrice: formatCurrencyNumber(2500000),
        costPrice: formatCurrencyNumber(1800000),
      },
    ],
  },
  {
    id: "3",
    name: "Áo khoác nữ Adidas Originals",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center",
    sku: "SKU03",
    barcode: "9876543210987",
    inventory: 8,
    availableToSell: 8,
    webQuantity: 5,
    posQuantity: 3,
    sellingPrice: formatCurrencyNumber(1200000),
    costPrice: formatCurrencyNumber(800000),
    status: "active",
    categoryName: "Áo khoác nữ",
    brandName: "Adidas",
    description:
      "Áo khoác nữ Adidas Originals phong cách thể thao, chất liệu giữ ấm tốt và chống gió hiệu quả.",
    weight: "540",
    length: "68",
    width: "45",
    height: "4",
    images: [
      baseImage(
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center"
      ),
    ],
    attributes: [
      {
        name: "Size",
        values: ["S", "M", "L"],
      },
      {
        name: "Màu sắc",
        values: ["Đen", "Trắng"],
      },
    ],
    versions: [
      {
        id: "v3-1",
        combination: ["S", "Đen"],
        name: "Size S / Đen",
        price: "1200000",
        inventory: "3",
        available: "3",
      },
      {
        id: "v3-2",
        combination: ["M", "Trắng"],
        name: "Size M / Trắng",
        price: "1200000",
        inventory: "3",
        available: "3",
      },
      {
        id: "v3-3",
        combination: ["L", "Đen"],
        name: "Size L / Đen",
        price: "1200000",
        inventory: "2",
        available: "2",
      },
    ],
    variants: [
      {
        id: "v3-1",
        name: "Size S / Đen",
        sku: "SKU03-SD",
        barcode: "98765432109871",
        inventory: 3,
        availableToSell: 3,
        webQuantity: 2,
        posQuantity: 1,
        sellingPrice: formatCurrencyNumber(1200000),
        costPrice: formatCurrencyNumber(800000),
      },
      {
        id: "v3-2",
        name: "Size M / Trắng",
        sku: "SKU03-MT",
        barcode: "98765432109872",
        inventory: 3,
        availableToSell: 3,
        webQuantity: 2,
        posQuantity: 1,
        sellingPrice: formatCurrencyNumber(1200000),
        costPrice: formatCurrencyNumber(800000),
      },
      {
        id: "v3-3",
        name: "Size L / Đen",
        sku: "SKU03-LD",
        barcode: "98765432109873",
        inventory: 2,
        availableToSell: 2,
        webQuantity: 1,
        posQuantity: 1,
        sellingPrice: formatCurrencyNumber(1200000),
        costPrice: formatCurrencyNumber(800000),
      },
    ],
  },
];

