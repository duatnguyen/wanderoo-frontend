export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  inventory: number;
  availableToSell: number;
  webQuantity: number;
  posQuantity: number;
  sellingPrice: string;
  costPrice: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  image?: string;
  sku: string;
  barcode: string;
  inventory: number;
  availableToSell: number;
  webQuantity: number;
  posQuantity: number;
  sellingPrice: string;
  costPrice: string;
  display?: "WEBSITE" | "POS" | "BOTH";
  variants?: ProductVariant[];
}
