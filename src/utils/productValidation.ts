import type { ValidationRules, FormErrors, ProductFormData } from '@/types/product';

export const productValidationRules: ValidationRules = {
  productName: [
    { required: true, message: "Tên sản phẩm là bắt buộc" },
    { minLength: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự" },
    { maxLength: 100, message: "Tên sản phẩm không được vượt quá 100 ký tự" }
  ],
  brand: [
    { required: true, message: "Thương hiệu là bắt buộc" }
  ],
  description: [
    { required: true, message: "Mô tả sản phẩm là bắt buộc" },
    { minLength: 10, message: "Mô tả phải có ít nhất 10 ký tự" }
  ],
  costPrice: [
    { required: true, message: "Giá vốn là bắt buộc" },
    { pattern: /^\d+$/, message: "Giá vốn phải là số" }
  ],
  sellingPrice: [
    { required: true, message: "Giá bán là bắt buộc" },
    { pattern: /^\d+$/, message: "Giá bán phải là số" }
  ],
  inventory: [
    { required: true, message: "Tồn kho là bắt buộc" },
    { pattern: /^\d+$/, message: "Tồn kho phải là số nguyên" }
  ],
  available: [
    { required: true, message: "Số lượng có thể bán là bắt buộc" },
    { pattern: /^\d+$/, message: "Số lượng có thể bán phải là số nguyên" }
  ],
  weight: [
    { required: true, message: "Cân nặng là bắt buộc" },
    { pattern: /^\d+(\.\d+)?$/, message: "Cân nặng phải là số" }
  ]
};

export const validateField = (field: string, value: string): string => {
  const rules = productValidationRules[field];
  if (!rules) return '';

  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      return rule.message;
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }
  }
  
  return '';
};

export const validateForm = (formData: ProductFormData): FormErrors => {
  const errors: FormErrors = {};
  
  Object.keys(productValidationRules).forEach(field => {
    const error = validateField(field, formData[field as keyof ProductFormData]);
    if (error) {
      errors[field] = error;
    }
  });

  // Custom validation for price comparison
  if (formData.costPrice && formData.sellingPrice) {
    const cost = parseFloat(formData.costPrice);
    const selling = parseFloat(formData.sellingPrice);
    if (selling <= cost) {
      errors.sellingPrice = "Giá bán phải lớn hơn giá vốn";
    }
  }

  // Custom validation for inventory vs available
  if (formData.inventory && formData.available) {
    const inventory = parseInt(formData.inventory);
    const available = parseInt(formData.available);
    if (available > inventory) {
      errors.available = "Số lượng có thể bán không được lớn hơn tồn kho";
    }
  }
  
  return errors;
};