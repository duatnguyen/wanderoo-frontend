// Product related TypeScript interfaces

export interface ProductFormData {
  productName: string;
  barcode: string;
  category: string;
  categoryId: number | null;
  brand: string;
  brandId: number | null;
  description: string;
  costPrice: string;
  sellingPrice: string;
  inventory: string;
  available: string;
  weight: string;
  length: string;
  width: string;
  height: string;
}

export interface ProductAttribute {
  name: string;
  values: string[];
}

export interface ProductVersion {
  id: string;
  name: string;
  price?: string;
  costPrice?: string;
  inventory?: string;
  available?: string;
  image?: string | null;
  sku?: string;
  barcode?: string;
}

export interface EditingVersion {
  id: string;
  name: string;
  barcode: string;
  costPrice: string;
  sellingPrice: string;
  inventory: string;
  available: string;
  image: string;
  sku?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  file?: File;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule[];
}