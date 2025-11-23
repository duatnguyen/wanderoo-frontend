import type { ValidationRules, FormErrors, ProductFormData } from '@/types/product';

export const productValidationRules: ValidationRules = {
  productName: [
    { required: true, message: "Tên sản phẩm là bắt buộc" },
    { minLength: 2, message: "Tên sản phẩm phải có ít nhất 2 ký tự" },
    { maxLength: 100, message: "Tên sản phẩm không được vượt quá 100 ký tự" }
  ],
  category: [
    { required: true, message: "Danh mục là bắt buộc" }
  ],
  brand: [
    { required: true, message: "Thương hiệu là bắt buộc" }
  ],
  description: [
    { required: true, message: "Mô tả sản phẩm là bắt buộc" },
    { minLength: 10, message: "Mô tả phải có ít nhất 10 ký tự" }
  ],
  weight: [
    { required: true, message: "Cân nặng là bắt buộc" },
    { pattern: /^\d+(\.\d+)?$/, message: "Cân nặng phải là số" }
  ],
  length: [
    { required: true, message: "Chiều dài là bắt buộc" },
    { pattern: /^\d+(\.\d+)?$/, message: "Chiều dài phải là số" }
  ],
  width: [
    { required: true, message: "Chiều rộng là bắt buộc" },
    { pattern: /^\d+(\.\d+)?$/, message: "Chiều rộng phải là số" }
  ],
  height: [
    { required: true, message: "Chiều cao là bắt buộc" },
    { pattern: /^\d+(\.\d+)?$/, message: "Chiều cao phải là số" }
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
  
  if (!formData.categoryId) {
    errors.category = "Vui lòng chọn danh mục";
  }

  if (!formData.brandId) {
    errors.brand = "Vui lòng chọn thương hiệu";
  }

  return errors;
};