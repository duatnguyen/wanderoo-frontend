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
  weight: [
    { pattern: /^\d+(\.\d+)?$/, message: "Cân nặng phải là số hợp lệ" }
  ]
};

export const validateField = (field: string, value: string): string => {
  const rules = productValidationRules[field];
  if (!rules) return '';

  for (const rule of rules) {
    const trimmed = value.trim();

    if (rule.required && !trimmed) {
      return rule.message;
    }

    // Nếu cho phép bỏ trống thì chỉ kiểm tra các rule khác khi có giá trị
    if (!trimmed) {
      continue;
    }

    if (rule.minLength && trimmed.length < rule.minLength) {
      return rule.message;
    }

    if (rule.maxLength && trimmed.length > rule.maxLength) {
      return rule.message;
    }

    if (rule.pattern && !rule.pattern.test(trimmed)) {
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
  
  return errors;
};