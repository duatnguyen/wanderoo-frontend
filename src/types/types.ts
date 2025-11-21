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
  variants?: ProductVariant[];
}
